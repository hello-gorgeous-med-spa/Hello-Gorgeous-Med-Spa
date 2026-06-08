-- ============================================================
-- APP AFTERCARE TABLES (prefixed with app_ to avoid conflicts)
-- ============================================================

-- Add missing columns to referral_redemptions
alter table public.referral_redemptions
  add column if not exists code text,
  add column if not exists referrer_id uuid references public.clients(id),
  add column if not exists new_client_id uuid references public.clients(id),
  add column if not exists new_client_email text,
  add column if not exists referrer_credit_cents integer not null default 2500,
  add column if not exists referee_credit_cents integer not null default 2500,
  add column if not exists redeemed_at timestamptz not null default now();

create index if not exists referral_redemptions_referrer_idx on public.referral_redemptions(referrer_id);
alter table public.referral_redemptions enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'referral_redemptions' and policyname = 'service_role_all') then
    create policy "service_role_all" on public.referral_redemptions using (true) with check (true);
  end if;
end $$;

-- ── App aftercare notification templates ─────────────────────
create table if not exists public.app_aftercare_templates (
  id              uuid primary key default gen_random_uuid(),
  treatment_key   text not null,
  day_offset      integer not null,
  title           text not null,
  message         text not null,
  url             text not null default '/app',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists app_aftercare_templates_key_idx on public.app_aftercare_templates(treatment_key);
alter table public.app_aftercare_templates enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'app_aftercare_templates' and policyname = 'service_role_all') then
    create policy "service_role_all" on public.app_aftercare_templates using (true) with check (true);
  end if;
end $$;

-- ── App aftercare schedules ───────────────────────────────────
create table if not exists public.app_aftercare_schedules (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.clients(id) on delete cascade,
  appointment_id  uuid references public.appointments(id),
  treatment_key   text not null,
  day_offset      integer not null,
  scheduled_for   timestamptz not null,
  sent_at         timestamptz,
  status          text not null default 'pending' check (status in ('pending','sent','failed','skipped')),
  created_at      timestamptz not null default now()
);
create index if not exists app_aftercare_schedules_status_idx on public.app_aftercare_schedules(status, scheduled_for);
create index if not exists app_aftercare_schedules_client_idx on public.app_aftercare_schedules(client_id);
alter table public.app_aftercare_schedules enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'app_aftercare_schedules' and policyname = 'service_role_all') then
    create policy "service_role_all" on public.app_aftercare_schedules using (true) with check (true);
  end if;
end $$;

-- ── Seed templates ─────────────────────────────────────────
insert into public.app_aftercare_templates (treatment_key, day_offset, title, message, url) values
  ('botox', 1, '24 hours post-Botox 💉', 'How are you feeling? Mild redness and tenderness are totally normal. Avoid rubbing the area and stay upright for a few more hours. You''re glowing already!', '/app'),
  ('botox', 3, 'Botox check-in — Day 3', 'By now you may notice the Botox starting to kick in! Full results take 10–14 days. If you see any asymmetry, don''t worry — it''s still settling. Any concerns? Message us anytime.', '/portal'),
  ('botox', 7, 'Botox — 1 week later ✨', 'Your Botox should be looking amazing by now! If anything looks uneven after day 14, reach out — we''ll take care of you. Love what you see? Book your next appointment!', '/app'),
  ('filler', 1, 'Day 1 after fillers 💫', 'Swelling and firmness are completely normal right now. Avoid heat, exercise, and alcohol today. You''re going to love it!', '/app'),
  ('filler', 3, 'Filler check-in — Day 3', 'Swelling should be going down now. Bruising is still normal. Keep massaging gently if we instructed you to. How does it feel?', '/portal'),
  ('filler', 7, 'Filler results — Week 1 ✨', 'This is closer to your final result! Fillers take up to 4 weeks to fully integrate. If anything feels off, reach out.', '/app'),
  ('morpheus8', 1, 'Day 1 after Morpheus8 🔥', 'Redness, swelling, and pinpoint marks are all expected — you''re healing! Stay out of direct sun, skip makeup today. The best results are coming.', '/app'),
  ('morpheus8', 3, 'Morpheus8 — Day 3 update', 'The surface redness should be fading. Keep moisturizing and using SPF. The collagen remodeling has begun! 🌟', '/app'),
  ('morpheus8', 7, 'Morpheus8 — 1 week check-in', 'Results continue to improve for 3–6 months as collagen builds. Excited for your transformation!', '/app'),
  ('co2', 1, 'Day 1 after Solaria CO₂ ✨', 'Redness and swelling are expected. Keep it clean, moisturized, and protected. No picking — let your skin heal beautifully.', '/app'),
  ('co2', 3, 'CO₂ Laser — Day 3', 'Peeling may start now — resist the urge to pick! This is your old skin making way for fresh, renewed skin underneath.', '/app'),
  ('co2', 7, 'CO₂ results emerging 🌟', 'Your skin should be mostly healed and looking fresher. Best results show at 1–3 months. SPF every day — it protects your investment!', '/app'),
  ('hydrafacial', 1, 'Post-HydraFacial glow ✨', 'You should already be glowing! Your skin may be slightly pink — totally normal. Avoid heavy makeup today.', '/app'),
  ('hydrafacial', 3, 'HydraFacial — Day 3 check-in', 'Your pores should look refined and your skin hydrated. Think about booking monthly to keep this glow going!', '/app'),
  ('laser-hair', 1, 'After laser hair removal 💡', 'Redness and sensitivity are normal for 24–48 hours. Avoid hot showers and sun exposure. You''re one step closer to smooth!', '/app'),
  ('laser-hair', 3, 'Laser Hair — Day 3', 'Hair may appear to be growing — it''s actually being shed! Don''t wax or tweeze. Progress! 🌟', '/app'),
  ('laser-hair', 7, 'Laser check-in — Week 1', 'Shedding should be wrapping up. Consistency is key — book your next session for best results!', '/app'),
  ('vitamin', 1, 'How are you feeling? 💉', 'It''s been about 24 hours since your vitamin shot! Most clients feel the energy boost within a day or two. Schedule your next visit anytime in the app.', '/app?tab=vitamin'),
  ('glp1', 3, 'GLP-1 Week 1 check-in 💊', 'How are you feeling on your new program? Mild nausea the first week is common — small meals help. Stay hydrated!', '/portal'),
  ('glp1', 7, 'Week 1 complete! 🎉', 'You made it through week 1! Most clients start noticing changes in weeks 2–4. Consistency is everything. You''ve got this!', '/app')
on conflict do nothing;
