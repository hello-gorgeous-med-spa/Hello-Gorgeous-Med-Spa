// ============================================================
// DEFAULT SERVICES IN CODE — Med Spa service catalog
// Used when DB is not connected. Edit this file to add/change services.
// Admin Services UI can still add new services at runtime (stored in memory).
// ============================================================

export const SERVICE_CATEGORIES = [
  'Injectables',
  'Fillers',
  'Facials',
  'Laser',
  'Body',
  'Wellness',
  'Skincare',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export interface DefaultServiceRow {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory | string;
  description: string | null;
  duration_minutes: number;
  cleanup_minutes: number;
  price_cents: number;
  deposit_cents: number | null;
  online_booking: boolean;
  membership_eligible: boolean;
  package_eligible: boolean;
  consent_required: boolean;
  active: boolean;
  archived: boolean;
  sort_order: number;
}

function def(
  id: string,
  name: string,
  category: string,
  opts: Partial<DefaultServiceRow> & { price_cents?: number; price?: number; duration_minutes?: number } = {}
): DefaultServiceRow {
  const slug = (opts.slug ?? name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || id;
  const price_cents = opts.price_cents ?? (opts.price != null ? Math.round(opts.price * 100) : 0);
  return {
    id,
    name,
    slug,
    category,
    description: opts.description ?? null,
    duration_minutes: opts.duration_minutes ?? 30,
    cleanup_minutes: opts.cleanup_minutes ?? 0,
    price_cents,
    deposit_cents: opts.deposit_cents ?? null,
    online_booking: opts.online_booking !== false,
    membership_eligible: opts.membership_eligible === true,
    package_eligible: opts.package_eligible === true,
    consent_required: opts.consent_required === true,
    active: opts.active !== false,
    archived: opts.archived === true,
    sort_order: opts.sort_order ?? 0,
  };
}

// —— Injectables ——
const INJECTABLES = [
  def('svc-botox', 'Botox (per unit)', 'Injectables', {
    description: 'Neurotoxin to smooth wrinkles. Priced per unit.',
    duration_minutes: 30,
    price_cents: 1400, // $14/unit
    consent_required: true,
    sort_order: 10,
  }),
  def('svc-dysport', 'Dysport (per unit)', 'Injectables', {
    description: 'Neurotoxin alternative to Botox. Broader spread.',
    duration_minutes: 30,
    price_cents: 400, // $4/unit typical
    consent_required: true,
    sort_order: 11,
  }),
  def('svc-xeomin', 'Xeomin (per unit)', 'Injectables', {
    description: 'Pure neurotoxin, no additives. Good for those sensitive to other formulations.',
    duration_minutes: 30,
    price_cents: 1100,
    consent_required: true,
    sort_order: 12,
  }),
  def('svc-jeuveau', 'Jeuveau (per unit)', 'Injectables', {
    description: 'Neurotoxin for frown lines. FDA-approved.',
    duration_minutes: 30,
    price_cents: 1200,
    consent_required: true,
    sort_order: 13,
  }),
];

// —— Fillers ——
const FILLERS = [
  def('svc-dermal-fillers', 'Dermal Fillers', 'Fillers', {
    description: 'Restore volume, enhance contours. Cheeks, jawline, nasolabial folds.',
    duration_minutes: 45,
    price_cents: 50000, // From $500
    consent_required: true,
    sort_order: 20,
  }),
  def('svc-lip-filler', 'Lip Filler', 'Fillers', {
    description: 'Natural-looking lip volume and definition.',
    duration_minutes: 45,
    price_cents: 45000, // From $450
    consent_required: true,
    sort_order: 21,
  }),
  def('svc-juvederm', 'Juvederm', 'Fillers', {
    description: 'Hyaluronic acid filler. Multiple formulations for different areas.',
    duration_minutes: 45,
    price_cents: 55000,
    consent_required: true,
    sort_order: 22,
  }),
  def('svc-restylane', 'Restylane', 'Fillers', {
    description: 'HA filler for lips, cheeks, and facial contours.',
    duration_minutes: 45,
    price_cents: 52000,
    consent_required: true,
    sort_order: 23,
  }),
];

// —— Facials ——
const FACIALS = [
  def('svc-hydrafacial', 'HydraFacial', 'Facials', {
    description: 'Cleansing, extraction, hydration. Suitable for most skin types.',
    duration_minutes: 60,
    price_cents: 19900, // $199
    sort_order: 30,
  }),
  def('svc-chemical-peel', 'Chemical Peel', 'Facials', {
    description: 'Resurface skin, improve texture and tone.',
    duration_minutes: 45,
    price_cents: 15000,
    sort_order: 31,
  }),
  def('svc-microneedling', 'Microneedling', 'Facials', {
    description: 'Collagen induction for texture and scarring.',
    duration_minutes: 60,
    price_cents: 35000,
    sort_order: 32,
  }),
  def('svc-facial', 'Custom Facial', 'Facials', {
    description: 'Customized facial treatment based on skin assessment.',
    duration_minutes: 60,
    price_cents: 12000,
    sort_order: 33,
  }),
];

// —— Laser ——
const LASER = [
  def('svc-morpheus8', 'Morpheus8 RF Microneedling', 'Laser', {
    description: 'RF microneedling for skin tightening, body contouring, acne scars.',
    duration_minutes: 90,
    price_cents: 80000, // From $800
    sort_order: 40,
  }),
  def('svc-laser-hair-removal', 'Laser Hair Removal', 'Laser', {
    description: 'Permanent hair reduction. Multiple areas available.',
    duration_minutes: 30,
    price_cents: 7500, // From $75/session
    consent_required: true,
    sort_order: 41,
  }),
  def('svc-ipl-photofacial', 'IPL Photofacial', 'Laser', {
    description: 'Target sun damage, redness, pigmentation.',
    duration_minutes: 45,
    price_cents: 25000,
    consent_required: true,
    sort_order: 42,
  }),
  def('svc-co2-laser', 'CO₂ Fractional Laser', 'Laser', {
    description: 'Skin resurfacing for wrinkles, scars, sun damage.',
    duration_minutes: 60,
    price_cents: 80000,
    consent_required: true,
    sort_order: 43,
  }),
];

// —— Body ——
const BODY = [
  def('svc-body-contouring', 'Body Contouring', 'Body', {
    description: 'Non-invasive body sculpting and fat reduction.',
    duration_minutes: 60,
    price_cents: 35000,
    sort_order: 50,
  }),
  def('svc-skin-tightening', 'Skin Tightening', 'Body', {
    description: 'RF or ultrasound skin tightening for body areas.',
    duration_minutes: 45,
    price_cents: 25000,
    sort_order: 51,
  }),
];

// —— Wellness ——
const WELLNESS = [
  def('svc-weight-loss-consultation', 'Weight Loss Consultation', 'Wellness', {
    description: 'Free consultation for GLP-1 / medical weight loss program.',
    duration_minutes: 45,
    price_cents: 0,
    sort_order: 60,
  }),
  def('svc-weight-loss-monthly', 'Medical Weight Loss (monthly)', 'Wellness', {
    description: 'Semaglutide or Tirzepatide program. Monthly supervision.',
    duration_minutes: 15,
    price_cents: 35000, // From $350/mo
    sort_order: 61,
  }),
  def('svc-iv-therapy', 'IV Therapy', 'Wellness', {
    description: 'IV vitamin and hydration therapy.',
    duration_minutes: 45,
    price_cents: 19900,
    sort_order: 62,
  }),
  def('svc-consultation', 'Free Consultation', 'Wellness', {
    description: 'Complimentary consultation to create your treatment plan.',
    duration_minutes: 30,
    price_cents: 0,
    online_booking: true,
    sort_order: 63,
  }),
];

// —— Skincare ——
const SKINCARE = [
  def('svc-skin-consultation', 'Skincare Consultation', 'Skincare', {
    description: 'Personalized skincare assessment and product recommendations.',
    duration_minutes: 30,
    price_cents: 0,
    sort_order: 70,
  }),
  def('svc-retinol-treatment', 'Retinol / Vitamin A Treatment', 'Skincare', {
    description: 'Professional-grade retinol application for anti-aging.',
    duration_minutes: 45,
    price_cents: 15000,
    sort_order: 71,
  }),
];

/** All default services in category order. Edit this file to add or change services. */
export const DEFAULT_SERVICES: DefaultServiceRow[] = [
  ...INJECTABLES,
  ...FILLERS,
  ...FACIALS,
  ...LASER,
  ...BODY,
  ...WELLNESS,
  ...SKINCARE,
];
