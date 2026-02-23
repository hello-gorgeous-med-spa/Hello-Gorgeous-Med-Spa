-- ============================================================
-- HG Roadmap™: Rate limiting for /api/journey/roadmap
-- Max 5 requests per IP per calendar hour (persists across serverless invocations)
-- ============================================================

CREATE TABLE IF NOT EXISTS journey_rate_limit (
  ip TEXT NOT NULL,
  hour_ts TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ip, hour_ts)
);

CREATE INDEX IF NOT EXISTS idx_journey_rate_limit_hour_ts ON journey_rate_limit(hour_ts);

COMMENT ON TABLE journey_rate_limit IS 'Rate limit bucket: 5 roadmap generations per IP per hour';

-- Atomic increment and return new count (used by API route)
CREATE OR REPLACE FUNCTION journey_rate_limit_inc(p_ip TEXT, p_hour_ts TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO journey_rate_limit (ip, hour_ts, count)
  VALUES (p_ip, p_hour_ts, 1)
  ON CONFLICT (ip, hour_ts) DO UPDATE
  SET count = journey_rate_limit.count + 1, updated_at = now()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
