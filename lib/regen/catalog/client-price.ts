/**
 * Client-facing "from $X" quotes for the RE GEN catalog.
 *
 * The storefront catalog (`catalog-data.js`) carries Olympia/Formulation wholesale,
 * which runs well above what Hello Gorgeous actually pays BoomRx for the same vial
 * ($120 vs $70 for a 3 mg/mL 5 mL BPC-157). Client quotes are therefore derived from
 * the BoomRx sheet so the shop, the peptide menus, and the NP's invoice agree.
 *
 * Staff point-of-sale keeps using `pricing.ts` (Square catalog prices) — repricing
 * Square is a separate business decision, not a display concern.
 */

import {
  boomrxConsumerMonthlyUsd,
  boomrxConsumerProductUsd,
} from "@/lib/boomrx-consumer-pricing";
import {
  glp1LowestSemaglutideUsd,
  glp1LowestTirzepatideUsd,
} from "@/lib/glp1-dose-tiers";
import { BOOMRX_PEPTIDE_PDF_PRODUCTS } from "@/lib/peptide-boomrx-catalog";
import { formatMoney, listingPriceText, price30, price90, unitsPer } from "./pricing";
import type { CatalogProduct, CatalogVariant, SupplyDays } from "./types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

type BoomRxRow = { name: string; concentration: string; wholesaleUsd: number };

const BOOMRX_ROWS: BoomRxRow[] = BOOMRX_PEPTIDE_PDF_PRODUCTS.map((row) => ({
  name: normalize(row.productName),
  concentration: normalize(row.concentration),
  wholesaleUsd: row.wholesaleUsd,
}));

/**
 * BoomRx wholesale for one vial of a catalog SKU, or null when the SKU has no
 * BoomRx equivalent (tablets, creams, supplies, commercial vials).
 */
export function boomrxWholesaleForCatalogProduct(
  product: CatalogProduct,
  variant?: CatalogVariant,
): number | null {
  const name = normalize(product.name);
  if (!name) return null;

  const exactName = BOOMRX_ROWS.filter((row) => row.name === name);

  if (exactName.length && variant) {
    const strength = normalize(variant.strength);
    const byStrength = exactName.find(
      (row) => row.concentration && strength.includes(row.concentration),
    );
    if (byStrength) return byStrength.wholesaleUsd;
  }

  if (exactName.length) {
    // Several fills can share a name (Tesamorelin 2 mg vs 3 mg) — quote the lowest.
    return Math.min(...exactName.map((row) => row.wholesaleUsd));
  }

  const contained = BOOMRX_ROWS.filter((row) => row.name.includes(name));
  if (contained.length === 1) return contained[0].wholesaleUsd;

  return null;
}

/**
 * GLP-1 program pricing is set by dose tier, not by vial cost — a single catalog vial
 * is one step in a titration, so quoting it would badly undercut the program price.
 */
function glp1ProgramMonthlyUsd(product: CatalogProduct): number | null {
  if (product.goal !== "Lose Weight") return null;
  const name = product.name.toLowerCase();
  if (name.includes("tirzepatide") || name.includes("retatrutide")) {
    return glp1LowestTirzepatideUsd();
  }
  if (name.includes("semaglutide")) return glp1LowestSemaglutideUsd();
  return null;
}

/** Monthly client price (30-day supply) derived from BoomRx, or null if unmapped. */
export function catalogClientMonthlyUsd(product: CatalogProduct): number | null {
  const glp1 = glp1ProgramMonthlyUsd(product);
  if (glp1 !== null) return glp1;

  const variant = product.variants[0];
  const wholesalePerUnit = boomrxWholesaleForCatalogProduct(product, variant);
  if (wholesalePerUnit === null) return null;
  return boomrxConsumerMonthlyUsd(wholesalePerUnit * unitsPer(product));
}

/**
 * Client price for a 30- or 90-day supply. 90-day carries the standard 10% off
 * product, matching what the NP invoices after approval.
 */
export function catalogClientSupplyUsd(
  product: CatalogProduct,
  supply: SupplyDays,
): number {
  const glp1 = glp1ProgramMonthlyUsd(product);
  if (glp1 !== null) {
    return supply === 90 ? Math.round(glp1 * 3 * 0.9) : glp1;
  }

  const variant = product.variants[0];
  const wholesalePerUnit = boomrxWholesaleForCatalogProduct(product, variant);
  if (wholesalePerUnit === null) {
    return supply === 90 ? price90(product, variant) : price30(product, variant);
  }

  const monthlyWholesale = wholesalePerUnit * unitsPer(product);
  if (supply === 90) {
    return boomrxConsumerProductUsd(monthlyWholesale * 3, "90-day");
  }
  return boomrxConsumerMonthlyUsd(monthlyWholesale);
}

/**
 * The price shown on client cards and product pages. Always a starting point —
 * the NP sets the final price at consult, so every surface reads "from $X".
 */
export function catalogClientPriceText(product: CatalogProduct): string {
  const monthly = catalogClientMonthlyUsd(product);
  if (monthly === null) return listingPriceText(product);
  return `from $${formatMoney(monthly)}`;
}
