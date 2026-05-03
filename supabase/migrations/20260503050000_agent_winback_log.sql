-- ============================================================
-- AGENT: Win-Back Outreach Log
-- Tracks which clients have been contacted by the win-back agent
-- to prevent duplicate messages and measure effectiveness.
-- ============================================================

CREATE TABLE IF NOT EXISTS agent_winback_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who was contacted
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  square_customer_id TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  first_name TEXT,
  
  -- Campaign details
  campaign_id TEXT NOT NULL DEFAULT 'lapsed_winback_v1',
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'both')),
  message_preview TEXT,
  
  -- Delivery status
  sms_sent BOOLEAN DEFAULT FALSE,
  sms_message_id TEXT,
  sms_error TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  email_message_id TEXT,
  email_error TEXT,
  
  -- Outcome tracking (updated later)
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  booked BOOLEAN DEFAULT FALSE,
  booked_at TIMESTAMPTZ,
  booking_id UUID,
  
  -- Timestamps
  contacted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for preventing duplicates within a time window
CREATE INDEX idx_winback_phone_campaign ON agent_winback_log(phone, campaign_id, contacted_at);
CREATE INDEX idx_winback_client ON agent_winback_log(client_id);
CREATE INDEX idx_winback_square ON agent_winback_log(square_customer_id);

-- RLS
ALTER TABLE agent_winback_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to agent_winback_log"
  ON agent_winback_log FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE agent_winback_log IS 'Tracks win-back agent outreach to prevent spam and measure ROI';
