-- HG_DEV_PLAID_001: Plaid Items (one per Plaid Item / institution connection)
create table if not exists public.hg_plaid_items (
  id bigserial primary key,
  item_id text not null unique,
  access_token_encrypted text not null,
  institution_id text,
  institution_name text,
  cursor text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- Accounts under an Item (Chase checking, Amex cards, etc.)
create table if not exists public.hg_plaid_accounts (
  id bigserial primary key,
  item_id text not null references public.hg_plaid_items (item_id) on delete cascade,
  plaid_account_id text not null unique,
  name text,
  official_name text,
  type text,
  subtype text,
  mask text,
  current_balance numeric(14, 2),
  available_balance numeric(14, 2),
  currency text default 'USD',
  updated_at timestamptz not null default now()
);

create index if not exists idx_hg_plaid_accounts_item on public.hg_plaid_accounts (item_id);

create table if not exists public.hg_plaid_transactions (
  transaction_id text primary key,
  item_id text not null references public.hg_plaid_items (item_id) on delete cascade,
  account_id text not null,
  institution text,
  date date not null,
  name text,
  amount numeric(12, 2),
  category text,
  hg_category text,
  pending boolean not null default false,
  synced_at timestamptz not null default now()
);

create index if not exists idx_hg_plaid_txn_date on public.hg_plaid_transactions (date desc);
create index if not exists idx_hg_plaid_txn_item on public.hg_plaid_transactions (item_id);
create index if not exists idx_hg_plaid_txn_account on public.hg_plaid_transactions (account_id);

alter table public.hg_plaid_items enable row level security;
alter table public.hg_plaid_accounts enable row level security;
alter table public.hg_plaid_transactions enable row level security;
