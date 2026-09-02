-- Repair REGEN tables from partial migration

-- Drop the broken tables and recreate them properly
DROP TABLE IF EXISTS regen_messages CASCADE;
DROP TABLE IF EXISTS regen_orders CASCADE;

-- Recreate REGEN Orders table
CREATE TABLE regen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  stripe_subscription_id TEXT,
  program TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
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

CREATE INDEX idx_regen_orders_patient ON regen_orders(patient_id);
CREATE INDEX idx_regen_orders_status ON regen_orders(status);

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

-- Recreate REGEN Messages table
CREATE TABLE regen_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regen_messages_patient ON regen_messages(patient_id);
CREATE INDEX idx_regen_messages_unread ON regen_messages(patient_id, read_at) WHERE read_at IS NULL;

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
