-- ============================================================
-- HELLO GORGEOUS OS - CLIENT REVIEWS TABLE
-- First-party reviews (legacy Fresha import + future HG OS)
-- Run in Supabase SQL Editor
-- ============================================================

-- Review source: legacy import vs first-party vs Google (optional later)
DO $$ BEGIN
  CREATE TYPE review_source AS ENUM ('fresha_legacy', 'hg_os', 'google');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- client_reviews
-- ============================================================

CREATE TABLE IF NOT EXISTS client_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  client_name TEXT,
  service_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source review_source NOT NULL DEFAULT 'hg_os',
  legacy_source_id TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at_legacy TIMESTAMPTZ
);

-- Dedupe by legacy id when importing
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_reviews_legacy_source_id
  ON client_reviews (legacy_source_id) WHERE legacy_source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_client_reviews_rating ON client_reviews (rating DESC);
CREATE INDEX IF NOT EXISTS idx_client_reviews_created_at ON client_reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_reviews_source ON client_reviews (source);

-- Allow public read for reviews (anon can SELECT)
ALTER TABLE client_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read client_reviews"
  ON client_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert/update/delete (import + admin)
CREATE POLICY "Service role full access client_reviews"
  ON client_reviews FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE client_reviews IS 'First-party client reviews; legacy Fresha import + HG OS submissions.';
