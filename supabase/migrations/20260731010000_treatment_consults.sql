-- ============================================================
-- Treatment Consults — upstream of treatment_proposals
-- Staff Consult Room: screen → educate → recommend → propose
-- ============================================================

CREATE TABLE IF NOT EXISTS public.treatment_consults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_id TEXT,
  vertical TEXT NOT NULL DEFAULT 'weight_loss' CHECK (
    vertical IN ('weight_loss', 'injectables', 'morpheus8', 'other')
  ),
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'screening', 'educated', 'proposed', 'closed', 'disqualified')
  ),
  concern_tags TEXT[] NOT NULL DEFAULT '{}',
  screening JSONB NOT NULL DEFAULT '{}'::jsonb,
  education_progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendation JSONB NOT NULL DEFAULT '{}'::jsonb,
  proposal_id UUID REFERENCES public.treatment_proposals(id) ON DELETE SET NULL,
  internal_notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_treatment_consults_created_at
  ON public.treatment_consults(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_treatment_consults_status
  ON public.treatment_consults(status);
CREATE INDEX IF NOT EXISTS idx_treatment_consults_vertical
  ON public.treatment_consults(vertical);
CREATE INDEX IF NOT EXISTS idx_treatment_consults_proposal_id
  ON public.treatment_consults(proposal_id);

CREATE OR REPLACE FUNCTION public.touch_treatment_consult_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_treatment_consults_updated_at ON public.treatment_consults;
CREATE TRIGGER tr_treatment_consults_updated_at
  BEFORE UPDATE ON public.treatment_consults
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_treatment_consult_updated_at();

ALTER TABLE public.treatment_consults ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff read treatment_consults" ON public.treatment_consults;
CREATE POLICY "Staff read treatment_consults"
  ON public.treatment_consults
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

DROP POLICY IF EXISTS "Staff write treatment_consults" ON public.treatment_consults;
CREATE POLICY "Staff write treatment_consults"
  ON public.treatment_consults
  FOR ALL
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.treatment_consults TO authenticated;
GRANT ALL ON public.treatment_consults TO service_role;
