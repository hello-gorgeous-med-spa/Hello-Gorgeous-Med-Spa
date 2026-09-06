-- REGEN RX partner / affiliate program (med spas, day spas, creators).
-- Commissions are a marketing referral fee — never tied to a prescription.

create table if not exists public.regen_affiliates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  partner_type text not null
    check (partner_type in ('med_spa', 'day_spa', 'creator')),
  status text not null default 'applied'
    check (status in ('applied', 'pending', 'active', 'paused', 'terminated')),
  legal_name text not null,
  email text not null unique,
  phone text,
  business_name text,
  website text,
  audience text,
  illinois_ack boolean not null default false,
  agreement_version text,
  agreement_signed_at timestamptz,
  agreement_signature text,
  payout_method text,
  payout_details text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text
);

create index if not exists idx_regen_affiliates_status
  on public.regen_affiliates (status, created_at desc);
create index if not exists idx_regen_affiliates_email
  on public.regen_affiliates (email);

create table if not exists public.regen_affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.regen_affiliates(id) on delete cascade,
  code text not null,
  path text,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists idx_regen_affiliate_clicks_aff
  on public.regen_affiliate_clicks (affiliate_id, created_at desc);

create table if not exists public.regen_affiliate_attributions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.regen_affiliates(id) on delete cascade,
  code text not null,
  patient_email_hash text,
  first_touch_at timestamptz not null default now(),
  signup_at timestamptz,
  intake_id text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_regen_affiliate_attr_email
  on public.regen_affiliate_attributions (affiliate_id, patient_email_hash)
  where patient_email_hash is not null;

create table if not exists public.regen_affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.regen_affiliates(id) on delete cascade,
  kind text not null check (kind in ('recurring_percent', 'intake_bonus')),
  status text not null default 'holding'
    check (status in ('holding', 'payable', 'paid', 'void')),
  amount_usd numeric(10,2) not null,
  basis_usd numeric(10,2),
  month_index integer,
  order_reference text,
  intake_id text,
  patient_email_hash text,
  payable_at timestamptz,
  paid_at timestamptz,
  paid_by text,
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_regen_aff_comm_order
  on public.regen_affiliate_commissions (kind, order_reference)
  where order_reference is not null
    and kind = 'recurring_percent'
    and status <> 'void';

create unique index if not exists idx_regen_aff_comm_intake
  on public.regen_affiliate_commissions (affiliate_id, kind, patient_email_hash)
  where kind = 'intake_bonus'
    and patient_email_hash is not null
    and status <> 'void';

create index if not exists idx_regen_aff_comm_status
  on public.regen_affiliate_commissions (affiliate_id, status, created_at desc);

create table if not exists public.regen_affiliate_login_tokens (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.regen_affiliates(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.regen_orders
  add column if not exists affiliate_code text;

alter table public.regen_intakes
  add column if not exists affiliate_code text;

create index if not exists idx_regen_orders_affiliate_code
  on public.regen_orders (affiliate_code)
  where affiliate_code is not null;

create index if not exists idx_regen_intakes_affiliate_code
  on public.regen_intakes (affiliate_code)
  where affiliate_code is not null;

alter table public.regen_affiliates enable row level security;
alter table public.regen_affiliate_clicks enable row level security;
alter table public.regen_affiliate_attributions enable row level security;
alter table public.regen_affiliate_commissions enable row level security;
alter table public.regen_affiliate_login_tokens enable row level security;

comment on table public.regen_affiliates is
  'REGEN RX partner program. Referral fee only — never tied to a clinical decision.';
comment on column public.regen_affiliate_attributions.patient_email_hash is
  'SHA-256 of lowercase email. Partners never see PHI.';
