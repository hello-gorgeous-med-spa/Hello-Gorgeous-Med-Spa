-- Cloud video render jobs (Creatomate integration)
CREATE TABLE IF NOT EXISTS render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creatomate_render_id TEXT,
  service TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'vertical',
  status TEXT NOT NULL DEFAULT 'rendering',
  video_url TEXT,
  props JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on render_jobs" ON render_jobs;
CREATE POLICY "Service role full access on render_jobs"
  ON render_jobs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);
CREATE INDEX IF NOT EXISTS idx_render_jobs_created ON render_jobs(created_at DESC);
