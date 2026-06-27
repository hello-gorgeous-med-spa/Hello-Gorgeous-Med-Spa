-- GLP-1 weight loss refill request (submitted from /glp1-refill)
insert into public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
values (
  'glp1-refill-request',
  'GLP-1 Weight Loss Refill Request',
  '[
    {"id":"first_name","label":"First name","type":"text","required":true},
    {"id":"last_name","label":"Last name","type":"text","required":true},
    {"id":"email","label":"Email","type":"text","required":true},
    {"id":"phone","label":"Phone","type":"text","required":true},
    {"id":"dob","label":"Date of birth","type":"text","required":true},
    {"id":"address_line1","label":"Street address","type":"text","required":true},
    {"id":"city","label":"City","type":"text","required":true},
    {"id":"state","label":"State","type":"text","required":true},
    {"id":"zip","label":"ZIP","type":"text","required":true},
    {"id":"current_medication","label":"Current medication","type":"text","required":true},
    {"id":"qualified","label":"Screening result","type":"text","required":true},
    {"id":"refill_consent","label":"Consent","type":"checkbox","required":true}
  ]'::jsonb,
  'weight-loss',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  schema_json = excluded.schema_json,
  trigger_service_slug = excluded.trigger_service_slug,
  is_active = true;
