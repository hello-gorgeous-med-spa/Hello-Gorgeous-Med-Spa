create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  code text not null unique,  -- short human-readable code e.g. HGV-ABC123
  purchase_amount integer not null,  -- 1000 or 2000 (dollars)
  credit_amount integer not null,    -- 1100 or 2225 (dollars)
  remaining_balance integer not null, -- starts equal to credit_amount, decreases on use
  status text not null default 'active' check (status in ('active','depleted','expired','refunded')),
  purchased_at timestamptz not null default now(),
  expires_at timestamptz,  -- null = no expiry
  note text,  -- staff notes
  created_by text
);

create table if not exists public.voucher_redemptions (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null references public.vouchers(id),
  client_id uuid not null references public.clients(id),
  amount_used integer not null,  -- dollars redeemed
  balance_before integer not null,
  balance_after integer not null,
  redeemed_at timestamptz not null default now(),
  redeemed_by text,  -- staff name or 'system'
  note text
);
