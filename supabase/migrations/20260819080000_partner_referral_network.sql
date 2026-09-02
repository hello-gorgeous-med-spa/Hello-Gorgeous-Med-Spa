-- Partner referral network (Dr. Arora doors + day-spa QR partners).
-- Patients become Hello Gorgeous / RE GEN patients. Referring spas do not
-- store, inject, or sell medication. Payouts fire on first paid med order.

create table if not exists public.partner_networks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  md_name text,
  md_fee_usd numeric(10,2) not null default 1500,
  network_fee_usd numeric(10,2) not null default 500,
  override_usd numeric(10,2) not null default 25,
  spa_first_order_usd numeric(10,2) not null default 100,
  kickoff_usd numeric(10,2) not null default 250,
  status text not null default 'proposed'
    check (status in ('proposed', 'active', 'paused')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_locations (
  id uuid primary key default gen_random_uuid(),
  network_id uuid not null references public.partner_networks(id) on delete cascade,
  slug text not null unique,
  name text not null,
  city text,
  contact_name text,
  contact_email text,
  contact_phone text,
  directed_by_md boolean not null default true,
  payouts_enabled boolean not null default true,
  status text not null default 'draft'
    check (status in ('draft', 'live', 'paused')),
  referral_agreement_signed_at timestamptz,
  kickoff_at timestamptz,
  scan_count integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_locations_network
  on public.partner_locations (network_id, status);

create table if not exists public.partner_attributions (
  id uuid primary key default gen_random_uuid(),
  network_id uuid not null references public.partner_networks(id) on delete cascade,
  location_id uuid not null references public.partner_locations(id) on delete cascade,
  code text not null,
  customer_email text,
  customer_phone text,
  customer_name text,
  first_touch_at timestamptz not null default now(),
  order_reference text,
  first_paid_med_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_partner_attributions_location
  on public.partner_attributions (location_id, created_at desc);

create index if not exists idx_partner_attributions_email
  on public.partner_attributions (customer_email)
  where customer_email is not null;

create index if not exists idx_partner_attributions_order
  on public.partner_attributions (order_reference)
  where order_reference is not null;

create table if not exists public.partner_payouts (
  id uuid primary key default gen_random_uuid(),
  kind text not null
    check (kind in (
      'spa_first_order',
      'md_override',
      'kickoff',
      'md_retainer',
      'network_retainer'
    )),
  network_id uuid not null references public.partner_networks(id) on delete cascade,
  location_id uuid references public.partner_locations(id) on delete set null,
  attribution_id uuid references public.partner_attributions(id) on delete set null,
  order_reference text,
  customer_email text,
  payee text not null check (payee in ('spa', 'md')),
  payee_name text not null,
  amount_usd numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'void')),
  period_month date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  paid_by text
);

create unique index if not exists idx_partner_payouts_order_kind
  on public.partner_payouts (kind, order_reference)
  where order_reference is not null
    and kind in ('spa_first_order', 'md_override')
    and status <> 'void';

create unique index if not exists idx_partner_payouts_first_order_email
  on public.partner_payouts (customer_email)
  where kind = 'spa_first_order'
    and customer_email is not null
    and status <> 'void';

create unique index if not exists idx_partner_payouts_kickoff_location
  on public.partner_payouts (location_id)
  where kind = 'kickoff'
    and location_id is not null
    and status <> 'void';

create unique index if not exists idx_partner_payouts_retainer_month
  on public.partner_payouts (kind, network_id, period_month)
  where kind in ('md_retainer', 'network_retainer')
    and period_month is not null
    and status <> 'void';

create index if not exists idx_partner_payouts_status
  on public.partner_payouts (status, created_at desc);

alter table public.regen_orders
  add column if not exists partner_code text,
  add column if not exists partner_location_id uuid references public.partner_locations(id) on delete set null;

create index if not exists idx_regen_orders_partner_code
  on public.regen_orders (partner_code)
  where partner_code is not null;

alter table public.partner_networks enable row level security;
alter table public.partner_locations enable row level security;
alter table public.partner_attributions enable row level security;
alter table public.partner_payouts enable row level security;

comment on table public.partner_networks is
  'MD / channel partner (e.g. Dr. Arora). Clinical partner, not equity.';
comment on table public.partner_locations is
  'Referring spa doors. QR /go/{slug}. Referral only — they do not practice peptide medicine.';
comment on table public.partner_payouts is
  'Ledger: $100 spa + $25 MD override on first paid med; $250 kickoff; $1500 MD + $500 network retainers.';
comment on column public.regen_orders.partner_code is
  'First-touch partner location slug from /go/{code} cookie.';

insert into public.partner_networks (slug, name, md_name, status, notes)
values (
  'arora',
  'Dr. Arora referral network',
  'Dr. Mukesh Arora, MD',
  'proposed',
  'Medical Director of Hello Gorgeous at $1,500/mo. Network retainer $500/mo once the first of his spas is live as a referral door. Ryan Kent, FNP-BC reviews every RE GEN chart.'
)
on conflict (slug) do nothing;

insert into public.partner_locations (network_id, slug, name, city, directed_by_md, payouts_enabled, status, notes)
select
  n.id,
  v.slug,
  v.name,
  null,
  true,
  true,
  'draft',
  'Rename with the real spa name before printing QR cards. Directed by Dr. Arora — $25 override applies.'
from public.partner_networks n
cross join (values
  ('arora-1', 'Partner spa 1'),
  ('arora-2', 'Partner spa 2'),
  ('arora-3', 'Partner spa 3'),
  ('arora-4', 'Partner spa 4'),
  ('arora-5', 'Partner spa 5')
) as v(slug, name)
where n.slug = 'arora'
on conflict (slug) do nothing;
