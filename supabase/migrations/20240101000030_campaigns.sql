-- ============================================================
-- MARKETING CAMPAIGNS - History, Recipients, Stats
-- Powers admin/marketing campaign sending & tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'multichannel')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', 'failed')),

  -- Email fields
  subject TEXT,
  preview_text TEXT,
  email_html TEXT,

  -- SMS fields
  sms_content TEXT,

  -- Audience
  audience_segment TEXT NOT NULL DEFAULT 'all-clients',
  audience_filters JSONB DEFAULT '{}'::jsonb,

  -- Stats
  total_recipients INT NOT NULL DEFAULT 0,
  email_sent INT NOT NULL DEFAULT 0,
  email_delivered INT NOT NULL DEFAULT 0,
  email_opened INT NOT NULL DEFAULT 0,
  email_clicked INT NOT NULL DEFAULT 0,
  email_bounced INT NOT NULL DEFAULT 0,
  sms_sent INT NOT NULL DEFAULT 0,
  sms_delivered INT NOT NULL DEFAULT 0,
  sms_failed INT NOT NULL DEFAULT 0,

  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Metadata
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON campaigns(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION touch_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_campaigns_timestamps ON campaigns;
CREATE TRIGGER trg_campaigns_timestamps
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION touch_campaigns_updated_at();

-- RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to campaigns" ON campaigns;
CREATE POLICY "Service role full access to campaigns"
  ON campaigns FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins manage campaigns" ON campaigns;
CREATE POLICY "Admins manage campaigns"
  ON campaigns FOR ALL
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
  RAISE NOTICE 'Campaigns schema ready.';
END $$;
