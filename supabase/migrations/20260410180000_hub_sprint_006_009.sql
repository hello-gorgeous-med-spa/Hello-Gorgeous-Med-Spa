-- HG_DEV_006 — Service packages (catalog + per-client balances)
-- HG_DEV_007 — Virtual check-in (QR → public /checkin)
-- HG_DEV_008 — Intake / consent form templates + submissions
-- HG_DEV_009 — Saved client segments (Command Center filters)

-- ── 007 Check-ins (audit log; appointments.checked_in_at is source for calendar) ──
create table if not exists public.hg_checkins (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  phone_normalized text,
  display_name text,
  checked_in_at timestamptz not null default now(),
  source text not null default 'qr_public'
);

create index if not exists idx_hg_checkins_time on public.hg_checkins (checked_in_at desc);
create index if not exists idx_hg_checkins_appointment on public.hg_checkins (appointment_id);

-- ── 006 Packages ──
create table if not exists public.hg_service_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  total_sessions int not null default 1,
  square_catalog_variation_id text,
  price_cents int,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.hg_client_packages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  hub_client_id text,
  package_id uuid not null references public.hg_service_packages(id) on delete restrict,
  sessions_remaining int not null,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz,
  square_order_id text,
  notes text,
  created_at timestamptz not null default now(),
  constraint hg_client_packages_some_client check (client_id is not null or hub_client_id is not null)
);

create index if not exists idx_hg_client_packages_client on public.hg_client_packages (client_id);
create index if not exists idx_hg_client_packages_hub on public.hg_client_packages (hub_client_id);

-- ── 008 Forms ──
create table if not exists public.hg_form_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  schema_json jsonb not null default '[]'::jsonb,
  trigger_service_slug text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.hg_form_submissions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.hg_form_templates(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  access_token text unique,
  responses_json jsonb not null default '{}'::jsonb,
  signer_name text,
  signature_data text,
  client_phone text,
  submitter_ip text,
  user_agent text,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_hg_form_submissions_template on public.hg_form_submissions (template_id);
create index if not exists idx_hg_form_submissions_submitted on public.hg_form_submissions (submitted_at desc);

-- ── 009 Segments ──
create table if not exists public.hg_segments (
  id bigserial primary key,
  user_key text not null check (user_key in ('dani', 'ryan')),
  name text not null,
  filters_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_segments_user on public.hg_segments (user_key);

-- Seed packages (editable in DB / future admin UI)
insert into public.hg_service_packages (slug, name, description, total_sessions, price_cents)
values
  ('morpheus8-trio', 'Morpheus8 × 3', 'Three Morpheus8 sessions — prepaid bundle', 3, 199900),
  ('glp1-kickstart-3mo', 'GLP-1 3-month kickstart', 'Three-month GLP-1 program — prepaid', 3, 0),
  ('trifecta', 'Trifecta package', 'Combined treatment bundle — sessions tracked in Hub', 6, 0)
on conflict (slug) do nothing;

-- Minimal intake template (fields rendered by app/forms/[slug])
insert into public.hg_form_templates (slug, title, schema_json)
values (
  'general-intake',
  'General intake',
  '[
    {"id":"full_name","label":"Full legal name","type":"text","required":true},
    {"id":"dob","label":"Date of birth","type":"text","required":true},
    {"id":"allergies","label":"Allergies or sensitivities","type":"textarea","required":false},
    {"id":"medications","label":"Current medications","type":"textarea","required":false},
    {"id":"consent","label":"I confirm the information above is accurate.","type":"checkbox","required":true}
  ]'::jsonb
)
on conflict (slug) do nothing;

-- RLS
alter table public.hg_checkins enable row level security;
alter table public.hg_service_packages enable row level security;
alter table public.hg_client_packages enable row level security;
alter table public.hg_form_templates enable row level security;
alter table public.hg_form_submissions enable row level security;
alter table public.hg_segments enable row level security;

drop policy if exists "Service role full access to hg_checkins" on public.hg_checkins;
create policy "Service role full access to hg_checkins" on public.hg_checkins
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_service_packages" on public.hg_service_packages;
create policy "Service role full access to hg_service_packages" on public.hg_service_packages
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_client_packages" on public.hg_client_packages;
create policy "Service role full access to hg_client_packages" on public.hg_client_packages
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_form_templates" on public.hg_form_templates;
create policy "Service role full access to hg_form_templates" on public.hg_form_templates
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_form_submissions" on public.hg_form_submissions;
create policy "Service role full access to hg_form_submissions" on public.hg_form_submissions
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_segments" on public.hg_segments;
create policy "Service role full access to hg_segments" on public.hg_segments
  for all using (public.is_service_role());
