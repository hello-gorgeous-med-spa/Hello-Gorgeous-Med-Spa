-- Brow consultation intake (digital wizard at /forms/brow-intake)
insert into public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
values (
  'brow-consultation-intake',
  'Brow Consultation & Intake',
  '[]'::jsonb,
  'brow-pmu',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  is_active = true;
