-- Unified SMS + WhatsApp thread for Command Center (Twilio)
-- Server writes via SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

create table if not exists public.hg_messages (
  id uuid primary key default gen_random_uuid(),
  hub_client_id text,
  client_phone text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  channel text not null check (channel in ('sms', 'whatsapp')),
  body text not null,
  twilio_sid text unique,
  status text default 'sent',
  error_message text,
  read_at timestamptz,
  sent_by text check (sent_by is null or sent_by in ('dani', 'ryan')),
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_messages_client_phone on public.hg_messages (client_phone);
create index if not exists idx_hg_messages_hub_client_id on public.hg_messages (hub_client_id);
create index if not exists idx_hg_messages_sent_at on public.hg_messages (sent_at desc);
create index if not exists idx_hg_messages_unread_wa on public.hg_messages (channel, read_at)
  where direction = 'inbound' and channel = 'whatsapp' and read_at is null;

alter table public.hg_messages enable row level security;

drop policy if exists "Service role full access to hg_messages" on public.hg_messages;
create policy "Service role full access to hg_messages" on public.hg_messages
  for all using (public.is_service_role());
