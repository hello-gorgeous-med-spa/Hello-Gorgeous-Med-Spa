-- Allow treatment proposal invoices on the RX payment ledger track.
ALTER TABLE public.hg_rx_payment_ledger
  DROP CONSTRAINT IF EXISTS hg_rx_payment_ledger_track_check;

ALTER TABLE public.hg_rx_payment_ledger
  ADD CONSTRAINT hg_rx_payment_ledger_track_check
  CHECK (track IS NULL OR track IN ('weight-loss', 'peptides', 'fees', 'proposals'));
