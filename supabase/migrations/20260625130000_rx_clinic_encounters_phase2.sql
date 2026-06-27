-- Phase 2: clinic encounter chart link, shipping tracking, dispatch shipped status

alter table public.hg_rx_clinic_encounters
  add column if not exists chart_note_id uuid references public.chart_notes(id) on delete set null,
  add column if not exists tracking_number text,
  add column if not exists carrier text,
  add column if not exists shipped_at timestamptz;

create index if not exists idx_hg_rx_clinic_encounters_chart_note
  on public.hg_rx_clinic_encounters (chart_note_id)
  where chart_note_id is not null;

alter table public.hg_rx_clinic_encounters
  drop constraint if exists hg_rx_clinic_encounters_dispatch_status_check;

alter table public.hg_rx_clinic_encounters
  add constraint hg_rx_clinic_encounters_dispatch_status_check check (dispatch_status in (
    'new',
    'reviewed',
    'sent',
    'shipped'
  ));
