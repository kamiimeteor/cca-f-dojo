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
  version    bigint      not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.progress add column if not exists version bigint not null default 1;

comment on table public.progress is
  'cca-f-dojo 用户进度。一个用户一行，data 是前端 sanitizeState() 后的完整状态。';

-- 防止有人塞爆免费额度：单行 JSON 上限约 500 KB
-- （正常进度 163 题全做满也就几十 KB）
do $$
begin
  if not exists (
    select 1 from pg_constraint
      where conname = 'progress_data_size'
        and conrelid = 'public.progress'::regclass
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
--    只给 authenticated 四项；anon 一个权限都不给
--
--    ⚠️ 必须先 REVOKE ALL 再 GRANT。原因：Supabase 预设了
--       alter default privileges ... grant all on tables to authenticated
--    即使建项目时关掉了「Automatically expose new tables」，那个开关也只挡住
--    anon —— authenticated 仍会拿到完整 7 项权限（含 TRUNCATE / REFERENCES / TRIGGER）。
--
--    其中 TRUNCATE 尤其不能留：它是表级操作，**不受 RLS 约束**，
--    一旦被调用会清空所有用户的行，而不只是调用者自己那一行。
-- ─────────────────────────────────────────────
revoke all on table public.progress from anon, authenticated;
grant select, insert, update, delete on table public.progress to authenticated;

-- 同时收掉 default privileges，避免以后新建的表重蹈覆辙
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on tables from authenticated;

-- ─────────────────────────────────────────────
-- 5. version / updated_at 自动维护
-- ─────────────────────────────────────────────
create or replace function public.bump_progress_version()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.version := old.version + 1;
  return new;
end $$;

drop trigger if exists trg_progress_bump_version on public.progress;
create trigger trg_progress_bump_version
  before update on public.progress
  for each row execute function public.bump_progress_version();

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
-- ⚠️ 写成单条语句：Supabase SQL Editor 只渲染最后一条语句的结果，
--    拆成多条的话前面的结果会被覆盖掉，看不到。
select
  (select count(*) from pg_policies
     where schemaname = 'public' and tablename = 'progress')            as policy_count,
  (select relrowsecurity from pg_class
     where oid = 'public.progress'::regclass)                           as rls_enabled,
  (select count(*) from information_schema.role_table_grants
     where table_name = 'progress' and grantee = 'anon')                as anon_grants,
  (select string_agg(privilege_type, ', ' order by privilege_type)
     from information_schema.role_table_grants
     where table_name = 'progress' and grantee = 'authenticated')       as auth_privs;

-- 期望：
--   policy_count = 4
--   rls_enabled  = true
--   anon_grants  = 0
--   auth_privs   = 'DELETE, INSERT, SELECT, UPDATE'   ← 出现 TRUNCATE 就是权限没收干净
