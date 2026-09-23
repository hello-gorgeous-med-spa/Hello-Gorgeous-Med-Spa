-- Ops Approve writes a pharmacy order. Production regen_orders is the
-- Sept 2 repair shape (program + order_number) and is missing the
-- fulfillment / FormuConnect columns. Add them without dropping rows.

ALTER TABLE public.regen_orders
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS intake_id uuid,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS goal text,
  ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal numeric(10, 2),
  ADD COLUMN IF NOT EXISTS shipping numeric(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount numeric(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric(10, 2),
  ADD COLUMN IF NOT EXISTS subtotal_usd numeric(10, 2),
  ADD COLUMN IF NOT EXISTS shipping_usd numeric(10, 2),
  ADD COLUMN IF NOT EXISTS pharmacy_name text,
  ADD COLUMN IF NOT EXISTS pharmacy_order_id text,
  ADD COLUMN IF NOT EXISTS pharmacy_source text,
  ADD COLUMN IF NOT EXISTS pharmacy_ordered_at timestamptz,
  ADD COLUMN IF NOT EXISTS np_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS np_notes text,
  ADD COLUMN IF NOT EXISTS intake_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS intake_data jsonb,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS tracking_carrier text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_regen_orders_reference_unique
  ON public.regen_orders (reference)
  WHERE reference IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_regen_orders_intake_id
  ON public.regen_orders (intake_id)
  WHERE intake_id IS NOT NULL;

UPDATE public.regen_orders
SET reference = order_number
WHERE reference IS NULL AND order_number IS NOT NULL;
