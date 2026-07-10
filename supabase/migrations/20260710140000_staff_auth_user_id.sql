-- Link public.users to Supabase Auth + allow readonly in user_profiles

ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id)
  WHERE auth_user_id IS NOT NULL;

COMMENT ON COLUMN users.auth_user_id IS 'Supabase auth.users id for staff password login';

-- user_profiles.role CHECK may omit readonly on older DBs
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('owner', 'admin', 'provider', 'staff', 'client', 'readonly'));
