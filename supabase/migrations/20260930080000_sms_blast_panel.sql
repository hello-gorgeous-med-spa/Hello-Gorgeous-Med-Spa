-- SMS Blast Panel tables for marketing campaigns
-- Stores contacts, consent, opt-outs, and blast history

-- SMS contacts table (synced from Square CSV)
CREATE TABLE IF NOT EXISTS sms_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  last_service_date DATE,
  lifetime_value NUMERIC(10,2) DEFAULT 0,
  consent_date TIMESTAMPTZ,
  consent_source TEXT, -- 'square_checkout', 'intake_form', 'manual'
  opted_out BOOLEAN DEFAULT FALSE,
  opted_out_at TIMESTAMPTZ,
  square_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(phone)
);

-- Index for audience queries
CREATE INDEX IF NOT EXISTS idx_sms_contacts_opted_out ON sms_contacts(opted_out);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_last_service ON sms_contacts(last_service_date);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_tags ON sms_contacts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_lifetime ON sms_contacts(lifetime_value);

-- SMS blasts history
CREATE TABLE IF NOT EXISTS sms_blasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id TEXT NOT NULL,
  message TEXT NOT NULL,
  media_url TEXT,
  recipient_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  opt_out_count INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,4),
  sent_by TEXT,
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_blasts_status ON sms_blasts(status);
CREATE INDEX IF NOT EXISTS idx_sms_blasts_sent_at ON sms_blasts(sent_at DESC);

-- SMS message log (individual sends)
CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blast_id UUID REFERENCES sms_blasts(id),
  contact_id UUID REFERENCES sms_contacts(id),
  twilio_sid TEXT,
  status TEXT DEFAULT 'queued', -- queued, sent, delivered, failed, undelivered
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sms_messages_blast ON sms_messages(blast_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_twilio ON sms_messages(twilio_sid);

-- Opt-out log (for compliance)
CREATE TABLE IF NOT EXISTS sms_optouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  reason TEXT, -- 'STOP', 'manual', 'bounce'
  twilio_sid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_optouts_phone ON sms_optouts(phone);

-- RLS policies
ALTER TABLE sms_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_blasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_optouts ENABLE ROW LEVEL SECURITY;

-- Staff can read/write all SMS data
CREATE POLICY "Staff can manage sms_contacts" ON sms_contacts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Staff can manage sms_blasts" ON sms_blasts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Staff can manage sms_messages" ON sms_messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Staff can manage sms_optouts" ON sms_optouts
  FOR ALL USING (true) WITH CHECK (true);

-- Function to handle STOP replies (Twilio webhook)
CREATE OR REPLACE FUNCTION handle_sms_optout(p_phone TEXT, p_reason TEXT DEFAULT 'STOP')
RETURNS VOID AS $$
BEGIN
  -- Mark contact as opted out
  UPDATE sms_contacts
  SET opted_out = TRUE, opted_out_at = NOW()
  WHERE phone = p_phone OR phone = '+1' || REGEXP_REPLACE(p_phone, '[^0-9]', '', 'g');
  
  -- Log the opt-out
  INSERT INTO sms_optouts (phone, reason)
  VALUES (p_phone, p_reason);
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE sms_contacts IS 'SMS marketing contacts with consent tracking';
COMMENT ON TABLE sms_blasts IS 'SMS/MMS campaign history';
COMMENT ON TABLE sms_messages IS 'Individual message delivery log';
COMMENT ON TABLE sms_optouts IS 'Opt-out compliance log';
