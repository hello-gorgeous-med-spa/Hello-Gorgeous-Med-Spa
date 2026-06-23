-- Hello Gorgeous RX™ peptide request & refill intakes (/peptide-request)

insert into public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
values
  (
    'peptide-therapy-request',
    'Hello Gorgeous RX™ Peptide Protocol Request',
    '[
      {"id":"request_type","label":"Request type","type":"text","required":true},
      {"id":"selected_peptides","label":"Peptides requested","type":"text","required":true},
      {"id":"first_name","label":"First name","type":"text","required":true},
      {"id":"last_name","label":"Last name","type":"text","required":true},
      {"id":"email","label":"Email","type":"text","required":true},
      {"id":"phone","label":"Phone","type":"text","required":true},
      {"id":"qualified","label":"Screening result","type":"text","required":true},
      {"id":"telehealth_consent","label":"Telehealth consent","type":"checkbox","required":true}
    ]'::jsonb,
    'peptide-therapy',
    true
  ),
  (
    'peptide-refill-request',
    'Hello Gorgeous RX™ Peptide Refill Request',
    '[
      {"id":"request_type","label":"Request type","type":"text","required":true},
      {"id":"selected_peptides","label":"Peptides requested","type":"text","required":true},
      {"id":"current_peptide","label":"Current peptide","type":"text","required":true},
      {"id":"first_name","label":"First name","type":"text","required":true},
      {"id":"last_name","label":"Last name","type":"text","required":true},
      {"id":"email","label":"Email","type":"text","required":true},
      {"id":"phone","label":"Phone","type":"text","required":true},
      {"id":"qualified","label":"Screening result","type":"text","required":true},
      {"id":"telehealth_consent","label":"Telehealth consent","type":"checkbox","required":true}
    ]'::jsonb,
    'peptide-therapy',
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  schema_json = excluded.schema_json,
  trigger_service_slug = excluded.trigger_service_slug,
  is_active = true;
