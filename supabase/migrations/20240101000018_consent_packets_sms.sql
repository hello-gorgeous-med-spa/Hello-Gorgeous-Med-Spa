-- ============================================================
-- CONSENT PACKETS + SMS TRACKING
-- Auto-send consent forms via Telnyx SMS on booking
-- ============================================================

-- ============================================================
-- CONSENT PACKET STATUS ENUM
-- ============================================================
DO $$ BEGIN
  CREATE TYPE consent_packet_status AS ENUM ('draft', 'sent', 'viewed', 'signed', 'expired', 'voided');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- CONSENT PACKETS TABLE
-- Individual consent packet per template per appointment
-- ============================================================
CREATE TABLE IF NOT EXISTS consent_packets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  template_id UUID REFERENCES consent_templates(id) ON DELETE SET NULL,
  
  -- Template snapshot (immutable copy at time of creation)
  template_name TEXT NOT NULL,
  template_version INT NOT NULL DEFAULT 1,
  template_content JSONB NOT NULL, -- Full template snapshot
  
  -- Status tracking
  status consent_packet_status NOT NULL DEFAULT 'draft',
  
  -- Wizard token for public access
  wizard_token TEXT UNIQUE,
  wizard_expires_at TIMESTAMPTZ,
  
  -- SMS tracking
  sms_provider TEXT DEFAULT 'telnyx',
  sms_message_id TEXT,
  sent_to TEXT, -- E.164 phone or email
  sent_at TIMESTAMPTZ,
  send_error TEXT,
  last_resend_at TIMESTAMPTZ,
  resend_count INT NOT NULL DEFAULT 0,
  
  -- View/Sign tracking
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_by UUID REFERENCES users(id),
  
  -- Signature data
  signature_image TEXT, -- Base64 or URL
  signature_ip TEXT,
  signature_user_agent TEXT,
  signed_pdf_url TEXT, -- Generated PDF storage URL
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- ============================================================
-- CONSENT EVENTS TABLE (AUDIT TRAIL)
-- Every action on a consent packet is logged
-- ============================================================
DO $$ BEGIN
  CREATE TYPE consent_event_type AS ENUM (
    'created', 'sent', 'resent', 'viewed', 'signed', 
    'voided', 'failed', 'expired', 'kiosk_started'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS consent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  packet_id UUID NOT NULL REFERENCES consent_packets(id) ON DELETE CASCADE,
  
  event consent_event_type NOT NULL,
  meta JSONB DEFAULT '{}', -- Store messageId, to, error, etc.
  
  -- Actor tracking
  actor_user_id UUID REFERENCES users(id), -- NULL for system/client actions
  actor_type TEXT NOT NULL DEFAULT 'system', -- 'system', 'staff', 'client'
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- APPOINTMENT WIZARD TOKENS
-- One token per appointment for consent wizard access
-- ============================================================
CREATE TABLE IF NOT EXISTS appointment_consent_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  token TEXT NOT NULL UNIQUE,
  token_type TEXT NOT NULL DEFAULT 'sms', -- 'sms', 'kiosk', 'email'
  
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one active token per type per appointment
  CONSTRAINT unique_active_token UNIQUE (appointment_id, token_type, is_valid)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_consent_packets_client ON consent_packets(client_id);
CREATE INDEX IF NOT EXISTS idx_consent_packets_appointment ON consent_packets(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consent_packets_status ON consent_packets(status);
CREATE INDEX IF NOT EXISTS idx_consent_packets_template ON consent_packets(template_id);
CREATE INDEX IF NOT EXISTS idx_consent_packets_wizard_token ON consent_packets(wizard_token) WHERE wizard_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_consent_packets_signed ON consent_packets(client_id, template_id, signed_at) 
  WHERE status = 'signed';

CREATE INDEX IF NOT EXISTS idx_consent_events_packet ON consent_events(packet_id);
CREATE INDEX IF NOT EXISTS idx_consent_events_created ON consent_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointment_consent_tokens_token ON appointment_consent_tokens(token);
CREATE INDEX IF NOT EXISTS idx_appointment_consent_tokens_appointment ON appointment_consent_tokens(appointment_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE consent_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_consent_tokens ENABLE ROW LEVEL SECURITY;

-- Staff can view all
CREATE POLICY "Staff can view consent packets"
  ON consent_packets FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage consent packets"
  ON consent_packets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner', 'provider', 'nurse', 'front_desk')
    )
  );

CREATE POLICY "Staff can view consent events"
  ON consent_events FOR SELECT
  USING (true);

CREATE POLICY "Staff can create consent events"
  ON consent_events FOR INSERT
  WITH CHECK (true);

-- Service role bypass
CREATE POLICY "Service role full access to consent_packets"
  ON consent_packets FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to consent_events"
  ON consent_events FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to appointment_consent_tokens"
  ON appointment_consent_tokens FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function to generate random token
CREATE OR REPLACE FUNCTION generate_consent_token(length INT DEFAULT 48)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check if consent is valid (signed within 12 months)
CREATE OR REPLACE FUNCTION is_consent_valid(
  p_client_id UUID,
  p_template_id UUID,
  p_validity_days INT DEFAULT 365
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM consent_packets
    WHERE client_id = p_client_id
      AND template_id = p_template_id
      AND status = 'signed'
      AND signed_at >= (now() - (p_validity_days || ' days')::interval)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get outstanding consents for an appointment
CREATE OR REPLACE FUNCTION get_outstanding_consents(p_appointment_id UUID)
RETURNS TABLE (
  packet_id UUID,
  template_name TEXT,
  status consent_packet_status,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.template_name,
    cp.status,
    cp.sent_at,
    cp.viewed_at
  FROM consent_packets cp
  WHERE cp.appointment_id = p_appointment_id
    AND cp.status NOT IN ('signed', 'voided', 'expired')
  ORDER BY cp.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUDIT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION audit_consent_packet_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes to audit_logs
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO audit_logs (
      user_id, action, resource_type, resource_id, description, old_values, new_values
    ) VALUES (
      NEW.signed_by,
      'consent_status_changed',
      'consent_packet',
      NEW.id::text,
      'Consent packet status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status, 'signed_at', NEW.signed_at)
    );
  END IF;
  
  -- Update timestamp
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS consent_packet_audit_trigger ON consent_packets;
CREATE TRIGGER consent_packet_audit_trigger
  BEFORE UPDATE ON consent_packets
  FOR EACH ROW
  EXECUTE FUNCTION audit_consent_packet_changes();

-- ============================================================
-- SUCCESS
-- ============================================================
DO $$ BEGIN
  RAISE NOTICE 'Consent packets and SMS tracking tables created successfully';
END $$;
