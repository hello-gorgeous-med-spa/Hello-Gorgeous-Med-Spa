-- ============================================================
-- HG Face Blueprint™: face_sessions
-- AI-assisted aesthetic face simulation sessions. Rate limit via api_rate_limit (face:{ip}, 5/hour).
-- ============================================================

CREATE TABLE IF NOT EXISTS face_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID,
  roadmap_id UUID,
  selected_services JSONB NOT NULL DEFAULT '[]',
  intensity_level TEXT NOT NULL DEFAULT 'balanced',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  image_hash TEXT,
  ai_summary JSONB,
  conversion_status TEXT NOT NULL DEFAULT 'generated'
);

CREATE INDEX IF NOT EXISTS idx_face_sessions_created_at ON face_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_face_sessions_conversion_status ON face_sessions(conversion_status);
CREATE INDEX IF NOT EXISTS idx_face_sessions_roadmap_id ON face_sessions(roadmap_id);

COMMENT ON TABLE face_sessions IS 'HG Face Blueprint™ – aesthetic simulation sessions and AI summary';
