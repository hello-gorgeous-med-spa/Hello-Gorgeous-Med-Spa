-- Reminder logs: deduplicate appointment reminders (24h and 2h before)
-- Used by /api/reminders/send and /api/cron/reminders
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  channels TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id, template)
);

CREATE INDEX IF NOT EXISTS idx_reminder_logs_appointment_template ON reminder_logs(appointment_id, template);

COMMENT ON TABLE reminder_logs IS 'Tracks sent appointment reminders (24h, 2h) for cron deduplication';
