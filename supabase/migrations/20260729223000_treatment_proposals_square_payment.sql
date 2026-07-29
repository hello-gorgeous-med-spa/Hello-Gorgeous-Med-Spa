-- Treatment proposals: Square payment sync (deposit / full)
ALTER TABLE public.treatment_proposals
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'pending', 'deposit_paid', 'paid', 'refunded')),
  ADD COLUMN IF NOT EXISTS payment_kind TEXT
    CHECK (payment_kind IS NULL OR payment_kind IN ('deposit', 'full')),
  ADD COLUMN IF NOT EXISTS payment_option_name TEXT,
  ADD COLUMN IF NOT EXISTS payment_amount_usd NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS payment_url TEXT,
  ADD COLUMN IF NOT EXISTS square_payment_link_id TEXT,
  ADD COLUMN IF NOT EXISTS square_order_id TEXT,
  ADD COLUMN IF NOT EXISTS square_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ledger_id UUID REFERENCES public.hg_rx_payment_ledger(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_treatment_proposals_square_order
  ON public.treatment_proposals (square_order_id)
  WHERE square_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_treatment_proposals_payment_status
  ON public.treatment_proposals (payment_status);

-- Allow treatment proposals in the RX payment ledger source enum
ALTER TABLE public.hg_rx_payment_ledger
  DROP CONSTRAINT IF EXISTS hg_rx_payment_ledger_source_check;

ALTER TABLE public.hg_rx_payment_ledger
  ADD CONSTRAINT hg_rx_payment_ledger_source_check CHECK (source IN (
    'staff_invoice',
    'glp1_checkout',
    'glp1_autopay',
    'peptide_checkout',
    'peptide_autopay',
    'manual',
    'clinic_terminal',
    'clinic_cash',
    'clinic_autopay',
    'treatment_proposal'
  ));
