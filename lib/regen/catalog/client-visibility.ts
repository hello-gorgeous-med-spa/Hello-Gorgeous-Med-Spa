/**
 * Which catalog SKUs the client-facing RE GEN storefront (`/rx`) shows.
 *
 * The owner narrowed the public shop to what she stocks and promotes: the peptides on
 * the BoomRx July 2026 sheet, weight loss / GLP-1, and hormones. Everything else — derm
 * creams, hair-loss protocols, ED tablets, oral wellness — stays in the catalog and
 * stays sellable by staff. `/admin/rx/portal` and `/rx-portal/place-order` render every
 * SKU in `catalog-data`; only the public shop is filtered.
 *
 * The peptide half of the allowlist is derived from the BoomRx sheet rather than
 * hand-typed, so re-syncing the sheet re-syncs the shop. Name matching lives with the
 * sheet in `lib/peptide-boomrx-catalog`.
 */

import {
  BOOMRX_SHEET_ROWS,
  boomrxIngredientKey,
  isOnBoomRxSheet,
} from "@/lib/peptide-boomrx-catalog";
import { PRODUCTS } from "./catalog-data";
import { SHOP_GOALS, SHOP_GOAL_HERO_DRUG_KEYS } from "./helpers";
import type { CatalogProduct } from "./types";

/**
 * Goals kept whole for clients. Supplies rides along because syringes, needles, and
 * bacteriostatic water are consumables for the injectables above — they are not a goal
 * card, they only surface in search, the full-catalog browse, and the GLP-1 stack.
 */
const CLIENT_VISIBLE_GOALS = new Set(["Lose Weight", "Hormones", "Supplies"]);

/**
 * Removed from every client surface earlier: investigational and not FDA-approved.
 * Kept as a name guard so a future catalog sync cannot quietly put it back in the shop.
 */
const NEVER_CLIENT_VISIBLE = /retatrutide/i;

/**
 * Injectable wellness vitamins that stay listed even though they are not on the peptide
 * sheet: `/rx/wellness` markets them by name, so hiding them would leave the hub
 * advertising something a client cannot reach. Injectables only — the oral forms of the
 * same molecule remain staff-only, since the shop sells the shot, not the capsule.
 */
const CLIENT_VISIBLE_WELLNESS_DRUG_KEYS = new Set(["b12"]);

function isMarketedWellnessInjectable(product: CatalogProduct): boolean {
  return (
    product.form === "Injectable" && CLIENT_VISIBLE_WELLNESS_DRUG_KEYS.has(product.drugKey)
  );
}

/** True when this SKU is one of the peptides on the BoomRx sheet. */
export function isBoomRxSheetProduct(product: CatalogProduct): boolean {
  return isOnBoomRxSheet(product.name, { perDoseOnly: product.perUnit });
}

export function isClientVisibleProduct(product: CatalogProduct): boolean {
  if (NEVER_CLIENT_VISIBLE.test(product.name)) return false;
  if (CLIENT_VISIBLE_GOALS.has(product.goal)) return true;
  if (isMarketedWellnessInjectable(product)) return true;
  return isBoomRxSheetProduct(product);
}

const ALL_PRODUCTS = PRODUCTS as CatalogProduct[];

export const CLIENT_VISIBLE_PRODUCTS: CatalogProduct[] =
  ALL_PRODUCTS.filter(isClientVisibleProduct);

export const CLIENT_HIDDEN_PRODUCTS: CatalogProduct[] = ALL_PRODUCTS.filter(
  (product) => !isClientVisibleProduct(product),
);

const CLIENT_VISIBLE_IDS = new Set(CLIENT_VISIBLE_PRODUCTS.map((p) => p.id));

export function isClientVisibleProductId(id: string): boolean {
  return CLIENT_VISIBLE_IDS.has(id);
}

/**
 * Goal cards on the client shop. A card leads with one protocol (its hero vial and
 * "from $X"), so a goal only earns a card while that protocol is still client-visible —
 * otherwise the card would advertise something the shop no longer lists.
 */
export const CLIENT_SHOP_GOALS = SHOP_GOALS.filter((goal) =>
  CLIENT_VISIBLE_PRODUCTS.some(
    (p) => p.goal === goal && p.drugKey === SHOP_GOAL_HERO_DRUG_KEYS[goal],
  ),
);

/** Sheet rows with no catalog SKU — audited with `scripts/audit-rx-client-catalog.ts`. */
export function boomRxSheetRowsWithoutCatalogMatch(): string[] {
  const catalogKeys = new Set(ALL_PRODUCTS.map((p) => boomrxIngredientKey(p.name)));
  return BOOMRX_SHEET_ROWS.filter((row) => !catalogKeys.has(row.key)).map(
    (row) => row.productName,
  );
}
