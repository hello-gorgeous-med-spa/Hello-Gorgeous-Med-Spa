/**
 * tryregenrx.com Bundles aisle — BoomRx July 2026 sheet stacks only.
 *
 * Visitors request a bundle. Ryan Kent, FNP-BC prescribes only if clinically
 * appropriate (including off-label when indicated). Damara then pastes the
 * exact sheet name into the BoomRx portal. Not a research-chem cart.
 */

import { BOOMRX_PEPTIDE_PDF_PRODUCTS, isOnBoomRxSheet } from "@/lib/peptide-boomrx-catalog";
import {
  BOOMRX_CONSUMER_SHIPPING_USD,
  boomrxConsumerMonthlyUsd,
} from "@/lib/boomrx-consumer-pricing";

export const TRYREGEN_BUNDLES_GOAL = "bundles" as const;

export type TryregenBundle = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Exact BoomRx July 2026 sheet product names Damara pastes. */
  boomrxSheetNames: string[];
};

function sheetWholesaleUsd(productName: string): number {
  const row = BOOMRX_PEPTIDE_PDF_PRODUCTS.find((p) => p.productName === productName);
  if (!row) {
    throw new Error(`tryregen bundle line "${productName}" is not on the BoomRx July 2026 sheet`);
  }
  return row.wholesaleUsd;
}

export const TRYREGEN_BUNDLES: TryregenBundle[] = [
  {
    id: "recovery",
    name: "Recovery Blend",
    tagline: "Repair",
    description: "BPC-157 / TB-500. Ryan decides if it is appropriate.",
    boomrxSheetNames: ["BPC-157 / TB-500"],
  },
  {
    id: "skin-repair",
    name: "Skin Repair Blend",
    tagline: "Skin",
    description: "BPC-157 / TB-500 / GHK-Cu.",
    boomrxSheetNames: ["GLOW (BPC-157 / TB-500 / GHK-Cu)"],
  },
  {
    id: "full-recovery",
    name: "Full Recovery Blend",
    tagline: "Repair",
    description: "BPC-157 / GHK-Cu / KPV / TB-500.",
    boomrxSheetNames: ["BPC-157 / GHK-Cu / KPV / TB-500"],
  },
  {
    id: "heal",
    name: "Heal Blend",
    tagline: "Repair",
    description: "BPC-157 / KPV / TB-500.",
    boomrxSheetNames: ["BPC-157 / KPV / TB-500"],
  },
  {
    id: "peak",
    name: "Peak Performance",
    tagline: "Energy",
    description: "CJC-1295 / Ipamorelin plus NAD+ — two vials, one cold ship.",
    boomrxSheetNames: ["CJC-1295 / Ipamorelin", "NAD+ 1000mg/10mL"],
  },
  {
    id: "neuro",
    name: "Focus Blend",
    tagline: "Focus",
    description: "Semax / Selank.",
    boomrxSheetNames: ["Semax / Selank"],
  },
  {
    id: "nad-sermorelin",
    name: "NAD + Sermorelin",
    tagline: "Energy",
    description: "Cellular energy plus growth-hormone support — two vials, one ship.",
    boomrxSheetNames: ["NAD+ 1000mg/10mL", "Sermorelin"],
  },
  {
    id: "radiance",
    name: "The Radiance Pair",
    tagline: "Glow",
    description: "Glutathione + NAD+ — two vials, one cold ship.",
    boomrxSheetNames: ["Glutathione", "NAD+ 1000mg/10mL"],
  },
];

const BY_ID = new Map(TRYREGEN_BUNDLES.map((b) => [b.id, b]));

export function getTryregenBundle(id: string): TryregenBundle | undefined {
  return BY_ID.get(id);
}

export function isTryregenBundleProgram(programId?: string | null): boolean {
  return Boolean(programId && BY_ID.has(programId));
}

export function tryregenBundleSheetNames(programId: string): string[] {
  if (programId === "bpc-tb") return ["BPC-157 / TB-500"];
  return BY_ID.get(programId)?.boomrxSheetNames ?? [];
}

export function tryregenBundleRetailUsd(bundle: TryregenBundle): number {
  const wholesale = bundle.boomrxSheetNames.reduce((sum, name) => sum + sheetWholesaleUsd(name), 0);
  return boomrxConsumerMonthlyUsd(wholesale);
}

export function tryregenBundleShippingUsd(): number {
  return BOOMRX_CONSUMER_SHIPPING_USD;
}

export function tryregenBundleStartHref(bundle?: TryregenBundle): string {
  if (!bundle) return `/start?goal=${TRYREGEN_BUNDLES_GOAL}`;
  return `/start?goal=${TRYREGEN_BUNDLES_GOAL}&program=${bundle.id}`;
}

export const TRYREGEN_BUNDLES_LEGAL =
  "Compounded medications are not FDA-approved. Ryan Kent, FNP-BC prescribes only when clinically appropriate, including off-label use when indicated. Requesting a bundle is a consult — not a guaranteed prescription.";

export function tryregenBundleSheetGaps(): string[] {
  return TRYREGEN_BUNDLES.flatMap((bundle) =>
    bundle.boomrxSheetNames.filter((name) => !isOnBoomRxSheet(name)),
  );
}
