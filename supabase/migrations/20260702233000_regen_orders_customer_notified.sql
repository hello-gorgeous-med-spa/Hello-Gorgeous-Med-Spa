-- Track customer confirmation email/SMS after post-payment intake.

ALTER TABLE regen_orders
  ADD COLUMN IF NOT EXISTS customer_notified_at timestamptz;

COMMENT ON COLUMN regen_orders.customer_notified_at IS 'When order confirmation + portal login were sent to the patient';
