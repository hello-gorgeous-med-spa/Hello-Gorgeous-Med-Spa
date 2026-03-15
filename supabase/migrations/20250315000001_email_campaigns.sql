-- Email campaigns table for /admin/email-campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  open_rate NUMERIC(5,2),
  click_rate NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on email_campaigns"
  ON email_campaigns FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_created ON email_campaigns(created_at DESC);
