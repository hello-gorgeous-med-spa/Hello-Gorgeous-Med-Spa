-- ============================================================
-- VIP WAITLIST TABLE (Modular for future launches)
-- Supports: CO2, Vaginal CO2, Future lasers, VIP programs
-- ============================================================

-- Create VIP waitlist table
CREATE TABLE IF NOT EXISTS vip_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Campaign identifier (for filtering/reuse)
  campaign TEXT NOT NULL DEFAULT 'co2_solaria', -- 'co2_solaria', 'vaginal_co2', 'morpheus8', etc.
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Qualification data
  age_range TEXT, -- '18-25', '26-35', '36-45', '46-55', '56+'
  concerns TEXT[], -- array of selected concerns
  prior_treatment BOOLEAN DEFAULT FALSE, -- have they had this treatment before?
  downtime_ok BOOLEAN DEFAULT FALSE, -- comfortable with downtime?
  investment_ready BOOLEAN DEFAULT FALSE, -- prepared for investment level?
  
  -- Additional qualification (flexible JSON for future fields)
  qualification_data JSONB DEFAULT '{}',
  
  -- CRM integration
  crm_tag TEXT DEFAULT 'VIP_WAITLIST',
  
  -- Status workflow
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'contacted', 'scheduled', 'booked', 'declined', 'no_response'
  
  -- Communication tracking
  email_sent_at TIMESTAMPTZ,
  contacted_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  
  -- Staff notes
  notes TEXT,
  assigned_to UUID REFERENCES providers(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_campaign ON vip_waitlist(campaign);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_email ON vip_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_status ON vip_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_created_at ON vip_waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_qualified ON vip_waitlist(campaign, investment_ready, downtime_ok) 
  WHERE investment_ready = TRUE AND downtime_ok = TRUE;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_vip_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vip_waitlist_updated_at ON vip_waitlist;
CREATE TRIGGER vip_waitlist_updated_at
  BEFORE UPDATE ON vip_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_vip_waitlist_updated_at();

-- RLS policies
ALTER TABLE vip_waitlist ENABLE ROW LEVEL SECURITY;

-- Admin/staff can do everything
CREATE POLICY vip_waitlist_admin_policy ON vip_waitlist
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'owner', 'provider', 'staff')
    )
  );

-- Service role (API) can insert
CREATE POLICY vip_waitlist_insert_policy ON vip_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant access
GRANT ALL ON vip_waitlist TO authenticated;
GRANT ALL ON vip_waitlist TO service_role;
GRANT INSERT ON vip_waitlist TO anon;

-- ============================================================
-- VIEW: Qualified VIP Leads (Investment Ready + Downtime OK)
-- ============================================================

CREATE OR REPLACE VIEW vip_waitlist_qualified AS
SELECT *
FROM vip_waitlist
WHERE investment_ready = TRUE 
  AND downtime_ok = TRUE
ORDER BY created_at DESC;

-- Grant access to view
GRANT SELECT ON vip_waitlist_qualified TO authenticated;
GRANT SELECT ON vip_waitlist_qualified TO service_role;
