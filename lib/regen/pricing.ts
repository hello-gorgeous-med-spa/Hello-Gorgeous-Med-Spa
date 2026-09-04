/**
 * REGEN RX Centralized Pricing
 * 
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL REGEN RX PRICING.
 * Do NOT hardcode prices anywhere else in the codebase.
 * 
 * Formula: (Wholesale Cost × 2.5) + $25 shipping
 */

// ============================================================
// CONSULTATION PRICING
// ============================================================

export const CONSULTATION_PRICE = 99;
export const CONSULTATION_LABEL = '$99 Expert Consultation';

// ============================================================
// VITAMIN INJECTABLES
// ============================================================

export const VITAMIN_PRICING = {
  b12: {
    name: 'Vitamin B12 (Methylcobalamin)',
    price: 89,
    perDose: 'per 10mL vial',
    dosesIncluded: '10+ doses',
  },
  biotin: {
    name: 'Biotin Injection',
    price: 99,
    perDose: 'per 10mL vial',
    dosesIncluded: '10+ doses',
  },
  glutathione: {
    name: 'Glutathione',
    price: 170,
    perDose: 'per 30mL vial',
    dosesIncluded: '15+ doses',
  },
  nad: {
    name: 'NAD+ Injection',
    price: 375,
    perDose: 'per 10mL vial',
    dosesIncluded: 'varies by protocol',
  },
  myersCocktail: {
    name: "Myers' Cocktail",
    price: 180,
    perDose: 'per 10mL vial',
    dosesIncluded: '4-5 treatments',
  },
  triImmune: {
    name: 'Tri-Immune Boost',
    price: 185,
    perDose: 'per 30mL vial',
    dosesIncluded: '6+ doses',
  },
} as const;

// ============================================================
// WEIGHT LOSS / GLP-1 PRICING
// ============================================================

export const WEIGHT_LOSS_PRICING = {
  semaglutideTier1: {
    name: 'Semaglutide Starter',
    monthlyPrice: 299,
    description: '2.5mg/mL - Month 1-2',
  },
  semaglutideTier2: {
    name: 'Semaglutide Standard',
    monthlyPrice: 349,
    description: '5mg/mL - Month 3+',
  },
  tirzepatideTier1: {
    name: 'Tirzepatide Starter',
    monthlyPrice: 399,
    description: '12.5mg/mL - Month 1-2',
  },
  tirzepatideTier2: {
    name: 'Tirzepatide Standard',
    monthlyPrice: 449,
    description: '25mg/mL - Month 3+',
  },
} as const;

// ============================================================
// PEPTIDE PRICING
// ============================================================

export const PEPTIDE_PRICING = {
  sermorelin: {
    name: 'Sermorelin',
    monthlyPrice: 189,
    description: 'Growth hormone support',
  },
  bpc157: {
    name: 'BPC-157',
    monthlyPrice: 199,
    description: 'Recovery & healing',
  },
  pt141: {
    name: 'PT-141 (Bremelanotide)',
    monthlyPrice: 229,
    description: 'Sexual wellness',
  },
  ghkCu: {
    name: 'GHK-Cu',
    monthlyPrice: 179,
    description: 'Skin & tissue repair',
  },
  fountainOfYouth: {
    name: 'Fountain of Youth (Epitalon + GHK-Cu)',
    monthlyPrice: 349,
    description: 'Anti-aging protocol',
  },
} as const;

// ============================================================
// HORMONE THERAPY PRICING
// ============================================================

export const HORMONE_PRICING = {
  testosteroneMale: {
    name: 'Testosterone (Men)',
    monthlyPrice: 199,
    description: 'Cypionate injection',
  },
  testosteroneFemale: {
    name: 'Testosterone (Women)',
    monthlyPrice: 149,
    description: 'Low-dose protocol',
  },
  progesterone: {
    name: 'Progesterone',
    monthlyPrice: 89,
    description: 'Oral or topical',
  },
  estrogen: {
    name: 'Bi-Est / Estrogen',
    monthlyPrice: 99,
    description: 'Customized dosing',
  },
} as const;

// ============================================================
// SUBSCRIPTION TIER PRICING (from subscription-tiers.ts)
// Re-exported for convenience
// ============================================================

export { SUBSCRIPTION_TIERS } from './subscriptions/subscription-tiers';

// ============================================================
// PRICING HELPERS
// ============================================================

/**
 * Calculate retail price from wholesale cost
 * Formula: (cost × 2.5) + $25 shipping
 */
export function calculateRetailPrice(wholesaleCost: number): number {
  return Math.round(wholesaleCost * 2.5 + 25);
}

/**
 * Calculate profit margin
 */
export function calculateMargin(retailPrice: number, wholesaleCost: number): number {
  return retailPrice - wholesaleCost - 25; // Subtract shipping
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

/**
 * Format monthly price
 */
export function formatMonthlyPrice(price: number): string {
  return `$${price}/mo`;
}

// ============================================================
// PRICE RANGES FOR MARKETING (use these, not hardcoded)
// ============================================================

export const PRICE_RANGES = {
  vitaminInjectables: { from: 89, to: 375 },
  weightLoss: { from: 299, to: 449 },
  peptides: { from: 179, to: 349 },
  hormones: { from: 89, to: 199 },
  consultation: CONSULTATION_PRICE,
} as const;

export function getPriceRangeLabel(category: keyof typeof PRICE_RANGES): string {
  const range = PRICE_RANGES[category];
  if (typeof range === 'number') {
    return formatPrice(range);
  }
  return `${formatPrice(range.from)} - ${formatPrice(range.to)}`;
}
