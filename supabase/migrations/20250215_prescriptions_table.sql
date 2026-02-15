-- ============================================================
-- PRESCRIPTIONS TABLE
-- eRX-style prescription tracking for med spa
-- Print/Fax to pharmacies via eFax
-- IDEMPOTENT: Safe to run multiple times
-- ============================================================

CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Patient & Provider
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  
  -- Medication details
  medication_name TEXT NOT NULL,
  strength TEXT,
  form TEXT,
  sig TEXT NOT NULL,
  quantity INTEGER,
  refills INTEGER DEFAULT 0,
  daw BOOLEAN DEFAULT FALSE,
  
  -- Diagnosis
  diagnosis TEXT,
  
  -- Pharmacy
  pharmacy_name TEXT,
  pharmacy_phone TEXT,
  pharmacy_fax TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Internal notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  filled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_client_id ON prescriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_provider_id ON prescriptions(provider_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created_at ON prescriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medication ON prescriptions(medication_name);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_prescriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;
CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_prescriptions_updated_at();

-- RLS Policies (idempotent)
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS prescriptions_admin_policy ON prescriptions;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

CREATE POLICY prescriptions_admin_policy ON prescriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'owner', 'provider', 'staff')
    )
  );

-- Grant access
GRANT ALL ON prescriptions TO authenticated;
GRANT ALL ON prescriptions TO service_role;

-- Reporting view
CREATE OR REPLACE VIEW prescription_summary AS
SELECT 
  p.id,
  p.medication_name,
  p.status,
  p.created_at,
  c.first_name || ' ' || c.last_name AS client_name,
  c.date_of_birth AS client_dob,
  COALESCE(u.first_name || ' ' || u.last_name, 'Unknown') AS prescriber_name
FROM prescriptions p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN providers pr ON p.provider_id = pr.id
LEFT JOIN users u ON pr.user_id = u.id
ORDER BY p.created_at DESC;

GRANT SELECT ON prescription_summary TO authenticated;
GRANT SELECT ON prescription_summary TO service_role;
