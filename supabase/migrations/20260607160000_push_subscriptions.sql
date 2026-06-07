-- Push notification subscriptions for the client app PWA.
-- Stores Web Push API subscription objects per client.

create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists push_subscriptions_client_id_idx on public.push_subscriptions(client_id);

-- RLS: only service role can read/write (push send is server-side only)
alter table public.push_subscriptions enable row level security;

create policy "service_role_all" on public.push_subscriptions
  using (true)
  with check (true);
