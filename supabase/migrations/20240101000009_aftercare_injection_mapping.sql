-- ============================================================
-- MIGRATION 008: Aftercare Instructions & Injection Mapping
-- Aesthetic Record-style clinical features
-- ============================================================

-- ============================================================
-- PART 1: Aftercare Instructions
-- ============================================================

-- Aftercare templates - one per service (or default)
CREATE TABLE IF NOT EXISTS public.aftercare_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- Rich text / markdown
  send_via VARCHAR(50) DEFAULT 'email', -- email, sms, both
  send_delay_minutes INT DEFAULT 0, -- 0 = immediately after checkout
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Allow one template per service, or null for default
  UNIQUE(service_id)
);

-- Log of sent aftercare instructions
CREATE TABLE IF NOT EXISTS public.aftercare_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  appointment_id UUID REFERENCES public.appointments(id),
  template_id UUID REFERENCES public.aftercare_templates(id),
  service_name VARCHAR(255),
  sent_via VARCHAR(50),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  content_snapshot TEXT, -- Copy of what was sent
  delivery_status VARCHAR(50) DEFAULT 'sent' -- sent, delivered, failed
);

-- ============================================================
-- PART 2: Injection Mapping
-- ============================================================

-- Injection map records - one per treatment/visit
CREATE TABLE IF NOT EXISTS public.injection_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_record_id UUID REFERENCES public.treatment_records(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  provider_id UUID REFERENCES public.providers(id),
  
  -- Metadata
  diagram_type VARCHAR(50) DEFAULT 'face_front', -- face_front, face_side_left, face_side_right, body
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual injection points on the map
CREATE TABLE IF NOT EXISTS public.injection_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injection_map_id UUID NOT NULL REFERENCES public.injection_maps(id) ON DELETE CASCADE,
  
  -- Position on diagram (0-100 percentage based)
  x_position DECIMAL(5,2) NOT NULL, -- 0-100
  y_position DECIMAL(5,2) NOT NULL, -- 0-100
  
  -- Injection details
  product_name VARCHAR(255) NOT NULL, -- e.g., "Botox", "Juvederm Ultra"
  product_id UUID REFERENCES public.inventory_items(id), -- Link to inventory if available
  lot_number VARCHAR(100),
  expiration_date DATE,
  
  -- Dosage
  units DECIMAL(6,2), -- For neurotoxins (e.g., 20 units)
  volume_ml DECIMAL(5,2), -- For fillers (e.g., 1.0 ml)
  
  -- Technique
  injection_depth VARCHAR(50), -- superficial, mid, deep, periosteal
  technique VARCHAR(100), -- linear threading, fanning, bolus, serial puncture
  
  -- Area label
  area_label VARCHAR(100), -- e.g., "Glabella", "Crow's feet R", "Nasolabial fold L"
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PART 3: Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_aftercare_templates_service ON public.aftercare_templates(service_id);
CREATE INDEX IF NOT EXISTS idx_aftercare_sent_client ON public.aftercare_sent(client_id);
CREATE INDEX IF NOT EXISTS idx_aftercare_sent_appointment ON public.aftercare_sent(appointment_id);
CREATE INDEX IF NOT EXISTS idx_injection_maps_client ON public.injection_maps(client_id);
CREATE INDEX IF NOT EXISTS idx_injection_maps_appointment ON public.injection_maps(appointment_id);
CREATE INDEX IF NOT EXISTS idx_injection_points_map ON public.injection_points(injection_map_id);

-- ============================================================
-- PART 4: RLS Policies
-- ============================================================

ALTER TABLE public.aftercare_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftercare_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injection_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injection_points ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "Service role full access to aftercare_templates" ON public.aftercare_templates;
DROP POLICY IF EXISTS "Service role full access to aftercare_sent" ON public.aftercare_sent;
DROP POLICY IF EXISTS "Service role full access to injection_maps" ON public.injection_maps;
DROP POLICY IF EXISTS "Service role full access to injection_points" ON public.injection_points;

-- Service role access
CREATE POLICY "Service role full access to aftercare_templates" ON public.aftercare_templates
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access to aftercare_sent" ON public.aftercare_sent
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access to injection_maps" ON public.injection_maps
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access to injection_points" ON public.injection_points
  FOR ALL USING (public.is_service_role());

-- ============================================================
-- PART 5: Default Aftercare Templates
-- ============================================================

INSERT INTO public.aftercare_templates (service_id, name, content, send_via) VALUES
(NULL, 'General Treatment Aftercare', E'# Aftercare Instructions\n\nThank you for visiting Hello Gorgeous Med Spa!\n\n## General Guidelines\n- Avoid touching the treated area for 4-6 hours\n- Stay hydrated\n- Avoid strenuous exercise for 24 hours\n- Contact us if you have any concerns\n\n**Questions?** Call us at (555) 123-4567', 'email')
ON CONFLICT (service_id) DO NOTHING;

-- ============================================================
-- PART 6: Trigger for updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_aftercare_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS aftercare_templates_updated ON public.aftercare_templates;
CREATE TRIGGER aftercare_templates_updated
  BEFORE UPDATE ON public.aftercare_templates
  FOR EACH ROW EXECUTE FUNCTION update_aftercare_timestamp();

DROP TRIGGER IF EXISTS injection_maps_updated ON public.injection_maps;
CREATE TRIGGER injection_maps_updated
  BEFORE UPDATE ON public.injection_maps
  FOR EACH ROW EXECUTE FUNCTION update_aftercare_timestamp();
