-- M9: RX Ops compliance & go-live gates (HGRX-100–103)

create table if not exists public.hg_rx_vendor_baas (
  id uuid primary key default gen_random_uuid(),
  vendor_key text not null unique,
  vendor_name text not null,
  category text not null,
  touches_phi boolean not null default true,
  status text not null default 'pending'
    check (status in ('pending', 'signed', 'expired', 'not_required')),
  signed_at date,
  renewal_due date,
  document_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hg_rx_security_reviews (
  id uuid primary key default gen_random_uuid(),
  review_key text not null unique,
  title text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'complete', 'remediated')),
  completed_at date,
  vendor_name text,
  critical_open integer not null default 0,
  high_open integer not null default 0,
  report_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hg_rx_licensed_states (
  state_code char(2) primary key,
  licensed boolean not null default false,
  provider_name text,
  license_number text,
  expires_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hg_rx_uat_signoffs (
  role text primary key check (role in ('owner', 'provider', 'front_desk')),
  signed_by_email text not null,
  signed_by_name text,
  signed_at timestamptz not null default now(),
  notes text
);

create table if not exists public.hg_rx_ops_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.hg_rx_vendor_baas (vendor_key, vendor_name, category, touches_phi, status)
values
  ('vercel', 'Vercel', 'hosting', true, 'pending'),
  ('supabase', 'Supabase', 'hosting', true, 'pending'),
  ('square', 'Square', 'payments', true, 'pending'),
  ('formulation_rx', 'Formulation Rx', 'pharmacy', true, 'pending'),
  ('boomrx', 'BoomRx', 'pharmacy', true, 'pending'),
  ('olympia', 'Olympia Pharmacy', 'pharmacy', true, 'pending'),
  ('twilio', 'Twilio', 'sms', true, 'pending'),
  ('resend', 'Resend', 'email', true, 'pending'),
  ('fresha', 'Fresha', 'telehealth', true, 'pending')
on conflict (vendor_key) do nothing;

insert into public.hg_rx_security_reviews (review_key, title, status)
values ('annual_pen_test', 'Annual penetration test / security review', 'pending')
on conflict (review_key) do nothing;

insert into public.hg_rx_licensed_states (state_code, licensed, provider_name, notes)
values ('IL', true, 'Ryan Kent, FNP-BC', 'Illinois APRN — default telehealth state')
on conflict (state_code) do nothing;

insert into public.hg_rx_ops_config (key, value)
values
  ('controlled_substances', '{"dea_verified": false, "pmp_enabled": false}'::jsonb),
  ('go_live', '{"sample_data_acknowledged": false}'::jsonb)
on conflict (key) do nothing;

alter table public.hg_rx_vendor_baas enable row level security;
alter table public.hg_rx_security_reviews enable row level security;
alter table public.hg_rx_licensed_states enable row level security;
alter table public.hg_rx_uat_signoffs enable row level security;
alter table public.hg_rx_ops_config enable row level security;

drop policy if exists "Service role full access to hg_rx_vendor_baas" on public.hg_rx_vendor_baas;
create policy "Service role full access to hg_rx_vendor_baas" on public.hg_rx_vendor_baas
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_security_reviews" on public.hg_rx_security_reviews;
create policy "Service role full access to hg_rx_security_reviews" on public.hg_rx_security_reviews
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_licensed_states" on public.hg_rx_licensed_states;
create policy "Service role full access to hg_rx_licensed_states" on public.hg_rx_licensed_states
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_uat_signoffs" on public.hg_rx_uat_signoffs;
create policy "Service role full access to hg_rx_uat_signoffs"
  on public.hg_rx_uat_signoffs for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_ops_config" on public.hg_rx_ops_config;
create policy "Service role full access to hg_rx_ops_config" on public.hg_rx_ops_config
  for all using (public.is_service_role());
