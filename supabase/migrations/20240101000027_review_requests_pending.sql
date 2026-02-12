-- Pending review requests - scheduled 24h after appointment completion
CREATE TABLE IF NOT EXISTS review_requests_pending (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_pending_scheduled ON review_requests_pending(scheduled_for);

COMMENT ON TABLE review_requests_pending IS 'Review requests queued for 24h delay; processed by cron';
