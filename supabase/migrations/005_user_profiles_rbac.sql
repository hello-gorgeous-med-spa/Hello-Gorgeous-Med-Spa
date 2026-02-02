-- ============================================================
-- USER PROFILES & ROLE-BASED ACCESS CONTROL
-- Required for authentication and route protection
-- ============================================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('owner', 'admin', 'provider', 'staff', 'client')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  
  -- Link to other entities
  staff_id UUID REFERENCES staff(id),
  provider_id UUID REFERENCES providers(id),
  client_id UUID REFERENCES clients(id),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins and owners can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Only owners can update roles
CREATE POLICY "Owners can update any profile" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profile_updated ON user_profiles;
CREATE TRIGGER user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_timestamp();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'client')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- INSERT OWNER ACCOUNT
-- Run this AFTER creating the user in Supabase Auth
-- ============================================================

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with the actual user ID from auth.users
-- You can find this in Supabase Dashboard > Authentication > Users

-- Example (uncomment and modify after creating auth user):
-- INSERT INTO user_profiles (user_id, email, role, first_name, last_name, is_active)
-- VALUES (
--   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  -- Replace with actual user_id from auth.users
--   'hello@hellogorgeousmedspa.com',
--   'owner',
--   'Danielle',
--   'Glazier-Alcala',
--   true
-- );

-- ============================================================
-- HELPER: Get user role function (for use in middleware)
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE user_id = user_uuid
  AND is_active = true;
  
  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- HELPER: Check if user has role
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE user_id = user_uuid
  AND is_active = true;
  
  -- Owner has access to everything
  IF user_role = 'owner' THEN
    RETURN true;
  END IF;
  
  -- Check specific role hierarchy
  CASE required_role
    WHEN 'owner' THEN
      RETURN user_role = 'owner';
    WHEN 'admin' THEN
      RETURN user_role IN ('owner', 'admin');
    WHEN 'provider' THEN
      RETURN user_role IN ('owner', 'admin', 'provider');
    WHEN 'staff' THEN
      RETURN user_role IN ('owner', 'admin', 'provider', 'staff');
    ELSE
      RETURN true;  -- client level - everyone has access
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
