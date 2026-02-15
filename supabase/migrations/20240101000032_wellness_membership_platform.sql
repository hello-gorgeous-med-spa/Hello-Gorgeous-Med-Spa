-- ============================================================
-- WELLNESS MEMBERSHIP PLATFORM
-- Precision Hormone Program + Metabolic Reset Program
-- ============================================================

-- 1. MEMBERSHIP PROGRAMS (Precision Hormone, Metabolic Reset)
CREATE TABLE IF NOT EXISTS public.membership_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  benefits JSONB DEFAULT '[]',
  price_cents INTEGER NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
  wellness_credits_per_period INTEGER DEFAULT 0,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_membership_programs_slug ON public.membership_programs(slug);
CREATE INDEX IF NOT EXISTS idx_membership_programs_active ON public.membership_programs(is_active);

-- 2. MEMBER SUBSCRIPTIONS (links client/user to program)
CREATE TABLE IF NOT EXISTS public.member_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.membership_programs(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  wellness_credit_balance INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_member_subscriptions_client ON public.member_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_user ON public.member_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_status ON public.member_subscriptions(status);

-- 3. LAB UPLOADS (member labs with OCR + AI)
CREATE TABLE IF NOT EXISTS public.member_lab_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name TEXT,
  extracted_data_json JSONB,
  ai_insights_markdown TEXT,
  ai_insights_json JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_member_lab_uploads_client ON public.member_lab_uploads(client_id);
CREATE INDEX IF NOT EXISTS idx_member_lab_uploads_uploaded ON public.member_lab_uploads(uploaded_at DESC);

-- 4. MEMBER MEDICATIONS (prescriptions, peptides, IVs)
CREATE TABLE IF NOT EXISTS public.member_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  med_name TEXT NOT NULL,
  dosage TEXT,
  unit TEXT DEFAULT 'units',
  category TEXT CHECK (category IN ('hormone', 'peptide', 'iv', 'supplement', 'other')),
  start_date DATE,
  end_date DATE,
  refill_status TEXT DEFAULT 'active' CHECK (refill_status IN ('active', 'pending', 'refilled', 'expired')),
  refill_requested_at TIMESTAMPTZ,
  fullscript_product_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_medications_client ON public.member_medications(client_id);
CREATE INDEX IF NOT EXISTS idx_member_medications_refill ON public.member_medications(refill_status);

-- 5. MEMBER MESSAGES (secure provider chat)
CREATE TABLE IF NOT EXISTS public.member_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  provider_id UUID,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'provider', 'system')),
  message_body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_messages_client ON public.member_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_member_messages_sent ON public.member_messages(sent_at DESC);

-- 6. MEMBER APPOINTMENTS (extends appointments - telehealth links, visit summaries)
-- We use existing appointments table; add columns if needed via separate migration
-- For visit summaries, we can use clinical_notes or a new member_visit_summaries table
CREATE TABLE IF NOT EXISTS public.member_visit_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  summary_markdown TEXT,
  action_items JSONB DEFAULT '[]',
  telehealth_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_visit_summaries_client ON public.member_visit_summaries(client_id);

-- 7. AUDIT LOG for PHI access
CREATE TABLE IF NOT EXISTS public.member_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  actor_id UUID,
  actor_type TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_audit_client ON public.member_audit_log(client_id);
CREATE INDEX IF NOT EXISTS idx_member_audit_created ON public.member_audit_log(created_at DESC);

-- 8. SEED DEFAULT PROGRAMS
INSERT INTO public.membership_programs (slug, name, description, benefits, price_cents, billing_cycle, wellness_credits_per_period)
VALUES
  ('precision-hormone', 'Precision Hormone Program', 'Comprehensive hormone optimization with quarterly labs, AI insights, and personalized care.', '["Quarterly lab panels","AI-powered lab interpretation","Doctor prep questions","Telehealth visits","Medication management"]'::jsonb, 19900, 'monthly', 4),
  ('metabolic-reset', 'Metabolic Reset Program', 'GLP-1 weight loss support with ongoing monitoring, nutrition guidance, and wellness credits.', '["Medical weight loss oversight","Quarterly check-ins","AI lab insights","Wellness credit pool","Supplement integration"]'::jsonb, 14900, 'monthly', 3)
ON CONFLICT (slug) DO NOTHING;

-- 9. RLS POLICIES (service_role bypasses; members see own data)
ALTER TABLE public.member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_lab_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_visit_summaries ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access member_subscriptions" ON public.member_subscriptions
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access member_lab_uploads" ON public.member_lab_uploads
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access member_medications" ON public.member_medications
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access member_messages" ON public.member_messages
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access member_visit_summaries" ON public.member_visit_summaries
  FOR ALL USING (public.is_service_role());
