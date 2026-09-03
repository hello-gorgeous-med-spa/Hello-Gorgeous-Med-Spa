/**
 * REGEN RX Subscription Tiers
 * All monthly subscription plans with pricing and margin data
 */

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  category: 'weight-loss' | 'vitamins' | 'peptides' | 'hormones' | 'skincare' | 'hair' | 'sexual-health';
  monthlyPriceUsd: number;
  estimatedCostUsd: number;
  includes: string[];
  popular?: boolean;
  badge?: string;
  stripeProductId?: string;
  stripePriceId?: string;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  // ═══════════════════════════════════════════════════════════════════
  // WEIGHT LOSS (GLP-1)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'weight-loss-starter',
    name: 'Weight Loss - Starter',
    description: 'Semaglutide starting dose for new patients',
    category: 'weight-loss',
    monthlyPriceUsd: 299,
    estimatedCostUsd: 65,
    popular: true,
    badge: 'Most Popular',
    includes: [
      'Semaglutide 2.5mg monthly supply',
      'Provider oversight & messaging',
      'Injection supplies included',
      'Free shipping',
      'Dosing guidance',
    ],
  },
  {
    id: 'weight-loss-maintenance',
    name: 'Weight Loss - Maintenance',
    description: 'Semaglutide higher doses for continued progress',
    category: 'weight-loss',
    monthlyPriceUsd: 399,
    estimatedCostUsd: 100,
    includes: [
      'Semaglutide 5-10mg monthly supply',
      'Provider oversight & messaging',
      'Injection supplies included',
      'Free shipping',
      'Dose adjustments as needed',
    ],
  },
  {
    id: 'weight-loss-premium',
    name: 'Weight Loss - Premium',
    description: 'Tirzepatide for maximum results',
    category: 'weight-loss',
    monthlyPriceUsd: 449,
    estimatedCostUsd: 130,
    badge: 'Best Results',
    includes: [
      'Tirzepatide monthly supply',
      'Provider oversight & messaging',
      'Injection supplies included',
      'Free shipping',
      'Priority support',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // VITAMIN INJECTABLES
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'vitamin-boost',
    name: 'Vitamin Boost',
    description: 'Monthly B12 or Biotin injections',
    category: 'vitamins',
    monthlyPriceUsd: 79,
    estimatedCostUsd: 25,
    includes: [
      'B12 OR Biotin vial (your choice)',
      '4-week supply',
      'Syringes included',
      'Free shipping',
    ],
  },
  {
    id: 'glow-package',
    name: 'Glow Package',
    description: 'Glutathione + B12 combo for skin & energy',
    category: 'vitamins',
    monthlyPriceUsd: 149,
    estimatedCostUsd: 50,
    popular: true,
    includes: [
      'Glutathione vial',
      'B12 vial',
      '8-week supply total',
      'Syringes included',
      'Free shipping',
    ],
  },
  {
    id: 'longevity-stack',
    name: 'Longevity Stack',
    description: 'NAD+ for cellular energy & anti-aging',
    category: 'vitamins',
    monthlyPriceUsd: 199,
    estimatedCostUsd: 70,
    badge: 'Anti-Aging',
    includes: [
      'NAD+ 250mg vial',
      'Provider oversight',
      'Monthly supply',
      'Syringes included',
      'Free shipping',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // PEPTIDES
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'peptide-recovery',
    name: 'Peptide Recovery',
    description: 'BPC-157 for healing & recovery',
    category: 'peptides',
    monthlyPriceUsd: 349,
    estimatedCostUsd: 130,
    includes: [
      'BPC-157 15mg vial',
      'Provider dosing protocol',
      'Injection supplies',
      'Free shipping',
      'Recovery guidance',
    ],
  },
  {
    id: 'peptide-performance',
    name: 'Peptide Performance',
    description: 'BPC-157 + TB-500 combo for athletes',
    category: 'peptides',
    monthlyPriceUsd: 449,
    estimatedCostUsd: 160,
    badge: 'Athletes Choice',
    includes: [
      'BPC-157/TB-500 combo vial',
      'Provider dosing protocol',
      'Injection supplies',
      'Free shipping',
      'Performance optimization',
    ],
  },
  {
    id: 'growth-optimization',
    name: 'Growth Optimization',
    description: 'CJC/Ipamorelin for HGH support',
    category: 'peptides',
    monthlyPriceUsd: 399,
    estimatedCostUsd: 160,
    includes: [
      'CJC-1295/Ipamorelin vial',
      'Provider oversight',
      'Injection supplies',
      'Free shipping',
      'Sleep & recovery support',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // HORMONE THERAPY
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hrt-women',
    name: 'HRT - Women',
    description: 'Bioidentical hormone optimization',
    category: 'hormones',
    monthlyPriceUsd: 149,
    estimatedCostUsd: 45,
    includes: [
      'Custom hormone compounds',
      'Provider oversight',
      'Lab coordination',
      'Free shipping',
      'Symptom tracking',
    ],
  },
  {
    id: 'hrt-men-trt',
    name: 'HRT - Men (TRT)',
    description: 'Testosterone replacement therapy',
    category: 'hormones',
    monthlyPriceUsd: 179,
    estimatedCostUsd: 35,
    popular: true,
    includes: [
      'Testosterone cypionate',
      'AI (anastrozole) if needed',
      'Provider oversight',
      'Injection supplies',
      'Free shipping',
      'Lab coordination',
    ],
  },
  {
    id: 'thyroid-support',
    name: 'Thyroid Support',
    description: 'T3/T4 optimization',
    category: 'hormones',
    monthlyPriceUsd: 99,
    estimatedCostUsd: 30,
    includes: [
      'T3/T4 compounds',
      'Provider oversight',
      'Lab coordination',
      'Free shipping',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SKINCARE
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'skincare-essentials',
    name: 'Skincare Essentials',
    description: 'Tretinoin for anti-aging',
    category: 'skincare',
    monthlyPriceUsd: 89,
    estimatedCostUsd: 35,
    includes: [
      'Tretinoin cream',
      'Provider oversight',
      '90-day supply',
      'Free shipping',
      'Skin guidance',
    ],
  },
  {
    id: 'skincare-advanced',
    name: 'Skincare Advanced',
    description: 'Custom anti-aging blend',
    category: 'skincare',
    monthlyPriceUsd: 149,
    estimatedCostUsd: 55,
    popular: true,
    includes: [
      'Custom compound (Tretinoin + actives)',
      'Provider oversight',
      '90-day supply',
      'Free shipping',
      'Personalized protocol',
    ],
  },
  {
    id: 'skincare-brightening',
    name: 'Skincare Brightening',
    description: 'Hyperpigmentation treatment',
    category: 'skincare',
    monthlyPriceUsd: 125,
    estimatedCostUsd: 45,
    includes: [
      'Hydroquinone blend',
      'Provider oversight',
      '90-day supply',
      'Free shipping',
      'Sun protection guidance',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // HAIR RESTORATION
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hair-oral',
    name: 'Hair - Oral Treatment',
    description: 'Oral minoxidil for hair growth',
    category: 'hair',
    monthlyPriceUsd: 49,
    estimatedCostUsd: 15,
    includes: [
      'Oral minoxidil 2.5mg',
      'Provider oversight',
      '30-day supply',
      'Free shipping',
    ],
  },
  {
    id: 'hair-topical',
    name: 'Hair - Topical Treatment',
    description: 'Finasteride/Minoxidil foam',
    category: 'hair',
    monthlyPriceUsd: 89,
    estimatedCostUsd: 30,
    popular: true,
    includes: [
      'Finasteride/Minoxidil foam',
      'Provider oversight',
      '60-day supply',
      'Free shipping',
    ],
  },
  {
    id: 'hair-complete',
    name: 'Hair - Complete Protocol',
    description: 'Oral + topical combo',
    category: 'hair',
    monthlyPriceUsd: 129,
    estimatedCostUsd: 40,
    badge: 'Best Value',
    includes: [
      'Oral minoxidil',
      'Topical finasteride/minoxidil',
      'Provider oversight',
      'Free shipping',
      'Progress tracking',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEXUAL HEALTH
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'ed-basic',
    name: 'ED - Basic',
    description: 'Sildenafil as needed',
    category: 'sexual-health',
    monthlyPriceUsd: 49,
    estimatedCostUsd: 15,
    includes: [
      'Sildenafil 20mg (10 tablets)',
      'Provider oversight',
      'Discreet shipping',
    ],
  },
  {
    id: 'ed-daily',
    name: 'ED - Daily',
    description: 'Daily tadalafil for spontaneity',
    category: 'sexual-health',
    monthlyPriceUsd: 79,
    estimatedCostUsd: 25,
    popular: true,
    includes: [
      'Tadalafil 5mg (30 tablets)',
      'Provider oversight',
      'Discreet shipping',
    ],
  },
  {
    id: 'ed-premium',
    name: 'ED - Premium',
    description: 'Combo troches for max effect',
    category: 'sexual-health',
    monthlyPriceUsd: 129,
    estimatedCostUsd: 40,
    includes: [
      'Sildenafil/Tadalafil troches',
      'Provider oversight',
      'Discreet shipping',
      'Fast-acting formula',
    ],
  },
  {
    id: 'desire-boost',
    name: 'Desire Boost',
    description: 'PT-141 for libido (men & women)',
    category: 'sexual-health',
    monthlyPriceUsd: 199,
    estimatedCostUsd: 70,
    includes: [
      'PT-141 vial',
      'Provider dosing protocol',
      'Injection supplies',
      'Discreet shipping',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getSubscriptionTierById(id: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find(t => t.id === id);
}

export function getSubscriptionTiersByCategory(category: SubscriptionTier['category']): SubscriptionTier[] {
  return SUBSCRIPTION_TIERS.filter(t => t.category === category);
}

export function getPopularTiers(): SubscriptionTier[] {
  return SUBSCRIPTION_TIERS.filter(t => t.popular);
}

export function calculateMargin(tier: SubscriptionTier): { profit: number; marginPct: number } {
  const profit = tier.monthlyPriceUsd - tier.estimatedCostUsd;
  const marginPct = (profit / tier.monthlyPriceUsd) * 100;
  return { profit, marginPct };
}

// Category metadata for display
export const SUBSCRIPTION_CATEGORIES = {
  'weight-loss': {
    name: 'Weight Loss',
    description: 'GLP-1 medications for sustainable weight loss',
    icon: '⚖️',
    color: '#E91E8C',
  },
  'vitamins': {
    name: 'Vitamin Injectables',
    description: 'Energy, immunity & wellness shots',
    icon: '💉',
    color: '#0D9488',
  },
  'peptides': {
    name: 'Peptide Therapy',
    description: 'Recovery, performance & longevity',
    icon: '🧬',
    color: '#8B5CF6',
  },
  'hormones': {
    name: 'Hormone Therapy',
    description: 'HRT for women & men',
    icon: '⚡',
    color: '#F59E0B',
  },
  'skincare': {
    name: 'Rx Skincare',
    description: 'Prescription anti-aging treatments',
    icon: '✨',
    color: '#EC4899',
  },
  'hair': {
    name: 'Hair Restoration',
    description: 'Prescription hair growth treatments',
    icon: '💇',
    color: '#6366F1',
  },
  'sexual-health': {
    name: 'Sexual Wellness',
    description: 'Discreet, effective solutions',
    icon: '❤️',
    color: '#EF4444',
  },
} as const;

// Prepay discount tiers
export const PREPAY_DISCOUNTS = {
  3: 0.10,  // 10% off for 3-month prepay
  6: 0.15,  // 15% off for 6-month prepay
  12: 0.20, // 20% off for 12-month prepay
} as const;

export function calculatePrepayPrice(tier: SubscriptionTier, months: 3 | 6 | 12): number {
  const discount = PREPAY_DISCOUNTS[months];
  const total = tier.monthlyPriceUsd * months;
  return Math.round(total * (1 - discount));
}
