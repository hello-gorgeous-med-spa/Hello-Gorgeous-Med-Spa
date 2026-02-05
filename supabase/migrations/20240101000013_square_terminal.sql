-- ============================================================
-- SQUARE TERMINAL INTEGRATION SCHEMA
-- OAuth connections, device management, terminal checkout support
-- ============================================================

-- ============================================================
-- 1. SQUARE CONNECTIONS (OAuth tokens and merchant info)
-- ============================================================
CREATE TABLE IF NOT EXISTS square_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Square Account Info
  merchant_id VARCHAR(255) NOT NULL UNIQUE,
  business_name VARCHAR(255),
  
  -- Selected Location/Device
  location_id VARCHAR(255),
  location_name VARCHAR(255),
  default_device_id UUID,
  
  -- OAuth Tokens (encrypted)
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  token_type VARCHAR(50) DEFAULT 'bearer',
  
  -- Scopes granted
  scopes TEXT[],
  
  -- Connection Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'disconnected')),
  
  -- Environment
  environment VARCHAR(20) DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  
  -- Timestamps
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_token_refresh_at TIMESTAMPTZ,
  last_webhook_at TIMESTAMPTZ,
  disconnected_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. SQUARE DEVICES (Terminal devices for each location)
-- ============================================================
CREATE TABLE IF NOT EXISTS square_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Connection Reference
  connection_id UUID REFERENCES square_connections(id) ON DELETE CASCADE,
  location_id VARCHAR(255) NOT NULL,
  
  -- Square Device Info
  square_device_id VARCHAR(255) NOT NULL,
  device_code_id VARCHAR(255),
  
  -- Device Details
  name VARCHAR(255) NOT NULL,
  product_type VARCHAR(100), -- 'TERMINAL_API', etc.
  status VARCHAR(50) DEFAULT 'paired' CHECK (status IN ('unpaired', 'pairing', 'paired', 'offline', 'disconnected')),
  
  -- Configuration
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  paired_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(location_id, square_device_id)
);

-- ============================================================
-- 3. ADD SQUARE TERMINAL COLUMNS TO SALE_PAYMENTS
-- ============================================================
-- Add Square-specific columns to existing sale_payments table
ALTER TABLE sale_payments 
  ADD COLUMN IF NOT EXISTS square_order_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS square_terminal_checkout_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS terminal_status VARCHAR(50),
  ADD COLUMN IF NOT EXISTS terminal_device_id UUID REFERENCES square_devices(id),
  ADD COLUMN IF NOT EXISTS raw_square_response JSONB;

-- ============================================================
-- 4. TERMINAL CHECKOUTS (Track in-progress terminal payments)
-- ============================================================
CREATE TABLE IF NOT EXISTS terminal_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES sale_payments(id) ON DELETE SET NULL,
  device_id UUID REFERENCES square_devices(id),
  
  -- Square IDs
  square_checkout_id VARCHAR(255) NOT NULL UNIQUE,
  square_order_id VARCHAR(255),
  square_payment_id VARCHAR(255),
  
  -- Amounts (in cents)
  amount_money INTEGER NOT NULL,
  tip_money INTEGER DEFAULT 0,
  
  -- Status tracking
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN (
    'PENDING',
    'IN_PROGRESS', 
    'CANCEL_REQUESTED',
    'CANCELED',
    'COMPLETED',
    'EXPIRED',
    'FAILED'
  )),
  
  -- Error info
  error_code VARCHAR(100),
  error_message TEXT,
  
  -- Idempotency
  idempotency_key VARCHAR(255) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ
);

-- ============================================================
-- 5. REFUNDS TABLE (Track refunds separately for audit)
-- ============================================================
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  payment_id UUID NOT NULL REFERENCES sale_payments(id) ON DELETE RESTRICT,
  
  -- Square IDs
  square_refund_id VARCHAR(255),
  square_payment_id VARCHAR(255),
  
  -- Amounts (in cents)
  amount INTEGER NOT NULL,
  processing_fee_refunded INTEGER DEFAULT 0,
  
  -- Details
  reason TEXT NOT NULL,
  refund_type VARCHAR(20) DEFAULT 'full' CHECK (refund_type IN ('full', 'partial')),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rejected')),
  
  -- Error info
  error_code VARCHAR(100),
  error_message TEXT,
  
  -- Audit
  created_by UUID,
  approved_by UUID,
  
  -- Raw response
  raw_square_response JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ============================================================
-- 6. AUDIT LOG (Compliance tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was affected
  entity_type VARCHAR(100) NOT NULL, -- 'sale', 'payment', 'refund', 'square_connection', etc.
  entity_id UUID,
  
  -- What happened
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'refund', 'void', 'connect', 'disconnect'
  
  -- Who did it
  user_id UUID,
  user_email VARCHAR(255),
  user_role VARCHAR(50),
  
  -- Details
  details JSONB,
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. FUNCTIONS
-- ============================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure only one default device per location
CREATE OR REPLACE FUNCTION ensure_single_default_device()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE square_devices 
    SET is_default = false 
    WHERE location_id = NEW.location_id 
      AND id != NEW.id 
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 8. TRIGGERS
-- ============================================================

-- Update timestamps
DROP TRIGGER IF EXISTS square_connections_updated_at ON square_connections;
CREATE TRIGGER square_connections_updated_at
  BEFORE UPDATE ON square_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS square_devices_updated_at ON square_devices;
CREATE TRIGGER square_devices_updated_at
  BEFORE UPDATE ON square_devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS terminal_checkouts_updated_at ON terminal_checkouts;
CREATE TRIGGER terminal_checkouts_updated_at
  BEFORE UPDATE ON terminal_checkouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure single default device
DROP TRIGGER IF EXISTS ensure_single_default_device_trigger ON square_devices;
CREATE TRIGGER ensure_single_default_device_trigger
  BEFORE INSERT OR UPDATE ON square_devices
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_device();

-- ============================================================
-- 9. INDEXES
-- ============================================================

-- Square Connections
CREATE INDEX IF NOT EXISTS idx_square_connections_merchant_id ON square_connections(merchant_id);
CREATE INDEX IF NOT EXISTS idx_square_connections_status ON square_connections(status);

-- Square Devices
CREATE INDEX IF NOT EXISTS idx_square_devices_connection_id ON square_devices(connection_id);
CREATE INDEX IF NOT EXISTS idx_square_devices_location_id ON square_devices(location_id);
CREATE INDEX IF NOT EXISTS idx_square_devices_square_device_id ON square_devices(square_device_id);
CREATE INDEX IF NOT EXISTS idx_square_devices_is_default ON square_devices(is_default) WHERE is_default = true;

-- Terminal Checkouts
CREATE INDEX IF NOT EXISTS idx_terminal_checkouts_sale_id ON terminal_checkouts(sale_id);
CREATE INDEX IF NOT EXISTS idx_terminal_checkouts_square_checkout_id ON terminal_checkouts(square_checkout_id);
CREATE INDEX IF NOT EXISTS idx_terminal_checkouts_status ON terminal_checkouts(status);
CREATE INDEX IF NOT EXISTS idx_terminal_checkouts_created_at ON terminal_checkouts(created_at DESC);

-- Sale Payments (new columns)
CREATE INDEX IF NOT EXISTS idx_sale_payments_square_order_id ON sale_payments(square_order_id) WHERE square_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sale_payments_square_terminal_checkout_id ON sale_payments(square_terminal_checkout_id) WHERE square_terminal_checkout_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sale_payments_terminal_status ON sale_payments(terminal_status) WHERE terminal_status IS NOT NULL;

-- Refunds
CREATE INDEX IF NOT EXISTS idx_refunds_sale_id ON refunds(sale_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_square_refund_id ON refunds(square_refund_id) WHERE square_refund_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_created_at ON refunds(created_at DESC);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================================
-- 10. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE square_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE square_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated access to square_connections" ON square_connections;
DROP POLICY IF EXISTS "Allow authenticated access to square_devices" ON square_devices;
DROP POLICY IF EXISTS "Allow authenticated access to terminal_checkouts" ON terminal_checkouts;
DROP POLICY IF EXISTS "Allow authenticated access to refunds" ON refunds;
DROP POLICY IF EXISTS "Allow authenticated read on audit_log" ON audit_log;
DROP POLICY IF EXISTS "Allow service role full access to audit_log" ON audit_log;

-- Policies for authenticated users (staff)
CREATE POLICY "Allow authenticated access to square_connections" ON square_connections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access to square_devices" ON square_devices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access to terminal_checkouts" ON terminal_checkouts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access to refunds" ON refunds
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Audit log: read-only for authenticated, full for service role
CREATE POLICY "Allow authenticated read on audit_log" ON audit_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role full access to audit_log" ON audit_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- 11. COMMENTS
-- ============================================================

COMMENT ON TABLE square_connections IS 'OAuth connections to Square merchant accounts';
COMMENT ON COLUMN square_connections.access_token_encrypted IS 'AES-256 encrypted OAuth access token';
COMMENT ON COLUMN square_connections.refresh_token_encrypted IS 'AES-256 encrypted OAuth refresh token';

COMMENT ON TABLE square_devices IS 'Square Terminal devices paired for each location';
COMMENT ON COLUMN square_devices.square_device_id IS 'Device ID from Square Device API';
COMMENT ON COLUMN square_devices.is_default IS 'Default device used for terminal checkouts at this location';

COMMENT ON TABLE terminal_checkouts IS 'Tracks in-progress and completed terminal checkout sessions';
COMMENT ON COLUMN terminal_checkouts.status IS 'Terminal checkout status from Square webhooks';

COMMENT ON TABLE refunds IS 'Refund records for compliance tracking and reconciliation';
COMMENT ON COLUMN refunds.amount IS 'Refund amount in cents';

COMMENT ON TABLE audit_log IS 'Immutable audit trail for compliance (refunds, voids, adjustments)';

-- ============================================================
-- DONE! Square Terminal integration schema is ready.
-- ============================================================
