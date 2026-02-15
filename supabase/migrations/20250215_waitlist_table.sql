-- ============================================================
-- WAITLIST TABLE
-- Aesthetic Record-style waitlist management
-- ============================================================

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  
  -- Preferences
  preferred_days TEXT[] DEFAULT '{}',
  preferred_time TEXT DEFAULT 'any', -- 'morning', 'afternoon', 'evening', 'any'
  notes TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'contacted', 'booked', 'expired', 'cancelled'
  priority TEXT DEFAULT 'normal', -- 'normal', 'high', 'vip'
  card_on_file BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_client_id ON waitlist(client_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_service_id ON waitlist(service_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_provider_id ON waitlist(provider_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority ON waitlist(priority);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS waitlist_updated_at ON waitlist;
CREATE TRIGGER waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_waitlist_updated_at();

-- RLS policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Admin/staff can do everything
CREATE POLICY waitlist_admin_policy ON waitlist
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'owner', 'provider', 'staff')
    )
  );

-- Grant access
GRANT ALL ON waitlist TO authenticated;
GRANT ALL ON waitlist TO service_role;

-- ============================================================
-- Add deposit/scheduling settings to settings table (if not exists)
-- ============================================================

-- You may need to add these columns to your settings table
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS deposits_enabled BOOLEAN DEFAULT FALSE;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS default_deposit_percent INTEGER DEFAULT 25;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS new_client_deposit_required BOOLEAN DEFAULT FALSE;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS lead_time_hours INTEGER DEFAULT 2;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS max_advance_booking_days INTEGER DEFAULT 90;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS booking_increment_minutes INTEGER DEFAULT 15;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS buffer_between_appointments INTEGER DEFAULT 0;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS require_card_for_booking BOOLEAN DEFAULT FALSE;

