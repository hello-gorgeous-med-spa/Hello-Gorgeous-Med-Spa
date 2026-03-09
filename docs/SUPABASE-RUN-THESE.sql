-- ============================================================
-- COPY AND PASTE THIS INTO SUPABASE SQL EDITOR (Run once)
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- --------------- 1. ROOMS (for calendar room selection & double-book) ---------------
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON public.rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_display_order ON public.rooms(display_order);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access rooms" ON public.rooms;
CREATE POLICY "Service role full access rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

COMMENT ON TABLE public.rooms IS 'Treatment rooms for scheduling; used with provider to prevent double-book.';

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES public.rooms(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_appointments_room_id ON public.appointments(room_id);

INSERT INTO public.rooms (name, slug, is_active, display_order)
SELECT name, slug, is_active, display_order FROM (VALUES
  ('Room 1', 'room-1', true, 1),
  ('Room 2', 'room-2', true, 2),
  ('Room 3', 'room-3', true, 3)
) AS v(name, slug, is_active, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.rooms LIMIT 1);


-- --------------- 2. FREE CONSULTATION SERVICE (/book/consultation) ---------------
INSERT INTO services (
  name,
  slug,
  short_description,
  category_id,
  price_cents,
  price_display,
  duration_minutes,
  is_active,
  allow_online_booking,
  requires_consult
)
SELECT
  'Free Consultation',
  'consultation',
  'Not sure which treatment is right for you? Book a free consultation. Choose Ryan Kent, FNP-BC or Danielle Alcala, RN-S for a personalized plan.',
  (SELECT id FROM service_categories WHERE slug = 'consultations' LIMIT 1),
  0,
  'Free',
  30,
  true,
  true,
  false
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'consultation');


-- --------------- 3. CHART AUDITS & EMERGENCY LOG (compliance; optional) ---------------
-- Skip this block if you already ran provider_governance_phase3 or if protocols table doesn't exist yet.

CREATE TABLE IF NOT EXISTS public.chart_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id UUID,
  appointment_id UUID,
  audited_by_provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checklist_result JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chart_audits_audit_date ON public.chart_audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_chart_audits_audited_by ON public.chart_audits(audited_by_provider_id);

ALTER TABLE public.chart_audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access chart_audits" ON public.chart_audits;
CREATE POLICY "Service role full access chart_audits" ON public.chart_audits FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.emergency_response_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID,
  protocol_slug TEXT,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_by_provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  patient_id UUID,
  outcome TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_response_log_used_at ON public.emergency_response_log(used_at);
CREATE INDEX IF NOT EXISTS idx_emergency_response_log_protocol ON public.emergency_response_log(protocol_id);

ALTER TABLE public.emergency_response_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access emergency_response_log" ON public.emergency_response_log;
CREATE POLICY "Service role full access emergency_response_log" ON public.emergency_response_log FOR ALL TO service_role USING (true) WITH CHECK (true);
