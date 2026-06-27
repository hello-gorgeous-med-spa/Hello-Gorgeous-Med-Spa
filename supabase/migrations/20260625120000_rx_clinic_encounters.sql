-- In-person GLP-1 clinic sales — consult, pay at terminal, ship to patient (no clinic drug inventory)

create table if not exists public.hg_rx_clinic_encounters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete restrict,
  created_by text,
  encounter_type text not null check (encounter_type in ('new_consult', 'refill', 'dose_change')),
  medication text not null,
  dose_tier_id text not null,
  dose_label text,
  supply_cycle text not null check (supply_cycle in ('30-day', '90-day')),
  list_total_usd numeric(12, 2) not null,
  consult_fee_usd numeric(12, 2) not null default 0,
  discount_usd numeric(12, 2) not null default 0,
  discount_reason text,
  discount_authorized_by text,
  final_total_usd numeric(12, 2) not null,
  pricing_snapshot jsonb not null default '{}'::jsonb,
  ship_address_line1 text,
  ship_address_line2 text,
  ship_city text,
  ship_state text default 'IL',
  ship_zip text,
  pharmacy text check (pharmacy is null or pharmacy in ('formulation', 'boomrx')),
  dispatch_status text not null default 'new' check (dispatch_status in ('new', 'reviewed', 'sent')),
  sig text,
  clinical jsonb not null default '{}'::jsonb,
  staff_notes text,
  status text not null default 'draft' check (status in (
    'draft',
    'awaiting_payment',
    'paid',
    'ready_to_ship',
    'shipped',
    'complete',
    'cancelled'
  )),
  payment_method text check (payment_method is null or payment_method in (
    'terminal',
    'payment_link',
    'cash',
    'other'
  )),
  sale_id uuid references public.sales(id) on delete set null,
  ledger_id uuid references public.hg_rx_payment_ledger(id) on delete set null,
  square_order_id text,
  square_payment_id text,
  paid_at timestamptz
);

create index if not exists idx_hg_rx_clinic_encounters_created
  on public.hg_rx_clinic_encounters (created_at desc);
create index if not exists idx_hg_rx_clinic_encounters_client
  on public.hg_rx_clinic_encounters (client_id);
create index if not exists idx_hg_rx_clinic_encounters_status
  on public.hg_rx_clinic_encounters (status);
create index if not exists idx_hg_rx_clinic_encounters_dispatch
  on public.hg_rx_clinic_encounters (dispatch_status);

alter table public.hg_rx_clinic_encounters enable row level security;

drop policy if exists "Service role full access to hg_rx_clinic_encounters" on public.hg_rx_clinic_encounters;
create policy "Service role full access to hg_rx_clinic_encounters" on public.hg_rx_clinic_encounters
  for all using (public.is_service_role());

-- Extend RX ledger sources for in-person clinic sales
alter table public.hg_rx_payment_ledger
  drop constraint if exists hg_rx_payment_ledger_source_check;

alter table public.hg_rx_payment_ledger
  add constraint hg_rx_payment_ledger_source_check check (source in (
    'staff_invoice',
    'glp1_checkout',
    'glp1_autopay',
    'peptide_checkout',
    'manual',
    'clinic_terminal',
    'clinic_cash'
  ));
