-- Phase 4C — staff SMS dedupe for overdue refill alerts

alter table public.hg_rx_refill_reminders
  drop constraint if exists hg_rx_refill_reminders_channel_check;

alter table public.hg_rx_refill_reminders
  add constraint hg_rx_refill_reminders_channel_check
  check (channel in ('sms', 'email', 'push', 'staff_sms'));
