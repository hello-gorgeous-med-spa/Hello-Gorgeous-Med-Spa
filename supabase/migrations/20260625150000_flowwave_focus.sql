-- FlowWave FOCUS shockwave therapy — intake, screening, sessions (portal records)

create table if not exists public.hg_flowwave_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete restrict,
  appointment_id uuid references public.appointments(id) on delete set null,
  created_by text,
  status text not null default 'draft' check (status in (
    'draft',
    'contraindicated',
    'caution_review',
    'cleared',
    'in_treatment',
    'complete',
    'cancelled'
  )),
  screening_result text not null default 'pending' check (screening_result in (
    'pending',
    'cleared',
    'caution',
    'contraindicated'
  )),
  treatment_area text,
  primary_complaint text,
  clinician text,
  session_date date,
  intake_data jsonb not null default '{}'::jsonb,
  soap_data jsonb not null default '{}'::jsonb,
  policy_data jsonb not null default '{}'::jsonb,
  chart_note_id uuid references public.chart_notes(id) on delete set null
);

create table if not exists public.hg_flowwave_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete restrict,
  intake_id uuid references public.hg_flowwave_intakes(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  created_by text,
  session_number int,
  session_date date not null default current_date,
  treatment_area text,
  handle_type text,
  intensity int,
  frequency_hz int,
  shots_delivered int,
  actual_shots int,
  total_energy_mj text,
  duration_min int,
  pain_before int,
  pain_after int,
  clinician text,
  notes text,
  tolerance text,
  session_data jsonb not null default '{}'::jsonb
);

create index if not exists idx_hg_flowwave_intakes_created on public.hg_flowwave_intakes (created_at desc);
create index if not exists idx_hg_flowwave_intakes_client on public.hg_flowwave_intakes (client_id);
create index if not exists idx_hg_flowwave_intakes_status on public.hg_flowwave_intakes (status);
create index if not exists idx_hg_flowwave_intakes_screening on public.hg_flowwave_intakes (screening_result);
create index if not exists idx_hg_flowwave_sessions_client on public.hg_flowwave_sessions (client_id);
create index if not exists idx_hg_flowwave_sessions_date on public.hg_flowwave_sessions (session_date desc);
create index if not exists idx_hg_flowwave_sessions_intake on public.hg_flowwave_sessions (intake_id);

alter table public.hg_flowwave_intakes enable row level security;
alter table public.hg_flowwave_sessions enable row level security;

drop policy if exists "Service role full access to hg_flowwave_intakes" on public.hg_flowwave_intakes;
create policy "Service role full access to hg_flowwave_intakes" on public.hg_flowwave_intakes
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_flowwave_sessions" on public.hg_flowwave_sessions;
create policy "Service role full access to hg_flowwave_sessions" on public.hg_flowwave_sessions
  for all using (public.is_service_role());
