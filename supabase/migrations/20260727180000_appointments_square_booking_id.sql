-- Square booking id on appointments for hub "Start consents" dedupe
alter table public.appointments
  add column if not exists square_booking_id text;

create unique index if not exists idx_appointments_square_booking_id
  on public.appointments (square_booking_id)
  where square_booking_id is not null;

comment on column public.appointments.square_booking_id is
  'Square Appointments booking id — used by hub square-start-consents interim bridge';
