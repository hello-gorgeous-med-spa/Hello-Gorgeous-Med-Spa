-- ============================================================
-- PHASE 2: CONSENT IMMUTABILITY ENFORCEMENT
-- Prevents modification of signed consent records
-- ============================================================

-- Add immutability trigger to consent_submissions
-- This prevents ANY updates to signed consents

CREATE OR REPLACE FUNCTION prevent_consent_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.signed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot modify a signed consent record. Consent ID: %', OLD.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS enforce_consent_immutability ON consent_submissions;

-- Create trigger to prevent updates on signed consents
CREATE TRIGGER enforce_consent_immutability
  BEFORE UPDATE ON consent_submissions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_consent_modification();

-- Also prevent deletion of signed consents
CREATE OR REPLACE FUNCTION prevent_consent_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.signed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot delete a signed consent record. Consent ID: %', OLD.id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_consent_no_delete ON consent_submissions;

CREATE TRIGGER enforce_consent_no_delete
  BEFORE DELETE ON consent_submissions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_consent_deletion();

-- Add audit columns if not exists
ALTER TABLE consent_submissions 
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS consent_version VARCHAR(20) DEFAULT '1.0';

-- Log all consent access
CREATE TABLE IF NOT EXISTS consent_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_submission_id UUID NOT NULL REFERENCES consent_submissions(id),
  action VARCHAR(50) NOT NULL, -- 'viewed', 'printed', 'exported'
  performed_by UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consent_audit_submission ON consent_audit_log(consent_submission_id);

-- RLS
ALTER TABLE consent_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view consent audit logs" ON consent_audit_log
  FOR SELECT TO authenticated USING (true);
