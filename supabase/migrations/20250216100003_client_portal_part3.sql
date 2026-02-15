-- ============================================================
-- CLIENT PORTAL - Part 3: Wallet & Payments
-- ============================================================

-- Patient Wallet
CREATE TABLE IF NOT EXISTS patient_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  credit_balance_cents INTEGER DEFAULT 0,
  gift_card_balance_cents INTEGER DEFAULT 0,
  reward_points INTEGER DEFAULT 0,
  total_spent_cents INTEGER DEFAULT 0,
  total_saved_cents INTEGER DEFAULT 0,
  membership_tier VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_patient_wallet_client ON patient_wallet(client_id);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES patient_wallet(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  transaction_type VARCHAR(30) NOT NULL,
  amount_cents INTEGER NOT NULL,
  balance_after_cents INTEGER NOT NULL,
  source VARCHAR(50),
  source_id UUID,
  description TEXT,
  gift_card_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_client ON wallet_transactions(client_id);

-- Payment Receipts
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID,
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal_cents INTEGER NOT NULL,
  discount_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  tip_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  last_four VARCHAR(4),
  card_brand VARCHAR(20),
  line_items JSONB DEFAULT '[]',
  provider_id UUID,
  provider_name VARCHAR(255),
  pdf_url TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receipt_client ON payment_receipts(client_id);
CREATE INDEX IF NOT EXISTS idx_receipt_date ON payment_receipts(receipt_date);

-- RLS
ALTER TABLE patient_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role wallet" ON patient_wallet;
CREATE POLICY "Service role wallet" ON patient_wallet FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role wallet_tx" ON wallet_transactions;
CREATE POLICY "Service role wallet_tx" ON wallet_transactions FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role receipts" ON payment_receipts;
CREATE POLICY "Service role receipts" ON payment_receipts FOR ALL TO service_role USING (true);
