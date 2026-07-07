-- M6: RX telehealth sync (HGRX-060) + 90-day recheck log (HGRX-061)

alter table public.hg_rx_dispatch
  add column if not exists telehealth_required boolean not null default false,
  add column if not exists telehealth_scheduled_at timestamptz,
  add column if not exists telehealth_completed_at timestamptz,
  add column if not exists fresha_appointment_id text;

create index if not exists idx_hg_rx_dispatch_telehealth
  on public.hg_rx_dispatch (telehealth_required, telehealth_completed_at);

alter table public.regen_orders
  add column if not exists fresha_appointment_id text;

create table if not exists public.hg_rx_telehealth_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  request_kind text,
  request_id text,
  fresha_appointment_id text,
  completed_at timestamptz not null default now(),
  source text not null default 'fresha',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_hg_rx_telehealth_events_client
  on public.hg_rx_telehealth_events (client_id, completed_at desc);

create unique index if not exists idx_hg_rx_telehealth_events_fresha
  on public.hg_rx_telehealth_events (fresha_appointment_id)
  where fresha_appointment_id is not null;

alter table public.hg_rx_telehealth_events enable row level security;

drop policy if exists "Service role full access to hg_rx_telehealth_events" on public.hg_rx_telehealth_events;
create policy "Service role full access to hg_rx_telehealth_events" on public.hg_rx_telehealth_events
  for all using (public.is_service_role());
