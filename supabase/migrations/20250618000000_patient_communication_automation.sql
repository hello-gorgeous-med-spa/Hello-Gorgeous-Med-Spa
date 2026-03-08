-- ============================================================
-- Patient Communication Automation System
-- Master ticket: automation infrastructure (templates, rules, queue, logs, unsubscribes)
-- Uses existing: clients (as patients), appointments
-- ============================================================

-- Ensure clients have consent columns for compliance
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS consent_sms BOOLEAN DEFAULT false;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS consent_email BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ------------------------------------------------------------
-- message_templates — Resend (email) and Telnyx (SMS) templates
-- trigger_event: appointment_confirmation, reminder_24h, post_treatment_followup, review_request, rebooking_reminder, abandoned_booking_recovery
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  trigger_event TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, channel)
);

CREATE INDEX IF NOT EXISTS idx_message_templates_trigger ON public.message_templates(trigger_event);
CREATE INDEX IF NOT EXISTS idx_message_templates_channel ON public.message_templates(channel);
COMMENT ON TABLE public.message_templates IS 'Email (Resend) and SMS (Telnyx) templates with {{variables}} for automation';

-- ------------------------------------------------------------
-- automation_rules — when to send what, with delay
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  template_id UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger ON public.automation_rules(trigger_event);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON public.automation_rules(active);
COMMENT ON TABLE public.automation_rules IS 'Rules: trigger_event + delay_minutes -> template on channel';

-- ------------------------------------------------------------
-- message_queue — pending/scheduled messages (processed by cron or worker)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  automation_rule_id UUID REFERENCES public.automation_rules(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  payload_json JSONB DEFAULT '{}',
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_queue_scheduled ON public.message_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_message_queue_client ON public.message_queue(client_id);
CREATE INDEX IF NOT EXISTS idx_message_queue_status ON public.message_queue(status);
COMMENT ON TABLE public.message_queue IS 'Outbound messages scheduled for send; cron processes pending rows';

-- ------------------------------------------------------------
-- message_logs — audit of all sent messages (delivery status, provider)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  template_id UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  provider TEXT,
  external_message_id TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_logs_client ON public.message_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_sent_at ON public.message_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_message_logs_channel ON public.message_logs(channel);
COMMENT ON TABLE public.message_logs IS 'Audit log of all sent automation messages (Resend/Telnyx)';

-- ------------------------------------------------------------
-- unsubscribes — SMS/email opt-out for compliance
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  phone TEXT,
  email TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unsubscribes_phone_channel ON public.unsubscribes(phone, channel) WHERE phone IS NOT NULL AND phone != '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_unsubscribes_email_channel ON public.unsubscribes(LOWER(email), channel) WHERE email IS NOT NULL AND email != '';
CREATE INDEX IF NOT EXISTS idx_unsubscribes_client ON public.unsubscribes(client_id);
COMMENT ON TABLE public.unsubscribes IS 'SMS/email opt-outs; check before sending automation';

-- RLS
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access message_templates" ON public.message_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access automation_rules" ON public.automation_rules FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access message_queue" ON public.message_queue FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access message_logs" ON public.message_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access unsubscribes" ON public.unsubscribes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed default automation templates (can be edited in admin)
INSERT INTO public.message_templates (name, channel, trigger_event, subject, body, active) VALUES
  ('Appointment Confirmation', 'email', 'appointment_created', 'Your appointment is confirmed – {{service_name}} – Hello Gorgeous Med Spa', 'Hi {{first_name}},\n\nYour appointment is confirmed at Hello Gorgeous Med Spa!\n\nDate & time: {{appointment_time}}\nService: {{service_name}}\nProvider: {{provider_name}}\n\nWe look forward to seeing you.\nHello Gorgeous Med Spa', true),
  ('Appointment Confirmation SMS', 'sms', 'appointment_created', NULL, 'Hi {{first_name}} 💕 Your Hello Gorgeous Med Spa appointment is confirmed for {{appointment_time}}. Reply STOP to unsubscribe.', true),
  ('24-Hour Reminder', 'sms', 'reminder_24h', NULL, 'Hi {{first_name}}! Reminder: your appointment is tomorrow at {{appointment_time}}. Reply STOP to unsubscribe.', true),
  ('Post-Treatment Follow-Up', 'email', 'post_treatment_followup', 'How was your visit? – Hello Gorgeous Med Spa', 'Hi {{first_name}},\n\nThank you for visiting Hello Gorgeous Med Spa. We hope you had a great experience.\n\nIf you have any questions about aftercare, reach out anytime.\n\nHello Gorgeous Med Spa', true),
  ('Review Request', 'sms', 'review_request', NULL, 'Hi {{first_name}}! Thank you for visiting Hello Gorgeous Med Spa. Would you mind leaving us a quick review? {{review_link}} Reply STOP to unsubscribe.', true),
  ('Rebooking Reminder', 'sms', 'rebooking_reminder', NULL, 'Hi {{first_name}} 💕 It’s been a while! We’d love to see you again at Hello Gorgeous Med Spa. Book when you’re ready. Reply STOP to unsubscribe.', true),
  ('Abandoned Booking Recovery', 'sms', 'abandoned_booking_recovery', NULL, 'Hi {{first_name}} – you started booking with us but didn’t finish. Need help? Call us or book online. Reply STOP to unsubscribe.', true)
ON CONFLICT (name, channel) DO NOTHING;

-- Seed default automation rules (reference templates by name; template_id set by app or follow-up migration)
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT 'Appointment confirmation email', 'appointment_created', 0, 'email', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'appointment_created' AND channel = 'email' LIMIT 1);
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT 'Appointment confirmation SMS', 'appointment_created', 0, 'sms', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'appointment_created' AND channel = 'sms' LIMIT 1);
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT '24-hour reminder SMS', 'reminder_24h', 24*60, 'sms', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'reminder_24h' LIMIT 1);
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT 'Post-treatment follow-up email', 'post_treatment_followup', 24*60, 'email', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'post_treatment_followup' LIMIT 1);
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT 'Review request SMS', 'review_request', 48*60, 'sms', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'review_request' LIMIT 1);
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT 'Rebooking reminder SMS', 'rebooking_reminder', 90*24*60, 'sms', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'rebooking_reminder' LIMIT 1);
INSERT INTO public.automation_rules (name, trigger_event, delay_minutes, channel, active)
SELECT 'Abandoned booking recovery SMS', 'abandoned_booking_recovery', 30, 'sms', true
WHERE NOT EXISTS (SELECT 1 FROM public.automation_rules WHERE trigger_event = 'abandoned_booking_recovery' LIMIT 1);
