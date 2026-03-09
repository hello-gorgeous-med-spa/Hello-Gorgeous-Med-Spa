-- ============================================================
-- Free Consultation service for /book/consultation
-- Client can choose Ryan NP or Danielle (CNA/RN)
-- ============================================================

INSERT INTO services (
  name,
  slug,
  short_description,
  category_id,
  price_cents,
  price_display,
  duration_minutes,
  is_active,
  allow_online_booking,
  requires_consult
)
SELECT
  'Free Consultation',
  'consultation',
  'Not sure which treatment is right for you? Book a free consultation. Choose Ryan Kent, FNP-BC or Danielle Alcala, RN-S for a personalized plan.',
  (SELECT id FROM service_categories WHERE slug = 'consultations' LIMIT 1),
  0,
  'Free',
  30,
  true,
  true,
  false
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'consultation');
