-- Fix: escape single quotes in template body strings for SQL
-- Run this only if the original seed failed; or delete existing rows and re-run the INSERT below.

DELETE FROM public.message_templates WHERE name IN ('Rebooking Reminder', 'Abandoned Booking Recovery');

INSERT INTO public.message_templates (name, channel, trigger_event, subject, body, active) VALUES
  ('Rebooking Reminder', 'sms', 'rebooking_reminder', NULL, 'Hi {{first_name}} 💕 It''s been a while! We''d love to see you again at Hello Gorgeous Med Spa. Book when you''re ready. Reply STOP to unsubscribe.', true),
  ('Abandoned Booking Recovery', 'sms', 'abandoned_booking_recovery', NULL, 'Hi {{first_name}} – you started booking with us but didn''t finish. Need help? Call us or book online. Reply STOP to unsubscribe.', true)
ON CONFLICT (name, channel) DO UPDATE SET body = EXCLUDED.body;
