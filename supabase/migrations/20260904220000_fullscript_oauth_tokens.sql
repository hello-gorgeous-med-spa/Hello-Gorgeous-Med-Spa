-- ============================================================
-- Integration OAuth Tokens Storage
-- Stores OAuth tokens for third-party integrations like Fullscript
-- ============================================================

CREATE TABLE IF NOT EXISTS regen_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Provider identifier (unique per integration)
  provider VARCHAR(50) UNIQUE NOT NULL, -- 'fullscript', 'formuconnect', etc.
  
  -- OAuth tokens
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  token_type VARCHAR(50),
  scope TEXT,
  
  -- Raw response for debugging
  raw_response JSONB,
  
  -- Metadata
  connected_by UUID, -- staff member who connected
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE regen_integrations ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view/manage integrations
CREATE POLICY "Staff can manage integrations" ON regen_integrations
  FOR ALL TO authenticated USING (true);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_regen_integrations_provider ON regen_integrations(provider);
