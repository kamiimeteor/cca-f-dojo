alter table public.progress add column if not exists version bigint not null default 1;

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

alter default privileges in schema public revoke all on tables from authenticated;

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
