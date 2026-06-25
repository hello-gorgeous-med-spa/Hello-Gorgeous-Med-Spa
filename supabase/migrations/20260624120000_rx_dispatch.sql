-- RX Dispatch — staff workflow after intake approval (Formulation / BoomRx)

create table if not exists public.hg_rx_dispatch (
  submission_id uuid primary key references public.hg_form_submissions(id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'reviewed', 'approved', 'sent')),
  pharmacy text check (pharmacy is null or pharmacy in ('formulation', 'boomrx')),
  ship_to text not null default 'patient' check (ship_to in ('patient', 'clinic')),
  address_line1 text,
  address_line2 text,
  city text,
  state text default 'IL',
  zip text,
  drug text,
  sig text,
  staff_notes text,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists idx_hg_rx_dispatch_status on public.hg_rx_dispatch (status);
create index if not exists idx_hg_rx_dispatch_updated on public.hg_rx_dispatch (updated_at desc);

alter table public.hg_rx_dispatch enable row level security;

drop policy if exists "Service role full access to hg_rx_dispatch" on public.hg_rx_dispatch;
create policy "Service role full access to hg_rx_dispatch" on public.hg_rx_dispatch
  for all using (public.is_service_role());
