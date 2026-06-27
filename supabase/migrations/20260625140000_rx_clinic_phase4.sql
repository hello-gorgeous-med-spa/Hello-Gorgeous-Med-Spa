-- Phase 4: appointment link + monthly autopay for in-person clinic RX

alter table public.hg_rx_clinic_encounters
  add column if not exists appointment_id uuid references public.appointments(id) on delete set null,
  add column if not exists autopay_status text not null default 'none' check (autopay_status in (
    'none',
    'pending',
    'active',
    'cancelled'
  )),
  add column if not exists autopay_payment_url text,
  add column if not exists autopay_ledger_id uuid references public.hg_rx_payment_ledger(id) on delete set null,
  add column if not exists autopay_enrolled_at timestamptz;

create index if not exists idx_hg_rx_clinic_encounters_appointment
  on public.hg_rx_clinic_encounters (appointment_id)
  where appointment_id is not null;

alter table public.hg_rx_payment_ledger
  drop constraint if exists hg_rx_payment_ledger_source_check;

alter table public.hg_rx_payment_ledger
  add constraint hg_rx_payment_ledger_source_check check (source in (
    'staff_invoice',
    'glp1_checkout',
    'glp1_autopay',
    'peptide_checkout',
    'manual',
    'clinic_terminal',
    'clinic_cash',
    'clinic_autopay'
  ));
