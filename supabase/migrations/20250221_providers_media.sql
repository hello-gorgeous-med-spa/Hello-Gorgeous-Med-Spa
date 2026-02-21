-- ============================================================
-- PROVIDERS MEDIA TABLE
-- For Provider profile pages with videos and before/after photos
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROVIDERS TABLE (if not exists)
-- ============================================================

CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  credentials TEXT,
  title TEXT,
  bio TEXT,
  philosophy TEXT,
  headshot_url TEXT,
  email TEXT,
  phone TEXT,
  color TEXT DEFAULT '#FF2D8E',
  booking_url TEXT,
  specialties TEXT[],
  certifications TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROVIDER MEDIA TABLE
-- Videos and before/after photos
-- ============================================================

CREATE TABLE IF NOT EXISTS provider_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'before_after', 'intro_video')),
  
  -- For videos
  video_url TEXT,
  video_thumbnail_url TEXT,
  video_duration INTEGER, -- seconds
  video_orientation TEXT CHECK (video_orientation IN ('horizontal', 'vertical', 'square')),
  
  -- For before/after photos
  before_image_url TEXT,
  after_image_url TEXT,
  
  -- Metadata
  title TEXT,
  description TEXT,
  service_tag TEXT, -- Botox, Lip Filler, PRP, etc.
  caption TEXT,
  alt_text TEXT,
  
  -- Display control
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  
  -- Compliance
  consent_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
  consent_date TIMESTAMPTZ,
  watermark_enabled BOOLEAN DEFAULT TRUE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_provider_media_provider ON provider_media(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_media_type ON provider_media(type);
CREATE INDEX IF NOT EXISTS idx_provider_media_service ON provider_media(service_tag);
CREATE INDEX IF NOT EXISTS idx_provider_media_featured ON provider_media(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_provider_media_active ON provider_media(is_active) WHERE is_active = TRUE;

-- ============================================================
-- SERVICE TAGS (standardized tags for filtering)
-- ============================================================

CREATE TABLE IF NOT EXISTS media_service_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default service tags
INSERT INTO media_service_tags (name, display_name, category, display_order) VALUES
  ('botox', 'Botox', 'Injectables', 1),
  ('lip_filler', 'Lip Filler', 'Injectables', 2),
  ('dermal_filler', 'Dermal Filler', 'Injectables', 3),
  ('prp', 'PRP', 'Regenerative', 4),
  ('hormone_therapy', 'Hormone Therapy', 'Wellness', 5),
  ('weight_loss', 'Weight Loss', 'Wellness', 6),
  ('microneedling', 'Microneedling', 'Skin', 7),
  ('laser', 'Laser Treatments', 'Skin', 8),
  ('co2_laser', 'CO₂ Laser', 'Skin', 9),
  ('chemical_peel', 'Chemical Peel', 'Skin', 10),
  ('hydrafacial', 'HydraFacial', 'Skin', 11),
  ('skinvive', 'SkinVive', 'Injectables', 12)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_service_tags ENABLE ROW LEVEL SECURITY;

-- Providers: Everyone can read active, admin can modify
DROP POLICY IF EXISTS providers_select_policy ON providers;
CREATE POLICY providers_select_policy ON providers FOR SELECT USING (true);

DROP POLICY IF EXISTS providers_insert_policy ON providers;
CREATE POLICY providers_insert_policy ON providers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS providers_update_policy ON providers;
CREATE POLICY providers_update_policy ON providers FOR UPDATE USING (true);

DROP POLICY IF EXISTS providers_delete_policy ON providers;
CREATE POLICY providers_delete_policy ON providers FOR DELETE USING (true);

-- Provider media: Select requires consent confirmed for before_after
DROP POLICY IF EXISTS media_select_policy ON provider_media;
CREATE POLICY media_select_policy ON provider_media FOR SELECT 
  USING (is_active = TRUE AND (type != 'before_after' OR consent_confirmed = TRUE));

DROP POLICY IF EXISTS media_admin_policy ON provider_media;
CREATE POLICY media_admin_policy ON provider_media FOR ALL USING (true);

-- Service tags: Everyone can read
DROP POLICY IF EXISTS tags_select_policy ON media_service_tags;
CREATE POLICY tags_select_policy ON media_service_tags FOR SELECT USING (true);

-- ============================================================
-- TRIGGER: Update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_provider_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS provider_media_updated_at ON provider_media;
CREATE TRIGGER provider_media_updated_at
  BEFORE UPDATE ON provider_media
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_media_updated_at();

-- ============================================================
-- SEED DEFAULT PROVIDERS
-- ============================================================

INSERT INTO providers (
  id, name, first_name, last_name, credentials, title, bio, philosophy, headshot_url, email, booking_url, color, specialties, is_active, display_order
) VALUES 
(
  'a8f2e9d1-4b7c-4e5a-9f3d-2c1b8a7e6f5d',
  'Danielle Glazier-Alcala',
  'Danielle',
  'Glazier-Alcala',
  'FNP-BC',
  'Owner & Lead Aesthetic Injector',
  'Danielle Glazier-Alcala, FNP-BC, is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With extensive experience in family medicine and aesthetic medicine, she brings a unique perspective that combines medical expertise with an artistic eye for natural-looking results.',
  'Every face tells a story. My goal is to enhance your natural beauty while maintaining the features that make you uniquely you. I believe in conservative, gradual treatments that make you look refreshed, never overdone.',
  '/images/team/danielle-glazier-alcala.jpg',
  'danielle@hellogorgeousmedspa.com',
  'https://hellogorgeousmedspa.com/book',
  '#FF2D8E',
  ARRAY['Botox & Dysport', 'Dermal Fillers', 'Lip Augmentation', 'CO₂ Laser', 'Hormone Therapy'],
  TRUE,
  1
),
(
  'b7e6f872-3628-418a-aefb-aca2101f7cb2',
  'Ryan Kent',
  'Ryan',
  'Kent',
  'FNP-C',
  'Aesthetic Injector',
  'Ryan Kent, FNP-C, brings a precise and meticulous approach to aesthetic medicine. His background in emergency medicine gives him excellent assessment skills and the ability to create customized treatment plans for each patient.',
  'I believe aesthetics is both a science and an art. By understanding facial anatomy at a deep level, I can create results that enhance your features while maintaining facial harmony and natural movement.',
  '/images/team/ryan-kent.jpg',
  'ryan@hellogorgeousmedspa.com',
  'https://hellogorgeousmedspa.com/book',
  '#2D63A4',
  ARRAY['Botox & Dysport', 'Dermal Fillers', 'Jawline Contouring', 'PRP Treatments'],
  TRUE,
  2
)
ON CONFLICT (id) DO UPDATE SET
  credentials = EXCLUDED.credentials,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  philosophy = EXCLUDED.philosophy,
  specialties = EXCLUDED.specialties,
  updated_at = NOW();

-- ============================================================
-- GRANTS
-- ============================================================

GRANT ALL ON providers TO authenticated;
GRANT ALL ON provider_media TO authenticated;
GRANT ALL ON media_service_tags TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
