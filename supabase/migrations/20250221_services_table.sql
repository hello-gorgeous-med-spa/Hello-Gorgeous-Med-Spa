-- ============================================================
-- SERVICES & SERVICE CATEGORIES TABLES
-- Required for Admin → Services page
-- ============================================================

-- Create service_categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  price_cents INT DEFAULT 0,
  price_display TEXT,
  duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  requires_consult BOOLEAN DEFAULT false,
  requires_consent BOOLEAN DEFAULT true,
  allow_online_booking BOOLEAN DEFAULT true,
  provider_ids UUID[],
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);

-- RLS Policies
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Anyone can read services and categories (public menu)
CREATE POLICY service_categories_read ON service_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY services_read ON services FOR SELECT TO anon, authenticated USING (true);

-- Service role and authenticated users with admin role can write
CREATE POLICY service_categories_write ON service_categories FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.email = current_setting('request.jwt.claim.email', true) 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY services_write ON services FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.email = current_setting('request.jwt.claim.email', true) 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- Service role full access
CREATE POLICY service_categories_service_role ON service_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY services_service_role ON services FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON service_categories TO authenticated;
GRANT ALL ON service_categories TO service_role;
GRANT SELECT ON service_categories TO anon;

GRANT ALL ON services TO authenticated;
GRANT ALL ON services TO service_role;
GRANT SELECT ON services TO anon;

-- ============================================================
-- SEED DEFAULT CATEGORIES
-- ============================================================
INSERT INTO service_categories (id, name, slug, display_order) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Injectables', 'injectables', 1),
  ('11111111-1111-1111-1111-111111111002', 'Dermal Fillers', 'dermal-fillers', 2),
  ('11111111-1111-1111-1111-111111111003', 'Weight Loss', 'weight-loss', 3),
  ('11111111-1111-1111-1111-111111111004', 'Skin Treatments', 'skin-treatments', 4),
  ('11111111-1111-1111-1111-111111111005', 'IV Therapy', 'iv-therapy', 5),
  ('11111111-1111-1111-1111-111111111006', 'Laser Treatments', 'laser-treatments', 6),
  ('11111111-1111-1111-1111-111111111007', 'Wellness', 'wellness', 7),
  ('11111111-1111-1111-1111-111111111008', 'Consultations', 'consultations', 8)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED SOLARIA CO2 SERVICES
-- ============================================================
INSERT INTO services (id, name, slug, short_description, description, category_id, price_cents, price_display, duration_minutes, is_active, requires_consult, requires_consent, allow_online_booking) VALUES
  ('22222222-2222-2222-2222-222222222022', 'Solaria CO₂ Fractional Laser - Full Face', 'solaria-co2-full-face', 'Gold standard skin resurfacing', 'Advanced fractional CO₂ laser treatment for deep wrinkles, acne scars, sun damage, and skin tightening. Dramatic results with one treatment.', '11111111-1111-1111-1111-111111111006', 150000, 'From $1,500', 90, true, true, true, false),
  ('22222222-2222-2222-2222-222222222023', 'Solaria CO₂ Fractional Laser - Neck', 'solaria-co2-neck', 'Neck rejuvenation & tightening', 'Fractional CO₂ laser treatment for neck lines, crepey skin, and tightening.', '11111111-1111-1111-1111-111111111006', 80000, 'From $800', 60, true, true, true, false),
  ('22222222-2222-2222-2222-222222222024', 'Solaria CO₂ Fractional Laser - Eyes/Periorbital', 'solaria-co2-eyes', 'Crow''s feet & eyelid rejuvenation', 'Precision CO₂ treatment for crow''s feet, eyelid laxity, and periorbital wrinkles.', '11111111-1111-1111-1111-111111111006', 60000, 'From $600', 45, true, true, true, false),
  ('22222222-2222-2222-2222-222222222025', 'Solaria CO₂ Fractional Laser - Full Face + Neck', 'solaria-co2-face-neck', 'Complete facial & neck resurfacing', 'Comprehensive CO₂ laser treatment for face and neck. Maximum transformation.', '11111111-1111-1111-1111-111111111006', 200000, 'From $2,000', 120, true, true, true, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  price_display = EXCLUDED.price_display,
  is_active = EXCLUDED.is_active;
