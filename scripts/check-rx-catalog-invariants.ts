/**
 * CI gate for the client-facing RX / RE GEN catalog.
 *
 *   npx tsx scripts/check-rx-catalog-invariants.ts
 *
 * Exits non-zero when a client surface would ship something incoherent. This exists
 * because three phantom product cards shipped to production unnoticed — a "Vitamin D3
 * Injection · $148.78/vial" card pointing at a $1.25 oral capsule, a "Biotin Injection"
 * card pointing at a Biotin/Minoxidil capsule, and a "Glutathione Injection" tile
 * pointing at the capsule instead of the vial — alongside a pricing bug that quoted
 * per-unit oral SKUs at vial cost x 30 ($3,750 Gonadorelin tablets). Nothing verified
 * any of it.
 *
 * `scripts/audit-rx-client-catalog.ts` is the human-readable companion: it prints the
 * full picture and always exits 0. This script asserts and stays quiet when healthy.
 */

import { CATALOG_BUNDLES, CLIENT_STACK_IDS } from "../lib/regen/catalog/bundles";
import { PRODUCTS } from "../lib/regen/catalog/catalog-data";
import { catalogClientSupplyUsd } from "../lib/regen/catalog/client-price";
import {
  CLIENT_VISIBLE_PRODUCTS,
  boomRxSheetRowsWithoutCatalogMatch,
  findClientProductByDrugKey,
  isClientVisibleProductId,
  isKitComponentProduct,
} from "../lib/regen/catalog/client-visibility";
import { formGroup } from "../lib/regen/catalog/helpers";
import { BOOMRX_PEPTIDE_PDF_PRODUCTS } from "../lib/peptide-boomrx-catalog";
import { REGEN_CATEGORY_HUBS, type RxCategoryProduct } from "../lib/rx-category-hubs";
import type { CatalogProduct } from "../lib/regen/catalog/types";

const ALL_PRODUCTS = PRODUCTS as CatalogProduct[];
const PRODUCT_BY_ID = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));

const failures: string[] = [];
const warnings: string[] = [];

function fail(invariant: string, detail: string): void {
  failures.push(`[${invariant}] ${detail}`);
}

function warn(invariant: string, detail: string): void {
  warnings.push(`[${invariant}] ${detail}`);
}

/** Hub cards, flattened with the hub they came from so failures name a real screen. */
type HubCard = { hubId: string; hubPath: string; card: RxCategoryProduct };

const HUB_CARDS: HubCard[] = REGEN_CATEGORY_HUBS.flatMap((hub) =>
  hub.products.map((card) => ({ hubId: hub.id, hubPath: hub.hubPath, card })),
);

function describeCard({ hubId, card }: HubCard): string {
  return `${hubId} hub card "${card.name}" (id ${card.id}, catalogProductId ${card.catalogProductId})`;
}

/* ------------------------------------------------------------------ *
 * 1. Every client-visible product resolves to a real price above zero.
 * ------------------------------------------------------------------ */

for (const product of CLIENT_VISIBLE_PRODUCTS) {
  if (!product.variants.length) {
    fail("price", `${product.id} ${product.name} is client-visible with no variants`);
    continue;
  }

  const usd = catalogClientSupplyUsd(product, 30);
  if (!Number.isFinite(usd) || usd <= 0) {
    fail(
      "price",
      `${product.id} ${product.name} quotes ${JSON.stringify(usd)} for a 30-day supply`,
    );
  }
}

/* ------------------------------------------------------------------------------ *
 * 2. Every hub card that declares a catalogProductId points at a product that exists.
 * ------------------------------------------------------------------------------ */

for (const entry of HUB_CARDS) {
  const { catalogProductId } = entry.card;
  if (!catalogProductId) continue;

  if (!PRODUCT_BY_ID.has(catalogProductId)) {
    fail(
      "hub-card-missing-product",
      `${describeCard(entry)} points at a catalog id that does not exist — the card links to /rx/product/${catalogProductId}, which 404s`,
    );
  }
}

/* ---------------------------------------------------------------------------- *
 * 3. Hub cards pointing at a product hidden from clients.
 *
 * Reported, not failed. Some cards do this on purpose: the product stays staff-only
 * while the card falls back to an intake/consult link, which is a legitimate way to
 * advertise a protocol the shop does not list for self-service. The list exists so
 * that choice stays deliberate — a card silently drifting onto a hidden SKU looks
 * exactly the same from the code, but strands the shopper.
 * ---------------------------------------------------------------------------- */

for (const entry of HUB_CARDS) {
  const { catalogProductId } = entry.card;
  if (!catalogProductId) continue;

  const product = PRODUCT_BY_ID.get(catalogProductId);
  if (!product) continue; // already a hard failure above

  if (!isClientVisibleProductId(product.id)) {
    warn(
      "hub-card-hidden-product",
      `${describeCard(entry)} resolves to "${product.name}", which the client shop hides — confirm the card is meant to fall back to intake (href ${entry.card.href})`,
    );
  }
}

/* -------------------------------------------------------------------------- *
 * 4. No client-visible product quotes above the sanity ceiling.
 *
 * The ceiling catches unit-math bugs (a per-dose SKU priced as 30 vials), not
 * expensive medicine. Genuinely expensive SKUs are allowlisted one at a time so
 * that adding one is a decision someone signs off on, rather than a number that
 * quietly creeps upward.
 * -------------------------------------------------------------------------- */

const CLIENT_PRICE_CEILING_USD = 1_200;

const CEILING_EXEMPT_PRODUCT_IDS: Record<string, string> = {
  // Brand somatropin, priced by the manufacturer — ~$1,065/mo is the real cost, not a bug.
  p88: "Omnitrope - Commercial",
  // Brand somatropin, same story — ~$1,025/mo.
  p141: "Zomacton - Commercial",
};

for (const product of CLIENT_VISIBLE_PRODUCTS) {
  if (!product.variants.length) continue;

  const usd = catalogClientSupplyUsd(product, 30);
  if (usd <= CLIENT_PRICE_CEILING_USD) continue;

  if (product.id in CEILING_EXEMPT_PRODUCT_IDS) continue;

  fail(
    "price-ceiling",
    `${product.id} ${product.name} quotes $${usd.toLocaleString("en-US")} for 30 days, above the $${CLIENT_PRICE_CEILING_USD.toLocaleString("en-US")} ceiling — check the per-unit vs per-vial math before allowlisting it`,
  );
}

for (const [id, label] of Object.entries(CEILING_EXEMPT_PRODUCT_IDS)) {
  if (!PRODUCT_BY_ID.has(id)) {
    fail(
      "price-ceiling",
      `price ceiling allowlist names ${id} (${label}), which is no longer in the catalog — drop the entry`,
    );
  }
}

/* ------------------------------------------------------------- *
 * 5. Every row on the BoomRx sheet matches a catalog SKU.
 *
 * An unmatched row means the shop cannot sell something the NP is
 * already buying, and client pricing silently falls back to Olympia
 * wholesale for anything that half-matches it.
 * ------------------------------------------------------------- */

const unmatchedSheetRows = boomRxSheetRowsWithoutCatalogMatch();
for (const name of unmatchedSheetRows) {
  fail(
    "boomrx-sheet",
    `BoomRx sheet row "${name}" has no catalog SKU — add the SKU or remove the row from BOOMRX_PEPTIDE_PDF_PRODUCTS`,
  );
}

/* ------------------------------------------------------------------------ *
 * 6. Retatrutide stays off every client surface.
 *
 * Removed deliberately: investigational, not FDA-approved. `client-visibility`
 * enforces this with a name guard; this asserts the guard still bites after a
 * catalog re-sync renames something.
 * ------------------------------------------------------------------------ */

const RETATRUTIDE_GUARD = /retatrutide/i;

for (const product of CLIENT_VISIBLE_PRODUCTS) {
  if (RETATRUTIDE_GUARD.test(product.name)) {
    fail(
      "retatrutide",
      `${product.id} ${product.name} is client-visible — retatrutide is investigational and was removed from every client surface`,
    );
  }
}

for (const entry of HUB_CARDS) {
  const { card } = entry;
  if (RETATRUTIDE_GUARD.test(`${card.name} ${card.description}`)) {
    fail("retatrutide", `${describeCard(entry)} advertises retatrutide`);
  }
}

/* --------------------------------------------------------------------------- *
 * 7. Every client-visible stack is fully buildable by a client.
 *
 * A stack whose component is hidden renders a price for something the shopper
 * cannot see. Injection supplies are the deliberate exception — the GLP-1
 * Kickstart kit ships a month of syringes that nobody shops for on their own.
 * --------------------------------------------------------------------------- */

for (const bundle of CATALOG_BUNDLES) {
  if (!(CLIENT_STACK_IDS as readonly string[]).includes(bundle.id)) continue;

  for (const pick of bundle.pick) {
    const drugKey = pick[0];
    // Mirror the shop: it resolves a pick to a client-visible SKU when one exists, so
    // asserting against plain catalog order would flag a product no shopper is shown.
    const product = findClientProductByDrugKey(drugKey);

    if (!product) {
      fail(
        "stack",
        `client stack "${bundle.name}" (${bundle.id}) picks drugKey "${drugKey}", which matches no catalog product`,
      );
      continue;
    }

    if (isClientVisibleProductId(product.id) || isKitComponentProduct(product)) continue;

    fail(
      "stack",
      `client stack "${bundle.name}" (${bundle.id}) includes "${product.name}" (${product.id}), which is hidden from clients and is not a kit component — move the stack out of CLIENT_STACK_IDS or list the product`,
    );
  }
}

/* ---------------------------------------------------------------------------- *
 * 8. A card that advertises an injection must resolve to an injectable.
 *
 * This is the check that would have caught all three phantom cards. Each one read
 * "<something> Injection · $X/vial" while its catalogProductId pointed at a capsule,
 * so the shopper clicked an injection and landed on an oral SKU at a different price.
 * The card copy is the promise; the resolved product's form has to keep it.
 * ---------------------------------------------------------------------------- */

const CARD_CLAIMS_INJECTION = /\b(inject|injects|injected|injection|injectable|vial|syringe|subcutaneous|intramuscular)\b/i;

const ORAL_OR_TOPICAL_GROUPS = new Set(["Oral / SL", "Topical / Liquid"]);

/**
 * Mismatches that already ship on main, downgraded to a warning so this script can gate
 * CI without turning main red on the day it lands. Every entry is a real bug someone
 * still has to fix; an entry that stops tripping is reported so it gets deleted.
 *
 * Keyed `hubId:cardId`.
 */
const KNOWN_FORM_MISMATCH_CARDS: Record<string, string> = {
  // Empty on purpose. The `/rx/weight-loss` GLP-1 cards used to live here: they sold an
  // injection while pointing at oral disintegrating tablets. The program is
  // injection-only, so those oral SKUs are now hidden from the shop and both cards fall
  // back to intake. They still need a catalogProductId pointing at the injectable SKU
  // once the NP confirms which formulation he dispenses.
};

const trippedFormMismatchKeys = new Set<string>();

for (const entry of HUB_CARDS) {
  const { card } = entry;
  if (!card.catalogProductId) continue;

  const product = PRODUCT_BY_ID.get(card.catalogProductId);
  if (!product) continue; // already a hard failure above

  // When the resolved product is hidden the hub renders HubFallbackCard and routes to
  // intake, so no shopper ever lands on the oral SKU. Invariant 3 already lists those
  // cards; asserting form here would flag copy that never resolves to a product
  // on screen.
  if (!isClientVisibleProductId(product.id)) continue;

  const claim = `${card.name} ${card.description} ${card.priceLabel}`;
  if (!CARD_CLAIMS_INJECTION.test(claim)) continue;

  const group = formGroup(product.form);
  if (!ORAL_OR_TOPICAL_GROUPS.has(group)) continue;

  const key = `${entry.hubId}:${card.id}`;
  const detail = `${describeCard(entry)} advertises an injection ("${card.name} · ${card.priceLabel}") but resolves to "${product.name}", form "${product.form}" (${group}) — point catalogProductId at the injectable SKU`;

  if (key in KNOWN_FORM_MISMATCH_CARDS) {
    trippedFormMismatchKeys.add(key);
    warn("form-mismatch-known", `${detail} [known: ${KNOWN_FORM_MISMATCH_CARDS[key]}]`);
    continue;
  }

  fail("form-mismatch", detail);
}

for (const key of Object.keys(KNOWN_FORM_MISMATCH_CARDS)) {
  if (!trippedFormMismatchKeys.has(key)) {
    fail(
      "form-mismatch",
      `KNOWN_FORM_MISMATCH_CARDS still lists "${key}", which no longer mismatches — delete the entry so the next one fails loudly`,
    );
  }
}

/* ---------------- report ---------------- */

const checkedHubCards = HUB_CARDS.filter((e) => e.card.catalogProductId).length;

console.log("RX catalog invariants");
console.log(
  `  ${ALL_PRODUCTS.length} SKUs · ${CLIENT_VISIBLE_PRODUCTS.length} client-visible · ${checkedHubCards} hub cards with a catalog id · ${BOOMRX_PEPTIDE_PDF_PRODUCTS.length} BoomRx sheet rows`,
);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}) — intentional today, re-confirm when editing:`);
  for (const line of warnings) console.log(`  ! ${line}`);
}

if (failures.length) {
  console.error(`\nFAILED — ${failures.length} invariant violation(s):`);
  for (const line of failures) console.error(`  x ${line}`);
  console.error(
    "\nThese are client-facing. Fix the catalog or the card before merging; do not relax the check.",
  );
  process.exit(1);
}

console.log("\nAll invariants hold.");
