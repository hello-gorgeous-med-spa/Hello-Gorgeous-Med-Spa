-- =============================================================================
-- Run once in Supabase → SQL Editor if you see:
--   relation "public.hg_form_templates" does not exist
-- Creates form tables + RLS, then seeds general-intake, luxora-consent,
-- solaria-co2-consent, and morpheus8-consent.
-- Requires: public.clients, public.appointments (for FKs). If a FK fails, say which.
-- =============================================================================

-- Helper used by RLS policies (server uses service role for API)
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('role', true) = 'service_role'
     OR current_setting('request.jwt.claim.role', true) = 'service_role'
$$;

-- ── Form templates
CREATE TABLE IF NOT EXISTS public.hg_form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  schema_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  trigger_service_slug text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Submissions
CREATE TABLE IF NOT EXISTS public.hg_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.hg_form_templates(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  access_token text UNIQUE,
  responses_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  signer_name text,
  signature_data text,
  client_phone text,
  submitter_ip text,
  user_agent text,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_form_submissions_template ON public.hg_form_submissions (template_id);
CREATE INDEX IF NOT EXISTS idx_hg_form_submissions_submitted ON public.hg_form_submissions (submitted_at DESC);

-- RLS: only service role (Next.js server with SUPABASE_SERVICE_ROLE_KEY) reads/writes
ALTER TABLE public.hg_form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hg_form_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to hg_form_templates" ON public.hg_form_templates;
CREATE POLICY "Service role full access to hg_form_templates" ON public.hg_form_templates
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to hg_form_submissions" ON public.hg_form_submissions;
CREATE POLICY "Service role full access to hg_form_submissions" ON public.hg_form_submissions
  FOR ALL USING (public.is_service_role());

-- Seed: general intake (optional; safe if re-run)
INSERT INTO public.hg_form_templates (slug, title, schema_json)
VALUES (
  'general-intake',
  'General intake',
  '[
    {"id":"full_name","label":"Full legal name","type":"text","required":true},
    {"id":"dob","label":"Date of birth","type":"text","required":true},
    {"id":"allergies","label":"Allergies or sensitivities","type":"textarea","required":false},
    {"id":"medications","label":"Current medications","type":"textarea","required":false},
    {"id":"consent","label":"I confirm the information above is accurate.","type":"checkbox","required":true}
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Seed: Luxora (iframe body lives in /docs/luxora/ — keep schema_json empty)
INSERT INTO public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
VALUES (
  'luxora-consent',
  'Luxora — Informed Consent (verbatim source in /docs/luxora/)',
  '[]'::jsonb,
  'luxora',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_active = true;

-- Seed: Solaria CO₂ + Morpheus8 (iframe body in public/docs/… — keep schema_json empty)
INSERT INTO public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
VALUES
  (
    'solaria-co2-consent',
    'Solaria CO₂ — Informed Consent (verbatim source in /docs/solaria/)',
    '[]'::jsonb,
    'solaria-co2',
    true
  ),
  (
    'morpheus8-consent',
    'Morpheus8 — Informed Consent (verbatim source in /docs/morpheus8/)',
    '[]'::jsonb,
    'morpheus8',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_active = true;

-- Verify
SELECT id, slug, title, is_active FROM public.hg_form_templates ORDER BY slug;
