-- Image Library: Stores all uploaded and stock images for video creation
CREATE TABLE IF NOT EXISTS image_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'upload' CHECK (source IN ('upload', 'stock', 'generated', 'landing_page')),
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_image_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_image_library_updated_at
  BEFORE UPDATE ON image_library
  FOR EACH ROW
  EXECUTE FUNCTION update_image_library_updated_at();

-- Indexes
CREATE INDEX idx_image_library_category ON image_library(category);
CREATE INDEX idx_image_library_source ON image_library(source);
CREATE INDEX idx_image_library_created_at ON image_library(created_at DESC);
CREATE INDEX idx_image_library_is_favorite ON image_library(is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_image_library_tags ON image_library USING GIN(tags);

-- Enable RLS
ALTER TABLE image_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations for authenticated users
CREATE POLICY "image_library_all_access" ON image_library
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE image_library IS 'Stores uploaded and stock images for video creation';

-- Pre-populate with existing images from landing pages
INSERT INTO image_library (name, url, category, tags, source) VALUES
  ('Stretch Marks & Acne Scars', '/images/solaria-before-after/stretch-marks-acne-scars.png', 'before-after', ARRAY['solaria', 'stretch marks', 'acne scars', 'body'], 'landing_page'),
  ('Stretch Mark Comparison', '/images/solaria-before-after/stretch-mark-comparison.png', 'before-after', ARRAY['solaria', 'stretch marks', 'body', 'results'], 'landing_page'),
  ('Skin Tightening Jawline', '/images/solaria-before-after/skin-tightening-jawline.png', 'before-after', ARRAY['solaria', 'skin tightening', 'face', 'jawline'], 'landing_page'),
  ('Botox Lip Flip Hero', '/images/botox-lip-flip-hero.png', 'hero', ARRAY['botox', 'lip flip', 'lips'], 'landing_page'),
  ('Botox Lip Flip Before/After', '/images/botox-lip-flip-before-after.png', 'before-after', ARRAY['botox', 'lip flip', 'lips', 'results'], 'landing_page'),
  ('Gummy Smile Before/After', '/images/gummy-smile-before-after.png', 'before-after', ARRAY['botox', 'gummy smile', 'smile', 'results'], 'landing_page'),
  ('Lip Filler Before/After', '/images/lip-filler-before-after.png', 'before-after', ARRAY['fillers', 'lip filler', 'lips', 'results'], 'landing_page'),
  ('Hello Gorgeous Logo', '/images/hello-gorgeous-logo.png', 'branding', ARRAY['logo', 'brand', 'hello gorgeous'], 'landing_page'),
  ('Hero Banner', '/images/hero-banner.png', 'hero', ARRAY['hero', 'banner', 'main'], 'landing_page')
ON CONFLICT DO NOTHING;
