-- REGEN RX Patient Profiles
-- Separate patient table for the telehealth portal

CREATE TABLE IF NOT EXISTS regen_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT DEFAULT 'IL',
  zip TEXT,
  stripe_customer_id TEXT,
  charm_patient_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_regen_patients_user_id ON regen_patients(user_id);
CREATE INDEX IF NOT EXISTS idx_regen_patients_email ON regen_patients(email);
CREATE INDEX IF NOT EXISTS idx_regen_patients_stripe ON regen_patients(stripe_customer_id);

-- Enable RLS
ALTER TABLE regen_patients ENABLE ROW LEVEL SECURITY;

-- Patients can read their own profile
CREATE POLICY "Users can view own regen profile"
  ON regen_patients FOR SELECT
  USING (auth.uid() = user_id);

-- Patients can update their own profile
CREATE POLICY "Users can update own regen profile"
  ON regen_patients FOR UPDATE
  USING (auth.uid() = user_id);

-- Patients can insert their own profile (during signup)
CREATE POLICY "Users can insert own regen profile"
  ON regen_patients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do anything (for admin/API operations)
CREATE POLICY "Service role full access to regen_patients"
  ON regen_patients FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_regen_patients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_regen_patients_updated_at
  BEFORE UPDATE ON regen_patients
  FOR EACH ROW
  EXECUTE FUNCTION update_regen_patients_updated_at();

-- REGEN Orders and Messages tables are created in 20260902160000_regen_tables_repair.sql
