-- ============================================================
-- HELLO GORGEOUS COMMAND CENTER — one-shot setup / reset
--
-- What it does:
--   • Drops old hub + draft tables (tasks, notes, hub state, Anthony draft tables)
--   • Does NOT drop hg_oauth_tokens (Google/Meta tokens stay)
--   • Creates the tables your Next.js /api/hub/* routes expect
--
-- How to run:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Paste this entire file → Run
-- ============================================================

drop table if exists public.hg_google_reviews cascade;
drop table if exists public.hg_square_transactions cascade;
drop table if exists public.hg_settings cascade;
drop table if exists public.hg_bills cascade;
drop table if exists public.hg_expenses cascade;
drop table if exists public.hg_client_tags cascade;
drop table if exists public.hg_client_notes cascade;
drop table if exists public.hg_tasks cascade;
drop table if exists public.hg_notes cascade;
drop table if exists public.hg_hub_state cascade;
-- hg_oauth_tokens: NOT dropped — keeps existing OAuth tokens

create table public.hg_tasks (
  id bigserial primary key,
  user_key text not null check (user_key in ('dani','ryan')),
  text text not null,
  assignee text not null default 'both' check (assignee in ('dani','ryan','both')),
  done boolean not null default false,
  created_by text not null default 'dani',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_hg_tasks_user_key on public.hg_tasks(user_key);
create index idx_hg_tasks_created_at on public.hg_tasks(created_at desc);

create table public.hg_notes (
  id bigserial primary key,
  user_key text not null check (user_key in ('dani','ryan')),
  client_id text not null,
  client_name text,
  note text not null,
  created_by text not null default 'dani',
  created_at timestamptz not null default now()
);

create index idx_hg_notes_user_key_client on public.hg_notes(user_key, client_id);
create index idx_hg_notes_created_at on public.hg_notes(created_at desc);

create table public.hg_hub_state (
  user_key text primary key check (user_key in ('dani','ryan')),
  expenses jsonb not null default '[]'::jsonb,
  bills jsonb not null default '[]'::jsonb,
  tags jsonb not null default '{}'::jsonb,
  sq_data jsonb not null default '[]'::jsonb,
  credentials jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.hg_hub_state (user_key) values ('dani'), ('ryan');

create table if not exists public.hg_oauth_tokens (
  provider text primary key,
  access_token text,
  refresh_token text,
  scope text,
  account_id text,
  location_id text,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.hg_oauth_tokens add column if not exists access_token text;
alter table public.hg_oauth_tokens add column if not exists refresh_token text;
alter table public.hg_oauth_tokens add column if not exists scope text;
alter table public.hg_oauth_tokens add column if not exists account_id text;
alter table public.hg_oauth_tokens add column if not exists location_id text;
alter table public.hg_oauth_tokens add column if not exists expires_at timestamptz;
alter table public.hg_oauth_tokens add column if not exists updated_at timestamptz;

alter table public.hg_tasks enable row level security;
alter table public.hg_notes enable row level security;
alter table public.hg_hub_state enable row level security;
alter table public.hg_oauth_tokens enable row level security;
