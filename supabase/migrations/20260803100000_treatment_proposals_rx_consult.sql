-- Add rx_requires_consult flag to treatment_proposals
-- Proposals containing GLP-1, peptides, or hormone therapy require
-- medical consultation before self-checkout / payment link generation.

ALTER TABLE public.treatment_proposals
  ADD COLUMN IF NOT EXISTS rx_requires_consult BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_treatment_proposals_rx_consult
  ON public.treatment_proposals(rx_requires_consult)
  WHERE rx_requires_consult = true;

COMMENT ON COLUMN public.treatment_proposals.rx_requires_consult IS 'True when proposal contains GLP-1, peptides, or hormone therapy — blocks self-checkout until NP consult';
