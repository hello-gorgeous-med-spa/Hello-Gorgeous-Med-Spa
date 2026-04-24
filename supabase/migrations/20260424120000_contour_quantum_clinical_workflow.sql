-- ============================================================
-- Contour Lift / Quantum RF — clinical workflow (intake, consent, treatment, photos, post-care)
-- RLS: service_role only; app uses server API + admin session checks.
-- ============================================================

-- Case status (admin-manual pipeline)
CREATE TABLE IF NOT EXISTS public.cl_quantum_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  procedure_type TEXT NOT NULL DEFAULT 'contour_lift_quantum_rf',
  -- Denormalized for quick list views (kept in sync on link)
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'new_inquiry',
  scheduled_at TIMESTAMPTZ,
  model_event_date DATE,
  admin_notes_internal TEXT,
  created_by_user_id TEXT,
  CONSTRAINT cl_quantum_cases_status_check CHECK (status IN (
    'new_inquiry',
    'needs_review',
    'candidate',
    'not_candidate',
    'scheduled',
    'intake_sent',
    'consent_signed',
    'treated',
    'followup_needed',
    'completed'
  ))
);

CREATE INDEX IF NOT EXISTS idx_cl_quantum_cases_lead ON public.cl_quantum_cases(lead_id);
CREATE INDEX IF NOT EXISTS idx_cl_quantum_cases_client ON public.cl_quantum_cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cl_quantum_cases_status ON public.cl_quantum_cases(status);
CREATE INDEX IF NOT EXISTS idx_cl_quantum_cases_email ON public.cl_quantum_cases(LOWER(TRIM(email)));
CREATE INDEX IF NOT EXISTS idx_cl_quantum_cases_created ON public.cl_quantum_cases(created_at DESC);

COMMENT ON TABLE public.cl_quantum_cases IS 'One clinical journey per Contour/Quantum lead or client; status pipeline for admin.';

-- Intake (versioned JSON payload — Luxora-aligned fields live in app + answers JSONB)
CREATE TABLE IF NOT EXISTS public.cl_intake_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cl_quantum_cases(id) ON DELETE CASCADE,
  form_version TEXT NOT NULL DEFAULT '1.0.0',
  answers JSONB NOT NULL DEFAULT '{}',
  contraindication_yes_list TEXT[] DEFAULT '{}',
  requires_provider_review BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  submitted_by_client BOOLEAN NOT NULL DEFAULT false,
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cl_intake_case ON public.cl_intake_forms(case_id);
CREATE INDEX IF NOT EXISTS idx_cl_intake_submitted ON public.cl_intake_forms(submitted_at DESC);

-- Model day acknowledgments (separate from medical; marketing flags separated in consent)
CREATE TABLE IF NOT EXISTS public.cl_model_day_acks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cl_quantum_cases(id) ON DELETE CASCADE,
  form_version TEXT NOT NULL DEFAULT '1.0.0',
  ack_reduced_pricing BOOLEAN,
  ack_clinical_model_day BOOLEAN,
  ack_provider_ryan_kent BOOLEAN,
  ack_md_supervision BOOLEAN,
  ack_before_after_photos BOOLEAN,
  ack_marketing_photo_video BOOLEAN,
  ack_internal_documentation_photos BOOLEAN,
  ack_results_vary BOOLEAN,
  ack_candidacy_not_guaranteed BOOLEAN,
  signed_at TIMESTAMPTZ,
  signer_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cl_model_day_case ON public.cl_model_day_acks(case_id);

-- Informed consent (immutable row per signing; amend = new row with supersedes_id)
CREATE TABLE IF NOT EXISTS public.cl_consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cl_quantum_cases(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  form_version TEXT NOT NULL DEFAULT '1.0.0',
  supersedes_id UUID REFERENCES public.cl_consent_records(id) ON DELETE SET NULL,
  snapshot_json JSONB NOT NULL,
  patient_signature_b64_hash TEXT,
  patient_signed_at TIMESTAMPTZ,
  witness_user_id TEXT,
  witness_signature_b64_hash TEXT,
  witness_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cl_consent_type_check CHECK (consent_type IN (
    'quantum_rf_informed',
    'model_day',
    'marketing_media',
    'other'
  ))
);

CREATE INDEX IF NOT EXISTS idx_cl_consent_case ON public.cl_consent_records(case_id);
CREATE INDEX IF NOT EXISTS idx_cl_consent_type ON public.cl_consent_records(consent_type);

-- Treatment record (face or body template as JSONB for flexibility)
CREATE TABLE IF NOT EXISTS public.cl_treatment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cl_quantum_cases(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  form_version TEXT NOT NULL DEFAULT '1.0.0',
  record_json JSONB NOT NULL DEFAULT '{}',
  adverse_events TEXT,
  provider_user_id TEXT,
  provider_signature_b64_hash TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cl_treatment_type_check CHECK (record_type IN ('face_neck', 'body'))
);

CREATE INDEX IF NOT EXISTS idx_cl_treatment_case ON public.cl_treatment_records(case_id);

-- Photos
CREATE TABLE IF NOT EXISTS public.cl_procedure_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cl_quantum_cases(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  taken_at TIMESTAMPTZ,
  treatment_area TEXT,
  internal_only BOOLEAN NOT NULL DEFAULT true,
  marketing_approved BOOLEAN NOT NULL DEFAULT false,
  consent_for_marketing BOOLEAN,
  created_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cl_photo_category_check CHECK (category IN (
    'before', 'marking', 'during', 'immediately_after', 'follow_up', 'marketing_approved'
  ))
);

CREATE INDEX IF NOT EXISTS idx_cl_photos_case ON public.cl_procedure_photos(case_id);

-- Post-care delivery log
CREATE TABLE IF NOT EXISTS public.cl_postcare_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cl_quantum_cases(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  template_version TEXT NOT NULL DEFAULT '1.0.0',
  to_email TEXT,
  to_phone_last4 TEXT,
  link_token_hash TEXT,
  sent_at TIMESTAMPTZ,
  sent_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cl_postcare_channel_check CHECK (channel IN ('email', 'sms', 'portal'))
);

CREATE INDEX IF NOT EXISTS idx_cl_postcare_case ON public.cl_postcare_deliveries(case_id);
CREATE INDEX IF NOT EXISTS idx_cl_postcare_sent ON public.cl_postcare_deliveries(sent_at DESC);

-- Audit (no PHI in summary — store action + ids only; detail in app if needed)
CREATE TABLE IF NOT EXISTS public.cl_clinical_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cl_quantum_cases(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  actor_user_id TEXT,
  summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cl_audit_case ON public.cl_clinical_audit_log(case_id);
CREATE INDEX IF NOT EXISTS idx_cl_audit_created ON public.cl_clinical_audit_log(created_at DESC);

-- RLS: deny direct public access; service role + backend only
ALTER TABLE public.cl_quantum_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_model_day_acks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_procedure_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_postcare_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cl_clinical_audit_log ENABLE ROW LEVEL SECURITY;

DO $pol$
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'cl_quantum_cases','cl_intake_forms','cl_model_day_acks','cl_consent_records',
    'cl_treatment_records','cl_procedure_photos','cl_postcare_deliveries','cl_clinical_audit_log'
  ])::text
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "service role full %s" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "service role full %s" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END$pol$;

-- Optional: one case per lead (unique) where lead is set
CREATE UNIQUE INDEX IF NOT EXISTS idx_cl_case_one_per_lead
  ON public.cl_quantum_cases(lead_id) WHERE lead_id IS NOT NULL;
