-- Staff commission payout ledger — closes the loop from "estimated" to "paid".

create table if not exists public.staff_commission_payouts (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid not null,
  staff_email text,
  staff_display_name text,
  plan_id text,
  period_start date not null,
  period_end date not null,
  sales_total_usd numeric(10,2) not null default 0,
  commission_rate numeric(6,4),
  commission_usd numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'void')),
  method text,
  notes text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_staff_commission_payouts_staff
  on public.staff_commission_payouts (staff_user_id, period_start desc);

create index if not exists idx_staff_commission_payouts_status
  on public.staff_commission_payouts (status, created_at desc);

alter table public.staff_commission_payouts enable row level security;

-- Server-only table (service role bypasses RLS); no anon/authenticated policies.

comment on table public.staff_commission_payouts is
  'Commission payout records per staff per period. Created by owner from the RE GEN sales report; status pending -> paid.';
comment on column public.staff_commission_payouts.commission_rate is
  'Rate applied at time of record (e.g. 0.10) — snapshot, not a live plan lookup.';
