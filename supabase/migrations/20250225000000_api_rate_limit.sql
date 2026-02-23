-- Generic API rate limiting (dashboard, chat). Bucket = 'dashboard:'||ip or 'chat:'||ip.
CREATE TABLE IF NOT EXISTS api_rate_limit (
  bucket_key TEXT NOT NULL,
  hour_ts TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (bucket_key, hour_ts)
);
CREATE INDEX IF NOT EXISTS idx_api_rate_limit_hour_ts ON api_rate_limit(hour_ts);

CREATE OR REPLACE FUNCTION api_rate_limit_inc(p_bucket_key TEXT, p_hour_ts TEXT)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE new_count INTEGER;
BEGIN
  INSERT INTO api_rate_limit (bucket_key, hour_ts, count)
  VALUES (p_bucket_key, p_hour_ts, 1)
  ON CONFLICT (bucket_key, hour_ts) DO UPDATE
  SET count = api_rate_limit.count + 1, updated_at = now()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
