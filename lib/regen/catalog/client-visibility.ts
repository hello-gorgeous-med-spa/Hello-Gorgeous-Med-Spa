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

/** Goals kept whole for clients. */
const CLIENT_VISIBLE_GOALS = new Set(["Lose Weight", "Hormones"]);

/**
 * Consumables that ride along with an injectable — syringes, needles, luer locks,
 * bacteriostatic water, Topi-Click. They belong to a protocol rather than to a
 * shopper: a product card reading "Bacteriostatic Water · dose set at consult" is
 * nonsense, and a $1 needle tip next to a $235 GLP-1 makes the shop look like a
 * supply closet. Hidden from the client shop, still allowed inside a stack (the
 * GLP-1 Kickstart kit legitimately includes a month of supplies) and still fully
 * sellable by staff.
 */
const KIT_COMPONENT_GOALS = new Set(["Supplies"]);

/** True for a consumable that ships with a protocol instead of being shopped for. */
export function isKitComponentProduct(product: CatalogProduct): boolean {
  return KIT_COMPONENT_GOALS.has(product.goal);
}

/**
 * Kept off every client surface. Name-guarded so a catalog or BoomRx re-sync cannot
 * quietly put them back in the shop.
 *
 * - Retatrutide: investigational, never client-visible.
 * - SS-31 / elamipretide: FDA-approved as FORZINITY (Stealth BioTherapeutics). We do
 *   not market or offer compounded elamipretide. Counsel: Foley Hoag letter 19 Aug 2026.
 * - Named peptides below: do not publicly market (FDA compounding / advertising risk).
 *   Staff portals still see the full catalog. Public shop + intake picker do not.
 */
export const NEVER_CLIENT_VISIBLE =
  /retatrutide|ss-?31|elamipretide|elamipiretide|bpc-?157|pentadeca|aod-?9604|cjc-?1295|epithalon|epitalon|ghk-?cu|ipamorelin|kpv|ll-?37|mots-?c|selank|semax|thymosin|tb-?500|ibutamoren|mk-?677|ghrp-?[26]|melanotan|dsip|emideltide|wolverine|klow/i;

export function isNeverClientVisibleText(...parts: Array<string | undefined>): boolean {
  return NEVER_CLIENT_VISIBLE.test(parts.filter(Boolean).join(" "));
}

/**
 * The weight-loss program is injection-only, so the shop lists injectable GLP-1 SKUs
 * and nothing else. The oral disintegrating tablets and sublingual solutions stay in
 * the catalog for staff but are hidden from clients: the hub cards, the program
 * pricing, and the GLP-1 Kickstart's "month of injection supplies" all describe a
 * shot, and an oral SKU underneath that copy sells a form we do not run.
 */
const GLP1_DRUG_KEYS = new Set(["semaglutide", "tirzepatide"]);

function isNonInjectableGlp1(product: CatalogProduct): boolean {
  return GLP1_DRUG_KEYS.has(product.drugKey) && !/inject/i.test(product.form ?? "");
}

/**
 * Injectable wellness vitamins that stay listed even though they are not on the peptide
 * sheet: `/rx/wellness` markets them by name, so hiding them would leave the hub
 * advertising something a client cannot reach. Injectables only — the oral forms of the
 * same molecule remain staff-only, since the shop sells the shot, not the capsule.
 */
const CLIENT_VISIBLE_WELLNESS_DRUG_KEYS = new Set(["b12", "vitamind"]);

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
  if (isNeverClientVisibleText(product.id, product.name, product.drugKey)) return false;
  if (isNonInjectableGlp1(product)) return false;
  if (CLIENT_VISIBLE_GOALS.has(product.goal)) return true;
  if (isMarketedWellnessInjectable(product)) return true;
  // BoomRx peptides stay in the staff catalog. The public shop is not a
  // prescription-peptide cart.
  return false;
}

const ALL_PRODUCTS = PRODUCTS as CatalogProduct[];

export const CLIENT_VISIBLE_PRODUCTS: CatalogProduct[] =
  ALL_PRODUCTS.filter(isClientVisibleProduct);

/**
 * Compounds that stay client-visible for protocol pages / intake, but are not
 * shopping cards. AgelessRx merchandises treatments — not aromatase inhibitors,
 * anabolics, HGH, or slipped peptides.
 */
const TREATMENTS_SHOP_HIDDEN_DRUG_KEYS = new Set([
  "anastrozole",
  "exemestane",
  "tamoxifen",
  "cabergoline",
  "nandrolone",
  "oxandrolone",
  "stanozolol",
  "hgh",
  "kisspeptin",
  "igflr3",
  "melanotan",
]);

export function isTreatmentsShopProduct(product: CatalogProduct): boolean {
  return isClientVisibleProduct(product) && !TREATMENTS_SHOP_HIDDEN_DRUG_KEYS.has(product.drugKey);
}

/** One card per compound, injectable SKU preferred so the photo matches the shot. */
export function treatmentsShopProducts(
  products: readonly CatalogProduct[] = CLIENT_VISIBLE_PRODUCTS,
): CatalogProduct[] {
  const byKey = new Map<string, CatalogProduct[]>();
  for (const product of products) {
    if (!isTreatmentsShopProduct(product)) continue;
    const list = byKey.get(product.drugKey) ?? [];
    list.push(product);
    byKey.set(product.drugKey, list);
  }
  const out: CatalogProduct[] = [];
  for (const list of byKey.values()) {
    out.push(list.find((p) => /inject/i.test(p.form ?? "")) ?? list[0]);
  }
  return out;
}

export const CLIENT_HIDDEN_PRODUCTS: CatalogProduct[] = ALL_PRODUCTS.filter(
  (product) => !isClientVisibleProduct(product),
);

const CLIENT_VISIBLE_IDS = new Set(CLIENT_VISIBLE_PRODUCTS.map((p) => p.id));

export function isClientVisibleProductId(id: string): boolean {
  return CLIENT_VISIBLE_IDS.has(id);
}

/**
 * Resolve a stack's compound to the SKU a shopper can actually open. Stacks pick by
 * compound rather than by id, and the plain lookup returns the first match in catalog
 * order — for tirzepatide that was the oral tablet, so the GLP-1 Kickstart quoted a
 * tablet beside its month of injection supplies. Falls back to any match so kit
 * consumables, which are hidden on purpose, still resolve.
 */
export function findClientProductByDrugKey(drugKey: string): CatalogProduct | undefined {
  return (
    CLIENT_VISIBLE_PRODUCTS.find((p) => p.drugKey === drugKey) ??
    ALL_PRODUCTS.find((p) => p.drugKey === drugKey)
  );
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
