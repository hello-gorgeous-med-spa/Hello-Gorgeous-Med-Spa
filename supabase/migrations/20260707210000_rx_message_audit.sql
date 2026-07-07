-- M8: RX messaging audit, chart linkage, notification delivery (HGRX-080 / HGRX-081)

alter table public.hg_rx_message_threads
  add column if not exists client_id uuid references public.clients(id) on delete set null;

create index if not exists idx_hg_rx_message_threads_client
  on public.hg_rx_message_threads (client_id);

alter table public.hg_rx_messages
  add column if not exists chart_note_id uuid;

create table if not exists public.hg_rx_message_audit_log (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.hg_rx_message_threads(id) on delete cascade,
  message_id uuid references public.hg_rx_messages(id) on delete set null,
  action text not null,
  actor_email text,
  actor_type text not null check (actor_type in ('patient', 'staff', 'system')),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_rx_message_audit_thread
  on public.hg_rx_message_audit_log (thread_id, created_at desc);

create table if not exists public.hg_rx_message_notifications (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.hg_rx_messages(id) on delete cascade,
  thread_id uuid not null references public.hg_rx_message_threads(id) on delete cascade,
  channel text not null check (channel in ('sms', 'email', 'push')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'skipped')),
  error text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_rx_message_notifications_message
  on public.hg_rx_message_notifications (message_id);

alter table public.hg_rx_message_audit_log enable row level security;
alter table public.hg_rx_message_notifications enable row level security;

drop policy if exists "Service role full access to hg_rx_message_audit_log" on public.hg_rx_message_audit_log;
create policy "Service role full access to hg_rx_message_audit_log" on public.hg_rx_message_audit_log
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_message_notifications" on public.hg_rx_message_notifications;
create policy "Service role full access to hg_rx_message_notifications" on public.hg_rx_message_notifications
  for all using (public.is_service_role());
