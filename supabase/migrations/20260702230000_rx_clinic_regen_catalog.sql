-- In-clinic RE GEN catalog sales (peptides, wellness, hormones upsells at terminal)

alter table public.hg_rx_clinic_encounters
  add column if not exists sale_mode text not null default 'glp1'
    check (sale_mode in ('glp1', 'regen_catalog')),
  add column if not exists line_items jsonb not null default '[]'::jsonb,
  add column if not exists shipping_usd numeric(12, 2) not null default 0;

-- RE GEN multi-product sales do not use GLP-1 dose tiers
alter table public.hg_rx_clinic_encounters
  alter column medication drop not null,
  alter column dose_tier_id drop not null;

alter table public.hg_rx_clinic_encounters
  drop constraint if exists hg_rx_clinic_encounters_encounter_type_check;

alter table public.hg_rx_clinic_encounters
  add constraint hg_rx_clinic_encounters_encounter_type_check check (encounter_type in (
    'new_consult',
    'refill',
    'dose_change',
    'regen_in_clinic'
  ));

create index if not exists idx_hg_rx_clinic_encounters_sale_mode
  on public.hg_rx_clinic_encounters (sale_mode, created_at desc);

comment on column public.hg_rx_clinic_encounters.sale_mode is 'glp1 = weight-loss tier sale; regen_catalog = in-clinic RE GEN product cart';
comment on column public.hg_rx_clinic_encounters.line_items is 'RE GEN catalog line items when sale_mode = regen_catalog';
