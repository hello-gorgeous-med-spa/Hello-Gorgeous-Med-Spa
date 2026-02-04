-- ============================================================
-- SQUARE GIFT CARD INTEGRATION SCHEMA
-- Full lifecycle tracking with Square as payment processor
-- ============================================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS gift_card_transactions CASCADE;
DROP TABLE IF EXISTS gift_cards CASCADE;

-- ============================================================
-- GIFT CARDS TABLE (Internal Source of Truth)
-- ============================================================
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Square Integration Fields
  square_gift_card_id VARCHAR(255) UNIQUE,     -- Square's gift card ID
  square_gan VARCHAR(50),                       -- Gift card Account Number (masked)
  gan_last_4 VARCHAR(4),                        -- Last 4 digits for display
  
  -- Internal Tracking
  code VARCHAR(50) UNIQUE,                      -- Internal code (HG-XXXXXXXX)
  
  -- Financials
  initial_value DECIMAL(10,2) NOT NULL,         -- Original purchase amount
  current_balance DECIMAL(10,2) NOT NULL,       -- Current available balance
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'redeemed', 'voided', 'expired', 'blocked')),
  
  -- Client Links
  purchaser_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  recipient_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  square_customer_id VARCHAR(255),              -- Square customer ID (for linking)
  
  -- Recipient Info (for delivery)
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  
  -- Purchaser Info
  purchaser_name VARCHAR(255),
  purchaser_email VARCHAR(255),
  
  -- Gift Details
  message TEXT,                                 -- Personal message
  card_type VARCHAR(20) DEFAULT 'digital' CHECK (card_type IN ('digital', 'physical')),
  
  -- Source
  source VARCHAR(50) DEFAULT 'pos' CHECK (source IN ('pos', 'online', 'import', 'promotional')),
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment Tracking
  purchase_payment_id VARCHAR(255),             -- Square payment ID for purchase
  purchase_order_id VARCHAR(255),               -- Square order ID for purchase
  
  -- Audit
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  voided_at TIMESTAMP WITH TIME ZONE,
  void_reason TEXT,
  voided_by UUID,
  
  -- Sync Tracking
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_error TEXT,
  needs_sync BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- GIFT CARD TRANSACTIONS TABLE (Activity Log)
-- ============================================================
CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  gift_card_id UUID NOT NULL REFERENCES gift_cards(id) ON DELETE CASCADE,
  
  -- Square Integration
  square_activity_id VARCHAR(255),              -- Square activity ID
  square_payment_id VARCHAR(255),               -- Square payment ID (for redemptions)
  square_order_id VARCHAR(255),                 -- Square order ID
  
  -- Transaction Details
  transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
    'purchase',       -- Initial purchase/activation
    'redemption',     -- Used at checkout
    'load',           -- Additional value added
    'adjustment_up',  -- Manual increase
    'adjustment_down', -- Manual decrease
    'void',           -- Voided/deactivated
    'refund',         -- Refund back to card
    'expiration'      -- Balance expired
  )),
  
  -- Amounts
  amount DECIMAL(10,2) NOT NULL,                -- Positive for loads, negative for redemptions
  balance_before DECIMAL(10,2),                 -- Balance before transaction
  balance_after DECIMAL(10,2),                  -- Balance after transaction
  
  -- Context
  appointment_id UUID,                          -- If redeemed for an appointment
  transaction_reference VARCHAR(255),           -- Internal transaction reference
  pos_transaction_id UUID,                      -- Link to POS transaction
  
  -- Actor
  performed_by UUID,                            -- Staff who performed action
  performed_by_name VARCHAR(255),
  
  -- Notes
  notes TEXT,
  reason TEXT,                                  -- For adjustments/voids
  
  -- Location
  location_id VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- GIFT CARD SETTINGS TABLE (Owner Configuration)
-- ============================================================
CREATE TABLE IF NOT EXISTS gift_card_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Feature Toggles
  enabled BOOLEAN DEFAULT true,
  allow_online_purchase BOOLEAN DEFAULT true,
  allow_pos_purchase BOOLEAN DEFAULT true,
  allow_partial_redemption BOOLEAN DEFAULT true,
  
  -- Values
  min_purchase_amount DECIMAL(10,2) DEFAULT 25.00,
  max_purchase_amount DECIMAL(10,2) DEFAULT 500.00,
  preset_amounts JSONB DEFAULT '[25, 50, 100, 150, 200, 250]',
  allow_custom_amount BOOLEAN DEFAULT true,
  
  -- Expiration Rules
  cards_expire BOOLEAN DEFAULT false,
  default_expiration_months INTEGER DEFAULT 12,
  
  -- Redemption Rules
  allow_split_tender BOOLEAN DEFAULT true,     -- Allow with other payment methods
  auto_apply_to_appointments BOOLEAN DEFAULT false,
  prompt_before_checkout BOOLEAN DEFAULT true,
  
  -- Promotional
  allow_promotional_cards BOOLEAN DEFAULT true,
  
  -- Square Settings
  square_location_id VARCHAR(255),
  
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Insert default settings
INSERT INTO gift_card_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_gift_cards_square_id ON gift_cards(square_gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_email ON gift_cards(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchaser_client ON gift_cards(purchaser_client_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_client ON gift_cards(recipient_client_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_needs_sync ON gift_cards(needs_sync) WHERE needs_sync = true;

CREATE INDEX IF NOT EXISTS idx_gift_card_txn_card ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_txn_type ON gift_card_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_gift_card_txn_appointment ON gift_card_transactions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_txn_created ON gift_card_transactions(created_at);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Generate unique gift card code
CREATE OR REPLACE FUNCTION generate_gift_card_code()
RETURNS VARCHAR(50) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_code VARCHAR(50);
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'HG-';
    FOR i IN 1..8 LOOP
      new_code := new_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM gift_cards WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Auto-set code on insert if not provided
CREATE OR REPLACE FUNCTION set_gift_card_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL THEN
    NEW.code := generate_gift_card_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gift_card_code_trigger ON gift_cards;
CREATE TRIGGER gift_card_code_trigger
  BEFORE INSERT ON gift_cards
  FOR EACH ROW
  EXECUTE FUNCTION set_gift_card_code();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_gift_card_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gift_card_updated_trigger ON gift_cards;
CREATE TRIGGER gift_card_updated_trigger
  BEFORE UPDATE ON gift_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_card_timestamp();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_card_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "Authenticated users can view gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Authenticated users can insert gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Authenticated users can update gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Authenticated users can view transactions" ON gift_card_transactions;
DROP POLICY IF EXISTS "Authenticated users can insert transactions" ON gift_card_transactions;
DROP POLICY IF EXISTS "Authenticated users can view settings" ON gift_card_settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON gift_card_settings;
DROP POLICY IF EXISTS "Service role full access to gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Service role full access to transactions" ON gift_card_transactions;
DROP POLICY IF EXISTS "Service role full access to settings" ON gift_card_settings;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view gift cards" ON gift_cards
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert gift cards" ON gift_cards
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update gift cards" ON gift_cards
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view transactions" ON gift_card_transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert transactions" ON gift_card_transactions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view settings" ON gift_card_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update settings" ON gift_card_settings
  FOR UPDATE TO authenticated USING (true);

-- Service role full access
CREATE POLICY "Service role full access to gift cards" ON gift_cards
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to transactions" ON gift_card_transactions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to settings" ON gift_card_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE gift_cards IS 'Internal source of truth for gift cards, synced with Square';
COMMENT ON TABLE gift_card_transactions IS 'Complete activity log for all gift card operations';
COMMENT ON TABLE gift_card_settings IS 'Owner-controlled configuration for gift card feature';
COMMENT ON COLUMN gift_cards.square_gift_card_id IS 'Square gift card ID for API operations';
COMMENT ON COLUMN gift_cards.gan_last_4 IS 'Last 4 digits of gift card number for display';
COMMENT ON COLUMN gift_cards.needs_sync IS 'Flag for nightly reconciliation job';
