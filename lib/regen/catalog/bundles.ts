import type { CatalogBundle } from "./types";

/**
 * Stacks shown on the client storefront, in display order (cheapest first).
 *
 * Picked as one stack per goal at its lowest entry price, so the row reads as a
 * deliberate $165 -> $435 ladder instead of an unexplained jump to $3,925. Peak
 * Performance is omitted because it duplicates The Recovery Stack's goal; The
 * Radiance Drip and Men's Vitality are omitted as high-ticket comprehensive
 * programs. All seven stay reachable behind "see all stacks" on the client shop,
 * and staff portals always show every stack in CATALOG_BUNDLES.
 *
 * To change what clients see, reorder or swap ids here — no JSX changes needed.
 */
export const CLIENT_STACK_IDS = ["womens", "intimacy", "recovery", "glp1"] as const;

export const CATALOG_BUNDLES: CatalogBundle[] = [
  {
    id: "glp1",
    name: "GLP-1 Kickstart",
    tagline: "Lose Weight",
    blurb:
      "Everything to begin your weight-loss journey: your GLP-1, a metabolism-boosting B12/MIC shot, and a month of injection supplies.",
    pick: [["tirzepatide"], ["lipotropic"], ["supplies"]],
  },
  {
    id: "recovery",
    name: "The Recovery Stack",
    tagline: "Recovery & Performance",
    blurb:
      "The classic healing duo — BPC-157 + TB-500 — for faster recovery from training and injury.",
    pick: [["bpc157"], ["tb500"]],
  },
  {
    id: "peak",
    name: "Peak Performance",
    tagline: "Recovery & Performance",
    blurb:
      "Growth-hormone support paired with NAD+ for recovery, deeper sleep, and daily energy.",
    pick: [["cjc-ipamorelin"], ["nad"]],
  },
  {
    id: "intimacy",
    name: "The Intimacy Duo",
    tagline: "Intimacy",
    blurb:
      "Desire meets performance: PT-141 for drive and a fast-acting dissolvable for confidence.",
    pick: [["pt141"], ["pde5"]],
  },
  {
    id: "radiance",
    name: "The Radiance Drip",
    tagline: "Skin & Hair",
    blurb: "Glutathione + NAD+ for that lit-from-within glow and cellular energy.",
    pick: [["glutathione"], ["nad"]],
  },
  {
    id: "mens",
    name: "Men's Vitality",
    tagline: "Hormones",
    blurb:
      "A complete men's optimization foundation: testosterone, estrogen control, and testicular support.",
    pick: [["testosterone"], ["anastrozole"], ["gonadorelin"]],
  },
  {
    id: "womens",
    name: "Women's Balance",
    tagline: "Hormones",
    blurb: "Bioidentical BiEst + progesterone to smooth the menopausal transition.",
    pick: [["biest"], ["progesterone"]],
  },
];
