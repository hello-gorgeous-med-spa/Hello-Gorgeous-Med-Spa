-- ============================================================
-- FIX WHAT BOTHERS ME - Concern submissions from website
-- Clients write what bothers them; we suggest services & optionally book
-- ============================================================

CREATE TABLE IF NOT EXISTS concern_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who (optional for privacy)
  name VARCHAR(200),
  email VARCHAR(255),
  phone VARCHAR(50),

  -- Their message (sacred / personal)
  message TEXT NOT NULL,

  -- System-suggested services (slugs from SERVICES / book flow)
  suggested_service_slugs JSONB DEFAULT '[]'::jsonb,

  -- Status for owner workflow
  status VARCHAR(50) DEFAULT 'new', -- new | reviewed | contacted | booked
  source VARCHAR(50) DEFAULT 'web',

  -- Owner follow-up
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  owner_notes TEXT,
  booking_appointment_id UUID REFERENCES appointments(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_concern_submissions_status ON concern_submissions(status);
CREATE INDEX idx_concern_submissions_created ON concern_submissions(created_at DESC);
CREATE INDEX idx_concern_submissions_email ON concern_submissions(email) WHERE email IS NOT NULL;

COMMENT ON TABLE concern_submissions IS 'Fix What Bothers Me: client concerns from website, mapped to suggested services';
