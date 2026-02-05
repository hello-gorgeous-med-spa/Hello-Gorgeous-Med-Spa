-- ============================================================
-- WEBHOOK IDEMPOTENCY & SECURITY IMPROVEMENTS
-- Deduplication table + encryption key versioning
-- ============================================================

-- ============================================================
-- 1. SQUARE WEBHOOK EVENTS (Idempotency Guard)
-- ============================================================
-- Primary idempotency mechanism: reject duplicate event_id immediately
-- Secondary guards: terminal_checkout_id, payment_id, refund_id

CREATE TABLE IF NOT EXISTS square_webhook_events (
  -- Square event ID is the primary idempotency key
  event_id VARCHAR(255) PRIMARY KEY,
  
  -- Event metadata
  event_type VARCHAR(100) NOT NULL,
  object_id VARCHAR(255),  -- e.g., checkout_id, payment_id, refund_id
  
  -- Payload hash for debugging duplicates with different content
  payload_hash VARCHAR(64),
  
  -- Processing status
  status VARCHAR(20) DEFAULT 'processed' CHECK (status IN ('processed', 'failed', 'skipped')),
  error_message TEXT,
  
  -- Timestamps
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Store the raw payload for debugging (optional, can be disabled for storage)
  raw_payload JSONB
);

-- Fast lookups for recent events and by object
CREATE INDEX IF NOT EXISTS idx_webhook_events_received_at ON square_webhook_events(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_object_id ON square_webhook_events(object_id) WHERE object_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON square_webhook_events(event_type);

-- ============================================================
-- 2. ADD ENCRYPTION KEY VERSION TO CONNECTIONS
-- ============================================================
-- Supports key rotation: old tokens can be decrypted with their version's key
-- When rotating, update tokens with re-encrypted values + new version

ALTER TABLE square_connections
  ADD COLUMN IF NOT EXISTS encryption_key_version INTEGER DEFAULT 1;

COMMENT ON COLUMN square_connections.encryption_key_version IS 
  'Encryption key version used for tokens. Increment when rotating keys.';

-- ============================================================
-- 3. ADD ADDITIONAL IDEMPOTENCY INDEXES TO TERMINAL_CHECKOUTS
-- ============================================================
-- These support secondary idempotency guards

CREATE INDEX IF NOT EXISTS idx_terminal_checkouts_square_payment_id 
  ON terminal_checkouts(square_payment_id) 
  WHERE square_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_terminal_checkouts_square_order_id 
  ON terminal_checkouts(square_order_id) 
  WHERE square_order_id IS NOT NULL;

-- ============================================================
-- 4. ROW LEVEL SECURITY FOR WEBHOOK EVENTS
-- ============================================================
ALTER TABLE square_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access webhook events (security)
DROP POLICY IF EXISTS "Allow service role access to webhook_events" ON square_webhook_events;
CREATE POLICY "Allow service role access to webhook_events" ON square_webhook_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated users can read (for debugging in admin)
DROP POLICY IF EXISTS "Allow authenticated read on webhook_events" ON square_webhook_events;
CREATE POLICY "Allow authenticated read on webhook_events" ON square_webhook_events
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- 5. CLEANUP OLD WEBHOOK EVENTS (Function)
-- ============================================================
-- Call periodically to prevent unbounded growth
-- Default: keep 30 days of events

CREATE OR REPLACE FUNCTION cleanup_old_webhook_events(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM square_webhook_events
  WHERE received_at < NOW() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_webhook_events IS 
  'Remove webhook events older than specified days. Call via cron or manually.';

-- ============================================================
-- 6. COMMENTS
-- ============================================================
COMMENT ON TABLE square_webhook_events IS 
  'Idempotency guard for Square webhooks. Rejects duplicate event_id immediately.';

COMMENT ON COLUMN square_webhook_events.event_id IS 
  'Square webhook event ID - primary idempotency key';

COMMENT ON COLUMN square_webhook_events.payload_hash IS 
  'SHA-256 of event payload for duplicate detection with different content';

-- ============================================================
-- DONE! Webhook idempotency schema is ready.
-- ============================================================
