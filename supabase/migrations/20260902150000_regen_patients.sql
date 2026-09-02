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

-- REGEN Orders table (for tracking prescriptions/shipments)
CREATE TABLE IF NOT EXISTS regen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  stripe_subscription_id TEXT,
  program TEXT NOT NULL, -- weight-loss, hormones, peptides, sexual-health
  status TEXT DEFAULT 'pending', -- pending, provider_review, approved, shipped, delivered, cancelled
  medication TEXT,
  dosage TEXT,
  quantity INTEGER,
  amount_cents INTEGER,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regen_orders_patient ON regen_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_orders_status ON regen_orders(status);

ALTER TABLE regen_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own regen orders"
  ON regen_orders FOR SELECT
  USING (patient_id IN (SELECT id FROM regen_patients WHERE user_id = auth.uid()));

CREATE POLICY "Service role full access to regen_orders"
  ON regen_orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE TRIGGER trigger_regen_orders_updated_at
  BEFORE UPDATE ON regen_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_regen_patients_updated_at();

-- REGEN Messages table
CREATE TABLE IF NOT EXISTS regen_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'patient' or 'provider'
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regen_messages_patient ON regen_messages(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_messages_unread ON regen_messages(patient_id, read_at) WHERE read_at IS NULL;

ALTER TABLE regen_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own regen messages"
  ON regen_messages FOR SELECT
  USING (patient_id IN (SELECT id FROM regen_patients WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own regen messages"
  ON regen_messages FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM regen_patients WHERE user_id = auth.uid())
    AND sender = 'patient'
  );

CREATE POLICY "Service role full access to regen_messages"
  ON regen_messages FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
