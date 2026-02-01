-- ============================================================
-- PHASE 2: MEMBERSHIP/SUBSCRIPTION SYSTEM
-- Recurring memberships with benefits tracking
-- ============================================================

-- Membership Plans (templates)
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
  commitment_months INTEGER DEFAULT 0, -- 0 = month-to-month
  benefits JSONB DEFAULT '[]', -- array of benefit descriptions
  included_services JSONB DEFAULT '[]', -- array of service_ids or credits
  discount_percent INTEGER DEFAULT 0, -- % off all services
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client Memberships (active subscriptions)
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  plan_id UUID NOT NULL REFERENCES membership_plans(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'past_due', 'expired')),
  
  -- Billing
  price_locked DECIMAL(10,2), -- price at signup (may differ from plan price)
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  -- Dates
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE, -- for fixed-term memberships
  next_billing_date DATE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  -- Usage tracking
  credits_remaining DECIMAL(10,2) DEFAULT 0,
  credits_reset_date DATE,
  
  -- Audit
  sold_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Membership Benefit Usage
CREATE TABLE IF NOT EXISTS membership_benefit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
  benefit_type VARCHAR(50) NOT NULL, -- 'service_credit', 'product_discount', 'free_service'
  benefit_description TEXT,
  amount_used DECIMAL(10,2),
  related_transaction_id UUID REFERENCES transactions(id),
  related_appointment_id UUID REFERENCES appointments(id),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memberships_client ON memberships(client_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_membership_usage_membership ON membership_benefit_usage(membership_id);

-- RLS
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_benefit_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view membership plans" ON membership_plans
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can view memberships" ON memberships
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view benefit usage" ON membership_benefit_usage
  FOR SELECT TO authenticated USING (true);

-- Insert default membership plans
INSERT INTO membership_plans (name, description, price, billing_cycle, commitment_months, benefits, discount_percent)
VALUES 
  ('VIP Annual', 'Premium annual membership with exclusive benefits', 299, 'yearly', 12, 
   '["10% off all services", "Free vitamin injection monthly", "Priority booking", "Birthday gift ($50 value)", "Exclusive member events"]'::jsonb, 10),
  ('Glow Monthly', 'Monthly skincare membership with treatment credits', 149, 'monthly', 0,
   '["$150 treatment credit (use it or lose it)", "15% off skincare products", "Free signature facial monthly"]'::jsonb, 0),
  ('Botox Club', 'Monthly Botox membership for regular clients', 199, 'monthly', 6,
   '["20 units Botox monthly", "20% off additional units", "Free touch-ups within 14 days"]'::jsonb, 0)
ON CONFLICT DO NOTHING;
