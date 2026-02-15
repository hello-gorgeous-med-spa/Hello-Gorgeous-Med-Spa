-- ============================================================
-- PROVIDERS & MEDIA SYSTEM
-- For Hello Gorgeous Med Spa Provider Pages
-- ============================================================

-- Providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  credentials TEXT,
  short_bio TEXT,
  full_bio TEXT,
  philosophy TEXT,
  headshot_url TEXT,
  intro_video_url TEXT,
  booking_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider media table (videos and before/after photos)
CREATE TABLE IF NOT EXISTS provider_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'before_after')),
  -- For videos
  video_url TEXT,
  video_thumbnail_url TEXT,
  -- For before/after
  before_image_url TEXT,
  after_image_url TEXT,
  -- Common fields
  title TEXT,
  description TEXT,
  service_tag TEXT,
  is_featured BOOLEAN DEFAULT false,
  consent_confirmed BOOLEAN DEFAULT false,
  has_watermark BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service tags for filtering
CREATE TABLE IF NOT EXISTS service_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Insert default service tags
INSERT INTO service_tags (name, slug, display_order) VALUES
  ('Botox', 'botox', 1),
  ('Lip Filler', 'lip-filler', 2),
  ('Dermal Fillers', 'dermal-fillers', 3),
  ('PRP', 'prp', 4),
  ('Hormone Therapy', 'hormone-therapy', 5),
  ('Weight Loss', 'weight-loss', 6),
  ('Microneedling', 'microneedling', 7),
  ('Laser', 'laser', 8),
  ('IV Therapy', 'iv-therapy', 9),
  ('Skincare', 'skincare', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert Danielle and Ryan as providers
INSERT INTO providers (name, slug, credentials, short_bio, full_bio, philosophy, booking_url, display_order, is_active) VALUES
  (
    'Danielle Glazier',
    'danielle',
    'RN, BSN, Aesthetic Injector',
    'Danielle is our lead aesthetic injector with over 10 years of nursing experience and specialized training in facial aesthetics.',
    'Danielle Glazier is a Registered Nurse with a Bachelor of Science in Nursing and extensive training in aesthetic medicine. She has dedicated her career to helping clients feel confident and beautiful in their own skin. With over 10 years of nursing experience and specialized certifications in Botox, dermal fillers, and advanced injection techniques, Danielle brings both clinical expertise and artistic vision to every treatment.',
    'My philosophy is simple: enhance your natural beauty, never change who you are. I believe in a conservative approach that delivers stunning, natural-looking results. Your face tells your story - I''m here to help you love the way you tell it.',
    '/book?provider=danielle',
    1,
    true
  ),
  (
    'Ryan Kent',
    'ryan',
    'FNP-BC, Aesthetic Specialist',
    'Ryan is our Family Nurse Practitioner specializing in hormone therapy, weight loss, and comprehensive wellness treatments.',
    'Ryan Kent is a board-certified Family Nurse Practitioner with specialized training in hormone optimization, weight management, and regenerative medicine. With a passion for helping clients achieve their health and wellness goals, Ryan takes a holistic approach to treatment, addressing not just symptoms but underlying causes.',
    'I believe in treating the whole person, not just the symptoms. True beauty and confidence come from feeling your best both inside and out. My goal is to help you achieve optimal health and wellness through personalized, evidence-based treatments.',
    '/book?provider=ryan',
    2,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  credentials = EXCLUDED.credentials,
  short_bio = EXCLUDED.short_bio,
  full_bio = EXCLUDED.full_bio,
  philosophy = EXCLUDED.philosophy,
  booking_url = EXCLUDED.booking_url,
  is_active = EXCLUDED.is_active;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_providers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS providers_updated_at ON providers;
CREATE TRIGGER providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_providers_updated_at();

DROP TRIGGER IF EXISTS provider_media_updated_at ON provider_media;
CREATE TRIGGER provider_media_updated_at
  BEFORE UPDATE ON provider_media
  FOR EACH ROW
  EXECUTE FUNCTION update_providers_updated_at();

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tags ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active providers" ON providers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active media with consent" ON provider_media
  FOR SELECT USING (is_active = true AND (type = 'video' OR consent_confirmed = true));

CREATE POLICY "Public can read service tags" ON service_tags
  FOR SELECT USING (is_active = true);

-- Admin policies (authenticated users can manage)
CREATE POLICY "Admins can manage providers" ON providers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage provider media" ON provider_media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage service tags" ON service_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers(slug);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
CREATE INDEX IF NOT EXISTS idx_provider_media_provider ON provider_media(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_media_type ON provider_media(type);
CREATE INDEX IF NOT EXISTS idx_provider_media_service_tag ON provider_media(service_tag);
CREATE INDEX IF NOT EXISTS idx_provider_media_featured ON provider_media(is_featured);
