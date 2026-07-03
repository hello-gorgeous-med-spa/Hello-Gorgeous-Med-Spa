-- Post-payment health intake for RE GEN orders (pay → intake → telehealth → ship).

ALTER TABLE regen_orders
  ADD COLUMN IF NOT EXISTS intake_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS intake_data JSONB,
  ADD COLUMN IF NOT EXISTS intake_submission_id UUID REFERENCES hg_form_submissions(id);

COMMENT ON COLUMN regen_orders.intake_completed_at IS 'When patient completed post-payment health intake';
COMMENT ON COLUMN regen_orders.intake_data IS 'Structured post-payment intake responses';
COMMENT ON COLUMN regen_orders.intake_submission_id IS 'Link to hg_form_submissions row when archived';

INSERT INTO public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
VALUES (
  'regen-post-payment-intake',
  'RE GEN Post-Payment Health Intake',
  '[
    {"id":"order_ref","label":"Order reference","type":"text","required":true},
    {"id":"confirm_email","label":"Email","type":"text","required":true},
    {"id":"confirm_phone","label":"Phone","type":"text","required":true},
    {"id":"dob","label":"Date of birth","type":"text","required":true},
    {"id":"qualified","label":"Screening flags","type":"text","required":false},
    {"id":"intake_consent","label":"Consent","type":"checkbox","required":true}
  ]'::jsonb,
  'regen-rx',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  schema_json = excluded.schema_json,
  trigger_service_slug = excluded.trigger_service_slug,
  is_active = true;
