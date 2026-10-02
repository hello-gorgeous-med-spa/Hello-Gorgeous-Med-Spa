-- Per-message Twilio ledger for SMS blasts.
-- Kept separate from inbox sms_messages so campaign delivery
-- does not depend on that table's shape.

CREATE TABLE IF NOT EXISTS sms_blast_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blast_id UUID REFERENCES sms_blasts(id) ON DELETE SET NULL,
  contact_id UUID,
  phone TEXT NOT NULL,
  first_name TEXT,
  twilio_sid TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'queued',
  error_code TEXT,
  error_message TEXT,
  price_usd NUMERIC(10, 4),
  sent_at TIMESTAMPTZ,
  status_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_blast_deliveries_blast_status
  ON sms_blast_deliveries (blast_id, status);

ALTER TABLE sms_blasts ADD COLUMN IF NOT EXISTS accepted_count INTEGER DEFAULT 0;
ALTER TABLE sms_blasts ADD COLUMN IF NOT EXISTS undelivered_count INTEGER DEFAULT 0;

ALTER TABLE sms_blast_deliveries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "allow_all" ON sms_blast_deliveries
    FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
