-- RX Payment Ledger — Square invoice / payment link compliance record for staff

create table if not exists public.hg_rx_payment_ledger (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid references public.clients(id) on delete set null,
  client_name text,
  client_email text,
  client_phone text,
  submission_id uuid references public.hg_form_submissions(id) on delete set null,
  intake_ref text,
  source text not null check (source in (
    'staff_invoice',
    'glp1_checkout',
    'glp1_autopay',
    'peptide_checkout',
    'manual'
  )),
  template_id text,
  template_name text,
  track text check (track is null or track in ('weight-loss', 'peptides', 'fees')),
  line_label text,
  amount_usd numeric(12, 2) not null,
  payment_status text not null default 'pending' check (payment_status in (
    'pending',
    'paid',
    'failed',
    'refunded',
    'unknown'
  )),
  payment_url text,
  square_payment_link_id text,
  square_order_id text,
  square_payment_id text,
  delivery_method text check (delivery_method is null or delivery_method in (
    'link',
    'email',
    'sms',
    'both',
    'patient_portal'
  )),
  sent_by text,
  staff_note text,
  chart_note text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_hg_rx_payment_ledger_created on public.hg_rx_payment_ledger (created_at desc);
create index if not exists idx_hg_rx_payment_ledger_status on public.hg_rx_payment_ledger (payment_status);
create index if not exists idx_hg_rx_payment_ledger_track on public.hg_rx_payment_ledger (track);
create index if not exists idx_hg_rx_payment_ledger_client on public.hg_rx_payment_ledger (client_id);
create index if not exists idx_hg_rx_payment_ledger_submission on public.hg_rx_payment_ledger (submission_id);
create index if not exists idx_hg_rx_payment_ledger_square_order on public.hg_rx_payment_ledger (square_order_id)
  where square_order_id is not null;
create index if not exists idx_hg_rx_payment_ledger_square_payment on public.hg_rx_payment_ledger (square_payment_id)
  where square_payment_id is not null;

alter table public.hg_rx_payment_ledger enable row level security;

drop policy if exists "Service role full access to hg_rx_payment_ledger" on public.hg_rx_payment_ledger;
create policy "Service role full access to hg_rx_payment_ledger" on public.hg_rx_payment_ledger
  for all using (public.is_service_role());
