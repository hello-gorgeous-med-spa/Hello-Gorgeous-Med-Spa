-- Add fresha_appointment_id to appointments for Zapier webhook deduplication
alter table public.appointments
  add column if not exists fresha_appointment_id text unique,
  add column if not exists service_price integer; -- in cents, from Fresha

create index if not exists idx_appointments_fresha_id
  on public.appointments (fresha_appointment_id)
  where fresha_appointment_id is not null;

-- Backfill fresha_appointment_id from existing client_notes (e.g. "Fresha Ref: #93F1AF6E")
update public.appointments
set fresha_appointment_id = substring(client_notes from '#([A-Z0-9]+)')
where client_notes like 'Fresha Ref:%'
  and fresha_appointment_id is null;
