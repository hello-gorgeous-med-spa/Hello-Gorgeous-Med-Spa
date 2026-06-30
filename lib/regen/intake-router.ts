/**
 * RE GEN Intake Router
 * Maps storefront products/categories to their appropriate intake forms.
 * After intake completion, patients are routed to payment.
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  PEPTIDE_REQUEST_PATH,
  HRT_REQUEST_PATH,
  LAB_REQUEST_PATH,
} from "@/lib/flows";

export type RegenCategory =
  | "weight-loss"
  | "daily-wellness"
  | "sexual-health"
  | "hormones"
  | "hair-skin"
  | "labs";

export type RegenProductRoute = {
  intakePath: string;
  intakeType: "glp1" | "peptide" | "hrt" | "lab" | "general";
  requiresIntake: boolean;
  description: string;
};

/**
 * Category → Intake mapping
 * Each category routes to its appropriate medical intake form
 */
export const REGEN_CATEGORY_INTAKES: Record<RegenCategory, RegenProductRoute> = {
  "weight-loss": {
    intakePath: GLP1_INTAKE_PATH,
    intakeType: "glp1",
    requiresIntake: true,
    description: "GLP-1 weight loss screening",
  },
  "daily-wellness": {
    intakePath: PEPTIDE_REQUEST_PATH,
    intakeType: "peptide",
    requiresIntake: true,
    description: "Peptide therapy request",
  },
  "sexual-health": {
    intakePath: PEPTIDE_REQUEST_PATH, // Sexual health uses peptide intake with specific products
    intakeType: "peptide",
    requiresIntake: true,
    description: "Sexual health medication request",
  },
  "hormones": {
    intakePath: HRT_REQUEST_PATH,
    intakeType: "hrt",
    requiresIntake: true,
    description: "Hormone therapy request",
  },
  "hair-skin": {
    intakePath: PEPTIDE_REQUEST_PATH, // Hair/skin Rx uses peptide intake
    intakeType: "peptide",
    requiresIntake: true,
    description: "Hair & skin prescription request",
  },
  "labs": {
    intakePath: LAB_REQUEST_PATH,
    intakeType: "lab",
    requiresIntake: true,
    description: "Lab panel request",
  },
};

/**
 * Product ID → Category mapping
 * Specific products map to their category for intake routing
 */
export const REGEN_PRODUCT_CATEGORIES: Record<string, RegenCategory> = {
  // Weight Loss
  "semaglutide": "weight-loss",
  "tirzepatide": "weight-loss",
  "lipomino": "weight-loss",
  "glp1-refill": "weight-loss",
  
  // Daily Wellness / Peptides
  "nad-sermorelin": "daily-wellness",
  "nad-plus": "daily-wellness",
  "nadvantage": "daily-wellness",
  "bpc-157": "daily-wellness",
  "sermorelin": "daily-wellness",
  "ipamorelin": "daily-wellness",
  "cjc-1295": "daily-wellness",
  "pt-141": "daily-wellness",
  "mots-c": "daily-wellness",
  "thymosin-alpha": "daily-wellness",
  
  // Sexual Health
  "sildenafil": "sexual-health",
  "tadalafil": "sexual-health",
  "maxxpe": "sexual-health",
  "scream-cream": "sexual-health",
  "oxytocin": "sexual-health",
  
  // Hormones
  "testosterone": "hormones",
  "hcg": "hormones",
  "enclomiphene": "hormones",
  "dhea": "hormones",
  "progesterone": "hormones",
  "estrogen": "hormones",
  
  // Hair & Skin
  "manetain": "hair-skin",
  "glow-formula": "hair-skin",
  "miracle-cream": "hair-skin",
  "erase-cream": "hair-skin",
  "finasteride": "hair-skin",
  "minoxidil": "hair-skin",
  "tretinoin": "hair-skin",
  
  // Vitamins / Injections (wellness)
  "b12": "daily-wellness",
  "vitamin-d3": "daily-wellness",
  "glutathione": "daily-wellness",
  "lipo-b": "daily-wellness",
};

/**
 * Get the intake route for a product
 */
export function getProductIntakeRoute(productId: string): RegenProductRoute {
  const normalizedId = productId.toLowerCase().replace(/\s+/g, "-");
  const category = REGEN_PRODUCT_CATEGORIES[normalizedId];
  
  if (category) {
    return REGEN_CATEGORY_INTAKES[category];
  }
  
  // Default to peptide intake for unknown products
  return REGEN_CATEGORY_INTAKES["daily-wellness"];
}

/**
 * Get the intake route for a category
 */
export function getCategoryIntakeRoute(categoryId: string): RegenProductRoute {
  const normalizedId = categoryId.toLowerCase().replace(/\s+/g, "-") as RegenCategory;
  return REGEN_CATEGORY_INTAKES[normalizedId] || REGEN_CATEGORY_INTAKES["daily-wellness"];
}

/**
 * Build intake URL with product prefill
 */
export function buildIntakeUrl(
  productId: string,
  options?: {
    productName?: string;
    price?: number;
    quantity?: number;
    returnUrl?: string;
  }
): string {
  const route = getProductIntakeRoute(productId);
  const params = new URLSearchParams();
  
  params.set("product", productId);
  params.set("source", "regen-storefront");
  
  if (options?.productName) {
    params.set("productName", options.productName);
  }
  if (options?.price) {
    params.set("price", String(options.price));
  }
  if (options?.quantity) {
    params.set("qty", String(options.quantity));
  }
  if (options?.returnUrl) {
    params.set("return", options.returnUrl);
  }
  
  return `${route.intakePath}?${params.toString()}`;
}

/**
 * Build cart intake URL (multiple products)
 * Routes to the first product's intake with cart context
 */
export function buildCartIntakeUrl(
  items: Array<{ id: string; name: string; price: number; quantity: number }>
): string {
  if (items.length === 0) {
    return "/rx";
  }
  
  // Use the first item to determine the intake form
  const primaryItem = items[0];
  const route = getProductIntakeRoute(primaryItem.id);
  
  const params = new URLSearchParams();
  params.set("source", "regen-storefront");
  params.set("cart", "1");
  
  // Encode cart items
  const cartData = items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    qty: item.quantity,
  }));
  params.set("items", btoa(JSON.stringify(cartData)));
  
  return `${route.intakePath}?${params.toString()}`;
}
