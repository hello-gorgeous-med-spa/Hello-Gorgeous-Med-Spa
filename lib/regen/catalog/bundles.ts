import { isOnBoomRxSheet } from "@/lib/peptide-boomrx-catalog";
import { PRODUCTS } from "./catalog-data";
import type { CatalogBundle, CatalogProduct } from "./types";

const PRODUCT_BY_ID = new Map((PRODUCTS as CatalogProduct[]).map((p) => [p.id, p]));

/**
 * Public Bundles aisle — only stacks whose every shoppable line is already
 * client-visible. BoomRx peptide blends (BPC / GLOW / KLOW-style) stay staff-only.
 */
export const CLIENT_STACK_IDS = [
  "womens",
  "mens",
  "radiance",
  "nad-sermorelin",
  "glp1",
] as const;

export const CATALOG_BUNDLES: CatalogBundle[] = [
  {
    id: "glp1",
    name: "GLP-1 Kickstart",
    tagline: "Lose Weight",
    blurb:
      "Everything to begin your weight-loss journey: your GLP-1, a metabolism-boosting B12/MIC shot, and a month of injection supplies.",
    pick: [["tirzepatide"], ["lipotropic"], ["supplies"]],
    pharmacy: "mixed",
    boomrxSheetNames: ["LIPO-C"],
  },
  {
    id: "nad-sermorelin",
    name: "NAD + Sermorelin",
    tagline: "Bundles",
    blurb: "Cellular energy plus growth-hormone support — two vials, one ship.",
    pick: [["nad"], ["sermorelin"]],
    pharmacy: "boomrx",
    boomrxSheetNames: ["NAD+ 1000mg/10mL", "Sermorelin"],
  },
  {
    id: "radiance",
    name: "The Radiance Pair",
    tagline: "Bundles",
    blurb: "Glutathione + NAD+ for antioxidant support and cellular energy.",
    pick: [["glutathione"], ["nad"]],
    pharmacy: "boomrx",
    boomrxSheetNames: ["Glutathione", "NAD+ 1000mg/10mL"],
  },
  {
    id: "mens",
    name: "Men's Vitality",
    tagline: "Hormones",
    blurb:
      "A complete men's optimization foundation: testosterone, estrogen control, and testicular support.",
    pick: [["testosterone"], ["anastrozole"], ["gonadorelin"]],
    pharmacy: "mixed",
    boomrxSheetNames: ["Gonadorelin"],
  },
  {
    id: "womens",
    name: "Women's Balance",
    tagline: "Hormones",
    blurb: "Bioidentical BiEst + progesterone to smooth the menopausal transition.",
    pick: [["biest"], ["progesterone"]],
    pharmacy: "formulation",
    boomrxSheetNames: [],
  },
  {
    id: "recovery",
    name: "Recovery Blend",
    tagline: "Bundles",
    blurb: "One BoomRx vial: BPC-157 / TB-500. Staff-only — not a public peptide cart.",
    pick: [["bpc157"]],
    productIds: ["p159"],
    pharmacy: "boomrx",
    boomrxSheetNames: ["BPC-157 / TB-500"],
  },
  {
    id: "skin-repair",
    name: "Skin Repair Blend",
    tagline: "Bundles",
    blurb: "BoomRx sheet GLOW vial — BPC-157 / TB-500 / GHK-Cu. Staff-only.",
    pick: [["bpc157"]],
    productIds: ["p160"],
    pharmacy: "boomrx",
    boomrxSheetNames: ["GLOW (BPC-157 / TB-500 / GHK-Cu)"],
  },
  {
    id: "full-recovery",
    name: "Full Recovery Blend",
    tagline: "Bundles",
    blurb: "BoomRx four-way vial — BPC-157 / GHK-Cu / KPV / TB-500. Staff-only.",
    pick: [["bpc157"]],
    productIds: ["p157"],
    pharmacy: "boomrx",
    boomrxSheetNames: ["BPC-157 / GHK-Cu / KPV / TB-500"],
  },
  {
    id: "heal",
    name: "Heal Blend",
    tagline: "Bundles",
    blurb: "BoomRx vial — BPC-157 / KPV / TB-500. Staff-only.",
    pick: [["bpc157"]],
    productIds: ["p158"],
    pharmacy: "boomrx",
    boomrxSheetNames: ["BPC-157 / KPV / TB-500"],
  },
  {
    id: "peak",
    name: "Peak Performance",
    tagline: "Bundles",
    blurb: "CJC-1295 / Ipamorelin plus NAD+ — both on the BoomRx sheet. Staff-only.",
    pick: [["cjc-ipamorelin"], ["nad"]],
    pharmacy: "boomrx",
    boomrxSheetNames: ["CJC-1295 / Ipamorelin", "NAD+ 1000mg/10mL"],
  },
  {
    id: "neuro",
    name: "Focus Blend",
    tagline: "Bundles",
    blurb: "BoomRx Semax / Selank vial. Staff-only.",
    pick: [["semax-selank"]],
    productIds: ["p194"],
    pharmacy: "boomrx",
    boomrxSheetNames: ["Semax / Selank"],
  },
  {
    id: "intimacy",
    name: "The Intimacy Duo",
    tagline: "Intimacy",
    blurb: "PT-141 for drive and a fast-acting dissolvable for confidence. Staff-only.",
    pick: [["pt141"], ["pde5"]],
    pharmacy: "mixed",
    boomrxSheetNames: ["PT-141"],
  },
];

export function isClientStack(id: string): boolean {
  return (CLIENT_STACK_IDS as readonly string[]).includes(id);
}

export function resolveBundleProducts(
  bundle: CatalogBundle,
  findByDrugKey: (drugKey: string) => CatalogProduct | undefined,
): CatalogProduct[] {
  if (bundle.productIds?.length) {
    return bundle.productIds
      .map((id) => PRODUCT_BY_ID.get(id))
      .filter((p): p is CatalogProduct => Boolean(p));
  }
  return bundle.pick
    .map((pk) => findByDrugKey(pk[0]))
    .filter((p): p is CatalogProduct => Boolean(p));
}

/** Every named BoomRx line must exist on the July 2026 sheet. */
export function bundleSheetGaps(bundle: CatalogBundle): string[] {
  return bundle.boomrxSheetNames.filter((name) => !isOnBoomRxSheet(name));
}
