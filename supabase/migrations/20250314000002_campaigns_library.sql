-- Campaigns Library: Store generated AI campaigns
CREATE TABLE IF NOT EXISTS campaigns_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  prompt TEXT,
  headline TEXT NOT NULL,
  subheadline TEXT,
  hooks TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  cta TEXT,
  instagram_caption TEXT,
  tiktok_caption TEXT,
  facebook_caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  target_audience TEXT,
  tone TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  video_format TEXT,
  is_published BOOLEAN DEFAULT false,
  published_platforms TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_campaigns_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_campaigns_library_updated_at
  BEFORE UPDATE ON campaigns_library
  FOR EACH ROW
  EXECUTE FUNCTION update_campaigns_library_updated_at();

-- Indexes
CREATE INDEX idx_campaigns_library_service ON campaigns_library(service);
CREATE INDEX idx_campaigns_library_created_at ON campaigns_library(created_at DESC);
CREATE INDEX idx_campaigns_library_is_published ON campaigns_library(is_published);

-- Enable RLS
ALTER TABLE campaigns_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "campaigns_library_all_access" ON campaigns_library
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE campaigns_library IS 'Stores AI-generated marketing campaigns';
