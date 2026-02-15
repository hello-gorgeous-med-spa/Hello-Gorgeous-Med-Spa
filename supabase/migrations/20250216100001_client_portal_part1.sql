-- ============================================================
-- CLIENT PORTAL - Part 1: Authentication & Sessions
-- ============================================================

-- Magic Link Tokens
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE,
  token_hash VARCHAR(128) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_magic_link_token ON magic_link_tokens(token) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_magic_link_client ON magic_link_tokens(client_id);

-- Client Sessions
CREATE TABLE IF NOT EXISTS client_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  session_token VARCHAR(128) NOT NULL UNIQUE,
  refresh_token VARCHAR(128),
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_session_token ON client_sessions(session_token) WHERE revoked_at IS NULL;

-- Portal Access Log (HIPAA Audit)
CREATE TABLE IF NOT EXISTS portal_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  session_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_access_client ON portal_access_log(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_access_created ON portal_access_log(created_at);

-- RLS
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role magic_link" ON magic_link_tokens;
CREATE POLICY "Service role magic_link" ON magic_link_tokens FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role sessions" ON client_sessions;
CREATE POLICY "Service role sessions" ON client_sessions FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role access_log" ON portal_access_log;
CREATE POLICY "Service role access_log" ON portal_access_log FOR ALL TO service_role USING (true);
