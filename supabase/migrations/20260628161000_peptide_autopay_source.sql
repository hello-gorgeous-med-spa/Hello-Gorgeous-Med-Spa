-- Hims-compete Phase 4 — peptide monthly auto-pay ledger source

alter table public.hg_rx_payment_ledger
  drop constraint if exists hg_rx_payment_ledger_source_check;

alter table public.hg_rx_payment_ledger
  add constraint hg_rx_payment_ledger_source_check check (source in (
    'staff_invoice',
    'glp1_checkout',
    'glp1_autopay',
    'peptide_checkout',
    'peptide_autopay',
    'manual',
    'clinic_terminal',
    'clinic_cash',
    'clinic_autopay'
  ));
