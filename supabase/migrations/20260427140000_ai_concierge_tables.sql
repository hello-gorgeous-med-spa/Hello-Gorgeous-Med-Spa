-- AI Concierge (Twilio Voice + staff workflow) — Phase 1 tables
-- API routes use service_role (bypasses RLS). Authenticated org staff read via policies below.

-- ---------------------------------------------------------------------------
-- booking_requests: structured booking asks from AI calls (manual Fresha follow-up)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sid TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  service_requested TEXT NOT NULL,
  preferred_date TEXT,
  preferred_time TEXT,
  backup_datetime TEXT,
  is_new_client BOOLEAN NOT NULL DEFAULT true,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'cancelled', 'no_show')),
  booked_by TEXT,
  booked_at TIMESTAMPTZ,
  fresha_booking_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_call_sid ON public.booking_requests (call_sid);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON public.booking_requests (status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON public.booking_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_client_phone ON public.booking_requests (client_phone);

-- ---------------------------------------------------------------------------
-- ai_concierge_calls: per-call log (Twilio CallSid, transcript, recording)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_concierge_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sid TEXT NOT NULL UNIQUE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  duration_seconds INTEGER,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  status TEXT,
  transferred_to TEXT,
  transcript TEXT,
  summary TEXT,
  action_taken TEXT,
  booking_request_id UUID REFERENCES public.booking_requests (id) ON DELETE SET NULL,
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_concierge_calls_from_number ON public.ai_concierge_calls (from_number);
CREATE INDEX IF NOT EXISTS idx_ai_concierge_calls_started_at ON public.ai_concierge_calls (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_concierge_calls_status ON public.ai_concierge_calls (status);
CREATE INDEX IF NOT EXISTS idx_ai_concierge_calls_booking_request_id ON public.ai_concierge_calls (booking_request_id);

-- ---------------------------------------------------------------------------
-- ai_concierge_knowledge: FAQ snippets for RAG / prompt context
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_concierge_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_concierge_knowledge_category ON public.ai_concierge_knowledge (category);
CREATE INDEX IF NOT EXISTS idx_ai_concierge_knowledge_enabled ON public.ai_concierge_knowledge (enabled) WHERE enabled = true;

-- ---------------------------------------------------------------------------
-- ai_concierge_settings: key / JSON value (greeting, transfer number, voice, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_concierge_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers: updated_at
CREATE OR REPLACE FUNCTION public.touch_ai_concierge_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_ai_concierge_knowledge_updated ON public.ai_concierge_knowledge;
CREATE TRIGGER tr_ai_concierge_knowledge_updated
  BEFORE UPDATE ON public.ai_concierge_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_ai_concierge_updated_at();

DROP TRIGGER IF EXISTS tr_ai_concierge_settings_updated ON public.ai_concierge_settings;
CREATE TRIGGER tr_ai_concierge_settings_updated
  BEFORE UPDATE ON public.ai_concierge_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_ai_concierge_updated_at();

-- RLS: service_role bypasses. Staff (user_profiles) get SELECT; optional UPDATE on booking + calls.
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_concierge_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_concierge_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_concierge_settings ENABLE ROW LEVEL SECURITY;

-- Helper: org staff (single-tenant) — same pattern as other admin features
CREATE OR REPLACE FUNCTION public.is_org_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'staff', 'provider')
      AND is_active IS NOT FALSE
  );
$$;

-- booking_requests
CREATE POLICY "Staff read booking_requests"
  ON public.booking_requests
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

CREATE POLICY "Staff update booking_requests"
  ON public.booking_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

-- ai_concierge_calls
CREATE POLICY "Staff read ai_concierge_calls"
  ON public.ai_concierge_calls
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

CREATE POLICY "Staff update ai_concierge_calls"
  ON public.ai_concierge_calls
  FOR UPDATE
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

-- ai_concierge_knowledge
CREATE POLICY "Staff read ai_concierge_knowledge"
  ON public.ai_concierge_knowledge
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

CREATE POLICY "Staff update ai_concierge_knowledge"
  ON public.ai_concierge_knowledge
  FOR UPDATE
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

-- ai_concierge_settings
CREATE POLICY "Staff read ai_concierge_settings"
  ON public.ai_concierge_settings
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

CREATE POLICY "Staff update ai_concierge_settings"
  ON public.ai_concierge_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

COMMENT ON TABLE public.booking_requests IS 'AI / phone collected booking asks; staff books manually in Fresha.';
COMMENT ON TABLE public.ai_concierge_calls IS 'Twilio call logs, transcripts, links to recording.';
COMMENT ON TABLE public.ai_concierge_knowledge IS 'FAQ entries for AI concierge context.';
COMMENT ON TABLE public.ai_concierge_settings IS 'Org config JSON by setting_key.';

-- Grants: API uses service_role (insert/update). Staff JWT uses SELECT/UPDATE with RLS above.
GRANT ALL ON public.booking_requests TO service_role;
GRANT SELECT, UPDATE ON public.booking_requests TO authenticated;

GRANT ALL ON public.ai_concierge_calls TO service_role;
GRANT SELECT, UPDATE ON public.ai_concierge_calls TO authenticated;

GRANT ALL ON public.ai_concierge_knowledge TO service_role;
GRANT SELECT, UPDATE ON public.ai_concierge_knowledge TO authenticated;

GRANT ALL ON public.ai_concierge_settings TO service_role;
GRANT SELECT, UPDATE ON public.ai_concierge_settings TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_org_staff() TO authenticated;
