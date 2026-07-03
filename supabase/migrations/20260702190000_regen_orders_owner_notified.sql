-- Track owner/staff alert when a RE GEN order is paid (idempotent SMS + email).

ALTER TABLE regen_orders
  ADD COLUMN IF NOT EXISTS owner_notified_at TIMESTAMPTZ;

COMMENT ON COLUMN regen_orders.owner_notified_at IS 'When staff SMS/email alert was sent for a paid order';
