-- ============================================================
-- UNIFIED LEAD & CLIENT INTELLIGENCE (Hello Gorgeous Client Intelligence Engine™)
-- Phase 1: Database architecture
-- - Extend clients with LTV, Square link, source, tags
-- - leads table for all capture points
-- - square_sync_log for sync status
-- ============================================================

-- 1. CLIENTS — add columns for single source of truth (email/phone may exist from 20240101000019)
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS square_customer_id TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS total_lifetime_value_cents BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS total_visits INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS last_visit_date TIMESTAMPTZ;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_email_unique
  ON public.clients(LOWER(TRIM(email)))
  WHERE email IS NOT NULL AND TRIM(email) <> '';

CREATE INDEX IF NOT EXISTS idx_clients_square_customer_id ON public.clients(square_customer_id) WHERE square_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_source ON public.clients(source) WHERE source IS NOT NULL;

COMMENT ON COLUMN public.clients.source IS 'website, instagram, facebook, AI-roadmap, hormone-AI, face-blueprint, square, pos, booking, etc.';
COMMENT ON COLUMN public.clients.total_lifetime_value_cents IS 'Sum of completed payment amounts (cents) for LTV';
COMMENT ON COLUMN public.clients.tags IS 'Auto or manual tags: Hormone Prospect, Aesthetic Prospect, Neuro Client, etc.';

-- 2. LEADS — all capture points (contact form, roadmap, hormone, face, quiz, social)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  phone TEXT,
  full_name TEXT,
  source TEXT NOT NULL,
  lead_type TEXT NOT NULL,
  session_id TEXT,
  converted_to_client BOOLEAN NOT NULL DEFAULT false,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  CONSTRAINT leads_lead_type_check CHECK (lead_type IN (
    'contact_form', 'roadmap', 'hormone', 'face', 'quiz', 'social', 'concern', 'subscribe', 'waitlist', 'other'
  ))
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(LOWER(TRIM(email)));
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_converted ON public.leads(converted_to_client) WHERE converted_to_client = true;
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON public.leads(client_id) WHERE client_id IS NOT NULL;

COMMENT ON TABLE public.leads IS 'Unified lead capture: website, AI tools, social, quiz. Links to clients when converted.';

-- 3. SQUARE SYNC LOG — track Square customer ↔ client sync
CREATE TABLE IF NOT EXISTS public.square_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  square_customer_id TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  last_synced_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_square_sync_log_square_id ON public.square_sync_log(square_customer_id);
CREATE INDEX IF NOT EXISTS idx_square_sync_log_client_id ON public.square_sync_log(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_square_sync_log_status ON public.square_sync_log(sync_status);

COMMENT ON TABLE public.square_sync_log IS 'Tracks Square customer sync to clients for Client Intelligence Engine';

-- RLS (service role can do everything)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.square_sync_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role leads" ON public.leads;
CREATE POLICY "Service role leads" ON public.leads FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role square_sync_log" ON public.square_sync_log;
CREATE POLICY "Service role square_sync_log" ON public.square_sync_log FOR ALL TO service_role USING (true);
