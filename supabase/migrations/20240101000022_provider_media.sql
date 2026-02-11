-- ============================================================
-- PROVIDER PROFILES & MEDIA LIBRARY
-- Powers /providers hub + authority galleries
-- ============================================================

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_media_type') THEN
    CREATE TYPE provider_media_type AS ENUM ('video', 'before_after');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_media_status') THEN
    CREATE TYPE provider_media_status AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_service_tag') THEN
    CREATE TYPE provider_service_tag AS ENUM (
      'botox',
      'lip_filler',
      'prp',
      'hormone_therapy',
      'weight_loss',
      'microneedling',
      'laser',
      'other'
    );
  END IF;
END $$;

-- ------------------------------------------------------------
-- PROVIDER PROFILE ENHANCEMENTS
-- ------------------------------------------------------------
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS headshot_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS short_bio TEXT,
  ADD COLUMN IF NOT EXISTS philosophy TEXT,
  ADD COLUMN IF NOT EXISTS intro_video_url TEXT,
  ADD COLUMN IF NOT EXISTS booking_url TEXT,
  ADD COLUMN IF NOT EXISTS schema_meta JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_providers_slug_not_null ON providers(slug) WHERE slug IS NOT NULL;

-- ------------------------------------------------------------
-- PROVIDER MEDIA TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS provider_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  media_type provider_media_type NOT NULL,
  status provider_media_status NOT NULL DEFAULT 'draft',
  service_tag provider_service_tag NOT NULL DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  thumbnail_url TEXT,
  alt_text TEXT,
  duration_seconds INT,
  width INT,
  height INT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN NOT NULL DEFAULT false,
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  watermark_enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

ALTER TABLE provider_media
  ADD CONSTRAINT chk_provider_media_video
    CHECK (
      (media_type = 'video' AND video_url IS NOT NULL)
      OR media_type <> 'video'
    ),
  ADD CONSTRAINT chk_provider_media_before_after
    CHECK (
      (media_type = 'before_after' AND before_image_url IS NOT NULL AND after_image_url IS NOT NULL)
      OR media_type <> 'before_after'
    );

CREATE INDEX IF NOT EXISTS idx_provider_media_provider ON provider_media(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_media_status ON provider_media(status);
CREATE INDEX IF NOT EXISTS idx_provider_media_service_tag ON provider_media(service_tag);
CREATE INDEX IF NOT EXISTS idx_provider_media_featured ON provider_media(featured) WHERE featured = true;

-- Auto update updated_at
CREATE OR REPLACE FUNCTION touch_provider_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_provider_media_timestamps ON provider_media;
CREATE TRIGGER trg_provider_media_timestamps
  BEFORE UPDATE ON provider_media
  FOR EACH ROW
  EXECUTE FUNCTION touch_provider_media_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
ALTER TABLE provider_media ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to provider media"
  ON provider_media
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Admin / owner access
CREATE POLICY "Admins manage provider media"
  ON provider_media
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- Public read for published media
CREATE POLICY "Public can view published provider media"
  ON provider_media
  FOR SELECT
  USING (status = 'published' AND consent_confirmed = true);

-- ------------------------------------------------------------
-- STORAGE BUCKET FOR PROVIDER MEDIA
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-media', 'provider-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read provider media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-media');

CREATE POLICY "Service role full access provider media bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'provider-media' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'provider-media' AND auth.role() = 'service_role');

-- ------------------------------------------------------------
-- SEED CANONICAL PROVIDERS
-- ------------------------------------------------------------
INSERT INTO providers (id, user_id, slug, display_name, tagline, headshot_url, hero_image_url, short_bio, philosophy, intro_video_url, booking_url, credentials, color_hex, is_active)
VALUES
  (
    'b7e6f872-3628-418a-aefb-aca2101f7cb2',
    'b7e6f872-3628-418a-aefb-aca2101f7cb2',
    'danielle',
    'Danielle Alcala, RN-S',
    'Precision injectables + concierge-level care',
    'https://hellogorgeousmedspa.com/images/team/danielle.png',
    'https://hellogorgeousmedspa.com/images/gallery/treatment-1.png',
    'Founder & aesthetic expert obsessed with personalized, confidence-building outcomes.',
    'Every plan should feel luxurious, safe, and obsessed with your goals.',
    'https://hellogorgeousmedspa.com/videos/mascots/founder/founder-vision.mp4',
    '/book?provider=danielle',
    'RN-S, Licensed CNA, CMAA, Phlebotomist, Licensed Esthetician, Business Owner',
    '#ec4899',
    true
  ),
  (
    '47ab9361-4a68-4ab8-a860-c9c9fd64d26c',
    '47ab9361-4a68-4ab8-a860-c9c9fd64d26c',
    'ryan',
    'Ryan Kent, FNP-BC',
    'Full-practice authority NP | metabolic & regenerative care',
    'https://hellogorgeousmedspa.com/images/team/ryan-kent.png',
    'https://hellogorgeousmedspa.com/images/gallery/treatment-2.png',
    'Nurse Practitioner leading hormone optimization, weight loss, and regenerative protocols.',
    'Medical weight loss and hormone therapy built around safety, labs, and data.',
    'https://hellogorgeousmedspa.com/videos/mascots/ryan/ryan-intro.mp4',
    '/book?provider=ryan',
    'FNP-BC',
    '#3b82f6',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  tagline = EXCLUDED.tagline,
  headshot_url = EXCLUDED.headshot_url,
  hero_image_url = EXCLUDED.hero_image_url,
  short_bio = EXCLUDED.short_bio,
  philosophy = EXCLUDED.philosophy,
  intro_video_url = EXCLUDED.intro_video_url,
  booking_url = EXCLUDED.booking_url,
  credentials = COALESCE(EXCLUDED.credentials, providers.credentials),
  color_hex = COALESCE(EXCLUDED.color_hex, providers.color_hex),
  is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------
-- SEED SAMPLE MEDIA
-- ------------------------------------------------------------
INSERT INTO provider_media (
  provider_id,
  media_type,
  status,
  service_tag,
  title,
  description,
  before_image_url,
  after_image_url,
  thumbnail_url,
  alt_text,
  featured,
  consent_confirmed,
  watermark_enabled,
  sort_order
) VALUES
  (
    'b7e6f872-3628-418a-aefb-aca2101f7cb2',
    'before_after',
    'published',
    'lip_filler',
    'Balanced lip refresh',
    'Subtle volume restoration with softened borders.',
    'https://hellogorgeousmedspa.com/images/gallery/before-after.png',
    'https://hellogorgeousmedspa.com/images/gallery/treatment-3.png',
    'https://hellogorgeousmedspa.com/images/gallery/before-after.png',
    'Before and after lip filler by Danielle Alcala',
    true,
    true,
    true,
    1
  ),
  (
    '47ab9361-4a68-4ab8-a860-c9c9fd64d26c',
    'before_after',
    'published',
    'weight_loss',
    'Medical weight loss milestone',
    'GLP-1 guided weight loss with metabolic lab oversight.',
    'https://hellogorgeousmedspa.com/images/gallery/treatment-1.png',
    'https://hellogorgeousmedspa.com/images/gallery/treatment-2.png',
    'https://hellogorgeousmedspa.com/images/gallery/treatment-2.png',
    'Before and after medical weight loss by Ryan Kent',
    false,
    true,
    true,
    1
  )
ON CONFLICT DO NOTHING;

-- Log success
DO $$ BEGIN
  RAISE NOTICE 'Provider media schema ready.';
END $$;
