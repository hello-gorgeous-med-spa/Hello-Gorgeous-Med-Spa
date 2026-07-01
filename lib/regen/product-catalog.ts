/**
 * RE GEN Product Catalog — Master product & pricing reference
 * 
 * SOURCE OF TRUTH: data/olympia-pricelist.json (Olympia Pharmacy wholesale)
 * MARKUP: 2.5x wholesale = retail
 * DISCOUNTS: 90-day supply = 10% off (3x retail * 0.9)
 * 
 * When Olympia updates pricing or discontinues products, update this file.
 * Run `npm run sync:olympia` to refresh the wholesale pricelist.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProductForm = 
  | "injectable"
  | "capsule"
  | "troche"
  | "rdt"        // rapid-dissolve tablet
  | "cream"
  | "patch"
  | "spray"
  | "drops"
  | "powder";

export type ProductCategory =
  | "weight-loss"
  | "peptides"
  | "vitamins"
  | "hormones-men"
  | "hormones-women"
  | "sexual-health-men"
  | "sexual-health-women"
  | "iv-therapy"
  | "hair-skin";

export interface RegenProduct {
  id: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  form: ProductForm;
  concentration: string;
  dispenseSize: string;
  wholesaleUsd: number;
  /** Retail = wholesale × 2.5 */
  retailUsd: number;
  /** 90-day = retail × 3 × 0.9 */
  retail90DayUsd: number;
  /** What you save on 90-day vs 3× 30-day */
  savings90DayUsd: number;
  olympiaSku?: number;
  active: boolean;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const MARKUP_MULTIPLIER = 2.5;
export const DISCOUNT_90_DAY = 0.10; // 10% off
export const SHIPPING_FLAT_USD = 30;

// ─────────────────────────────────────────────────────────────────────────────
// Helper to calculate retail pricing
// ─────────────────────────────────────────────────────────────────────────────

function calcPricing(wholesaleUsd: number) {
  const retail = Math.round(wholesaleUsd * MARKUP_MULTIPLIER * 100) / 100;
  const fullPrice90 = retail * 3;
  const retail90 = Math.round(fullPrice90 * (1 - DISCOUNT_90_DAY) * 100) / 100;
  const savings90 = Math.round((fullPrice90 - retail90) * 100) / 100;
  return { retailUsd: retail, retail90DayUsd: retail90, savings90DayUsd: savings90 };
}

function product(
  id: string,
  name: string,
  shortName: string,
  category: ProductCategory,
  form: ProductForm,
  concentration: string,
  dispenseSize: string,
  wholesaleUsd: number,
  olympiaSku?: number,
  notes?: string
): RegenProduct {
  const pricing = calcPricing(wholesaleUsd);
  return {
    id,
    name,
    shortName,
    category,
    form,
    concentration,
    dispenseSize,
    wholesaleUsd,
    ...pricing,
    olympiaSku,
    active: true,
    notes,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WEIGHT LOSS — GLP-1 & Metabolic Support
// ─────────────────────────────────────────────────────────────────────────────

export const WEIGHT_LOSS_PRODUCTS: RegenProduct[] = [
  // Semaglutide Injectable (from separate pharmacy, not Olympia)
  product("sema-2mg", "Compounded Semaglutide 2mg", "Semaglutide 2mg", "weight-loss", "injectable", "2 mg/0.5 mL", "0.5 mL vial", 40, undefined, "Starter dose"),
  product("sema-4mg", "Compounded Semaglutide 4mg", "Semaglutide 4mg", "weight-loss", "injectable", "4 mg/1 mL", "1 mL vial", 50),
  product("sema-8mg", "Compounded Semaglutide 8mg", "Semaglutide 8mg", "weight-loss", "injectable", "8 mg/2 mL", "2 mL vial", 70),
  product("sema-16mg", "Compounded Semaglutide 16mg", "Semaglutide 16mg", "weight-loss", "injectable", "16 mg/4 mL", "4 mL vial", 110, undefined, "High dose"),
  
  // Tirzepatide Injectable
  product("tirz-10mg", "Compounded Tirzepatide 10mg", "Tirzepatide 10mg", "weight-loss", "injectable", "10 mg/1 mL", "1 mL vial", 50, undefined, "Starter dose"),
  product("tirz-20mg", "Compounded Tirzepatide 20mg", "Tirzepatide 20mg", "weight-loss", "injectable", "20 mg/1 mL", "1 mL vial", 90),
  product("tirz-40mg", "Compounded Tirzepatide 40mg", "Tirzepatide 40mg", "weight-loss", "injectable", "40 mg/2 mL", "2 mL vial", 130),
  product("tirz-60mg", "Compounded Tirzepatide 60mg", "Tirzepatide 60mg", "weight-loss", "injectable", "60 mg/3 mL", "3 mL vial", 150, undefined, "High dose"),

  // Oral/Sublingual GLP-1 (when available)
  // product("sema-sl", "Semaglutide Sublingual", "Semaglutide SL", "weight-loss", "troche", "varies", "30 troches", 165),
  
  // Lipotropic Support (Olympia)
  product("lipo-mino-30", "Lipo-Mino Mix (MIC)", "Lipo-Mino", "weight-loss", "injectable", "B12 + lipotropic blend", "30 mL vial", 80.5, undefined, "Fat-burning support"),
  product("lipo-mino-10", "Lipo-Mino Mix (MIC)", "Lipo-Mino 10mL", "weight-loss", "injectable", "B12 + lipotropic blend", "10 mL vial", 36.8),
];

// ─────────────────────────────────────────────────────────────────────────────
// PEPTIDES — Recovery, Longevity, Performance
// ─────────────────────────────────────────────────────────────────────────────

export const PEPTIDE_PRODUCTS: RegenProduct[] = [
  // NAD+
  product("nad-inj", "NAD+ Injection", "NAD+", "peptides", "injectable", "100 mg/mL", "10 mL vial", 64.8, undefined, "Cellular energy & longevity"),
  product("nad-cream", "NADvantage Face Cream", "NADvantage", "peptides", "cream", "NAD+ topical", "30 g tube", 71, undefined, "Topical NAD+"),
  
  // Sermorelin (GH-releasing hormone - supports natural growth hormone production)
  // Source: FORMULATION RX (cheapest) - Cold ship / Next day only
  product("sermorelin-inj-1mg", "Sermorelin Injection 1mg/mL", "Sermorelin 6mL", "peptides", "injectable", "1 mg/mL", "6 mL vial", 38, 2884, "GH-support · starter"),
  product("sermorelin-inj-1.5mg", "Sermorelin Injection 1.5mg/mL", "Sermorelin 1.5mg", "peptides", "injectable", "1.5 mg/mL", "6 mL vial", 49, 2885, "GH-support · standard"),
  product("sermorelin-inj-12ml", "Sermorelin Injection 1.5mg/mL (2-pack)", "Sermorelin 12mL", "peptides", "injectable", "1.5 mg/mL", "12 mL (2×6mL)", 85, 3950, "GH-support · value pack"),
  // Oral forms
  product("sermorelin-sl", "Sermorelin Sublingual Tablet", "Sermorelin SL", "peptides", "troche", "0.5 mg", "30 tablets", 55, 3520, "Sublingual tablet"),
  product("sermorelin-rdt", "Sermorelin RDT", "Sermorelin RDT", "peptides", "rdt", "0.5 mg", "30 tablets", 65, 3521, "Rapid dissolve"),
  product("sermorelin-troche", "Sermorelin Troche", "Sermorelin Troche", "peptides", "troche", "0.5 mg", "30 troches", 55, 3522, "Troche form"),
  // Sermorelin + DHEA combos
  product("sermorelin-dhea-rdt-03", "Sermorelin/DHEA RDT 0.3mg", "Serm/DHEA 0.3mg", "peptides", "rdt", "0.3mg/25mg", "30 tablets", 55, 2891, "Low dose + adrenal"),
  product("sermorelin-dhea-rdt-05", "Sermorelin/DHEA RDT 0.5mg", "Serm/DHEA 0.5mg", "peptides", "rdt", "0.5mg/25mg", "30 tablets", 67, 2892, "Standard + adrenal"),
  product("sermorelin-dhea-rdt-1", "Sermorelin/DHEA RDT 1mg", "Serm/DHEA 1mg", "peptides", "rdt", "1mg/25mg", "30 tablets", 110, 2893, "High dose + adrenal"),
  product("sermorelin-dhea-troche-03", "Sermorelin/DHEA Troche 0.3mg", "Serm/DHEA Troche 0.3", "peptides", "troche", "0.3mg/25mg", "30 troches", 55, 2888),
  product("sermorelin-dhea-troche-05", "Sermorelin/DHEA Troche 0.5mg", "Serm/DHEA Troche 0.5", "peptides", "troche", "0.5mg/25mg", "30 troches", 67, 2889),
  product("sermorelin-dhea-troche-1", "Sermorelin/DHEA Troche 1mg", "Serm/DHEA Troche 1", "peptides", "troche", "1mg/25mg", "30 troches", 110, 2890),
  // Sermorelin + Oxytocin
  product("sermorelin-oxy-troche", "Sermorelin/Oxytocin Troche", "Serm/Oxy Troche", "peptides", "troche", "1mg/10IU", "30 troches", 95, 2894, "GH + bonding"),
  
  // BPC-157 (if available)
  product("bpc157", "BPC-157", "BPC-157", "peptides", "injectable", "3 mg/mL", "5 mL vial", 28, undefined, "Tissue repair"),
  
  // GHK-Cu
  product("ghk-cu-cream", "GHK-Cu Cream (Tighten)", "GHK-Cu", "peptides", "cream", "0.5%", "30 g tube", 50, undefined, "Skin tightening"),
  product("ghk-cu-cream-plus", "GHK-Cu Cream Plus (Tighten Plus)", "GHK-Cu Plus", "peptides", "cream", "2%", "30 g tube", 65),
  product("ghk-cu-cream-max", "GHK-Cu Cream Max (Tighten Max)", "GHK-Cu Max", "peptides", "cream", "4%", "30 g tube", 71),
  
  // Glutathione
  product("glutathione-30", "Glutathione Injection", "Glutathione", "peptides", "injectable", "200 mg/mL", "30 mL vial", 58, undefined, "Master antioxidant"),
  product("glutathione-5", "Glutathione Injection", "Glutathione 5mL", "peptides", "injectable", "200 mg/mL", "5 mL vial", 26.45),
];

// ─────────────────────────────────────────────────────────────────────────────
// VITAMINS & INJECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const VITAMIN_PRODUCTS: RegenProduct[] = [
  // B12
  product("b12-methyl-10", "B12 Methylcobalamin", "B12", "vitamins", "injectable", "5 mg/mL", "10 mL vial", 29.1, undefined, "Energy & metabolism"),
  product("b12-methyl-30", "B12 Methylcobalamin", "B12 30mL", "vitamins", "injectable", "5 mg/mL", "30 mL vial", 64.8),
  product("b12-hydrox-30", "B12 Hydroxocobalamin", "B12 Hydroxo", "vitamins", "injectable", "2 mg/mL", "30 mL vial", 64.8),
  
  // Vitamin D3
  product("vitd3-30", "Vitamin D3 (IM)", "Vitamin D3", "vitamins", "injectable", "50,000 IU/mL", "30 mL vial", 59.51, undefined, "Immune support"),
  
  // Biotin
  product("biotin-10", "Biotin Injection", "Biotin", "vitamins", "injectable", "0.5 mg/mL", "10 mL vial", 33.06, undefined, "Hair, skin & nails"),
  
  // LDN (Oral)
  product("ldn-1.5", "Low Dose Naltrexone 1.5mg", "LDN 1.5mg", "vitamins", "capsule", "1.5 mg", "30 capsules", 27.50, undefined, "Immune & inflammation"),
  product("ldn-4.5", "Low Dose Naltrexone 4.5mg", "LDN 4.5mg", "vitamins", "capsule", "4.5 mg", "30 capsules", 27.50),
  product("ldn-4.5-90", "Low Dose Naltrexone 4.5mg", "LDN 4.5mg 90ct", "vitamins", "capsule", "4.5 mg", "90 capsules", 70),
];

// ─────────────────────────────────────────────────────────────────────────────
// HORMONES — MEN (TRT, HCG, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const HORMONE_MEN_PRODUCTS: RegenProduct[] = [
  // Testosterone Cypionate
  product("test-cyp-5", "Testosterone Cypionate (Grapeseed)", "Test Cyp 5mL", "hormones-men", "injectable", "200 mg/mL", "5 mL vial", 30, undefined, "TRT injectable"),
  product("test-cyp-10", "Testosterone Cypionate (Grapeseed)", "Test Cyp 10mL", "hormones-men", "injectable", "200 mg/mL", "10 mL vial", 60),
  
  // Testosterone Cream
  product("test-cream-1", "Testosterone Cream 1%", "Test Cream 1%", "hormones-men", "cream", "10 mg/mL", "30 g tube", 36),
  product("test-cream-10", "Testosterone Cream 10%", "Test Cream 10%", "hormones-men", "cream", "100 mg/mL", "30 g tube", 36),
  product("test-cream-20", "Testosterone Cream 20%", "Test Cream 20%", "hormones-men", "cream", "200 mg/mL", "30 g tube", 36),
  
  // Enclomiphene (priced at consult)
  product("enclomiphene", "Enclomiphene", "Enclomiphene", "hormones-men", "capsule", "varies", "30 capsules", 40, undefined, "T support / fertility"),
  
  // Anastrozole
  product("anastrozole-0.5", "Anastrozole 0.5mg", "Anastrozole", "hormones-men", "capsule", "0.5 mg", "30 capsules", 1.1 * 30, undefined, "Estrogen management"),
  
  // HCG (priced at consult)
  product("hcg", "HCG Injection", "HCG", "hormones-men", "injectable", "varies", "varies", 50, undefined, "Reproductive & T support"),
  
  // DHEA
  product("dhea-25", "DHEA 25mg", "DHEA 25mg", "hormones-men", "capsule", "25 mg", "30 capsules", 15, undefined, "Adrenal support"),
];

// ─────────────────────────────────────────────────────────────────────────────
// HORMONES — WOMEN (Bioidentical HRT)
// ─────────────────────────────────────────────────────────────────────────────

export const HORMONE_WOMEN_PRODUCTS: RegenProduct[] = [
  // Estradiol
  product("estradiol-rdt-0.5", "Estradiol 0.5mg RDT", "Estradiol 0.5mg", "hormones-women", "rdt", "0.5 mg", "30 tablets", 1 * 30),
  product("estradiol-rdt-1", "Estradiol 1mg RDT", "Estradiol 1mg", "hormones-women", "rdt", "1 mg", "30 tablets", 1 * 30),
  product("estradiol-rdt-1.25", "Estradiol 1.25mg RDT", "Estradiol 1.25mg", "hormones-women", "rdt", "1.25 mg", "30 tablets", 1 * 30),
  product("estradiol-cream", "Estradiol Cream", "Estradiol Cream", "hormones-women", "cream", "varies", "30 g tube", 35),
  
  // Bi-Est
  product("biest-cream", "Bi-Est 80/20 Cream", "Bi-Est Cream", "hormones-women", "cream", "estriol/estradiol", "30 g tube", 36),
  
  // Progesterone
  product("progest-cream", "Progesterone Cream 10%", "Progesterone Cream", "hormones-women", "cream", "100 mg/mL", "30 g tube", 41),
  product("progest-cap-100", "Progesterone 100mg Capsule", "Progesterone 100mg", "hormones-women", "capsule", "100 mg", "30 capsules", 0.85 * 30),
  product("progest-rdt-100", "Progesterone 100mg RDT", "Progesterone RDT", "hormones-women", "rdt", "100 mg", "30 tablets", 0.85 * 30),
  
  // DHEA
  product("dhea-women-10", "DHEA 10mg", "DHEA 10mg", "hormones-women", "capsule", "10 mg", "30 capsules", 12),
];

// ─────────────────────────────────────────────────────────────────────────────
// SEXUAL HEALTH — MEN
// ─────────────────────────────────────────────────────────────────────────────

export const SEXUAL_HEALTH_MEN_PRODUCTS: RegenProduct[] = [
  // Sildenafil
  product("sildenafil-rdt", "Sildenafil 110mg RDT", "Sildenafil", "sexual-health-men", "rdt", "110 mg", "10 tablets", 5 * 10, undefined, "ED - rapid dissolve"),
  
  // Tadalafil
  product("tadalafil-rdt", "Tadalafil 20mg RDT", "Tadalafil", "sexual-health-men", "rdt", "20 mg", "10 tablets", 5 * 10),
  
  // Combo tablets
  product("mount-olympia", "Mount Olympia (Sildenafil/Tadalafil/Oxytocin)", "Mount Olympia", "sexual-health-men", "rdt", "50mg/25mg/100iu", "10 tablets", 5 * 10, undefined, "Triple-action ED"),
  product("maxx-pe", "MAXX PE (Tadalafil/Oxytocin/PT-141)", "MAXX PE", "sexual-health-men", "rdt", "20mg/100iu/500mcg", "10 tablets", 6 * 10, undefined, "Performance + arousal"),
  
  // PT-141
  product("pt141-odt", "PT-141 (Bremelanotide) ODT", "PT-141", "sexual-health-men", "rdt", "varies", "10 tablets", 6 * 10, undefined, "Arousal peptide"),
  product("pt141-inj", "PT-141 Injection", "PT-141 Inj", "sexual-health-men", "injectable", "2 mg/mL", "5 mL vial", 28),
];

// ─────────────────────────────────────────────────────────────────────────────
// SEXUAL HEALTH — WOMEN
// ─────────────────────────────────────────────────────────────────────────────

export const SEXUAL_HEALTH_WOMEN_PRODUCTS: RegenProduct[] = [
  // Scream Cream / Arousal Creams
  product("scream-cream", "Scream Cream", "Scream Cream", "sexual-health-women", "cream", "arginine/sildenafil", "30 g tube", 50, undefined, "Arousal cream"),
  product("euphoria-cream", "Euphoria Cream", "Euphoria Cream", "sexual-health-women", "cream", "arginine/papaverine/alprostadil", "30 g tube", 71),
  
  // PT-141
  product("pt141-women-odt", "PT-141 (Bremelanotide) ODT", "PT-141", "sexual-health-women", "rdt", "varies", "10 tablets", 6 * 10, undefined, "Arousal peptide"),
];

// ─────────────────────────────────────────────────────────────────────────────
// HAIR & SKIN
// ─────────────────────────────────────────────────────────────────────────────

export const HAIR_SKIN_PRODUCTS: RegenProduct[] = [
  // GHK-Cu (also in peptides)
  product("ghk-hair", "GHK-Cu Hair Serum", "GHK-Cu Hair", "hair-skin", "spray", "varies", "30 mL", 50),
  
  // Biotin (also in vitamins)
  product("biotin-hair", "Biotin Injection (Hair)", "Biotin", "hair-skin", "injectable", "0.5 mg/mL", "10 mL vial", 33.06),
  
  // Minoxidil compounds (if available)
  // product("minox-oral", "Oral Minoxidil", "Minoxidil Oral", "hair-skin", "capsule", "2.5 mg", "30 capsules", 20),
];

// ─────────────────────────────────────────────────────────────────────────────
// ALL PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_REGEN_PRODUCTS: RegenProduct[] = [
  ...WEIGHT_LOSS_PRODUCTS,
  ...PEPTIDE_PRODUCTS,
  ...VITAMIN_PRODUCTS,
  ...HORMONE_MEN_PRODUCTS,
  ...HORMONE_WOMEN_PRODUCTS,
  ...SEXUAL_HEALTH_MEN_PRODUCTS,
  ...SEXUAL_HEALTH_WOMEN_PRODUCTS,
  ...HAIR_SKIN_PRODUCTS,
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────────────────────────────────────

export function getProductById(id: string): RegenProduct | undefined {
  return ALL_REGEN_PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): RegenProduct[] {
  return ALL_REGEN_PRODUCTS.filter(p => p.category === category && p.active);
}

export function getProductsByForm(form: ProductForm): RegenProduct[] {
  return ALL_REGEN_PRODUCTS.filter(p => p.form === form && p.active);
}

export function getProductsByCategoryAndForm(category: ProductCategory, form: ProductForm): RegenProduct[] {
  return ALL_REGEN_PRODUCTS.filter(p => p.category === category && p.form === form && p.active);
}

export function getAvailableForms(category: ProductCategory): ProductForm[] {
  const forms = new Set<ProductForm>();
  getProductsByCategory(category).forEach(p => forms.add(p.form));
  return Array.from(forms);
}

export function formatPrice(usd: number): string {
  return '$' + (Number.isInteger(usd) ? usd.toLocaleString('en-US') : usd.toFixed(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// Category metadata for UI
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_META: Record<ProductCategory, { title: string; icon: string; description: string }> = {
  "weight-loss": {
    title: "Weight Loss",
    icon: "⚖",
    description: "GLP-1 injectables & metabolic support",
  },
  "peptides": {
    title: "Peptides & NAD+",
    icon: "✦",
    description: "Recovery, longevity & cellular energy",
  },
  "vitamins": {
    title: "Vitamin Injections",
    icon: "✚",
    description: "B12, D3, biotin & LDN",
  },
  "hormones-men": {
    title: "Men's Hormones",
    icon: "⚕",
    description: "TRT, HCG, enclomiphene & DHEA",
  },
  "hormones-women": {
    title: "Women's Hormones",
    icon: "⚕",
    description: "Bioidentical estrogen, progesterone & DHEA",
  },
  "sexual-health-men": {
    title: "Men's Sexual Health",
    icon: "❤",
    description: "ED tablets & arousal peptides",
  },
  "sexual-health-women": {
    title: "Women's Sexual Health",
    icon: "❤",
    description: "Arousal creams & peptides",
  },
  "iv-therapy": {
    title: "IV Therapy",
    icon: "💧",
    description: "In-clinic IV drips & hydration",
  },
  "hair-skin": {
    title: "Hair & Skin",
    icon: "✨",
    description: "Growth peptides & rejuvenation",
  },
};

export const FORM_LABELS: Record<ProductForm, string> = {
  injectable: "Injectable",
  capsule: "Capsule",
  troche: "Troche",
  rdt: "Rapid-Dissolve Tablet",
  cream: "Cream / Topical",
  patch: "Patch",
  spray: "Spray",
  drops: "Drops",
  powder: "Powder",
};
