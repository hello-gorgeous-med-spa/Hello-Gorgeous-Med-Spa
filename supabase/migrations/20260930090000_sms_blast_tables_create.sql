-- SMS Blast Panel tables (fresh create after repair)

-- Drop old sms_messages if it exists with wrong schema
DROP TABLE IF EXISTS sms_messages CASCADE;

CREATE TABLE IF NOT EXISTS sms_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  lifetime_value NUMERIC(10,2) DEFAULT 0,
  consent_date TIMESTAMPTZ,
  consent_source TEXT,
  opted_out BOOLEAN DEFAULT FALSE,
  opted_out_at TIMESTAMPTZ,
  square_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_blasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id TEXT NOT NULL,
  message TEXT NOT NULL,
  media_url TEXT,
  recipient_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,4),
  sent_by TEXT,
  status TEXT DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blast_id UUID REFERENCES sms_blasts(id),
  contact_id UUID REFERENCES sms_contacts(id),
  twilio_sid TEXT,
  status TEXT DEFAULT 'queued',
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_optouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  reason TEXT,
  twilio_sid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_contacts_opted_out ON sms_contacts(opted_out);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_phone ON sms_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_sms_blasts_status ON sms_blasts(status);
CREATE INDEX IF NOT EXISTS idx_sms_messages_blast ON sms_messages(blast_id);
CREATE INDEX IF NOT EXISTS idx_sms_optouts_phone ON sms_optouts(phone);

ALTER TABLE sms_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_blasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_optouts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "allow_all" ON sms_contacts FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "allow_all" ON sms_blasts FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "allow_all" ON sms_messages FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "allow_all" ON sms_optouts FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
