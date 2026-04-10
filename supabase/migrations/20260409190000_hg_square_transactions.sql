-- Cache for Hub Square payment sync (HG_DEV_SQUARE_001 · Anthony / HGOS)
-- Service role (server) bypasses RLS for API routes.

create table if not exists public.hg_square_transactions (
  id text primary key,
  date date not null,
  description text,
  amount numeric(12, 2) not null,
  status text,
  synced_at timestamptz default now()
);

create index if not exists idx_hg_square_transactions_date on public.hg_square_transactions (date);

alter table public.hg_square_transactions enable row level security;
