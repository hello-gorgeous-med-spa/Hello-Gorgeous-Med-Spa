-- M7: RX refill plans + draft invoice triggers (HGRX-070 / HGRX-071)

create table if not exists public.hg_rx_refill_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  source_kind text not null check (source_kind in ('clinic', 'intake')),
  source_id text not null,
  track text not null default 'unknown',
  medication text not null,
  dose_label text,
  supply_cycle text not null default '30-day',
  pharmacy text,
  anchor_at timestamptz not null,
  next_refill_at timestamptz not null,
  price_usd numeric(10, 2),
  autopay_ledger_id uuid,
  draft_ledger_id uuid,
  last_reminder_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_hg_rx_refill_plans_source
  on public.hg_rx_refill_plans (source_kind, source_id)
  where status <> 'cancelled';

create index if not exists idx_hg_rx_refill_plans_client
  on public.hg_rx_refill_plans (client_id, status, next_refill_at);

create index if not exists idx_hg_rx_refill_plans_due
  on public.hg_rx_refill_plans (next_refill_at)
  where status = 'active';

alter table public.hg_rx_refill_plans enable row level security;

drop policy if exists "Service role full access to hg_rx_refill_plans" on public.hg_rx_refill_plans;
create policy "Service role full access to hg_rx_refill_plans" on public.hg_rx_refill_plans
  for all using (public.is_service_role());
