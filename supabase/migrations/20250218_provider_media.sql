-- ============================================================
-- PROVIDERS MEDIA SYSTEM
-- Video + Before/After Photo Upload System
-- ============================================================

-- ============================================================
-- PROVIDERS TABLE (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  credentials TEXT,
  role VARCHAR(255),
  
  -- Content
  bio TEXT,
  philosophy TEXT,
  headshot_url TEXT,
  
  -- Booking
  booking_url TEXT,
  telehealth_enabled BOOLEAN DEFAULT false,
  
  -- Status
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PROVIDER MEDIA TABLE (Videos + Before/After)
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  
  -- Type
  type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'before_after')),
  
  -- Video Fields
  video_url TEXT,
  video_thumbnail_url TEXT,
  video_orientation VARCHAR(20) CHECK (video_orientation IN ('horizontal', 'vertical')),
  
  -- Before/After Fields
  before_image_url TEXT,
  after_image_url TEXT,
  
  -- Shared Fields
  service_tag VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  
  -- Settings
  featured BOOLEAN DEFAULT false,
  consent_confirmed BOOLEAN DEFAULT false,
  watermarked BOOLEAN DEFAULT false,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SERVICE TAGS (For filtering)
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_service_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default service tags
INSERT INTO provider_service_tags (name, slug, display_order) VALUES
  ('Botox', 'botox', 1),
  ('Lip Filler', 'lip-filler', 2),
  ('Dermal Fillers', 'dermal-fillers', 3),
  ('PRP', 'prp', 4),
  ('Hormone Therapy', 'hormone-therapy', 5),
  ('Weight Loss', 'weight-loss', 6),
  ('Microneedling', 'microneedling', 7),
  ('Laser', 'laser', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers(slug);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(active);
CREATE INDEX IF NOT EXISTS idx_provider_media_provider ON provider_media(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_media_type ON provider_media(type);
CREATE INDEX IF NOT EXISTS idx_provider_media_service ON provider_media(service_tag);
CREATE INDEX IF NOT EXISTS idx_provider_media_featured ON provider_media(featured);
CREATE INDEX IF NOT EXISTS idx_provider_media_status ON provider_media(status);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_provider_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS providers_updated ON providers;
CREATE TRIGGER providers_updated BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_provider_timestamp();

DROP TRIGGER IF EXISTS provider_media_updated ON provider_media;
CREATE TRIGGER provider_media_updated BEFORE UPDATE ON provider_media
  FOR EACH ROW EXECUTE FUNCTION update_provider_timestamp();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_service_tags ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access providers" ON providers FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access provider_media" ON provider_media FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access provider_service_tags" ON provider_service_tags FOR ALL TO service_role USING (true);

-- Public read for active providers and published media
CREATE POLICY "Public read active providers" ON providers FOR SELECT USING (active = true);
CREATE POLICY "Public read published media" ON provider_media FOR SELECT USING (status = 'published' AND consent_confirmed = true);
CREATE POLICY "Public read service tags" ON provider_service_tags FOR SELECT USING (true);

-- ============================================================
-- SEED DATA (Danielle & Ryan)
-- ============================================================
INSERT INTO providers (slug, name, credentials, role, bio, headshot_url, booking_url, telehealth_enabled, active) VALUES
  (
    'danielle',
    'Danielle Alcala',
    'Licensed CNA • CMAA • Phlebotomist',
    'Founder, Hello Gorgeous Med Spa',
    'Passionate about helping clients feel confident and beautiful. Patient-first care philosophy with a focus on personalized treatments.',
    '/images/team/danielle.png',
    '/book?provider=danielle',
    false,
    true
  ),
  (
    'ryan',
    'Ryan Kent',
    'MSN, FNP-C, ABAAHP • Full Practice Authority Nurse Practitioner',
    'Medical Director',
    'Board-Certified Family Nurse Practitioner with full prescriptive authority. Specializing in weight management, hormone optimization, and regenerative medicine.',
    '/images/providers/ryan-kent-clinic.jpg',
    '/book?provider=ryan',
    true,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  credentials = EXCLUDED.credentials,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  headshot_url = EXCLUDED.headshot_url,
  booking_url = EXCLUDED.booking_url,
  telehealth_enabled = EXCLUDED.telehealth_enabled;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE providers IS 'Medical providers/staff profiles';
COMMENT ON TABLE provider_media IS 'Provider videos and before/after photos';
COMMENT ON TABLE provider_service_tags IS 'Service categories for filtering media';
