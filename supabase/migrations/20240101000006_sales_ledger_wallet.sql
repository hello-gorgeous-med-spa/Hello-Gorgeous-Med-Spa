-- ============================================================
-- SALES LEDGER + DAILY WALLET SYSTEM
-- Fresha-Level Financial Backbone
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. SALES TABLE
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES clients(id),
  appointment_id UUID REFERENCES appointments(id),
  provider_id UUID REFERENCES providers(id),
  location_id TEXT DEFAULT 'main',
  created_by UUID,
  sale_type TEXT NOT NULL DEFAULT 'service' CHECK (sale_type IN ('service', 'product', 'membership', 'package', 'gift_card', 'fee', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed', 'unpaid', 'partially_paid', 'refunded', 'voided', 'cancelled')),
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  tax_total INTEGER NOT NULL DEFAULT 0,
  tip_total INTEGER NOT NULL DEFAULT 0,
  gross_total INTEGER NOT NULL DEFAULT 0,
  net_total INTEGER NOT NULL DEFAULT 0,
  amount_paid INTEGER NOT NULL DEFAULT 0,
  balance_due INTEGER NOT NULL DEFAULT 0,
  discount_type TEXT,
  discount_code TEXT,
  discount_reason TEXT,
  tax_rate DECIMAL(5,4) DEFAULT 0.0000,
  tax_exempt BOOLEAN DEFAULT false,
  internal_notes TEXT,
  client_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  voided_at TIMESTAMPTZ,
  voided_by UUID,
  void_reason TEXT,
  version INTEGER DEFAULT 1
);

-- 2. SALE ITEMS TABLE
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('service', 'product', 'membership', 'package', 'gift_card', 'fee', 'adjustment')),
  item_id UUID,
  item_name TEXT NOT NULL,
  item_description TEXT,
  provider_id UUID REFERENCES providers(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  total_price INTEGER NOT NULL DEFAULT 0,
  units_used DECIMAL(10,2),
  unit_type TEXT,
  inventory_lot_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SALE PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS sale_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT NOT NULL UNIQUE,
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cash', 'gift_card', 'membership_credit', 'account_credit', 'check', 'other', 'split')),
  payment_processor TEXT,
  amount INTEGER NOT NULL,
  tip_amount INTEGER DEFAULT 0,
  processing_fee INTEGER DEFAULT 0,
  net_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'voided')),
  processor_transaction_id TEXT,
  processor_payment_intent_id TEXT,
  processor_receipt_url TEXT,
  gift_card_id UUID,
  gift_card_code TEXT,
  membership_id UUID,
  card_brand TEXT,
  card_last_four TEXT,
  refund_amount INTEGER DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,
  refunded_by UUID,
  original_payment_id UUID REFERENCES sale_payments(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID
);

-- 4. DAILY SALES SUMMARY TABLE
CREATE TABLE IF NOT EXISTS daily_sales_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL UNIQUE,
  location_id TEXT DEFAULT 'main',
  total_sales_count INTEGER DEFAULT 0,
  completed_sales_count INTEGER DEFAULT 0,
  voided_sales_count INTEGER DEFAULT 0,
  refund_count INTEGER DEFAULT 0,
  services_gross INTEGER DEFAULT 0,
  services_count INTEGER DEFAULT 0,
  products_gross INTEGER DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  memberships_gross INTEGER DEFAULT 0,
  memberships_count INTEGER DEFAULT 0,
  gift_cards_sold_gross INTEGER DEFAULT 0,
  gift_cards_sold_count INTEGER DEFAULT 0,
  fees_gross INTEGER DEFAULT 0,
  gross_sales INTEGER DEFAULT 0,
  discounts_total INTEGER DEFAULT 0,
  tax_collected INTEGER DEFAULT 0,
  tips_total INTEGER DEFAULT 0,
  refunds_total INTEGER DEFAULT 0,
  net_sales INTEGER DEFAULT 0,
  card_payments INTEGER DEFAULT 0,
  card_count INTEGER DEFAULT 0,
  cash_payments INTEGER DEFAULT 0,
  cash_count INTEGER DEFAULT 0,
  gift_card_redemptions INTEGER DEFAULT 0,
  gift_card_redemption_count INTEGER DEFAULT 0,
  membership_credits_used INTEGER DEFAULT 0,
  other_payments INTEGER DEFAULT 0,
  total_processing_fees INTEGER DEFAULT 0,
  total_collected INTEGER DEFAULT 0,
  total_payable INTEGER DEFAULT 0,
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMPTZ,
  reconciled_by UUID,
  discrepancy_amount INTEGER DEFAULT 0,
  discrepancy_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUSINESS WALLET TABLE
CREATE TABLE IF NOT EXISTS business_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_date DATE NOT NULL,
  location_id TEXT DEFAULT 'main',
  opening_balance INTEGER DEFAULT 0,
  payments_received INTEGER DEFAULT 0,
  refunds_issued INTEGER DEFAULT 0,
  processing_fees INTEGER DEFAULT 0,
  payouts_initiated INTEGER DEFAULT 0,
  adjustments INTEGER DEFAULT 0,
  closing_balance INTEGER DEFAULT 0,
  pending_payments INTEGER DEFAULT 0,
  pending_payouts INTEGER DEFAULT 0,
  square_balance INTEGER DEFAULT 0,
  cash_balance INTEGER DEFAULT 0,
  gift_card_balance INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'reconciled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  UNIQUE(wallet_date, location_id)
);

-- 6. SEQUENCES FOR AUTO-NUMBERING
CREATE SEQUENCE IF NOT EXISTS sale_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS payment_number_seq START 1;

-- 7. FUNCTION: Generate Sale Number (HG-2026-00000001)
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'HG-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('sale_number_seq')::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCTION: Generate Payment Number
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'HG-PAY-' || LPAD(NEXTVAL('payment_number_seq')::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql;

-- 9. TRIGGER FUNCTION: Auto-set sale number
CREATE OR REPLACE FUNCTION set_sale_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sale_number IS NULL OR NEW.sale_number = '' THEN
    NEW.sale_number := generate_sale_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. TRIGGER FUNCTION: Auto-set payment number
CREATE OR REPLACE FUNCTION set_payment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_number IS NULL OR NEW.payment_number = '' THEN
    NEW.payment_number := generate_payment_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. CREATE TRIGGERS
DROP TRIGGER IF EXISTS trigger_set_sale_number ON sales;
CREATE TRIGGER trigger_set_sale_number
  BEFORE INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION set_sale_number();

DROP TRIGGER IF EXISTS trigger_set_payment_number ON sale_payments;
CREATE TRIGGER trigger_set_payment_number
  BEFORE INSERT ON sale_payments
  FOR EACH ROW
  EXECUTE FUNCTION set_payment_number();

-- 12. INDEXES
CREATE INDEX IF NOT EXISTS idx_sales_sale_number ON sales(sale_number);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_payments_sale_id ON sale_payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_payments_status ON sale_payments(status);
CREATE INDEX IF NOT EXISTS idx_sale_payments_created_at ON sale_payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summary_date ON daily_sales_summary(summary_date DESC);
CREATE INDEX IF NOT EXISTS idx_business_wallet_date ON business_wallet(wallet_date DESC);

-- 13. ROW LEVEL SECURITY
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sales_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_wallet ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for sales" ON sales;
DROP POLICY IF EXISTS "Allow all for sale_items" ON sale_items;
DROP POLICY IF EXISTS "Allow all for sale_payments" ON sale_payments;
DROP POLICY IF EXISTS "Allow all for daily_sales_summary" ON daily_sales_summary;
DROP POLICY IF EXISTS "Allow all for business_wallet" ON business_wallet;

CREATE POLICY "Allow all for sales" ON sales FOR ALL USING (true);
CREATE POLICY "Allow all for sale_items" ON sale_items FOR ALL USING (true);
CREATE POLICY "Allow all for sale_payments" ON sale_payments FOR ALL USING (true);
CREATE POLICY "Allow all for daily_sales_summary" ON daily_sales_summary FOR ALL USING (true);
CREATE POLICY "Allow all for business_wallet" ON business_wallet FOR ALL USING (true);

-- 14. VIEWS
DROP VIEW IF EXISTS sales_detailed CASCADE;
CREATE OR REPLACE VIEW sales_detailed AS
SELECT 
  s.id,
  s.sale_number,
  s.client_id,
  s.provider_id,
  s.appointment_id,
  s.status,
  s.gross_total,
  s.discount_total,
  s.tax_total,
  s.tip_total,
  s.net_total,
  s.amount_paid,
  s.balance_due,
  s.created_at,
  s.updated_at,
  s.created_by,
  COALESCE(cup.first_name || ' ' || cup.last_name, 'Walk-in') AS client_name,
  cup.email AS client_email,
  cup.phone AS client_phone,
  COALESCE(pup.first_name || ' ' || pup.last_name, 'Unknown') AS provider_name,
  (SELECT COUNT(*) FROM sale_items WHERE sale_id = s.id) AS item_count,
  (SELECT COUNT(*) FROM sale_payments WHERE sale_id = s.id AND status = 'completed') AS payment_count
FROM sales s
LEFT JOIN clients c ON s.client_id = c.id
LEFT JOIN user_profiles cup ON c.user_id = cup.user_id
LEFT JOIN providers p ON s.provider_id = p.id
LEFT JOIN user_profiles pup ON p.user_id = pup.user_id;

DROP VIEW IF EXISTS today_sales_summary CASCADE;
CREATE OR REPLACE VIEW today_sales_summary AS
SELECT
  COUNT(*) AS total_sales,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_sales,
  COALESCE(SUM(gross_total) FILTER (WHERE status = 'completed'), 0) AS gross_total,
  COALESCE(SUM(tip_total) FILTER (WHERE status = 'completed'), 0) AS tips_total,
  COALESCE(SUM(amount_paid), 0) AS total_collected,
  COUNT(*) FILTER (WHERE status = 'unpaid' OR status = 'partially_paid') AS unpaid_count,
  COALESCE(SUM(balance_due), 0) AS total_outstanding
FROM sales
WHERE DATE(created_at) = CURRENT_DATE;

-- DONE! Sales Ledger system is ready.
