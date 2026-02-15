-- ============================================================
-- LASH SPA SERVICE
-- Adds Lash Spa category and service for online booking
-- Danielle only - clients book to her calendar
-- IDEMPOTENT: Safe to run multiple times
-- ============================================================

-- Ensure provider_ids column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'provider_ids'
  ) THEN
    ALTER TABLE services ADD COLUMN provider_ids UUID[] DEFAULT NULL;
  END IF;
END $$;

-- Lash Spa category
INSERT INTO service_categories (id, name, slug, display_order, is_active)
SELECT '11111111-1111-1111-1111-111111111009', 'Lash Spa', 'lash-spa', 9, true
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE slug = 'lash-spa');

-- Lash Spa service (Danielle's provider ID)
INSERT INTO services (
  id, category_id, name, slug, short_description, price_cents, price_display,
  price_type, duration_minutes, buffer_before_minutes, buffer_after_minutes,
  deposit_required, deposit_type, requires_consult, requires_intake, requires_consent,
  requires_labs, requires_telehealth_clearance, max_advance_booking_days, min_advance_booking_hours,
  allow_online_booking, is_active, is_featured, display_order, provider_ids
)
SELECT 
  '33333333-3333-3333-3333-333333333001',
  '11111111-1111-1111-1111-111111111009',
  'Lash Spa',
  'lash-spa',
  'Full set, fill, lash perm & tint, mini fill.',
  15000,
  '$150',
  'fixed',
  60,
  0, 0,
  false, 'fixed',
  false, false, false,
  false, false,
  60, 2,
  true, true, false, 100,
  ARRAY['b7e6f872-3628-418a-aefb-aca2101f7cb2']::UUID[]
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'lash-spa');

-- Ensure existing lash-spa service has Danielle as provider
UPDATE services 
SET provider_ids = ARRAY['b7e6f872-3628-418a-aefb-aca2101f7cb2']::UUID[],
    allow_online_booking = true,
    is_active = true
WHERE slug = 'lash-spa' AND (provider_ids IS NULL OR array_length(provider_ids, 1) IS NULL);
