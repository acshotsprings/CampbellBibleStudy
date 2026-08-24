-- ============================================================
--  Part 2 — shared settings
--  Lets the TMDB key live in the database instead of the public
--  repo. Only signed-in family can read it.
--  Paste into Supabase → SQL Editor → Run.
-- ============================================================

create table if not exists public.app_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

alter table public.app_config enable row level security;

drop policy if exists "read config"  on public.app_config;
drop policy if exists "write config" on public.app_config;

-- signed-in family can read it; nobody signed out can
create policy "read config"  on public.app_config for select to authenticated using (true);
-- any signed-in member can set it (so you're not the only one who can fix it)
create policy "write config" on public.app_config for all to authenticated
  using (true) with check (true);
