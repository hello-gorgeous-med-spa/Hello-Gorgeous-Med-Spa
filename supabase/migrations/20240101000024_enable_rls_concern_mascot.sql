-- ============================================================
-- Enable RLS on concern_submissions and mascot_feedback
-- Resolves Supabase security linter warnings
-- ============================================================

ALTER TABLE IF EXISTS public.concern_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mascot_feedback ENABLE ROW LEVEL SECURITY;

-- Service role full access (API uses admin client)
DROP POLICY IF EXISTS "Service role full access to concern_submissions" ON public.concern_submissions;
CREATE POLICY "Service role full access to concern_submissions"
  ON public.concern_submissions
  FOR ALL
  USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to mascot_feedback" ON public.mascot_feedback;
CREATE POLICY "Service role full access to mascot_feedback"
  ON public.mascot_feedback
  FOR ALL
  USING (public.is_service_role());
