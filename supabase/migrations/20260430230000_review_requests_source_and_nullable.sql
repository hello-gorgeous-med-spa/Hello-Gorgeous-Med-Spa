-- ============================================================
-- Review automation: support Square-only checkouts (no HG OS appointment)
-- ============================================================
-- Before: review_requests_pending.appointment_id NOT NULL UNIQUE
-- Reality: most paying customers check out via Square Terminal / Square Online
-- and never have a corresponding HG OS appointment row marked "completed".
-- After: appointment_id is optional. We dedupe by client when no appointment
-- exists, and keep the appointment-level uniqueness via partial unique index.
-- ============================================================

-- review_requests_pending
ALTER TABLE review_requests_pending
  ALTER COLUMN appointment_id DROP NOT NULL;

ALTER TABLE review_requests_pending
  DROP CONSTRAINT IF EXISTS review_requests_pending_appointment_id_key;

ALTER TABLE review_requests_pending
  ADD COLUMN IF NOT EXISTS source TEXT;

-- Keep appointment-level dedupe when present, but allow many client-only rows.
CREATE UNIQUE INDEX IF NOT EXISTS idx_review_pending_appt_unique
  ON review_requests_pending(appointment_id)
  WHERE appointment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_review_pending_client
  ON review_requests_pending(client_id);

COMMENT ON COLUMN review_requests_pending.source IS
  'Origin of enqueue: appointment_completed | square_payment | manual';

-- review_requests_sent
ALTER TABLE review_requests_sent
  ALTER COLUMN appointment_id DROP NOT NULL;

ALTER TABLE review_requests_sent
  DROP CONSTRAINT IF EXISTS review_requests_sent_appointment_id_key;

ALTER TABLE review_requests_sent
  ADD COLUMN IF NOT EXISTS source TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_review_sent_appt_unique
  ON review_requests_sent(appointment_id)
  WHERE appointment_id IS NOT NULL;

-- For 60-day-per-client cooldown lookup
CREATE INDEX IF NOT EXISTS idx_review_sent_client_created
  ON review_requests_sent(client_id, created_at DESC);

COMMENT ON COLUMN review_requests_sent.source IS
  'Origin of enqueue: appointment_completed | square_payment | manual';
