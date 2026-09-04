-- ============================================================
-- REGEN RX Additional Features
-- Weight tracking, refills, referrals, subscriptions
-- ============================================================

-- Weight/Progress tracking
CREATE TABLE IF NOT EXISTS regen_weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  weight DECIMAL(5,1) NOT NULL,
  notes TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regen_weight_patient ON regen_weight_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_weight_date ON regen_weight_entries(date DESC);

-- Refill reminders
CREATE TABLE IF NOT EXISTS regen_refill_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  order_id UUID REFERENCES regen_orders(id),
  program VARCHAR(50),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regen_refill_patient ON regen_refill_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_refill_order ON regen_refill_reminders(order_id);

-- Referral program
ALTER TABLE regen_patients ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;

CREATE TABLE IF NOT EXISTS regen_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  referred_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, expired
  reward_amount DECIMAL(10,2) DEFAULT 25,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regen_referral_referrer ON regen_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_regen_referral_email ON regen_referrals(referred_email);

-- Subscriptions tracking
CREATE TABLE IF NOT EXISTS regen_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regen_sub_patient ON regen_subscriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_sub_stripe ON regen_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_regen_sub_status ON regen_subscriptions(status);

-- Row Level Security
ALTER TABLE regen_weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_refill_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_subscriptions ENABLE ROW LEVEL SECURITY;

-- Patients can see own weight entries
CREATE POLICY "Patients view own weight" ON regen_weight_entries
  FOR SELECT USING (auth.uid()::text IN (
    SELECT user_id::text FROM regen_patients WHERE id = patient_id
  ));

CREATE POLICY "Patients insert own weight" ON regen_weight_entries
  FOR INSERT WITH CHECK (auth.uid()::text IN (
    SELECT user_id::text FROM regen_patients WHERE id = patient_id
  ));

-- Staff can view all
CREATE POLICY "Staff view weight" ON regen_weight_entries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff view refills" ON regen_refill_reminders
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff view referrals" ON regen_referrals
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff view subscriptions" ON regen_subscriptions
  FOR ALL TO authenticated USING (true);

-- Patients can see own referrals
CREATE POLICY "Patients view own referrals" ON regen_referrals
  FOR SELECT USING (auth.uid()::text IN (
    SELECT user_id::text FROM regen_patients WHERE id = referrer_id
  ));

-- Patients can see own subscriptions
CREATE POLICY "Patients view own subs" ON regen_subscriptions
  FOR SELECT USING (auth.uid()::text IN (
    SELECT user_id::text FROM regen_patients WHERE id = patient_id
  ));
