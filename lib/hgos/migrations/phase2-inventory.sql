-- ============================================================
-- PHASE 2: INVENTORY TRACKING SYSTEM
-- Lot tracking, expiration dates, FIFO management
-- ============================================================

-- Inventory Items (products/injectables)
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(50) NOT NULL CHECK (category IN ('neurotoxin', 'filler', 'biostimulator', 'skin_booster', 'vitamin', 'skincare', 'supplies', 'other')),
  sku VARCHAR(100) UNIQUE,
  unit_type VARCHAR(50) DEFAULT 'units', -- units, syringes, ml, etc.
  cost_per_unit DECIMAL(10,2) DEFAULT 0,
  price_per_unit DECIMAL(10,2) DEFAULT 0,
  reorder_point INTEGER DEFAULT 10,
  is_controlled BOOLEAN DEFAULT FALSE,
  requires_lot_tracking BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Lots (batch tracking)
CREATE TABLE IF NOT EXISTS inventory_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  lot_number VARCHAR(100) NOT NULL,
  quantity_received INTEGER NOT NULL,
  quantity_remaining INTEGER NOT NULL,
  cost_per_unit DECIMAL(10,2),
  expiration_date DATE NOT NULL,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  received_by UUID REFERENCES users(id),
  supplier VARCHAR(255),
  invoice_number VARCHAR(100),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'depleted', 'recalled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Transactions (usage/adjustments)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  lot_id UUID REFERENCES inventory_lots(id),
  transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('receive', 'use', 'adjust', 'waste', 'transfer', 'return')),
  quantity INTEGER NOT NULL, -- positive for receive, negative for use
  appointment_id UUID REFERENCES appointments(id),
  client_id UUID REFERENCES clients(id),
  provider_id UUID REFERENCES providers(id),
  performed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_inventory_lots_item ON inventory_lots(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_lots_expiration ON inventory_lots(expiration_date);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item ON inventory_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON inventory_transactions(created_at);

-- Function to get current stock for an item
CREATE OR REPLACE FUNCTION get_inventory_stock(item_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(quantity_remaining) FROM inventory_lots 
     WHERE item_id = item_uuid AND status = 'active' AND expiration_date > CURRENT_DATE),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- Auto-expire lots past expiration date
CREATE OR REPLACE FUNCTION expire_inventory_lots() RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory_lots
  SET status = 'expired'
  WHERE expiration_date < CURRENT_DATE AND status = 'active';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view inventory
CREATE POLICY "Authenticated users can view inventory items" ON inventory_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view inventory lots" ON inventory_lots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view inventory transactions" ON inventory_transactions
  FOR SELECT TO authenticated USING (true);
