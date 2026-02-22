-- ============================================================
-- PROVIDERS MEDIA & AUTHORITY PAGE SCHEMA
-- Migration for Providers feature with video + photo uploads
-- ============================================================

-- First, enhance the existing providers table with new fields
ALTER TABLE providers ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS credentials TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS philosophy TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS headshot_url TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers(slug);

-- Update existing provider slugs from names
UPDATE providers 
SET slug = LOWER(REGEXP_REPLACE(first_name || '-' || last_name, '[^a-zA-Z0-9-]', '', 'g'))
WHERE slug IS NULL;

-- ============================================================
-- PROVIDER MEDIA TABLE
-- Stores videos and before/after photos for each provider
-- ============================================================

CREATE TABLE IF NOT EXISTS provider_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  
  -- Media type: 'video' or 'before_after'
  type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'before_after')),
  
  -- For videos
  video_url TEXT,
  thumbnail_url TEXT,
  video_orientation VARCHAR(20) CHECK (video_orientation IN ('horizontal', 'vertical', NULL)),
  
  -- For before/after images
  before_image_url TEXT,
  after_image_url TEXT,
  
  -- Metadata
  title VARCHAR(255),
  description TEXT,
  service_tag VARCHAR(100),
  caption TEXT,
  
  -- Flags
  is_featured BOOLEAN DEFAULT FALSE,
  consent_confirmed BOOLEAN DEFAULT FALSE,
  watermarked BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Ordering and timestamps
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for provider_media
CREATE INDEX IF NOT EXISTS idx_provider_media_provider_id ON provider_media(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_media_type ON provider_media(type);
CREATE INDEX IF NOT EXISTS idx_provider_media_service_tag ON provider_media(service_tag);
CREATE INDEX IF NOT EXISTS idx_provider_media_featured ON provider_media(is_featured);

-- RLS Policies
ALTER TABLE provider_media ENABLE ROW LEVEL SECURITY;

-- Public can read active provider media
CREATE POLICY provider_media_select_public ON provider_media
  FOR SELECT USING (is_active = TRUE);

-- Admin/staff can do everything
CREATE POLICY provider_media_admin ON provider_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Service tags enum table for consistency
CREATE TABLE IF NOT EXISTS service_tags (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0
);

INSERT INTO service_tags (id, name, display_order) VALUES
  ('botox', 'Botox', 1),
  ('lip-filler', 'Lip Filler', 2),
  ('dermal-fillers', 'Dermal Fillers', 3),
  ('prp', 'PRP/PRF', 4),
  ('hormone-therapy', 'Hormone Therapy', 5),
  ('weight-loss', 'Weight Loss', 6),
  ('microneedling', 'Microneedling', 7),
  ('laser', 'Laser Treatments', 8),
  ('facials', 'Facials', 9),
  ('iv-therapy', 'IV Therapy', 10)
ON CONFLICT (id) DO NOTHING;

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_provider_media_updated_at
  BEFORE UPDATE ON provider_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
