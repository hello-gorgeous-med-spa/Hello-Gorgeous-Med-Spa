-- ============================================================
-- LOYALTY TIERS, REFERRAL PROGRAM, AFTERCARE NOTIFICATIONS
-- ============================================================

-- ── Referral codes ───────────────────────────────────────────
create table if not exists public.referral_codes (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  code          text not null unique,
  uses          integer not null default 0,
  credits_earned integer not null default 0, -- cents
  created_at    timestamptz not null default now()
);
create index if not exists referral_codes_client_id_idx on public.referral_codes(client_id);
create index if not exists referral_codes_code_idx on public.referral_codes(code);

alter table public.referral_codes enable row level security;
create policy "service_role_all" on public.referral_codes using (true) with check (true);

-- ── Referral redemptions ─────────────────────────────────────
create table if not exists public.referral_redemptions (
  id              uuid primary key default gen_random_uuid(),
  code            text not null,
  referrer_id     uuid not null references public.clients(id),
  new_client_id   uuid references public.clients(id),
  new_client_email text,
  referrer_credit_cents integer not null default 2500, -- $25
  referee_credit_cents  integer not null default 2500, -- $25
  redeemed_at     timestamptz not null default now()
);
create index if not exists referral_redemptions_referrer_idx on public.referral_redemptions(referrer_id);
alter table public.referral_redemptions enable row level security;
create policy "service_role_all" on public.referral_redemptions using (true) with check (true);

-- ── Aftercare notification templates ─────────────────────────
create table if not exists public.aftercare_templates (
  id              uuid primary key default gen_random_uuid(),
  treatment_key   text not null,          -- e.g. "botox", "morpheus8", "filler"
  day_offset      integer not null,       -- days after treatment: 1, 3, 7
  title           text not null,
  message         text not null,
  url             text not null default '/app?tab=me',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists aftercare_templates_key_idx on public.aftercare_templates(treatment_key);
alter table public.aftercare_templates enable row level security;
create policy "service_role_all" on public.aftercare_templates using (true) with check (true);

-- ── Aftercare schedules (pending/sent per client) ────────────
create table if not exists public.aftercare_schedules (
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
create index if not exists aftercare_schedules_status_idx on public.aftercare_schedules(status, scheduled_for);
create index if not exists aftercare_schedules_client_idx on public.aftercare_schedules(client_id);
alter table public.aftercare_schedules enable row level security;
create policy "service_role_all" on public.aftercare_schedules using (true) with check (true);

-- ── Seed aftercare templates ─────────────────────────────────
insert into public.aftercare_templates (treatment_key, day_offset, title, message, url) values
  -- Botox / Dysport
  ('botox', 1, '24 hours post-Botox 💉', 'How are you feeling? Mild redness and tenderness are totally normal. Avoid rubbing the area and stay upright for a few more hours. You''re glowing already!', '/app'),
  ('botox', 3, 'Botox check-in — Day 3', 'By now you may notice the Botox starting to kick in! Full results take 10–14 days. If you see any asymmetry, don''t worry — it''s still settling. Any concerns? Message us anytime.', '/portal'),
  ('botox', 7, 'Botox — 1 week later ✨', 'Your Botox should be looking amazing by now! Full results are visible. If anything looks uneven after day 14, reach out — we''ll take care of you. Love what you see? Book your next appointment!', '/app'),

  -- Dermal Fillers
  ('filler', 1, 'Day 1 after fillers 💫', 'Swelling and firmness are completely normal right now — you''ll look a little more than your final result. Avoid heat, exercise, and alcohol today. You''re going to love it!', '/app'),
  ('filler', 3, 'Filler check-in — Day 3', 'Swelling should be going down now and you''re getting a preview of your results! Bruising is still normal. Keep massaging gently if we instructed you to. How does it feel?', '/portal'),
  ('filler', 7, 'Filler results — Week 1 ✨', 'This is closer to your final result! Fillers take up to 4 weeks to fully integrate. If anything feels off, reach out — we want you to love every single result.', '/app'),

  -- Morpheus8
  ('morpheus8', 1, 'Day 1 after Morpheus8 🔥', 'Redness, swelling, and pinpoint marks are all expected — you''re healing! Stay out of direct sun, skip makeup today, and be gentle with your skin. The best results are coming.', '/app'),
  ('morpheus8', 3, 'Morpheus8 — Day 3 update', 'The surface redness should be fading. Your skin may feel rough or textured — that''s normal as you heal. Keep moisturizing and using SPF. The collagen remodeling has begun! 🌟', '/portal/aftercare'),
  ('morpheus8', 7, 'Morpheus8 — 1 week check-in', 'How''s your skin looking? Most clients are back to normal by now. Results continue to improve for 3–6 months as collagen builds. Excited for your transformation!', '/app'),

  -- Solaria CO2
  ('co2', 1, 'Day 1 after Solaria CO₂ ✨', 'Your skin is working hard right now! Redness and swelling are expected. Keep it clean, moisturized, and protected. No picking — let your skin heal beautifully on its own.', '/app'),
  ('co2', 3, 'CO₂ Laser — Day 3', 'Peeling may start now — resist the urge to pick! This is your old skin making way for fresh, renewed skin underneath. Stay gentle, stay hydrated, and be patient.', '/portal/aftercare'),
  ('co2', 7, 'CO₂ results emerging 🌟', 'Your skin should be mostly healed and looking fresher already. The best results show at 1–3 months. Make sure you''re using SPF every single day — it protects your investment!', '/app'),

  -- HydraFacial / Facials
  ('hydrafacial', 1, 'Post-HydraFacial glow ✨', 'You should already be glowing! Your skin may be slightly pink — totally normal and will fade by tomorrow. Avoid heavy makeup today and enjoy that fresh skin feeling!', '/app'),
  ('hydrafacial', 3, 'HydraFacial — Day 3 check-in', 'How''s your skin feeling? Your pores should look refined and your skin hydrated. This is a great time to think about your next treatment — monthly facials keep this glow going!', '/app'),

  -- Laser Hair Removal
  ('laser-hair', 1, 'After laser hair removal 💡', 'Redness and sensitivity are normal for 24–48 hours. Avoid hot showers, sun exposure, and tight clothing on treated areas today. You''re one step closer to smooth!', '/app'),
  ('laser-hair', 3, 'Laser Hair — Day 3', 'Hair may appear to be growing — it''s actually being shed! Don''t wax or tweeze, just let it fall out naturally. Exfoliating gently in a week will help. Progress! 🌟', '/app'),
  ('laser-hair', 7, 'Laser check-in — Week 1', 'Shedding should be wrapping up. Remember — consistency is key for laser hair removal. Book your next session at the right interval for the best results!', '/app'),

  -- Vitamin Bar / Shots
  ('vitamin', 1, 'How are you feeling? 💉', 'It''s been about 24 hours since your vitamin shot! Most clients feel the energy boost within a day or two. Remember you can pre-pay and schedule your next drive-thru visit anytime in the app.', '/app?tab=vitamin'),

  -- Weight Loss / GLP-1
  ('glp1', 3, 'GLP-1 Week 1 check-in 💊', 'How are you feeling on your new program? Mild nausea the first week is common — small meals help. Stay hydrated and track your progress. We''re rooting for you!', '/portal'),
  ('glp1', 7, 'Week 1 complete! 🎉', 'You made it through week 1! Most clients start noticing changes in weeks 2–4. Remember your check-in appointment — consistency is everything with GLP-1 programs. You''ve got this!', '/app')
on conflict do nothing;
