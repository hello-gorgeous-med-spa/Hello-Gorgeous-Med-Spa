-- Review-request observability: retries, click tracking, send errors.
-- Square 24h asks are the only post-visit path after Fresha sunset (Aug 2026).

ALTER TABLE review_requests_pending
  ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_error text,
  ADD COLUMN IF NOT EXISTS last_attempted_at timestamptz;

ALTER TABLE review_requests_sent
  ADD COLUMN IF NOT EXISTS tracking_token uuid,
  ADD COLUMN IF NOT EXISTS click_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS first_clicked_at timestamptz,
  ADD COLUMN IF NOT EXISTS sms_error text,
  ADD COLUMN IF NOT EXISTS email_error text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_review_sent_tracking_token
  ON review_requests_sent(tracking_token)
  WHERE tracking_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS review_request_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_id uuid REFERENCES review_requests_sent(id) ON DELETE CASCADE,
  tracking_token uuid NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now(),
  user_agent text
);

CREATE INDEX IF NOT EXISTS idx_review_request_clicks_sent
  ON review_request_clicks(sent_id, clicked_at DESC);

CREATE TABLE IF NOT EXISTS review_google_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  captured_at timestamptz NOT NULL DEFAULT now(),
  rating numeric,
  review_count integer
);
