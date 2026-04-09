-- Optional client-side settings blob for Command Center classic (Twilio, Meta, etc.)
alter table public.hg_hub_state
  add column if not exists credentials jsonb not null default '{}'::jsonb;
