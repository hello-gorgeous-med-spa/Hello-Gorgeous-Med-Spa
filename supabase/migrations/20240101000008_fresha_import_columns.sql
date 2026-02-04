-- ============================================================
-- MIGRATION 007: Add Fresha Import Columns
-- Adds columns needed to track imported sales from Fresha
-- ============================================================

-- Add columns to sales table for external system tracking
ALTER TABLE sales ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS external_source TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS booking_channel TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS processing_fee_total INTEGER DEFAULT 0;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS gift_card_amount INTEGER DEFAULT 0;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS item_count INTEGER DEFAULT 1;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Index for external lookups
CREATE INDEX IF NOT EXISTS idx_sales_external ON sales(external_source, external_id);

-- Comment
COMMENT ON COLUMN sales.external_id IS 'ID from external system (e.g., Fresha sale number)';
COMMENT ON COLUMN sales.external_source IS 'Source system (fresha, square, etc.)';
COMMENT ON COLUMN sales.booking_channel IS 'How the booking was made (Offline, Book Now Link, etc.)';
