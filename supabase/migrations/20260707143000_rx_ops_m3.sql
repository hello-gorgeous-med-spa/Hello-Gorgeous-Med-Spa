-- M3: RX Ops clinical review — immutable Rx records (HGRX-033) + audit log (HGRX-005)

create table if not exists public.hg_rx_prescriptions (
  id uuid primary key default gen_random_uuid(),
  request_kind text not null check (request_kind in ('intake', 'clinic', 'regen')),
  request_id text not null,
  patient_name text not null,
  compound text,
  product_label text,
  pharmacy text,
  sig text,
  decision text not null check (decision in ('approved', 'declined', 'info_requested')),
  signed_by_name text not null,
  signed_by_email text not null,
  signed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists idx_hg_rx_prescriptions_approved_once
  on public.hg_rx_prescriptions (request_kind, request_id)
  where decision = 'approved';

create index if not exists idx_hg_rx_prescriptions_signed_at
  on public.hg_rx_prescriptions (signed_at desc);

alter table public.hg_rx_prescriptions enable row level security;

drop policy if exists "Service role full access to hg_rx_prescriptions" on public.hg_rx_prescriptions;
create policy "Service role full access to hg_rx_prescriptions" on public.hg_rx_prescriptions
  for all using (public.is_service_role());

create table if not exists public.hg_rx_ops_audit_log (
  id uuid primary key default gen_random_uuid(),
  request_kind text not null,
  request_id text not null,
  action text not null,
  actor_email text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_rx_ops_audit_request
  on public.hg_rx_ops_audit_log (request_kind, request_id);

create index if not exists idx_hg_rx_ops_audit_created
  on public.hg_rx_ops_audit_log (created_at desc);

alter table public.hg_rx_ops_audit_log enable row level security;

drop policy if exists "Service role full access to hg_rx_ops_audit_log" on public.hg_rx_ops_audit_log;
create policy "Service role full access to hg_rx_ops_audit_log" on public.hg_rx_ops_audit_log
  for all using (public.is_service_role());

-- HGRX-030: extend dispatch workflow for decline / info-requested stages
alter table public.hg_rx_dispatch drop constraint if exists hg_rx_dispatch_status_check;
alter table public.hg_rx_dispatch add constraint hg_rx_dispatch_status_check
  check (status in ('new', 'reviewed', 'approved', 'sent', 'declined', 'info_requested'));
