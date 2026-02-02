-- ============================================================
-- WEBSITE CMS SCHEMA
-- Owner-controlled website content management
-- NO DEV REQUIRED FOR CONTENT, PAGES, OR CHANGES
-- ============================================================

-- ============================================================
-- PAGES TABLE (CMS Core)
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  slug VARCHAR(255) NOT NULL UNIQUE,           -- URL path (e.g., 'botox', 'weight-loss')
  title VARCHAR(255) NOT NULL,                  -- Page title
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'hidden', 'gated')),
  
  -- Scheduling
  publish_at TIMESTAMP WITH TIME ZONE,
  unpublish_at TIMESTAMP WITH TIME ZONE,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image_url TEXT,
  schema_enabled BOOLEAN DEFAULT true,
  no_index BOOLEAN DEFAULT false,
  
  -- Template
  template VARCHAR(50) DEFAULT 'default',       -- default, landing, service, blog
  
  -- Content
  sections JSONB DEFAULT '[]',                  -- Array of section configs
  
  -- Metadata
  created_by UUID,
  updated_by UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PAGE VERSIONS (History & Rollback)
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  
  version_number INTEGER NOT NULL,
  
  -- Snapshot of page data
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  sections JSONB,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_summary TEXT
);

-- ============================================================
-- SECTIONS LIBRARY (Reusable Blocks)
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,                    -- hero, services_grid, pricing, testimonials, etc.
  
  -- Content
  content JSONB DEFAULT '{}',                   -- Section-specific content
  
  -- Settings
  is_global BOOLEAN DEFAULT false,              -- Shared across pages
  is_template BOOLEAN DEFAULT false,            -- Available as template
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- NAVIGATION (Menus)
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  location VARCHAR(50) NOT NULL,                -- header, footer, mobile, sidebar
  
  -- Items (JSON array for flexibility)
  items JSONB DEFAULT '[]',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Insert default navigation locations
INSERT INTO cms_navigation (location, items) VALUES
  ('header', '[]'),
  ('footer', '[]'),
  ('mobile', '[]')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PROMOTIONS & OFFERS
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100),
  
  -- Content
  headline VARCHAR(255),
  subheadline TEXT,
  description TEXT,
  terms TEXT,
  
  -- Visual
  image_url TEXT,
  background_color VARCHAR(20),
  text_color VARCHAR(20),
  
  -- CTA
  cta_text VARCHAR(100),
  cta_url TEXT,
  cta_service_id UUID,                          -- Link to specific service
  cta_provider_id UUID,                         -- Preselect provider
  promo_code VARCHAR(50),                       -- Auto-apply promo code
  
  -- Display Settings
  display_locations JSONB DEFAULT '["homepage"]', -- Where to show
  display_as VARCHAR(30) DEFAULT 'banner',      -- banner, popup, inline, floating
  
  -- Scheduling
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,                   -- Higher = more prominent
  
  -- Tracking
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CTAs & BOOKING LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_ctas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name VARCHAR(100) NOT NULL,                   -- Internal name
  location VARCHAR(100),                        -- Where it's used
  
  -- Button Config
  text VARCHAR(100) NOT NULL,                   -- Button text
  style VARCHAR(30) DEFAULT 'primary',          -- primary, secondary, outline
  
  -- Target
  action_type VARCHAR(30) DEFAULT 'booking',    -- booking, link, phone, modal
  target_url TEXT,
  target_service_id UUID,
  target_provider_id UUID,
  promo_code VARCHAR(50),
  
  -- Visibility
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- File Info
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  file_type VARCHAR(50),                        -- image, video, document
  mime_type VARCHAR(100),
  file_size INTEGER,
  
  -- URLs
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Metadata
  alt_text VARCHAR(255),
  caption TEXT,
  tags JSONB DEFAULT '[]',
  
  -- Dimensions (for images/video)
  width INTEGER,
  height INTEGER,
  duration INTEGER,                             -- For video, in seconds
  
  -- Organization
  folder VARCHAR(100) DEFAULT 'general',
  
  -- Usage Tracking
  usage_count INTEGER DEFAULT 0,
  
  -- Timestamps
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS (Design System + Global Config)
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Branding
  site_name VARCHAR(255) DEFAULT 'Hello Gorgeous Med Spa',
  tagline VARCHAR(255),
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Colors
  color_primary VARCHAR(20) DEFAULT '#ec4899',   -- Pink
  color_secondary VARCHAR(20) DEFAULT '#000000', -- Black
  color_accent VARCHAR(20) DEFAULT '#ffffff',    -- White
  color_background VARCHAR(20) DEFAULT '#ffffff',
  color_text VARCHAR(20) DEFAULT '#1f2937',
  
  -- Typography
  font_heading VARCHAR(100) DEFAULT 'Inter',
  font_body VARCHAR(100) DEFAULT 'Inter',
  font_size_base INTEGER DEFAULT 16,
  
  -- Layout
  max_content_width INTEGER DEFAULT 1280,
  header_style VARCHAR(30) DEFAULT 'fixed',      -- fixed, sticky, static
  footer_style VARCHAR(30) DEFAULT 'standard',
  
  -- Contact
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  
  -- Social
  social_links JSONB DEFAULT '{}',
  
  -- Business Hours
  business_hours JSONB DEFAULT '{}',
  
  -- Feature Toggles (Site-Level)
  features JSONB DEFAULT '{}',
  
  -- SEO Defaults
  default_meta_title VARCHAR(255),
  default_meta_description TEXT,
  google_analytics_id VARCHAR(50),
  facebook_pixel_id VARCHAR(50),
  
  -- Maintenance
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT,
  
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Insert default settings
INSERT INTO cms_site_settings (id, site_name) 
VALUES (gen_random_uuid(), 'Hello Gorgeous Med Spa')
ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_page_versions_page ON cms_page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_promotions_active ON cms_promotions(is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_cms_media_folder ON cms_media(folder);
CREATE INDEX IF NOT EXISTS idx_cms_media_type ON cms_media(file_type);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_cms_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_pages_updated ON cms_pages;
CREATE TRIGGER cms_pages_updated BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_cms_timestamp();

DROP TRIGGER IF EXISTS cms_sections_updated ON cms_sections;
CREATE TRIGGER cms_sections_updated BEFORE UPDATE ON cms_sections
  FOR EACH ROW EXECUTE FUNCTION update_cms_timestamp();

DROP TRIGGER IF EXISTS cms_promotions_updated ON cms_promotions;
CREATE TRIGGER cms_promotions_updated BEFORE UPDATE ON cms_promotions
  FOR EACH ROW EXECUTE FUNCTION update_cms_timestamp();

-- Auto-version pages on update
CREATE OR REPLACE FUNCTION create_page_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
  FROM cms_page_versions WHERE page_id = OLD.id;
  
  -- Only create version if content changed
  IF OLD.sections IS DISTINCT FROM NEW.sections OR 
     OLD.title IS DISTINCT FROM NEW.title OR
     OLD.meta_title IS DISTINCT FROM NEW.meta_title THEN
    INSERT INTO cms_page_versions (
      page_id, version_number, title, slug, 
      meta_title, meta_description, sections, created_by
    ) VALUES (
      OLD.id, next_version, OLD.title, OLD.slug,
      OLD.meta_title, OLD.meta_description, OLD.sections, NEW.updated_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS page_version_trigger ON cms_pages;
CREATE TRIGGER page_version_trigger BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION create_page_version();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_ctas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_site_settings ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access" ON cms_pages FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_page_versions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_sections FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_navigation FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_promotions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_ctas FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_media FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON cms_site_settings FOR ALL TO service_role USING (true);

-- Public read for published content
CREATE POLICY "Public read published pages" ON cms_pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active promos" ON cms_promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active nav" ON cms_navigation FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings" ON cms_site_settings FOR SELECT USING (true);
CREATE POLICY "Public read media" ON cms_media FOR SELECT USING (true);

-- ============================================================
-- SEED DATA (Default Sections)
-- ============================================================
INSERT INTO cms_sections (name, type, content, is_template) VALUES
  ('Hero - Default', 'hero', '{"headline": "Welcome to Hello Gorgeous", "subheadline": "Your Premier Medical Spa", "cta_text": "Book Now", "cta_url": "/book"}', true),
  ('Services Grid', 'services_grid', '{"title": "Our Services", "columns": 3, "show_prices": true}', true),
  ('Testimonials', 'testimonials', '{"title": "What Our Clients Say", "display": "carousel"}', true),
  ('FAQ Section', 'faq', '{"title": "Frequently Asked Questions"}', true),
  ('Promo Banner', 'promo_banner', '{"style": "gradient"}', true),
  ('Provider Bios', 'providers', '{"title": "Meet Our Team", "display": "grid"}', true),
  ('Booking Widget', 'booking', '{"title": "Schedule Your Appointment"}', true),
  ('Contact Section', 'contact', '{"show_map": true, "show_hours": true}', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE cms_pages IS 'Website pages managed through Owner Mode CMS';
COMMENT ON TABLE cms_page_versions IS 'Version history for page rollback';
COMMENT ON TABLE cms_sections IS 'Reusable content sections/blocks';
COMMENT ON TABLE cms_navigation IS 'Site navigation menus';
COMMENT ON TABLE cms_promotions IS 'Marketing promotions and offers';
COMMENT ON TABLE cms_ctas IS 'Call-to-action buttons configuration';
COMMENT ON TABLE cms_media IS 'Centralized media library';
COMMENT ON TABLE cms_site_settings IS 'Global site settings and design system';
