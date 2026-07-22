-- RE GEN abandoned-cart recovery: store pay link URL + reminder stamps

ALTER TABLE public.regen_orders
  ADD COLUMN IF NOT EXISTS checkout_url text,
  ADD COLUMN IF NOT EXISTS abandoned_reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS abandoned_staff_alerted_at timestamptz;

COMMENT ON COLUMN public.regen_orders.checkout_url IS 'Square hosted checkout URL created at cart submit';
COMMENT ON COLUMN public.regen_orders.abandoned_reminder_sent_at IS 'When patient email/SMS cart recovery was sent';
COMMENT ON COLUMN public.regen_orders.abandoned_staff_alerted_at IS 'When staff was alerted about a high-dollar abandoned cart';

CREATE INDEX IF NOT EXISTS idx_regen_orders_abandoned_pending
  ON public.regen_orders (created_at desc)
  WHERE status = 'pending_payment'
    AND abandoned_reminder_sent_at IS NULL;
