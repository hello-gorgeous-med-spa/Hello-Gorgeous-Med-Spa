/**
 * RE GEN Pricing Sync
 * Canonical source of pricing for RE GEN products.
 * Used by checkout validation and can be exposed via API for storefront sync.
 */

import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { PEPTIDE_RETAIL_MENU, PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";

export const REGEN_SHIPPING_USD = 30; // Flat shipping for all RE GEN orders

export type RegenProductPrice = {
  id: string;
  name: string;
  category: string;
  priceUsd: number;
  priceLabel: string;
  isFromPrice: boolean; // True if this is a "from $X" price
  rx: boolean;
};

/**
 * Weight Loss Products
 */
export const REGEN_WEIGHT_LOSS_PRICING: RegenProductPrice[] = [
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    category: "weight-loss",
    priceUsd: GLP1_PROGRAM.injectable.semaglutideFromUsd,
    priceLabel: `From $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo`,
    isFromPrice: true,
    rx: true,
  },
  {
    id: "tirzepatide",
    name: "Compounded Tirzepatide",
    category: "weight-loss",
    priceUsd: GLP1_PROGRAM.injectable.tirzepatideFromUsd,
    priceLabel: `From $${GLP1_PROGRAM.injectable.tirzepatideFromUsd}/mo`,
    isFromPrice: true,
    rx: true,
  },
  {
    id: "lipomino",
    name: "Lipo-Mino Injection",
    category: "weight-loss",
    priceUsd: 45,
    priceLabel: "$45/injection",
    isFromPrice: false,
    rx: false,
  },
];

/**
 * Sexual Health Products
 */
export const REGEN_SEXUAL_HEALTH_PRICING: RegenProductPrice[] = [
  {
    id: "sildenafil",
    name: "Sildenafil (Generic Viagra)",
    category: "sexual-health",
    priceUsd: 35,
    priceLabel: "From $35/mo",
    isFromPrice: true,
    rx: true,
  },
  {
    id: "tadalafil",
    name: "Tadalafil (Generic Cialis)",
    category: "sexual-health",
    priceUsd: 45,
    priceLabel: "From $45/mo",
    isFromPrice: true,
    rx: true,
  },
  {
    id: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "sexual-health",
    priceUsd: 175,
    priceLabel: "From $175/mo",
    isFromPrice: true,
    rx: true,
  },
  {
    id: "scream-cream",
    name: "Scream Cream",
    category: "sexual-health",
    priceUsd: 89,
    priceLabel: "$89/month",
    isFromPrice: false,
    rx: true,
  },
];

/**
 * Build peptide pricing from retail menu
 */
export const REGEN_PEPTIDE_PRICING: RegenProductPrice[] = PEPTIDE_RETAIL_MENU.map((p) => ({
  id: p.id,
  name: p.name,
  category: "daily-wellness",
  priceUsd: p.fromMonthlyUsd,
  priceLabel: `From $${p.fromMonthlyUsd}/mo`,
  isFromPrice: true,
  rx: true,
}));

/**
 * Hormone Products
 */
export const REGEN_HORMONE_PRICING: RegenProductPrice[] = [
  {
    id: "testosterone-cypionate",
    name: "Testosterone Cypionate",
    category: "hormones",
    priceUsd: 149,
    priceLabel: "From $149/mo",
    isFromPrice: true,
    rx: true,
  },
  {
    id: "hcg",
    name: "HCG",
    category: "hormones",
    priceUsd: 99,
    priceLabel: "From $99/mo",
    isFromPrice: true,
    rx: true,
  },
  {
    id: "enclomiphene",
    name: "Enclomiphene",
    category: "hormones",
    priceUsd: 89,
    priceLabel: "$89/mo",
    isFromPrice: false,
    rx: true,
  },
  {
    id: "dhea",
    name: "DHEA",
    category: "hormones",
    priceUsd: 45,
    priceLabel: "$45/mo",
    isFromPrice: false,
    rx: true,
  },
];

/**
 * Hair & Skin Products
 */
export const REGEN_HAIR_SKIN_PRICING: RegenProductPrice[] = [
  {
    id: "manetain",
    name: "Manetain (Hair Regrowth)",
    category: "hair-skin",
    priceUsd: 89,
    priceLabel: "$89/mo",
    isFromPrice: false,
    rx: true,
  },
  {
    id: "finasteride",
    name: "Finasteride",
    category: "hair-skin",
    priceUsd: 35,
    priceLabel: "$35/mo",
    isFromPrice: false,
    rx: true,
  },
  {
    id: "tretinoin",
    name: "Tretinoin Cream",
    category: "hair-skin",
    priceUsd: 65,
    priceLabel: "$65/mo",
    isFromPrice: false,
    rx: true,
  },
];

/**
 * Vitamins & Injections
 */
export const REGEN_VITAMIN_PRICING: RegenProductPrice[] = [
  {
    id: "b12",
    name: "B12 Injection",
    category: "daily-wellness",
    priceUsd: 35,
    priceLabel: "$35/injection",
    isFromPrice: false,
    rx: false,
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3 Injection",
    category: "daily-wellness",
    priceUsd: 45,
    priceLabel: "$45/injection",
    isFromPrice: false,
    rx: false,
  },
  {
    id: "glutathione",
    name: "Glutathione Push",
    category: "daily-wellness",
    priceUsd: 55,
    priceLabel: "$55/push",
    isFromPrice: false,
    rx: false,
  },
];

/**
 * All RE GEN products
 */
export const ALL_REGEN_PRICING: RegenProductPrice[] = [
  ...REGEN_WEIGHT_LOSS_PRICING,
  ...REGEN_SEXUAL_HEALTH_PRICING,
  ...REGEN_PEPTIDE_PRICING,
  ...REGEN_HORMONE_PRICING,
  ...REGEN_HAIR_SKIN_PRICING,
  ...REGEN_VITAMIN_PRICING,
];

/**
 * Get price for a product by ID
 */
export function getRegenProductPrice(productId: string): RegenProductPrice | null {
  const normalizedId = productId.toLowerCase().replace(/\s+/g, "-");
  return ALL_REGEN_PRICING.find(
    (p) => p.id === normalizedId || p.name.toLowerCase().replace(/\s+/g, "-") === normalizedId
  ) || null;
}

/**
 * Validate cart item prices against canonical pricing
 * Returns adjusted items if prices don't match
 */
export function validateCartPricing(
  items: Array<{ id: string; name: string; price: number; quantity: number }>
): { valid: boolean; items: typeof items; warnings: string[] } {
  const warnings: string[] = [];
  const validatedItems = items.map((item) => {
    const canonicalPrice = getRegenProductPrice(item.id);
    if (canonicalPrice && Math.abs(canonicalPrice.priceUsd - item.price) > 1) {
      warnings.push(
        `Price mismatch for ${item.name}: storefront $${item.price}, actual $${canonicalPrice.priceUsd}`
      );
      return { ...item, price: canonicalPrice.priceUsd };
    }
    return item;
  });

  return {
    valid: warnings.length === 0,
    items: validatedItems,
    warnings,
  };
}

/**
 * Calculate cart total with shipping
 */
export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>
): { subtotal: number; shipping: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? REGEN_SHIPPING_USD : 0;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
