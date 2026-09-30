-- Add last_service_date column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE sms_contacts ADD COLUMN last_service_date DATE;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_sms_contacts_last_service ON sms_contacts(last_service_date);
