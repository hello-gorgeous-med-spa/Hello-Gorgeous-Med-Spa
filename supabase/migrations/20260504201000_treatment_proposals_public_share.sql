-- ============================================================
-- Treatment proposals: public share identifiers
-- ============================================================

ALTER TABLE public.treatment_proposals
  ADD COLUMN IF NOT EXISTS public_id TEXT;

UPDATE public.treatment_proposals
SET public_id = encode(gen_random_bytes(10), 'hex')
WHERE public_id IS NULL OR btrim(public_id) = '';

ALTER TABLE public.treatment_proposals
  ALTER COLUMN public_id SET DEFAULT encode(gen_random_bytes(10), 'hex');

ALTER TABLE public.treatment_proposals
  ALTER COLUMN public_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_treatment_proposals_public_id
  ON public.treatment_proposals(public_id);
