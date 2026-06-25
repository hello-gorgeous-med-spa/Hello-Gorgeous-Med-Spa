-- Warm RX lead auto-nurture (24h / 72h SMS follow-up)

create table if not exists public.hg_warm_lead_nurture_log (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.hg_form_submissions(id) on delete cascade,
  stage text not null check (stage in ('24h', '72h')),
  sent_at timestamptz not null default now(),
  sms_success boolean not null default false,
  phone text,
  unique (submission_id, stage)
);

create index if not exists idx_hg_warm_lead_nurture_sent on public.hg_warm_lead_nurture_log (sent_at desc);

alter table public.hg_warm_lead_nurture_log enable row level security;

drop policy if exists "Service role warm lead nurture log" on public.hg_warm_lead_nurture_log;
create policy "Service role warm lead nurture log" on public.hg_warm_lead_nurture_log
  for all using (public.is_service_role());
