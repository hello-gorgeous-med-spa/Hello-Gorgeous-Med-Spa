-- ============================================================
-- PHASE 4: COMPLIANCE & SAFETY ENFORCEMENT
-- Inventory constraints, SMS logging, Chart note locking
-- ============================================================

-- ============================================================
-- 1. INVENTORY SAFETY CONSTRAINTS
-- ============================================================

-- First, ensure the required columns exist on inventory_lots
ALTER TABLE inventory_lots 
ADD COLUMN IF NOT EXISTS quantity_remaining DECIMAL(10,2) DEFAULT 0;

ALTER TABLE inventory_lots 
ADD COLUMN IF NOT EXISTS quantity_used DECIMAL(10,2) DEFAULT 0;

ALTER TABLE inventory_lots 
ADD COLUMN IF NOT EXISTS quantity_wasted DECIMAL(10,2) DEFAULT 0;

ALTER TABLE inventory_lots 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

ALTER TABLE inventory_lots 
ADD COLUMN IF NOT EXISTS expiration_date DATE;

-- Prevent negative inventory quantities (drop first to be idempotent)
ALTER TABLE inventory_lots DROP CONSTRAINT IF EXISTS check_quantity_remaining_non_negative;
ALTER TABLE inventory_lots 
ADD CONSTRAINT check_quantity_remaining_non_negative 
CHECK (quantity_remaining >= 0);

ALTER TABLE inventory_lots DROP CONSTRAINT IF EXISTS check_quantity_used_non_negative;
ALTER TABLE inventory_lots 
ADD CONSTRAINT check_quantity_used_non_negative 
CHECK (quantity_used >= 0);

ALTER TABLE inventory_lots DROP CONSTRAINT IF EXISTS check_quantity_wasted_non_negative;
ALTER TABLE inventory_lots 
ADD CONSTRAINT check_quantity_wasted_non_negative 
CHECK (quantity_wasted >= 0);

-- Ensure inventory_transactions table exists
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_lot_id UUID REFERENCES inventory_lots(id),
  inventory_item_id UUID,
  transaction_type VARCHAR(20) NOT NULL, -- 'use', 'waste', 'adjust', 'receive'
  quantity DECIMAL(10,2) NOT NULL,
  unit_cost DECIMAL(10,2),
  notes TEXT,
  performed_by UUID,
  appointment_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to check if lot is expired
CREATE OR REPLACE FUNCTION is_lot_expired(lot_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  exp_date DATE;
BEGIN
  SELECT expiration_date INTO exp_date
  FROM inventory_lots
  WHERE id = lot_id;
  
  RETURN exp_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent using expired inventory
CREATE OR REPLACE FUNCTION prevent_expired_inventory_use()
RETURNS TRIGGER AS $$
DECLARE
  exp_date DATE;
  lot_status VARCHAR(20);
BEGIN
  -- Only check on 'use' transactions (not waste/adjust)
  IF NEW.transaction_type = 'use' THEN
    SELECT expiration_date, status INTO exp_date, lot_status
    FROM inventory_lots
    WHERE id = NEW.inventory_lot_id;
    
    IF exp_date < CURRENT_DATE THEN
      RAISE EXCEPTION 'Cannot use expired inventory. Lot expired on %', exp_date;
    END IF;
    
    IF lot_status = 'expired' THEN
      RAISE EXCEPTION 'Cannot use inventory marked as expired';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_expired_inventory ON inventory_transactions;
CREATE TRIGGER check_expired_inventory
  BEFORE INSERT ON inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_expired_inventory_use();

-- Auto-update lot status based on expiration
CREATE OR REPLACE FUNCTION update_lot_status_on_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark as expired if past expiration date
  IF NEW.expiration_date < CURRENT_DATE AND NEW.status != 'expired' THEN
    NEW.status := 'expired';
  END IF;
  
  -- Mark as depleted if no quantity remaining
  IF NEW.quantity_remaining <= 0 AND NEW.status NOT IN ('expired', 'depleted') THEN
    NEW.status := 'depleted';
  END IF;
  
  -- Mark as low if below reorder point
  IF NEW.quantity_remaining > 0 AND NEW.quantity_remaining <= 10 AND NEW.status = 'active' THEN
    NEW.status := 'low';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_update_lot_status ON inventory_lots;
CREATE TRIGGER auto_update_lot_status
  BEFORE INSERT OR UPDATE ON inventory_lots
  FOR EACH ROW
  EXECUTE FUNCTION update_lot_status_on_expiry();

-- ============================================================
-- 2. SMS MESSAGE LOGGING (TCPA COMPLIANCE)
-- ============================================================

CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient info
  recipient_phone VARCHAR(20) NOT NULL,
  recipient_client_id UUID REFERENCES clients(id),
  recipient_name VARCHAR(255),
  
  -- Message content
  message_type VARCHAR(50) NOT NULL, -- 'reminder', 'confirmation', 'marketing', 'transactional'
  message_content TEXT NOT NULL,
  media_url TEXT,
  
  -- Sending details
  sender_phone VARCHAR(20) NOT NULL,
  telnyx_message_id VARCHAR(100),
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'opted_out'
  error_message TEXT,
  
  -- Consent tracking
  had_consent BOOLEAN DEFAULT true,
  consent_type VARCHAR(50), -- 'transactional', 'marketing'
  
  -- Cost tracking
  cost_cents INTEGER,
  segments INTEGER DEFAULT 1,
  
  -- Timestamps
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Who sent it
  sent_by UUID REFERENCES users(id),
  sent_via VARCHAR(50) DEFAULT 'api' -- 'api', 'campaign', 'automation', 'manual'
);

-- Indexes for SMS lookups
CREATE INDEX IF NOT EXISTS idx_sms_recipient_phone ON sms_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_sms_recipient_client ON sms_messages(recipient_client_id);
CREATE INDEX IF NOT EXISTS idx_sms_status ON sms_messages(status);
CREATE INDEX IF NOT EXISTS idx_sms_type ON sms_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_sms_created ON sms_messages(created_at);

-- Track opt-outs
CREATE TABLE IF NOT EXISTS sms_opt_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  client_id UUID REFERENCES clients(id),
  opted_out_at TIMESTAMPTZ DEFAULT NOW(),
  opt_out_method VARCHAR(50) DEFAULT 'STOP', -- 'STOP', 'manual', 'portal'
  resubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opt_outs_phone ON sms_opt_outs(phone);

-- Function to check if phone is opted out
CREATE OR REPLACE FUNCTION is_phone_opted_out(phone_number VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  opted_out BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM sms_opt_outs 
    WHERE phone = phone_number 
    AND resubscribed_at IS NULL
  ) INTO opted_out;
  
  RETURN opted_out;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. CLINICAL NOTE LOCKING (EHR COMPLIANCE)
-- ============================================================

-- Create clinical_notes table if it doesn't exist
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  provider_id UUID REFERENCES providers(id),
  appointment_id UUID REFERENCES appointments(id),
  note_type VARCHAR(50) DEFAULT 'soap',
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure required columns exist
ALTER TABLE clinical_notes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';
ALTER TABLE clinical_notes ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;
ALTER TABLE clinical_notes ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;

-- Prevent ANY modification to signed/locked notes
CREATE OR REPLACE FUNCTION prevent_signed_note_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- If note is signed or locked, prevent changes
  IF OLD.status IN ('signed', 'locked') THEN
    -- Only allow creating an amendment (which is a new record)
    RAISE EXCEPTION 'Cannot modify a signed clinical note. Create an addendum instead. Note ID: %', OLD.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_note_immutability ON clinical_notes;
CREATE TRIGGER enforce_note_immutability
  BEFORE UPDATE ON clinical_notes
  FOR EACH ROW
  EXECUTE FUNCTION prevent_signed_note_modification();

-- Prevent deletion of signed notes
CREATE OR REPLACE FUNCTION prevent_signed_note_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IN ('signed', 'locked', 'amended') THEN
    RAISE EXCEPTION 'Cannot delete a signed clinical note. Note ID: %', OLD.id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_note_no_delete ON clinical_notes;
CREATE TRIGGER enforce_note_no_delete
  BEFORE DELETE ON clinical_notes
  FOR EACH ROW
  EXECUTE FUNCTION prevent_signed_note_deletion();

-- Auto-lock notes after signing
CREATE OR REPLACE FUNCTION auto_lock_signed_note()
RETURNS TRIGGER AS $$
BEGIN
  -- When note is signed, set locked_at timestamp
  IF NEW.status = 'signed' AND OLD.status != 'signed' THEN
    NEW.locked_at := NOW();
    NEW.signed_at := COALESCE(NEW.signed_at, NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_lock_on_sign ON clinical_notes;
CREATE TRIGGER auto_lock_on_sign
  BEFORE UPDATE ON clinical_notes
  FOR EACH ROW
  EXECUTE FUNCTION auto_lock_signed_note();

-- ============================================================
-- 4. BUSINESS SETTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core business info
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Business hours by day
  business_hours JSONB DEFAULT '{
    "monday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "tuesday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "wednesday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "thursday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "friday": {"open": "9:00 AM", "close": "3:00 PM", "enabled": true},
    "saturday": {"open": "10:00 AM", "close": "2:00 PM", "enabled": false},
    "sunday": {"open": "", "close": "", "enabled": false}
  }'::jsonb,
  
  -- Holidays/closures
  holidays JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO business_settings (settings)
SELECT '{
  "business_name": "Hello Gorgeous Med Spa",
  "phone": "(630) 636-6193",
  "email": "hello@hellogorgeousmedspa.com",
  "address": "74 W. Washington St, Oswego, IL 60543",
  "timezone": "America/Chicago",
  "online_booking_enabled": true,
  "require_deposit": false,
  "send_reminders": true,
  "cancellation_hours": 24,
  "cancellation_fee_percent": 50
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM business_settings LIMIT 1);

-- ============================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================================

-- SMS Messages RLS
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view all SMS messages" ON sms_messages;
CREATE POLICY "Staff can view all SMS messages" ON sms_messages
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can insert SMS messages" ON sms_messages;
CREATE POLICY "Staff can insert SMS messages" ON sms_messages
  FOR INSERT TO authenticated WITH CHECK (true);

-- SMS Opt-outs RLS
ALTER TABLE sms_opt_outs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view opt-outs" ON sms_opt_outs;
CREATE POLICY "Staff can view opt-outs" ON sms_opt_outs
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can manage opt-outs" ON sms_opt_outs;
CREATE POLICY "Staff can manage opt-outs" ON sms_opt_outs
  FOR ALL TO authenticated USING (true);

-- Business Settings RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON business_settings;
CREATE POLICY "Anyone can read settings" ON business_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON business_settings;
CREATE POLICY "Admins can update settings" ON business_settings
  FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- 6. HELPER FUNCTIONS
-- ============================================================

-- Get active inventory lots for a product (not expired, has quantity)
CREATE OR REPLACE FUNCTION get_available_lots(item_id UUID)
RETURNS TABLE (
  lot_id UUID,
  lot_number VARCHAR,
  quantity_remaining DECIMAL,
  expiration_date DATE,
  days_until_expiry INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    il.id,
    il.lot_number,
    il.quantity_remaining,
    il.expiration_date,
    (il.expiration_date - CURRENT_DATE)::INTEGER as days_until_expiry
  FROM inventory_lots il
  WHERE il.inventory_item_id = item_id
    AND il.status NOT IN ('expired', 'depleted')
    AND il.quantity_remaining > 0
    AND il.expiration_date >= CURRENT_DATE
  ORDER BY il.expiration_date ASC; -- FEFO: First Expiry, First Out
END;
$$ LANGUAGE plpgsql;

-- Get SMS stats for a time period
CREATE OR REPLACE FUNCTION get_sms_stats(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS TABLE (
  total_sent BIGINT,
  total_delivered BIGINT,
  total_failed BIGINT,
  total_cost_cents BIGINT,
  by_type JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'sent' OR status = 'delivered'),
    COUNT(*) FILTER (WHERE status = 'delivered'),
    COUNT(*) FILTER (WHERE status = 'failed'),
    COALESCE(SUM(cost_cents), 0),
    jsonb_object_agg(
      COALESCE(message_type, 'unknown'),
      (SELECT COUNT(*) FROM sms_messages sm2 
       WHERE sm2.message_type = sms_messages.message_type
       AND sm2.created_at BETWEEN start_date AND end_date)
    )
  FROM sms_messages
  WHERE created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

SELECT 'Compliance & Safety migration completed successfully!' AS status;
