-- ============================================================
-- HG Roadmap™: journey_sessions + service_pricing
-- ============================================================

-- Enums for journey intake (match AI prompt values). Idempotent.
DO $$ BEGIN
  CREATE TYPE journey_desired_change_level AS ENUM ('subtle', 'balanced', 'dramatic');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE journey_experience_level AS ENUM ('first_time', 'experienced');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE journey_timeline_preference AS ENUM ('immediate', 'flexible');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE journey_downtime_preference AS ENUM ('minimal', 'okay_with_downtime');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE journey_decision_style AS ENUM ('cautious', 'ready_now');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE journey_conversion_status AS ENUM ('generated', 'emailed', 'booked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Journey sessions: one row per "Generate My Roadmap" submission
CREATE TABLE IF NOT EXISTS journey_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID,
  primary_concern TEXT,
  desired_change_level journey_desired_change_level,
  experience_level journey_experience_level,
  timeline_preference journey_timeline_preference,
  downtime_preference journey_downtime_preference,
  decision_style journey_decision_style,
  uploaded_image_url TEXT,
  ai_summary JSONB,
  recommended_services JSONB,
  estimated_cost_range TEXT,
  recommended_timeline TEXT,
  conversion_status journey_conversion_status NOT NULL DEFAULT 'generated'
);

-- Index for analytics and lookups
CREATE INDEX IF NOT EXISTS idx_journey_sessions_created_at ON journey_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_sessions_conversion_status ON journey_sessions(conversion_status);

-- Service pricing for smart cost estimation (AI recommends services → backend calculates range)
CREATE TABLE IF NOT EXISTS service_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  min_price_cents INTEGER NOT NULL,
  max_price_cents INTEGER NOT NULL,
  avg_sessions INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed common services (adjust amounts as needed)
INSERT INTO service_pricing (service_name, min_price_cents, max_price_cents, avg_sessions) VALUES
  ('Botox', 30000, 80000, 1),
  ('Dysport', 30000, 90000, 1),
  ('Jeuveau', 30000, 80000, 1),
  ('Lip Filler', 50000, 150000, 1),
  ('Dermal Fillers', 60000, 200000, 1),
  ('Weight Loss', 20000, 50000, 1),
  ('Microneedling', 30000, 150000, 1),
  ('Laser', 15000, 300000, 1),
  ('Hormone Therapy', 20000, 80000, 1),
  ('IV Therapy', 15000, 40000, 1)
ON CONFLICT (service_name) DO NOTHING;

COMMENT ON TABLE journey_sessions IS 'HG Roadmap™ intake and AI-generated recommendations';
COMMENT ON TABLE service_pricing IS 'Per-service min/max and session count for cost estimation';
