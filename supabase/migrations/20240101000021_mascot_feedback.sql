-- ============================================================
-- Mascot feedback — messages from chat widget sent to owner
-- (feedback, complaints, callback requests, etc.)
-- ============================================================

CREATE TABLE IF NOT EXISTS mascot_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  source TEXT NOT NULL DEFAULT 'widget',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mascot_feedback_created ON mascot_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mascot_feedback_read ON mascot_feedback(read_at) WHERE read_at IS NULL;

COMMENT ON TABLE mascot_feedback IS 'Feedback/complaints/requests from the Hello Gorgeous chat widget; owner inbox.';
