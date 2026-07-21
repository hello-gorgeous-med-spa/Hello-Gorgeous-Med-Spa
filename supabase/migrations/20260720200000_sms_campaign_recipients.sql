-- Per-recipient ledger for Text Studio SMS blasts (durable queue).

CREATE TABLE IF NOT EXISTS sms_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  client_id UUID,
  phone_e164 TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'skipped', 'cancelled')),
  twilio_sid TEXT,
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_campaign_recipients_campaign_status
  ON sms_campaign_recipients (campaign_id, status);

CREATE INDEX IF NOT EXISTS idx_sms_campaign_recipients_pending
  ON sms_campaign_recipients (status, created_at)
  WHERE status = 'pending';

CREATE UNIQUE INDEX IF NOT EXISTS idx_sms_campaign_recipients_campaign_phone
  ON sms_campaign_recipients (campaign_id, phone_e164);

ALTER TABLE sms_campaign_recipients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to sms_campaign_recipients" ON sms_campaign_recipients;
CREATE POLICY "Service role full access to sms_campaign_recipients"
  ON sms_campaign_recipients FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins manage sms_campaign_recipients" ON sms_campaign_recipients;
CREATE POLICY "Admins manage sms_campaign_recipients"
  ON sms_campaign_recipients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('admin', 'owner')
    )
  );

DO $$ BEGIN
  RAISE NOTICE 'sms_campaign_recipients ready.';
END $$;
