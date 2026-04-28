-- Staff can insert org settings rows (first upsert from admin UI)
GRANT INSERT ON public.ai_concierge_settings TO authenticated;

CREATE POLICY "Staff insert ai_concierge_settings"
  ON public.ai_concierge_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_org_staff());
