-- Phase 4B — allow push channel in RX refill reminder log

alter table public.hg_rx_refill_reminders
  drop constraint if exists hg_rx_refill_reminders_channel_check;

alter table public.hg_rx_refill_reminders
  add constraint hg_rx_refill_reminders_channel_check
  check (channel in ('sms', 'email', 'push'));
