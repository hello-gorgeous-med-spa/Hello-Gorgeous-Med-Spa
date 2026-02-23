-- ============================================================
-- Harmony AI™: hormone_sessions + rate limiting
-- ============================================================

CREATE TABLE IF NOT EXISTS hormone_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID,
  age_range TEXT,
  biological_sex TEXT,
  menopause_status TEXT,
  top_symptoms JSONB,
  sleep_quality TEXT,
  energy_level TEXT,
  weight_change TEXT,
  stress_level TEXT,
  prior_hormone_therapy BOOLEAN,
  uploaded_labs_url TEXT,
  ai_summary JSONB,
  recommended_labs JSONB,
  recommended_protocol JSONB,
  estimated_timeline TEXT,
  estimated_investment_range TEXT,
  severity_score INTEGER,
  conversion_status TEXT NOT NULL DEFAULT 'generated'
);

CREATE INDEX IF NOT EXISTS idx_hormone_sessions_created_at ON hormone_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hormone_sessions_conversion_status ON hormone_sessions(conversion_status);
CREATE INDEX IF NOT EXISTS idx_hormone_sessions_severity ON hormone_sessions(severity_score);

COMMENT ON TABLE hormone_sessions IS 'Harmony AI™ hormone assessment and blueprint output';

-- Rate limit: 5 blueprint generations per IP per hour
CREATE TABLE IF NOT EXISTS hormone_rate_limit (
  ip TEXT NOT NULL,
  hour_ts TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ip, hour_ts)
);

CREATE INDEX IF NOT EXISTS idx_hormone_rate_limit_hour_ts ON hormone_rate_limit(hour_ts);

CREATE OR REPLACE FUNCTION hormone_rate_limit_inc(p_ip TEXT, p_hour_ts TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO hormone_rate_limit (ip, hour_ts, count)
  VALUES (p_ip, p_hour_ts, 1)
  ON CONFLICT (ip, hour_ts) DO UPDATE
  SET count = hormone_rate_limit.count + 1, updated_at = now()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

-- BioTE / hormone-specific pricing (if not already in service_pricing)
INSERT INTO service_pricing (service_name, min_price_cents, max_price_cents, avg_sessions) VALUES
  ('BioTE Pellet Therapy', 25000, 60000, 1),
  ('BioTE Pellets', 25000, 60000, 1)
ON CONFLICT (service_name) DO NOTHING;
