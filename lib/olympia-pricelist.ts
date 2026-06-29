/**
 * Olympia Pharmacy — doctor wholesale pricelist (HELLO45844 / Hello Gorgeous PC).
 *
 * Source of truth: `data/olympia-pricelist.json` (sync from PDF via `npm run sync:olympia`).
 * Wholesale USD = Olympia "Discounted Price" on Ryan Kent's portal export.
 *
 * Use for COGS checks, menu expansion, and retail margin math — not client-facing prices.
 */

import raw from "@/data/olympia-pricelist.json";

export type OlympiaProduct = {
  sku: number;
  name: string;
  concentration: string;
  dispenseSize: string;
  wholesaleUsd: number;
  coldShip?: boolean;
  signatureRequired?: boolean;
};

export type OlympiaMenuCategory =
  | "iv-kits"
  | "iv-vials"
  | "weight-management"
  | "glp1"
  | "peptides"
  | "hormone-therapy"
  | "sexual-health"
  | "compounding-topical"
  | "supplies"
  | "bundles"
  | "otc"
  | "other";

export const OLYMPIA_PRICELIST_META = {
  source: raw.source,
  sourcePdf: raw.sourcePdf,
  clinic: raw.clinic,
  doctor: raw.doctor,
  username: raw.username,
  exportedAt: raw.exportedAt,
  productCount: raw.productCount,
  portalUrl: "https://olympiapharmacy.drscriptportal.com/dashboard",
} as const;

export const OLYMPIA_PRODUCTS: OlympiaProduct[] = raw.products as OlympiaProduct[];

const bySku = new Map(OLYMPIA_PRODUCTS.map((p) => [p.sku, p]));

/** SKUs we actively merchandise — extend as menus grow. */
export const OLYMPIA_MENU_HIGHLIGHTS: Record<
  string,
  { sku: number; label?: string; menuCategory: OlympiaMenuCategory }
> = {
  // GLP-1 / weight loss
  "liraglutide-5ml": { sku: 143, menuCategory: "glp1", label: "Liraglutide 30mg (5 mL)" },
  "liraglutide-10ml": { sku: 144, menuCategory: "glp1", label: "Liraglutide 60mg (10 mL)" },
  "liraglutide-starter-bundle": { sku: 146, menuCategory: "glp1" },
  "liraglutide-pro-bundle": { sku: 145, menuCategory: "glp1" },
  "peptidevite-glp1": { sku: 185, menuCategory: "glp1", label: "PeptideVite GLP-1 Support" },
  // Peptides / longevity
  "sermorelin-liquid": { sku: 142, menuCategory: "peptides", label: "Sermorelin 0.9 mg/mL" },
  "nad-sermorelin-bundle": { sku: 47, menuCategory: "peptides" },
  "nad-sermorelin-rdt-combo": { sku: 141, menuCategory: "peptides" },
  "sermorelin-rdt-30": { sku: 252, menuCategory: "peptides" },
  "nad-injection-10ml": { sku: 167, menuCategory: "peptides", label: "NAD+ 100 mg/mL (10 mL)" },
  // IV kits (Olympia premix components)
  "iv-immunity-kit": { sku: 105, menuCategory: "iv-kits" },
  "iv-quench-kit": { sku: 232, menuCategory: "iv-kits" },
  "iv-reboot-kit": { sku: 235, menuCategory: "iv-kits" },
  "iv-recovery-kit": { sku: 236, menuCategory: "iv-kits" },
  "iv-get-up-and-go": { sku: 91, menuCategory: "iv-kits" },
  // IV / vitamin vials (add-ons)
  "b12-methyl-10ml": { sku: 16, menuCategory: "iv-vials" },
  "glutathione-30ml": { sku: 93, menuCategory: "iv-vials", label: "Glutathione 200 mg/mL" },
  "tri-immune-30ml": { sku: 320, menuCategory: "iv-vials" },
  "l-carnitine-30ml": { sku: 108, menuCategory: "iv-vials" },
  "micc-30ml": { sku: 151, menuCategory: "iv-vials" },
  "myers-10ml": { sku: 165, menuCategory: "iv-vials", label: "Myers Cocktail premix" },
  // TRT / HRT
  "testosterone-cypionate-5ml": { sku: 314, menuCategory: "hormone-therapy" },
  "anastrozole": { sku: 8, menuCategory: "hormone-therapy" },
  // Weight management stacks (naltrexone + sermorelin kits)
  "wm-month-1-im": { sku: 155, menuCategory: "weight-management" },
};

export function getOlympiaProduct(sku: number): OlympiaProduct | undefined {
  return bySku.get(sku);
}

export function getOlympiaWholesaleUsd(sku: number): number | undefined {
  return bySku.get(sku)?.wholesaleUsd;
}

export function searchOlympiaProducts(query: string, limit = 25): OlympiaProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return OLYMPIA_PRODUCTS.slice(0, limit);
  return OLYMPIA_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.concentration.toLowerCase().includes(q) ||
      String(p.sku) === q,
  ).slice(0, limit);
}

export function inferOlympiaCategory(product: OlympiaProduct): OlympiaMenuCategory {
  const blob = `${product.name} ${product.concentration}`.toLowerCase();
  if (/\biv kit\b/.test(blob) || blob.includes("iv kit")) return "iv-kits";
  if (blob.includes("liraglutide") || blob.includes("peptidevite")) return "glp1";
  if (blob.includes("sermorelin") || blob.includes("nad")) return "peptides";
  if (blob.includes("month") && blob.includes("weight management")) return "weight-management";
  if (
    blob.includes("testosterone") ||
    blob.includes("estradiol") ||
    blob.includes("progesterone") ||
    blob.includes("biest") ||
    blob.includes("anastrozole") ||
    blob.includes("enclomiphene") ||
    blob.includes("clomiphene")
  ) {
    return "hormone-therapy";
  }
  if (
    blob.includes("sildenafil") ||
    blob.includes("tadalafil") ||
    blob.includes("trimix") ||
    blob.includes("papaverine") ||
    blob.includes("pt-141") ||
    blob.includes("scream cream") ||
    blob.includes("climax cream")
  ) {
    return "sexual-health";
  }
  if (blob.includes("syringe") || blob.includes("alcohol swab") || blob.includes("applicator")) {
    return "supplies";
  }
  if (blob.includes("bundle")) return "bundles";
  if (blob.includes(" otc") || blob.includes("tablet") || blob.includes("spray otc")) return "otc";
  if (
    blob.includes("cream") ||
    blob.includes("gel") ||
    blob.includes("ointment") ||
    blob.includes("tighten") ||
    blob.includes("miracle") ||
    blob.includes("illuminate")
  ) {
    return "compounding-topical";
  }
  if (
    blob.includes("30ml") ||
    blob.includes("10ml") ||
    blob.includes("5ml") ||
    blob.includes("b12") ||
    blob.includes("glutathione") ||
    blob.includes("micc") ||
    blob.includes("amino")
  ) {
    return "iv-vials";
  }
  return "other";
}

export function listOlympiaByCategory(category: OlympiaMenuCategory): OlympiaProduct[] {
  return OLYMPIA_PRODUCTS.filter((p) => inferOlympiaCategory(p) === category);
}

export function formatOlympiaWholesale(usd: number): string {
  return `$${usd.toFixed(2)}`;
}

/** Products referenced in OLYMPIA_MENU_HIGHLIGHTS with live wholesale. */
export function getOlympiaMenuCatalog(): Array<
  OlympiaProduct & { menuKey: string; menuCategory: OlympiaMenuCategory; displayLabel: string }
> {
  return Object.entries(OLYMPIA_MENU_HIGHLIGHTS)
    .map(([menuKey, ref]) => {
      const p = getOlympiaProduct(ref.sku);
      if (!p) return null;
      return {
        ...p,
        menuKey,
        menuCategory: ref.menuCategory,
        displayLabel: ref.label ?? p.name,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
