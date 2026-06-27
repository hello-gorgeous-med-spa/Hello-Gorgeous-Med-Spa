-- Hello Gorgeous RX™ — secure patient ↔ staff messaging (web portal, not SMS body storage)

create table if not exists public.hg_rx_message_threads (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.hg_form_submissions(id) on delete set null,
  intake_ref text not null,
  patient_email text not null,
  patient_name text,
  patient_phone text,
  track text,
  unread_staff_count integer not null default 0,
  unread_patient_count integer not null default 0,
  last_message_at timestamptz,
  last_preview text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (intake_ref, patient_email)
);

create table if not exists public.hg_rx_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.hg_rx_message_threads(id) on delete cascade,
  sender_type text not null check (sender_type in ('patient', 'staff')),
  body text not null,
  sent_by text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_rx_message_threads_ref on public.hg_rx_message_threads (intake_ref);
create index if not exists idx_hg_rx_message_threads_updated on public.hg_rx_message_threads (last_message_at desc nulls last);
create index if not exists idx_hg_rx_messages_thread on public.hg_rx_messages (thread_id, created_at desc);

alter table public.hg_rx_message_threads enable row level security;
alter table public.hg_rx_messages enable row level security;

drop policy if exists "Service role full access to hg_rx_message_threads" on public.hg_rx_message_threads;
create policy "Service role full access to hg_rx_message_threads" on public.hg_rx_message_threads
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_messages" on public.hg_rx_messages;
create policy "Service role full access to hg_rx_messages" on public.hg_rx_messages
  for all using (public.is_service_role());
