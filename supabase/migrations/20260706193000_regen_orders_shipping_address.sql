-- RE GEN orders — link Square checkout + store ship-to address

ALTER TABLE regen_orders
  ADD COLUMN IF NOT EXISTS square_order_id text,
  ADD COLUMN IF NOT EXISTS square_payment_link_id text,
  ADD COLUMN IF NOT EXISTS shipping_address jsonb;

CREATE INDEX IF NOT EXISTS idx_regen_orders_square_order_id
  ON regen_orders (square_order_id)
  WHERE square_order_id IS NOT NULL;

COMMENT ON COLUMN regen_orders.square_order_id IS 'Square order id from payment link checkout';
COMMENT ON COLUMN regen_orders.shipping_address IS 'Ship-to address captured from Square fulfillments';
