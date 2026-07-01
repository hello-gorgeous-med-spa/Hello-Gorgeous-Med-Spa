-- RE GEN Orders table (pay-first model)
-- Stores customer info and cart before payment, tracks order through fulfillment

CREATE TABLE IF NOT EXISTS regen_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  
  -- Customer info
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Health screening
  goal TEXT,
  allergies TEXT DEFAULT 'None',
  
  -- Order details
  supply_cycle TEXT DEFAULT '30-day',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_usd NUMERIC(10,2) NOT NULL DEFAULT 30,
  
  -- Payment
  status TEXT NOT NULL DEFAULT 'pending_payment',
  payment_id TEXT,
  paid_at TIMESTAMPTZ,
  
  -- Telehealth
  telehealth_required BOOLEAN DEFAULT true,
  telehealth_scheduled_at TIMESTAMPTZ,
  telehealth_completed_at TIMESTAMPTZ,
  
  -- Fulfillment
  np_approved_at TIMESTAMPTZ,
  np_notes TEXT,
  pharmacy_ordered_at TIMESTAMPTZ,
  pharmacy_source TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_regen_orders_reference ON regen_orders(reference);
CREATE INDEX IF NOT EXISTS idx_regen_orders_email ON regen_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_regen_orders_status ON regen_orders(status);
CREATE INDEX IF NOT EXISTS idx_regen_orders_created ON regen_orders(created_at DESC);

-- RLS
ALTER TABLE regen_orders ENABLE ROW LEVEL SECURITY;

-- Admin can see all
CREATE POLICY "admin_all_regen_orders" ON regen_orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner');

-- Public can insert (for checkout)
CREATE POLICY "public_insert_regen_orders" ON regen_orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

COMMENT ON TABLE regen_orders IS 'RE GEN pay-first orders - tracks from cart to delivery';
COMMENT ON COLUMN regen_orders.status IS 'pending_payment → paid → telehealth_scheduled → approved → ordered → shipped → delivered';
