-- =============================================================================
-- If you already ran hg_form_templates_bootstrap.sql, use ONLY the INSERT below
-- (or re-run the full combined script in hg_form_templates_bootstrap.sql — it is idempotent).
-- =============================================================================

INSERT INTO public.hg_form_templates (slug, title, schema_json, trigger_service_slug, is_active)
VALUES
  (
    'solaria-co2-consent',
    'Solaria CO₂ — Informed Consent (verbatim source in /docs/solaria/)',
    '[]'::jsonb,
    'solaria-co2',
    true
  ),
  (
    'morpheus8-consent',
    'Morpheus8 — Informed Consent (verbatim source in /docs/morpheus8/)',
    '[]'::jsonb,
    'morpheus8',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_active = true;

SELECT id, slug, title, is_active FROM public.hg_form_templates
WHERE slug IN ('solaria-co2-consent', 'morpheus8-consent', 'luxora-consent')
ORDER BY slug;
