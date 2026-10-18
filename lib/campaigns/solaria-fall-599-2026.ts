/**
 * Solaria CO₂ regular pricing — $899.
 * Google Business Profile + site. Consult required; results vary.
 * Note: Fall 2026 $599 promotion ended. Regular pricing restored.
 */

export const SOLARIA_FALL_599_USD = 899; // Regular price (constant name kept for import compatibility)
export const SOLARIA_FALL_599_PATH = "/services/solaria-co2" as const;

export const SOLARIA_FALL_599_CAMPAIGN = {
  name: "Solaria CO₂ at Hello Gorgeous Med Spa",
  seasonLabel: "From $899",
  path: SOLARIA_FALL_599_PATH,
  imagePath: "/images/marketing/solaria-fall-back-in-love-2026.jpg" as const,
  gbpPath:
    `${SOLARIA_FALL_599_PATH}?utm_source=google&utm_medium=gbp_post&utm_campaign=solaria_2026` as const,
  phoneDisplay: "(630) 636-6193",
  validUntilIso: null, // No expiration for regular pricing
} as const;

export const SOLARIA_FALL_599_GBP = `Your skin — renewed.

InMode Solaria CO₂ fractional resurfacing at Hello Gorgeous Medical Spa in downtown Oswego.

One treatment designed to help smoother, brighter, firmer-looking skin.

What it targets:
• Fine lines + wrinkles
• Acne scars
• Sun damage + brown spots
• Uneven texture + enlarged pores
• Mild skin laxity

Full face treatment: $899
Physician-directed care under Dr. Mukesh Arora, MD

Book your consultation
(630) 636-6193

Results vary. Consultation required.
74 W Washington St, Oswego IL`;
