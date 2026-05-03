-- ============================================================
-- LEAD NURTURE TRACKING
-- Track automated nurture sequence progress for leads
-- ============================================================

-- Add nurture tracking columns to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS nurture_step INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS nurture_last_sent_at TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS nurture_completed_at TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.leads.nurture_step IS '0=not started, 1=welcome sent, 2=day2 email, 3=day5 sms, 4=complete';
COMMENT ON COLUMN public.leads.nurture_last_sent_at IS 'Timestamp of last nurture message sent';
COMMENT ON COLUMN public.leads.nurture_completed_at IS 'When nurture sequence completed (or lead converted)';
COMMENT ON COLUMN public.leads.sms_opt_in IS 'Whether lead opted in to SMS marketing';

-- Index for efficient nurture queries
CREATE INDEX IF NOT EXISTS idx_leads_nurture_pending 
  ON public.leads(nurture_step, nurture_last_sent_at) 
  WHERE converted_to_client = false AND nurture_completed_at IS NULL;

-- Log table for nurture outreach (separate from agent_winback_log for clarity)
CREATE TABLE IF NOT EXISTS public.lead_nurture_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  channel TEXT NOT NULL, -- 'sms' or 'email'
  message_preview TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered BOOLEAN,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_lead_nurture_log_lead_id ON public.lead_nurture_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_nurture_log_sent_at ON public.lead_nurture_log(sent_at DESC);

ALTER TABLE public.lead_nurture_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role lead_nurture_log" ON public.lead_nurture_log;
CREATE POLICY "Service role lead_nurture_log" ON public.lead_nurture_log FOR ALL TO service_role USING (true);

-- Birthday campaign tracking (reuse for birthday agent)
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS birthday_month INTEGER;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS birthday_last_campaign_year INTEGER;

CREATE INDEX IF NOT EXISTS idx_clients_birthday_month 
  ON public.clients(birthday_month) 
  WHERE birthday_month IS NOT NULL;

COMMENT ON COLUMN public.clients.birthday_month IS 'Birth month (1-12) for birthday campaign';
COMMENT ON COLUMN public.clients.birthday_last_campaign_year IS 'Last year birthday campaign was sent (prevent duplicates)';
