-- cca-f-dojo · Supabase schema
-- 在 Supabase Dashboard → SQL Editor 里整段执行。可重复执行（幂等）。
--
-- 设计要点：
--   1. 未登录用户完全不碰数据库（anon 角色没有任何权限），只用 localStorage
--   2. 登录用户只能读写自己那一行，由 RLS 强制
--   3. 建项目时关掉了「Automatically expose new tables」，所以下面必须显式 GRANT
--      —— 这是第二道锁：没有 GRANT，PostgREST 根本看不到这张表

-- ─────────────────────────────────────────────
-- 1. 表
-- ─────────────────────────────────────────────
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.progress is
  'cca-f-dojo 用户进度。一个用户一行，data 是前端 sanitizeState() 后的完整状态。';

-- 防止有人塞爆免费额度：单行 JSON 上限约 500 KB
-- （正常进度 163 题全做满也就几十 KB）
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'progress_data_size'
  ) then
    alter table public.progress
      add constraint progress_data_size
      check (length(data::text) < 512000);
  end if;
end $$;

-- ─────────────────────────────────────────────
-- 2. 开启 RLS（建项目时勾了 automatic RLS，这里再显式写一遍，保证幂等）
-- ─────────────────────────────────────────────
alter table public.progress enable row level security;

-- ─────────────────────────────────────────────
-- 3. 策略：只能碰 user_id = 自己 的那一行
--    用 (select auth.uid()) 而非 auth.uid()：前者每条语句求值一次，
--    后者每行求值一次 —— 这是 Supabase 官方推荐的写法
-- ─────────────────────────────────────────────
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own" on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ─────────────────────────────────────────────
-- 4. 显式授权
--    只给 authenticated；anon 一个权限都不给
-- ─────────────────────────────────────────────
grant select, insert, update, delete on table public.progress to authenticated;
revoke all on table public.progress from anon;

-- ─────────────────────────────────────────────
-- 5. updated_at 自动维护（同步冲突判断要用）
-- ─────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists progress_touch_updated_at on public.progress;
create trigger progress_touch_updated_at
  before update on public.progress
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────
-- 6. 自检：跑完应该看到 4 条策略、rls_enabled = true、anon 无权限
-- ─────────────────────────────────────────────
select
  (select count(*) from pg_policies
     where schemaname = 'public' and tablename = 'progress')            as policy_count,
  (select relrowsecurity from pg_class
     where oid = 'public.progress'::regclass)                           as rls_enabled,
  (select count(*) from information_schema.role_table_grants
     where table_name = 'progress' and grantee = 'anon')                as anon_grants,
  (select count(*) from information_schema.role_table_grants
     where table_name = 'progress' and grantee = 'authenticated')       as authenticated_grants;
-- 期望：policy_count = 4 | rls_enabled = true | anon_grants = 0 | authenticated_grants = 4
