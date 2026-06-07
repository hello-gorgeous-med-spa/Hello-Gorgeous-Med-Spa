-- Vitamin Bar / client app wellness intake (submitted from /app)
insert into public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
values (
  'vitamin-bar-intake',
  'Vitamin Bar Wellness Intake',
  '[
    {"id":"full_name","label":"Full legal name","type":"text","required":true},
    {"id":"phone","label":"Mobile phone","type":"text","required":true},
    {"id":"dob","label":"Date of birth","type":"text","required":true},
    {"id":"allergies","label":"Allergies","type":"textarea","required":false},
    {"id":"medications","label":"Current medications","type":"textarea","required":false},
    {"id":"pregnant","label":"Pregnant or breastfeeding","type":"text","required":true},
    {"id":"recent_illness","label":"Recent illness","type":"text","required":true},
    {"id":"understand_treatment","label":"Treatment acknowledgement","type":"checkbox","required":true},
    {"id":"accuracy","label":"Information accuracy","type":"checkbox","required":true}
  ]'::jsonb,
  'vitamin-bar',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  schema_json = excluded.schema_json,
  trigger_service_slug = excluded.trigger_service_slug,
  is_active = true;
