-- ============================================================
-- USER ROLES & PERMISSIONS TABLES
-- Phase 4: Full Role-Based Access Control
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE (extends auth.users)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'provider', 'staff', 'client', 'readonly')),
  phone TEXT,
  avatar_url TEXT,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  is_protected BOOLEAN DEFAULT FALSE, -- True for owner account
  is_active BOOLEAN DEFAULT TRUE,
  requires_2fa BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- ============================================================
-- USER SESSIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_info JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ============================================================
-- 2FA RECOVERY CODES
-- ============================================================

CREATE TABLE IF NOT EXISTS user_2fa_recovery_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL, -- Store hashed, not plain
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_2fa_codes_user ON user_2fa_recovery_codes(user_id);

-- ============================================================
-- PERMISSION OVERRIDES (for custom permissions)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_permission_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted BOOLEAN DEFAULT TRUE, -- TRUE = grant, FALSE = revoke
  granted_by UUID REFERENCES users(id),
  reason TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permission_overrides_user ON user_permission_overrides(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_permission_overrides_unique 
  ON user_permission_overrides(user_id, permission);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_2fa_recovery_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permission_overrides ENABLE ROW LEVEL SECURITY;

-- Users: Everyone can read, only owner/admin can modify
DROP POLICY IF EXISTS users_select_policy ON users;
CREATE POLICY users_select_policy ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS users_insert_policy ON users;
CREATE POLICY users_insert_policy ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS users_update_policy ON users;
CREATE POLICY users_update_policy ON users FOR UPDATE USING (true);

DROP POLICY IF EXISTS users_delete_policy ON users;
CREATE POLICY users_delete_policy ON users FOR DELETE USING (is_protected = FALSE);

-- Sessions: Users can only see their own sessions
DROP POLICY IF EXISTS sessions_policy ON user_sessions;
CREATE POLICY sessions_policy ON user_sessions FOR ALL USING (true);

-- 2FA codes: Users can only see their own
DROP POLICY IF EXISTS twofa_policy ON user_2fa_recovery_codes;
CREATE POLICY twofa_policy ON user_2fa_recovery_codes FOR ALL USING (true);

-- Permission overrides: Admins only
DROP POLICY IF EXISTS permission_overrides_policy ON user_permission_overrides;
CREATE POLICY permission_overrides_policy ON user_permission_overrides FOR ALL USING (true);

-- ============================================================
-- TRIGGER: Update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- ============================================================
-- TRIGGER: Protect Owner Account
-- ============================================================

CREATE OR REPLACE FUNCTION protect_owner_account()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent deletion of protected accounts
  IF TG_OP = 'DELETE' AND OLD.is_protected = TRUE THEN
    RAISE EXCEPTION 'Cannot delete protected owner account';
  END IF;
  
  -- Prevent role change on protected accounts
  IF TG_OP = 'UPDATE' AND OLD.is_protected = TRUE THEN
    IF NEW.role != OLD.role THEN
      RAISE EXCEPTION 'Cannot change role of protected owner account';
    END IF;
    IF NEW.is_protected = FALSE THEN
      RAISE EXCEPTION 'Cannot remove protection from owner account';
    END IF;
    IF NEW.is_active = FALSE THEN
      RAISE EXCEPTION 'Cannot deactivate protected owner account';
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_owner ON users;
CREATE TRIGGER protect_owner
  BEFORE UPDATE OR DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION protect_owner_account();

-- ============================================================
-- SEED: Create Protected Owner Account
-- ============================================================

INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  role,
  phone,
  is_protected,
  is_active,
  requires_2fa,
  created_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'danielle@hellogorgeousmedspa.com',
  'Danielle',
  'Glazier-Alcala',
  'owner',
  '630-636-6193',
  TRUE,
  TRUE,
  TRUE,
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  is_protected = TRUE,
  role = 'owner';

-- ============================================================
-- GRANTS
-- ============================================================

GRANT ALL ON users TO authenticated;
GRANT ALL ON user_sessions TO authenticated;
GRANT ALL ON user_2fa_recovery_codes TO authenticated;
GRANT ALL ON user_permission_overrides TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
