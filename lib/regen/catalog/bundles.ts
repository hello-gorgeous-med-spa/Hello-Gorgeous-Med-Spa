import type { CatalogBundle } from "./types";

/**
 * Stacks shown on the client storefront, in display order (cheapest first).
 *
 * Four stacks, cheapest first, one per goal — the owner asked for a short ladder
 * rather than the full set. Peak Performance and The Radiance Drip duplicate goals
 * already covered here, and Men's Vitality is held back only to keep the row to
 * four. (An earlier note justified those omissions on price; that was a pricing
 * bug quoting vial cost x30, fixed in client-price.ts — the real spread is
 * $165-$565.) All seven stay reachable behind "see all stacks" on the client shop,
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
