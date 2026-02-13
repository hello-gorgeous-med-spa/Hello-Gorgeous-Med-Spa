-- ============================================================
-- MEDIA TABLE (Cloudflare Stream)
-- Stores video metadata for streaming embeds
-- ============================================================

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  stream_uid TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT,
  use_case TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_stream_uid ON media(stream_uid);
CREATE INDEX IF NOT EXISTS idx_media_use_case ON media(use_case);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access media" ON media FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public read media" ON media FOR SELECT TO anon USING (true);

COMMENT ON TABLE media IS 'Cloudflare Stream video metadata for site-wide embeds';
