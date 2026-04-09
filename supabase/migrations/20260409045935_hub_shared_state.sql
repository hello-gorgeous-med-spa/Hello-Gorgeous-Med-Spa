create table if not exists public.hg_tasks (
  id bigserial primary key,
  user_key text not null check (user_key in ('dani','ryan')),
  text text not null,
  assignee text not null default 'both' check (assignee in ('dani','ryan','both')),
  done boolean not null default false,
  created_by text not null default 'dani',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hg_tasks_user_key on public.hg_tasks(user_key);
create index if not exists idx_hg_tasks_created_at on public.hg_tasks(created_at desc);

create table if not exists public.hg_notes (
  id bigserial primary key,
  user_key text not null check (user_key in ('dani','ryan')),
  client_id text not null,
  client_name text,
  note text not null,
  created_by text not null default 'dani',
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_notes_user_key_client on public.hg_notes(user_key, client_id);
create index if not exists idx_hg_notes_created_at on public.hg_notes(created_at desc);

create table if not exists public.hg_hub_state (
  user_key text primary key check (user_key in ('dani','ryan')),
  expenses jsonb not null default '[]'::jsonb,
  bills jsonb not null default '[]'::jsonb,
  tags jsonb not null default '{}'::jsonb,
  sq_data jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.hg_hub_state (user_key) values ('dani') on conflict (user_key) do nothing;
insert into public.hg_hub_state (user_key) values ('ryan') on conflict (user_key) do nothing;

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

alter table public.hg_tasks enable row level security;
alter table public.hg_notes enable row level security;
alter table public.hg_hub_state enable row level security;
alter table public.hg_oauth_tokens enable row level security;
