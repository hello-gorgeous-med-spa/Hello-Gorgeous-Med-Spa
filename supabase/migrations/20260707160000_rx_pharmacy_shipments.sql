-- M4 (HGRX-043) — unified pharmacy shipment tracking across Formulation / BoomRx / Olympia

create table if not exists public.hg_rx_pharmacy_shipments (
  id uuid primary key default gen_random_uuid(),
  request_kind text not null check (request_kind in ('intake', 'clinic', 'regen')),
  request_id text not null,
  prescription_id uuid references public.hg_rx_prescriptions(id) on delete set null,
  patient_name text not null,
  patient_email text,
  patient_phone text,
  pharmacy text not null,
  pharmacy_key text not null check (pharmacy_key in ('formulation', 'boomrx', 'olympia')),
  product_label text,
  compound text,
  sig text,
  ship_to jsonb,
  status text not null default 'queued'
    check (status in ('queued', 'submitted', 'processing', 'shipped', 'delivered', 'failed')),
  external_order_id text,
  tracking_number text,
  carrier text,
  last_sync_at timestamptz,
  last_error text,
  submitted_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_hg_rx_pharmacy_shipments_request_pharmacy
  on public.hg_rx_pharmacy_shipments (request_kind, request_id, pharmacy_key);

create index if not exists idx_hg_rx_pharmacy_shipments_status
  on public.hg_rx_pharmacy_shipments (status, updated_at desc);

alter table public.hg_rx_pharmacy_shipments enable row level security;

drop policy if exists "Service role full access to hg_rx_pharmacy_shipments" on public.hg_rx_pharmacy_shipments;
create policy "Service role full access to hg_rx_pharmacy_shipments" on public.hg_rx_pharmacy_shipments
  for all using (public.is_service_role());
