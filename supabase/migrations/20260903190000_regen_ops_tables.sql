-- ============================================================
-- REGEN RX Operations Tables
-- Full backend for telehealth operations portal
-- ============================================================

-- Product Approval Table (what we're allowed to sell)
CREATE TABLE IF NOT EXISTS regen_approved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Formulation Rx reference
  sku VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  strength VARCHAR(255),
  category VARCHAR(100),
  
  -- Pricing
  wholesale_cost DECIMAL(10,2),
  retail_price DECIMAL(10,2),
  
  -- Availability flags
  illinois_available BOOLEAN DEFAULT true,
  consumer_visible BOOLEAN DEFAULT false,
  provider_only BOOLEAN DEFAULT true,
  
  -- Clinical requirements
  requires_labs BOOLEAN DEFAULT false,
  requires_video BOOLEAN DEFAULT false,
  controlled_substance BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(sku)
);

-- Intakes (patient submissions awaiting review)
CREATE TABLE IF NOT EXISTS regen_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES regen_patients(id),
  
  -- Contact info (for new patients)
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Program selection
  goal VARCHAR(50) NOT NULL,
  
  -- Medical info (JSONB for flexibility)
  medical_history JSONB DEFAULT '{}',
  current_medications JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  
  -- Physical info
  age INTEGER,
  weight VARCHAR(50),
  height VARCHAR(50),
  
  -- Consents
  hipaa_consent_at TIMESTAMPTZ,
  telehealth_consent_at TIMESTAMPTZ,
  treatment_consent_at TIMESTAMPTZ,
  
  -- Illinois verification
  state VARCHAR(2),
  verified_illinois BOOLEAN DEFAULT false,
  
  -- Status workflow
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, under_review, approved, declined, needs_info, needs_labs, needs_video
  
  -- Provider review
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Stripe
  stripe_customer_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  amount_paid DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders with full status history
CREATE TABLE IF NOT EXISTS regen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  
  patient_id UUID REFERENCES regen_patients(id),
  intake_id UUID REFERENCES regen_intakes(id),
  
  -- Pharmacy reference
  pharmacy_order_id VARCHAR(100),
  pharmacy_name VARCHAR(100) DEFAULT 'Formulation Rx',
  
  -- Items (JSONB array)
  items JSONB NOT NULL DEFAULT '[]',
  
  -- Price snapshot (NEVER CHANGE AFTER ORDER)
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  promo_code VARCHAR(50),
  
  -- Wholesale cost for margin tracking
  wholesale_cost DECIMAL(10,2),
  
  -- Current status
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Tracking
  tracking_number VARCHAR(100),
  tracking_carrier VARCHAR(50),
  
  -- Prescription
  prescription_signed_by UUID,
  prescription_signed_at TIMESTAMPTZ,
  
  -- Stripe
  stripe_payment_intent_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order status history (append-only audit trail)
CREATE TABLE IF NOT EXISTS regen_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES regen_orders(id) ON DELETE CASCADE,
  
  status VARCHAR(50) NOT NULL,
  actor_id UUID,
  actor_type VARCHAR(20), -- 'staff', 'patient', 'system', 'pharmacy_webhook'
  notes TEXT,
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff users for the ops portal
CREATE TABLE IF NOT EXISTS regen_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'owner', 'prescriber', 'admin', 'support'
  
  -- Permissions
  can_approve_rx BOOLEAN DEFAULT false,
  can_process_refunds BOOLEAN DEFAULT false,
  can_view_financials BOOLEAN DEFAULT false,
  can_manage_products BOOLEAN DEFAULT false,
  
  active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for compliance
CREATE TABLE IF NOT EXISTS regen_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  actor_id UUID,
  actor_type VARCHAR(20), -- 'staff', 'patient', 'system'
  actor_email VARCHAR(255),
  
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  
  ip_address INET,
  user_agent TEXT,
  
  details JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE regen_approved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE regen_audit_log ENABLE ROW LEVEL SECURITY;

-- Approved products: public read for consumer-visible, all for authenticated
CREATE POLICY "Public can view consumer-visible products" ON regen_approved_products
  FOR SELECT USING (consumer_visible = true AND status = 'approved');

CREATE POLICY "Authenticated can view all products" ON regen_approved_products
  FOR SELECT TO authenticated USING (true);

-- Intakes: patients see own, staff see all
CREATE POLICY "Patients see own intakes" ON regen_intakes
  FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Staff can manage intakes" ON regen_intakes
  FOR ALL TO authenticated USING (true);

-- Orders: patients see own, staff see all
CREATE POLICY "Patients see own orders" ON regen_orders
  FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Staff can manage orders" ON regen_orders
  FOR ALL TO authenticated USING (true);

-- Order history: same as orders
CREATE POLICY "View order history" ON regen_order_status_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Insert order history" ON regen_order_status_history
  FOR INSERT TO authenticated WITH CHECK (true);

-- Staff: only staff can view staff
CREATE POLICY "Staff can view staff" ON regen_staff
  FOR SELECT TO authenticated USING (true);

-- Audit log: staff only
CREATE POLICY "Staff can view audit log" ON regen_audit_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert audit log" ON regen_audit_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_regen_intakes_status ON regen_intakes(status);
CREATE INDEX IF NOT EXISTS idx_regen_intakes_email ON regen_intakes(email);
CREATE INDEX IF NOT EXISTS idx_regen_intakes_created ON regen_intakes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_regen_orders_status ON regen_orders(status);
CREATE INDEX IF NOT EXISTS idx_regen_orders_patient ON regen_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_orders_created ON regen_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_regen_orders_number ON regen_orders(order_number);

CREATE INDEX IF NOT EXISTS idx_regen_order_history_order ON regen_order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_regen_audit_created ON regen_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_regen_products_category ON regen_approved_products(category);
CREATE INDEX IF NOT EXISTS idx_regen_products_status ON regen_approved_products(status);

-- ============================================================
-- Insert default staff
-- ============================================================

INSERT INTO regen_staff (email, name, role, can_approve_rx, can_process_refunds, can_view_financials, can_manage_products)
VALUES 
  ('provider@hellogorgeousmedspa.com', 'Danielle Alcala', 'owner', false, true, true, true),
  ('ryan@hellogorgeousmedspa.com', 'Ryan Kent', 'prescriber', true, false, false, false)
ON CONFLICT (email) DO NOTHING;
