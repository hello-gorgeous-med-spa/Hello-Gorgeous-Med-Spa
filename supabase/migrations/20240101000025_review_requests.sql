-- Review request tracking for post-appointment Google review automation
CREATE TABLE IF NOT EXISTS review_requests_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sms_sent BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id)
);

CREATE INDEX IF NOT EXISTS idx_review_requests_appointment ON review_requests_sent(appointment_id);

COMMENT ON TABLE review_requests_sent IS 'Tracks Google review requests sent after completed appointments';
