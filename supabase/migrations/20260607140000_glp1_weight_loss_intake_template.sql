-- GLP-1 weight loss screening intake (submitted from /glp1-intake)
insert into public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
values (
  'glp1-weight-loss-intake',
  'GLP-1 Weight Loss Screening Intake',
  '[
    {"id":"first_name","label":"First name","type":"text","required":true},
    {"id":"last_name","label":"Last name","type":"text","required":true},
    {"id":"email","label":"Email","type":"text","required":true},
    {"id":"phone","label":"Phone","type":"text","required":true},
    {"id":"dob","label":"Date of birth","type":"text","required":true},
    {"id":"bmi","label":"BMI","type":"text","required":false},
    {"id":"qualified","label":"Screening result","type":"text","required":true},
    {"id":"intake_consent","label":"Consent","type":"checkbox","required":true}
  ]'::jsonb,
  'weight-loss',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  schema_json = excluded.schema_json,
  trigger_service_slug = excluded.trigger_service_slug,
  is_active = true;
