-- Hims-compete Phase 1 — longitudinal weight tracking for My RX

create table if not exists public.hg_rx_weight_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  patient_email text not null,
  weight_lbs numeric(6, 1) not null check (weight_lbs >= 50 and weight_lbs <= 800),
  recorded_at timestamptz not null default now(),
  source text not null check (source in ('intake', 'refill', 'portal', 'backfill')),
  submission_id uuid references public.hg_form_submissions(id) on delete set null,
  bmi numeric(5, 1),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_hg_rx_weight_logs_client
  on public.hg_rx_weight_logs (client_id, recorded_at desc);

create index if not exists idx_hg_rx_weight_logs_email
  on public.hg_rx_weight_logs (patient_email, recorded_at desc);

create table if not exists public.hg_rx_weight_goals (
  client_id uuid primary key references public.clients(id) on delete cascade,
  goal_weight_lbs numeric(6, 1) check (goal_weight_lbs >= 50 and goal_weight_lbs <= 800),
  updated_at timestamptz not null default now()
);

alter table public.hg_rx_weight_logs enable row level security;
alter table public.hg_rx_weight_goals enable row level security;

drop policy if exists "Service role full access to hg_rx_weight_logs" on public.hg_rx_weight_logs;
create policy "Service role full access to hg_rx_weight_logs" on public.hg_rx_weight_logs
  for all using (public.is_service_role());

drop policy if exists "Service role full access to hg_rx_weight_goals" on public.hg_rx_weight_goals;
create policy "Service role full access to hg_rx_weight_goals" on public.hg_rx_weight_goals
  for all using (public.is_service_role());
