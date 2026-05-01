-- Missed-call text-back dedupe columns on ai_concierge_calls.
-- /api/ai-concierge/voice/dial-status writes here when ring-first falls through
-- (busy / no-answer / failed / canceled) to ensure each missed caller is
-- texted at most once per inbound CallSid.

ALTER TABLE public.ai_concierge_calls
  ADD COLUMN IF NOT EXISTS missed_sms_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS missed_sms_message_id TEXT;

CREATE INDEX IF NOT EXISTS idx_ai_concierge_calls_missed_sms_sent_at
  ON public.ai_concierge_calls (missed_sms_sent_at)
  WHERE missed_sms_sent_at IS NOT NULL;
