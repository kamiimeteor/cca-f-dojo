-- CCA-P 进度表：与 CCA-F 共用 Supabase 项目和账号体系，进度分表保存
-- 在 Supabase Dashboard → SQL Editor 里整段执行。可重复执行（幂等）。
--
-- 为什么不能复用 progress 表：progress 以 user_id 为主键，一个用户只有一行。
-- 同一个人在两个站都登录时，CCA-P 的进度会直接覆盖 CCA-F 的那一行。
--
-- 结构、RLS、授权、触发器与 progress 完全一致（见 schema.sql 的设计说明）。
-- 删除账号时 auth.users 级联删除，两张表的行会一起清掉，delete-account 无需改动。

create table if not exists public.progress_ccap (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  version    bigint      not null default 1,
  updated_at timestamptz not null default now()
);

comment on table public.progress_ccap is
  'cca-p 用户进度。一个用户一行，data 是前端 progressArchive() 打包后的完整状态。';

do $$
begin
  if not exists (
    select 1 from pg_constraint
      where conname = 'progress_ccap_data_size'
        and conrelid = 'public.progress_ccap'::regclass
  ) then
    alter table public.progress_ccap
      add constraint progress_ccap_data_size
      check (length(data::text) < 512000);
  end if;
end $$;

alter table public.progress_ccap enable row level security;

drop policy if exists "progress_ccap_select_own" on public.progress_ccap;
create policy "progress_ccap_select_own" on public.progress_ccap
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "progress_ccap_insert_own" on public.progress_ccap;
create policy "progress_ccap_insert_own" on public.progress_ccap
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_ccap_update_own" on public.progress_ccap;
create policy "progress_ccap_update_own" on public.progress_ccap
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_ccap_delete_own" on public.progress_ccap;
create policy "progress_ccap_delete_own" on public.progress_ccap
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 必须先 REVOKE ALL 再 GRANT：default privileges 不能覆盖所有授予者，
-- 不收掉的话 authenticated 会拿到不受 RLS 约束的 TRUNCATE。
revoke all on table public.progress_ccap from anon, authenticated;
grant select, insert, update, delete on table public.progress_ccap to authenticated;

-- 两个触发器函数是通用的（只碰 new / old），直接复用 progress 那两个
drop trigger if exists trg_progress_ccap_bump_version on public.progress_ccap;
create trigger trg_progress_ccap_bump_version
  before update on public.progress_ccap
  for each row execute function public.bump_progress_version();

drop trigger if exists progress_ccap_touch_updated_at on public.progress_ccap;
create trigger progress_ccap_touch_updated_at
  before update on public.progress_ccap
  for each row execute function public.touch_updated_at();

-- 自检（单条语句，SQL Editor 只显示最后一条的结果）
select
  (select count(*) from pg_policies
     where schemaname = 'public' and tablename = 'progress_ccap')       as policy_count,
  (select relrowsecurity from pg_class
     where oid = 'public.progress_ccap'::regclass)                      as rls_enabled,
  (select count(*) from information_schema.role_table_grants
     where table_name = 'progress_ccap' and grantee = 'anon')           as anon_grants,
  (select string_agg(privilege_type, ', ' order by privilege_type)
     from information_schema.role_table_grants
     where table_name = 'progress_ccap' and grantee = 'authenticated')  as auth_privs,
  (select count(*) from pg_trigger
     where tgrelid = 'public.progress_ccap'::regclass and not tgisinternal) as trigger_count;

-- 期望：
--   policy_count  = 4
--   rls_enabled   = true
--   anon_grants   = 0
--   auth_privs    = 'DELETE, INSERT, SELECT, UPDATE'   ← 出现 TRUNCATE 就是权限没收干净
--   trigger_count = 2
