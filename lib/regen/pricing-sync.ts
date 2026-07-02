/**
 * RE GEN Pricing Sync
 * Canonical source of pricing for RE GEN products.
 * 
 * PRICING FORMULA:
 * - Retail = Wholesale × 2.5
 * - 90-day = (Retail × 3) × 0.90 (10% discount)
 * - Shipping = $30 flat
 * 
 * Source: data/regen-best-prices.json (from pharmacy bible)
 */

export const REGEN_MARKUP = 2.5;
export const REGEN_90DAY_DISCOUNT = 0.10; // 10% off
export const REGEN_SHIPPING_USD = 30; // Flat shipping for all RE GEN orders

export type RegenProductPrice = {
  id: string;
  name: string;
  category: string;
  wholesale: number;
  retail30: number;
  retail90: number;
  savings90: number;
  priceLabel: string;
  isFromPrice: boolean;
  rx: boolean;
  coldShip?: boolean;
  controlled?: boolean;
};

/**
 * Calculate retail pricing from wholesale
 */
export function calcRetailPricing(wholesale: number): {
  retail30: number;
  retail90: number;
  savings90: number;
} {
  const retail30 = Math.round(wholesale * REGEN_MARKUP * 100) / 100;
  const full90 = retail30 * 3;
  const retail90 = Math.round(full90 * (1 - REGEN_90DAY_DISCOUNT) * 100) / 100;
  const savings90 = Math.round((full90 - retail90) * 100) / 100;
  return { retail30, retail90, savings90 };
}

/**
 * Weight Loss Products (from verified pharmacy bible)
 */
export const REGEN_WEIGHT_LOSS_PRICING: RegenProductPrice[] = [
  // Semaglutide
  { id: "semaglutide-2.5mg", name: "Compounded Semaglutide 2.5mg", category: "weight-loss", wholesale: 35, ...calcRetailPricing(35), priceLabel: "$87.50/mo", isFromPrice: true, rx: true, coldShip: true },
  { id: "semaglutide-4mg", name: "Compounded Semaglutide 4mg", category: "weight-loss", wholesale: 50, ...calcRetailPricing(50), priceLabel: "$125/mo", isFromPrice: false, rx: true },
  { id: "semaglutide-8mg", name: "Compounded Semaglutide 8mg", category: "weight-loss", wholesale: 70, ...calcRetailPricing(70), priceLabel: "$175/mo", isFromPrice: false, rx: true },
  { id: "semaglutide-16mg", name: "Compounded Semaglutide 16mg", category: "weight-loss", wholesale: 110, ...calcRetailPricing(110), priceLabel: "$275/mo", isFromPrice: false, rx: true },
  // Tirzepatide
  { id: "tirzepatide-10mg", name: "Compounded Tirzepatide 10mg", category: "weight-loss", wholesale: 50, ...calcRetailPricing(50), priceLabel: "$125/mo", isFromPrice: true, rx: true },
  { id: "tirzepatide-20mg", name: "Compounded Tirzepatide 20mg", category: "weight-loss", wholesale: 90, ...calcRetailPricing(90), priceLabel: "$225/mo", isFromPrice: false, rx: true },
  { id: "tirzepatide-40mg", name: "Compounded Tirzepatide 40mg", category: "weight-loss", wholesale: 130, ...calcRetailPricing(130), priceLabel: "$325/mo", isFromPrice: false, rx: true },
  { id: "tirzepatide-60mg", name: "Compounded Tirzepatide 60mg", category: "weight-loss", wholesale: 150, ...calcRetailPricing(150), priceLabel: "$375/mo", isFromPrice: false, rx: true },
  // Lipo-Mino
  { id: "lipomino-30ml", name: "Lipo-Mino Mix (MIC) 30mL", category: "weight-loss", wholesale: 80.5, ...calcRetailPricing(80.5), priceLabel: "$201.25/vial", isFromPrice: false, rx: false },
  { id: "lipomino-10ml", name: "Lipo-Mino Mix (MIC) 10mL", category: "weight-loss", wholesale: 36.8, ...calcRetailPricing(36.8), priceLabel: "$92/vial", isFromPrice: false, rx: false },
];

/**
 * Peptides & Daily Wellness (from verified pharmacy bible)
 */
export const REGEN_PEPTIDE_PRICING: RegenProductPrice[] = [
  // NAD+
  { id: "nad-5ml", name: "NAD+ Injection 1mg/mL 5mL", category: "daily-wellness", wholesale: 35, ...calcRetailPricing(35), priceLabel: "$87.50/vial", isFromPrice: true, rx: true, coldShip: true },
  { id: "nad-10ml-50", name: "NAD+ Injection 50mg/mL 10mL", category: "daily-wellness", wholesale: 45, ...calcRetailPricing(45), priceLabel: "$112.50/vial", isFromPrice: false, rx: true, coldShip: true },
  { id: "nad-10ml-100", name: "NAD+ Injection 100mg/mL 10mL", category: "daily-wellness", wholesale: 60, ...calcRetailPricing(60), priceLabel: "$150/vial", isFromPrice: false, rx: true },
  { id: "nadvantage", name: "NADvantage Face Cream", category: "daily-wellness", wholesale: 71, ...calcRetailPricing(71), priceLabel: "$177.50/tube", isFromPrice: false, rx: false },
  // Sermorelin
  { id: "sermorelin-6ml", name: "Sermorelin Injection 1mg/mL 6mL", category: "daily-wellness", wholesale: 38, ...calcRetailPricing(38), priceLabel: "$95/vial", isFromPrice: true, rx: true, coldShip: true },
  { id: "sermorelin-6ml-1.5", name: "Sermorelin Injection 1.5mg/mL 6mL", category: "daily-wellness", wholesale: 49, ...calcRetailPricing(49), priceLabel: "$122.50/vial", isFromPrice: false, rx: true, coldShip: true },
  { id: "sermorelin-12ml", name: "Sermorelin Injection 12mL (2-pack)", category: "daily-wellness", wholesale: 85, ...calcRetailPricing(85), priceLabel: "$212.50/pack", isFromPrice: false, rx: true, coldShip: true },
  // BPC-157
  { id: "bpc-157", name: "BPC-157 Injection", category: "daily-wellness", wholesale: 70, ...calcRetailPricing(70), priceLabel: "$175/vial", isFromPrice: false, rx: true },
  // Tesamorelin
  { id: "tesamorelin", name: "Tesamorelin Injection", category: "daily-wellness", wholesale: 70, ...calcRetailPricing(70), priceLabel: "$175/vial", isFromPrice: false, rx: true },
  // CJC/Ipamorelin
  { id: "cjc-ipamorelin", name: "CJC-1295 / Ipamorelin Combo", category: "daily-wellness", wholesale: 80, ...calcRetailPricing(80), priceLabel: "$200/vial", isFromPrice: false, rx: true },
  // Glutathione
  { id: "glutathione-5ml", name: "Glutathione Injection 5mL", category: "daily-wellness", wholesale: 26.45, ...calcRetailPricing(26.45), priceLabel: "$66.13/vial", isFromPrice: true, rx: false },
  { id: "glutathione-30ml", name: "Glutathione Injection 30mL", category: "daily-wellness", wholesale: 58, ...calcRetailPricing(58), priceLabel: "$145/vial", isFromPrice: false, rx: false },
  // Methylene Blue (Anti-Aging)
  { id: "methylene-blue-15mg", name: "Methylene Blue 15mg 30 caps", category: "daily-wellness", wholesale: 55, ...calcRetailPricing(55), priceLabel: "$137.50/30ct", isFromPrice: true, rx: true },
  { id: "methylene-blue-25mg", name: "Methylene Blue 25mg 30 caps", category: "daily-wellness", wholesale: 75, ...calcRetailPricing(75), priceLabel: "$187.50/30ct", isFromPrice: false, rx: true },
  { id: "methylene-blue-45mg", name: "Methylene Blue 45mg 30 caps", category: "daily-wellness", wholesale: 119, ...calcRetailPricing(119), priceLabel: "$297.50/30ct", isFromPrice: false, rx: true },
];

/**
 * Vitamin Injections (from verified pharmacy bible)
 */
export const REGEN_VITAMIN_PRICING: RegenProductPrice[] = [
  { id: "b12-10ml", name: "B12 Methylcobalamin 10mL", category: "vitamins", wholesale: 29.1, ...calcRetailPricing(29.1), priceLabel: "$72.75/vial", isFromPrice: true, rx: false },
  { id: "b12-30ml", name: "B12 Methylcobalamin 30mL", category: "vitamins", wholesale: 64.8, ...calcRetailPricing(64.8), priceLabel: "$162/vial", isFromPrice: false, rx: false },
  { id: "vitamin-d3", name: "Vitamin D3 Injection 30mL", category: "vitamins", wholesale: 59.51, ...calcRetailPricing(59.51), priceLabel: "$148.78/vial", isFromPrice: false, rx: false },
  { id: "biotin-low", name: "Biotin LOW 0.5mg/mL 10mL", category: "vitamins", wholesale: 33.06, ...calcRetailPricing(33.06), priceLabel: "$82.65/vial", isFromPrice: true, rx: false },
  { id: "biotin-high", name: "Biotin HIGH 10mg/mL 10mL", category: "vitamins", wholesale: 56.35, ...calcRetailPricing(56.35), priceLabel: "$140.88/vial", isFromPrice: false, rx: false },
  { id: "ldn-30", name: "Low Dose Naltrexone 30 caps", category: "vitamins", wholesale: 27.5, ...calcRetailPricing(27.5), priceLabel: "$68.75/30ct", isFromPrice: true, rx: true },
  { id: "ldn-90", name: "Low Dose Naltrexone 90 caps", category: "vitamins", wholesale: 70, ...calcRetailPricing(70), priceLabel: "$175/90ct", isFromPrice: false, rx: true },
];

/**
 * Hormones (from verified pharmacy bible)
 */
export const REGEN_HORMONE_PRICING: RegenProductPrice[] = [
  // Testosterone - Men
  { id: "test-cyp-5ml", name: "Testosterone Cypionate 5mL", category: "hormones", wholesale: 22, ...calcRetailPricing(22), priceLabel: "$55/vial", isFromPrice: true, rx: true, controlled: true },
  { id: "test-cyp-10ml", name: "Testosterone Cypionate 10mL", category: "hormones", wholesale: 40, ...calcRetailPricing(40), priceLabel: "$100/vial", isFromPrice: false, rx: true, controlled: true },
  { id: "test-cream", name: "Testosterone Cream", category: "hormones", wholesale: 35, ...calcRetailPricing(35), priceLabel: "$87.50/tube", isFromPrice: false, rx: true, controlled: true },
  { id: "test-anastrozole", name: "Test Cyp / Anastrozole Combo", category: "hormones", wholesale: 30, ...calcRetailPricing(30), priceLabel: "$75/vial", isFromPrice: true, rx: true, controlled: true },
  // Clomiphene
  { id: "clomiphene", name: "Clomiphene 30 tablets", category: "hormones", wholesale: 45, ...calcRetailPricing(45), priceLabel: "$112.50/30ct", isFromPrice: false, rx: true },
  // Anastrozole
  { id: "anastrozole", name: "Anastrozole 30 capsules", category: "hormones", wholesale: 39, ...calcRetailPricing(39), priceLabel: "$97.50/30ct", isFromPrice: false, rx: true },
  // Women's hormones
  { id: "estradiol-rdt", name: "Estradiol RDT 30 tablets", category: "hormones", wholesale: 30, ...calcRetailPricing(30), priceLabel: "$75/30ct", isFromPrice: false, rx: true },
  { id: "biest-cream", name: "Bi-Est 80/20 Cream", category: "hormones", wholesale: 36, ...calcRetailPricing(36), priceLabel: "$90/tube", isFromPrice: false, rx: true },
  { id: "progesterone-cream", name: "Progesterone Cream 10%", category: "hormones", wholesale: 41, ...calcRetailPricing(41), priceLabel: "$102.50/tube", isFromPrice: false, rx: true },
  { id: "progesterone-caps", name: "Progesterone 30 capsules", category: "hormones", wholesale: 25.5, ...calcRetailPricing(25.5), priceLabel: "$63.75/30ct", isFromPrice: false, rx: true },
];

/**
 * Sexual Health (from verified pharmacy bible)
 */
export const REGEN_SEXUAL_HEALTH_PRICING: RegenProductPrice[] = [
  { id: "sildenafil-rdt", name: "Sildenafil RDT 10 tablets", category: "sexual-health", wholesale: 50, ...calcRetailPricing(50), priceLabel: "$125/10ct", isFromPrice: true, rx: true },
  { id: "tadalafil-rdt", name: "Tadalafil RDT 10 tablets", category: "sexual-health", wholesale: 50, ...calcRetailPricing(50), priceLabel: "$125/10ct", isFromPrice: false, rx: true },
  { id: "maxx-pe", name: "MAXX PE (Triple Combo) 10 tablets", category: "sexual-health", wholesale: 60, ...calcRetailPricing(60), priceLabel: "$150/10ct", isFromPrice: false, rx: true },
  { id: "pt-141-inj", name: "PT-141 Injection 5mL", category: "sexual-health", wholesale: 70, ...calcRetailPricing(70), priceLabel: "$175/vial", isFromPrice: false, rx: true },
  { id: "scream-cream", name: "Scream Cream", category: "sexual-health", wholesale: 50, ...calcRetailPricing(50), priceLabel: "$125/tube", isFromPrice: false, rx: true },
];

/**
 * Hair & Skin (from verified pharmacy bible)
 */
export const REGEN_HAIR_SKIN_PRICING: RegenProductPrice[] = [
  { id: "minoxidil-oral", name: "Minoxidil Oral 30 caps", category: "hair-skin", wholesale: 38, ...calcRetailPricing(38), priceLabel: "$95/30ct", isFromPrice: true, rx: true, coldShip: true },
  { id: "manetain", name: "ManeTain Hair Spray", category: "hair-skin", wholesale: 69, ...calcRetailPricing(69), priceLabel: "$172.50", isFromPrice: false, rx: true },
  { id: "ghk-cu-05", name: "GHK-Cu Cream 0.5%", category: "hair-skin", wholesale: 50, ...calcRetailPricing(50), priceLabel: "$125/tube", isFromPrice: true, rx: false },
  { id: "ghk-cu-2", name: "GHK-Cu Cream 2%", category: "hair-skin", wholesale: 65, ...calcRetailPricing(65), priceLabel: "$162.50/tube", isFromPrice: false, rx: false },
  { id: "ghk-cu-4", name: "GHK-Cu Cream 4% (Max)", category: "hair-skin", wholesale: 71, ...calcRetailPricing(71), priceLabel: "$177.50/tube", isFromPrice: false, rx: false },
];

/**
 * All RE GEN products (combined)
 */
export const ALL_REGEN_PRICING: RegenProductPrice[] = [
  ...REGEN_WEIGHT_LOSS_PRICING,
  ...REGEN_PEPTIDE_PRICING,
  ...REGEN_VITAMIN_PRICING,
  ...REGEN_HORMONE_PRICING,
  ...REGEN_SEXUAL_HEALTH_PRICING,
  ...REGEN_HAIR_SKIN_PRICING,
];

/**
 * Get price for a product by ID
 */
export function getRegenProductPrice(productId: string): RegenProductPrice | null {
  const normalizedId = productId.toLowerCase().replace(/\s+/g, "-");
  return ALL_REGEN_PRICING.find(
    (p) => p.id === normalizedId || 
           p.id.includes(normalizedId) ||
           p.name.toLowerCase().replace(/\s+/g, "-").includes(normalizedId)
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
    if (canonicalPrice && Math.abs(canonicalPrice.retail30 - item.price) > 1) {
      warnings.push(
        `Price mismatch for ${item.name}: submitted $${item.price}, canonical $${canonicalPrice.retail30}`
      );
      return { ...item, price: canonicalPrice.retail30 };
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
