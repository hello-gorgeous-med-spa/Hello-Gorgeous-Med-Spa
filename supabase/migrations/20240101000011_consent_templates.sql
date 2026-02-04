-- ============================================================
-- CONSENT TEMPLATES TABLE
-- Stores customizable consent form templates
-- ============================================================

-- Create consent_templates table
CREATE TABLE IF NOT EXISTS public.consent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_witness BOOLEAN NOT NULL DEFAULT false,
  required_for_services TEXT[], -- Array of service slugs that require this consent
  expires_days INTEGER DEFAULT 365, -- How long until consent expires
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_consent_templates_slug ON public.consent_templates(slug);
CREATE INDEX IF NOT EXISTS idx_consent_templates_active ON public.consent_templates(is_active);

-- Create client_consents table (signed consents)
CREATE TABLE IF NOT EXISTS public.client_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  consent_template_id UUID NOT NULL REFERENCES public.consent_templates(id),
  template_version INTEGER NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  signature_data TEXT, -- Base64 signature image or typed name
  signature_type VARCHAR(20) DEFAULT 'typed', -- 'drawn' or 'typed'
  ip_address INET,
  user_agent TEXT,
  witness_name VARCHAR(255),
  witness_signature TEXT,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for client_consents
CREATE INDEX IF NOT EXISTS idx_client_consents_client_id ON public.client_consents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_template_id ON public.client_consents(consent_template_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_expires_at ON public.client_consents(expires_at);

-- Updated_at trigger for consent_templates
CREATE OR REPLACE FUNCTION update_consent_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_consent_templates_timestamp ON public.consent_templates;
CREATE TRIGGER update_consent_templates_timestamp
  BEFORE UPDATE ON public.consent_templates
  FOR EACH ROW EXECUTE FUNCTION update_consent_templates_updated_at();

-- Enable RLS
ALTER TABLE public.consent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consent_templates (everyone can read active templates)
DROP POLICY IF EXISTS "Anyone can view active consent templates" ON public.consent_templates;
CREATE POLICY "Anyone can view active consent templates"
  ON public.consent_templates FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Service role has full access to consent templates" ON public.consent_templates;
CREATE POLICY "Service role has full access to consent templates"
  ON public.consent_templates FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for client_consents
DROP POLICY IF EXISTS "Service role has full access to client consents" ON public.client_consents;
CREATE POLICY "Service role has full access to client consents"
  ON public.client_consents FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.consent_templates TO service_role;
GRANT SELECT ON public.consent_templates TO authenticated;
GRANT ALL ON public.client_consents TO service_role;
GRANT SELECT, INSERT ON public.client_consents TO authenticated;
