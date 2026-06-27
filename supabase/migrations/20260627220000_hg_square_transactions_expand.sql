-- Expand Square payment cache for richer admin reporting / exports

alter table public.hg_square_transactions
  add column if not exists tip_usd numeric(12, 2),
  add column if not exists card_brand text,
  add column if not exists card_last_four text,
  add column if not exists order_id text,
  add column if not exists customer_id text,
  add column if not exists location_id text,
  add column if not exists receipt_url text,
  add column if not exists source_type text,
  add column if not exists paid_at timestamptz;

create index if not exists idx_hg_square_transactions_customer on public.hg_square_transactions (customer_id)
  where customer_id is not null;
create index if not exists idx_hg_square_transactions_paid_at on public.hg_square_transactions (paid_at desc nulls last);
