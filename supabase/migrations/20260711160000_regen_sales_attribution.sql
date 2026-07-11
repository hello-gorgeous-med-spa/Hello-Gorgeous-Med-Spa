-- RE GEN sales attribution — who sold what (online staff-assisted + in-clinic)

alter table public.regen_orders
  add column if not exists sold_by_user_id uuid,
  add column if not exists sold_by_email text,
  add column if not exists sales_channel text not null default 'online'
    check (sales_channel in ('online', 'staff_portal', 'staff_assisted'));

alter table public.hg_rx_clinic_encounters
  add column if not exists sold_by_user_id uuid,
  add column if not exists sold_by_email text;

create index if not exists idx_regen_orders_sold_by
  on public.regen_orders (sold_by_user_id, created_at desc)
  where sold_by_user_id is not null;

create index if not exists idx_regen_orders_sales_channel
  on public.regen_orders (sales_channel, created_at desc);

create index if not exists idx_hg_rx_clinic_encounters_sold_by
  on public.hg_rx_clinic_encounters (sold_by_user_id, created_at desc)
  where sold_by_user_id is not null;

comment on column public.regen_orders.sold_by_user_id is 'Staff user who assisted or sold the order (null = self-serve online)';
comment on column public.regen_orders.sales_channel is 'online = patient checkout; staff_portal = admin catalog; staff_assisted = staff helped on public site';
comment on column public.hg_rx_clinic_encounters.sold_by_user_id is 'Staff credited for in-clinic RE GEN catalog sale';
