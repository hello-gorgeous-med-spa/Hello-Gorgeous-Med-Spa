-- ============================================================
-- CMS CONTENT TABLE - Database-driven content management
-- ============================================================

CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT 'global',
  content JSONB NOT NULL DEFAULT '{}',
  content_type TEXT NOT NULL DEFAULT 'json',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_content_key ON cms_content(key);
CREATE INDEX IF NOT EXISTS idx_cms_content_page ON cms_content(page);

-- RLS
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cms_content_read ON cms_content;
DROP POLICY IF EXISTS cms_content_write ON cms_content;

CREATE POLICY cms_content_read ON cms_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY cms_content_write ON cms_content FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT SELECT ON cms_content TO anon, authenticated;
GRANT ALL ON cms_content TO service_role;

-- ============================================================
-- AUDIT LOGS TABLE - Track all system actions
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- RLS - Only service role can read/write (Owner access via API)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_logs_service ON audit_logs;
CREATE POLICY audit_logs_service ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON audit_logs TO service_role;

-- ============================================================
-- SEED DEFAULT CMS CONTENT
-- ============================================================

INSERT INTO cms_content (key, label, page, content) VALUES
  ('homepage_hero', 'Homepage Hero Section', 'homepage', '{"headline": "Luxury Aesthetics. Real Results.", "subheadline": "Medical-grade treatments delivered with care", "cta_text": "Book Now", "cta_link": "/book"}'),
  ('contact_info', 'Contact Information', 'global', '{"phone": "630-636-6193", "text_phone": "630-881-3398", "email": "hellogorgeousskin@yahoo.com", "address": "74 W. Washington Street, Oswego, IL 60543"}'),
  ('business_hours', 'Business Hours', 'global', '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 7:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "By Appointment", "sunday": "Closed"}'),
  ('announcement_banner', 'Announcement Banner', 'global', '{"text": "Can''t get in with your doctor? We have same-day appointments!", "link": "/book", "link_text": "Book Now", "is_visible": true, "bg_color": "#FF2D8E"}')
ON CONFLICT (key) DO NOTHING;
