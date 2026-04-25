-- Luxora informed consent: clinical body must be added verbatim to schema_json
-- (no paraphrasing). Empty array until HTML is ingested; Hub /intake and /forms use slug.

insert into public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
values (
  'luxora-consent',
  'Luxora — Informed Consent (verbatim clinical sections pending in template)',
  '[]'::jsonb,
  'luxora',
  true
)
on conflict (slug) do update
set
  title = excluded.title,
  is_active = true
where public.hg_form_templates.slug = excluded.slug;
