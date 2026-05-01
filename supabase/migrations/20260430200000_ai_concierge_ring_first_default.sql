-- Ring-first (Pattern B) default settings row.
-- /api/ai-concierge/voice/incoming reads ai_concierge_settings.ring_first to
-- decide whether to <Dial> staff first before handing off to Sarah. If the row
-- is missing the code defaults to enabled=true; this seed lets staff see and
-- edit the value in /admin/ai-concierge/settings without having to "Save" once
-- to materialize it.

INSERT INTO public.ai_concierge_settings (setting_key, setting_value)
VALUES (
  'ring_first',
  jsonb_build_object(
    'enabled', true,
    'timeout', 20,
    'number', NULL
  )
)
ON CONFLICT (setting_key) DO NOTHING;
