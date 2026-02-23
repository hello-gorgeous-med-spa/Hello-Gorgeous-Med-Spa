-- ============================================================
-- Feature leads: email/phone + opt-in captured before using tools
-- Used for Face Blueprint, Journey, Hormone, Lip Studio gates
-- ============================================================

CREATE TABLE IF NOT EXISTS feature_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL,
  marketing_opt_in BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_feature_leads_created_at ON feature_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_leads_source ON feature_leads(source);
CREATE INDEX IF NOT EXISTS idx_feature_leads_email ON feature_leads(email);

COMMENT ON TABLE feature_leads IS 'Leads captured at feature gate (face_blueprint, journey, hormone, lip_studio) for marketing/analytics';
