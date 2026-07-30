-- Allow clients to decline a proposal; accepted_option already exists.
ALTER TABLE treatment_proposals
  DROP CONSTRAINT IF EXISTS treatment_proposals_status_check;

ALTER TABLE treatment_proposals
  ADD CONSTRAINT treatment_proposals_status_check
  CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'));

ALTER TABLE treatment_proposals
  ADD COLUMN IF NOT EXISTS declined_at TIMESTAMPTZ;
