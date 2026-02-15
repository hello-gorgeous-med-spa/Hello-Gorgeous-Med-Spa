-- ============================================================
-- CLIENT PORTAL - Part 4: Notifications, Aftercare, Photos
-- ============================================================

-- Client Notifications
CREATE TABLE IF NOT EXISTS client_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  action_url TEXT,
  action_label VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'normal',
  category VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_dismissed BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_client ON client_notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_notification_unread ON client_notifications(client_id, is_read) WHERE is_read = false;

-- Aftercare Instructions Library
CREATE TABLE IF NOT EXISTS aftercare_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID,
  treatment_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  instructions JSONB NOT NULL DEFAULT '[]',
  warnings TEXT[],
  immediate_care TEXT,
  first_24_hours TEXT,
  first_week TEXT,
  emergency_signs TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aftercare_treatment ON aftercare_instructions(treatment_type);

-- Client Aftercare Assignments
CREATE TABLE IF NOT EXISTS client_aftercare (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID,
  aftercare_id UUID REFERENCES aftercare_instructions(id),
  custom_notes TEXT,
  provider_notes TEXT,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_aftercare_client ON client_aftercare(client_id);

-- Treatment Photos
CREATE TABLE IF NOT EXISTS treatment_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID,
  photo_type VARCHAR(20) NOT NULL,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  treatment_area VARCHAR(100),
  treatment_type VARCHAR(100),
  notes TEXT,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days_post_treatment INTEGER,
  client_visible BOOLEAN DEFAULT true,
  consent_for_marketing BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treatment_photos_client ON treatment_photos(client_id);

-- RLS
ALTER TABLE client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE aftercare_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_aftercare ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role notifications" ON client_notifications;
CREATE POLICY "Service role notifications" ON client_notifications FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role aftercare_lib" ON aftercare_instructions;
CREATE POLICY "Service role aftercare_lib" ON aftercare_instructions FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role client_aftercare" ON client_aftercare;
CREATE POLICY "Service role client_aftercare" ON client_aftercare FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role photos" ON treatment_photos;
CREATE POLICY "Service role photos" ON treatment_photos FOR ALL TO service_role USING (true);

-- Seed default aftercare
INSERT INTO aftercare_instructions (treatment_type, title, summary, instructions, warnings, immediate_care, first_24_hours, first_week, emergency_signs)
VALUES 
('botox', 'Botox Aftercare', 'Important guidelines after Botox.', '[{"step":1,"text":"Stay upright 4 hours"},{"step":2,"text":"No rubbing treated areas"},{"step":3,"text":"No exercise 24 hours"}]', ARRAY['No massaging', 'Contact us for drooping'], 'Stay upright, dont touch injection sites.', 'Avoid exercise, alcohol, lying face down.', 'Results appear in 3-5 days, full effect at 2 weeks.', ARRAY['Severe headache', 'Difficulty breathing', 'Vision changes']),
('filler', 'Dermal Filler Aftercare', 'Care after filler treatment.', '[{"step":1,"text":"Ice to reduce swelling"},{"step":2,"text":"Sleep elevated 2 nights"},{"step":3,"text":"No exercise 48 hours"}]', ARRAY['Swelling is normal', 'Avoid dental work 2 weeks'], 'Apply ice. Swelling increases first 24-48 hours.', 'Continue icing. No makeup on injection sites.', 'Swelling subsides. Final results at 2 weeks.', ARRAY['Severe pain', 'White/blue skin', 'Vision changes']),
('laser', 'Laser Aftercare', 'Post-laser care.', '[{"step":1,"text":"Apply healing ointment"},{"step":2,"text":"Avoid sun, use SPF 30+"},{"step":3,"text":"No hot showers 48 hours"}]', ARRAY['Redness expected', 'Avoid retinoids 1 week'], 'Skin may feel sunburned. Apply cooling gel.', 'Apply ointment. Avoid makeup if skin broken.', 'Redness fades. Do not pick peeling skin.', ARRAY['Blistering', 'Signs of infection', 'Extreme pain']),
('weight_loss', 'Weight Loss Injection Care', 'After your GLP-1 injection.', '[{"step":1,"text":"Eat small frequent meals"},{"step":2,"text":"Drink 64oz water daily"},{"step":3,"text":"Avoid high-fat foods"}]', ARRAY['Nausea is common', 'Contact us for severe vomiting'], 'Rest after injection. Site may be sore.', 'Start with bland foods. Nausea improves over time.', 'Continue healthy eating. Track progress.', ARRAY['Severe abdominal pain', 'Persistent vomiting', 'Allergic reaction'])
ON CONFLICT DO NOTHING;
