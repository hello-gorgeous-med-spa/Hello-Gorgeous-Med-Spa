-- RX refill cadence reminders — dedupe patient SMS/email nudges

create table if not exists public.hg_rx_refill_reminders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  source_kind text not null check (source_kind in ('clinic', 'intake')),
  source_id uuid not null,
  urgency text not null check (urgency in ('due_soon', 'overdue')),
  channel text not null check (channel in ('sms', 'email')),
  sent_at timestamptz not null default now()
);

create index if not exists idx_hg_rx_refill_reminders_lookup
  on public.hg_rx_refill_reminders (client_id, source_kind, source_id, urgency, sent_at desc);

alter table public.hg_rx_refill_reminders enable row level security;

drop policy if exists "Service role full access to hg_rx_refill_reminders" on public.hg_rx_refill_reminders;
create policy "Service role full access to hg_rx_refill_reminders" on public.hg_rx_refill_reminders
  for all using (public.is_service_role());
