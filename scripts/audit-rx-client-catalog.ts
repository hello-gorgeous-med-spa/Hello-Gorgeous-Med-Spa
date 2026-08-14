/**
 * Audit what the client-facing RE GEN shop shows vs what only staff can see.
 *
 * Run after re-syncing the BoomRx sheet or editing `client-visibility.ts`:
 *   npx tsx scripts/audit-rx-client-catalog.ts
 *
 * This prints the full picture and always exits 0. `scripts/check-rx-catalog-invariants.ts`
 * is the CI gate that turns the same data into pass/fail assertions.
 */

import { PRODUCTS } from "../lib/regen/catalog/catalog-data";
import {
  CLIENT_HIDDEN_PRODUCTS,
  CLIENT_SHOP_GOALS,
  CLIENT_VISIBLE_PRODUCTS,
  boomRxSheetRowsWithoutCatalogMatch,
  isBoomRxSheetProduct,
} from "../lib/regen/catalog/client-visibility";
import { CATALOG_BUNDLES, CLIENT_STACK_IDS } from "../lib/regen/catalog/bundles";
import { catalogClientMonthlyUsd } from "../lib/regen/catalog/client-price";
import { price30 } from "../lib/regen/catalog/pricing";
import type { CatalogProduct } from "../lib/regen/catalog/types";

const all = PRODUCTS as CatalogProduct[];

function byGoal(list: CatalogProduct[]): Map<string, CatalogProduct[]> {
  const map = new Map<string, CatalogProduct[]>();
  for (const product of list) {
    const bucket = map.get(product.goal) ?? [];
    bucket.push(product);
    map.set(product.goal, bucket);
  }
  return map;
}

function group(product: CatalogProduct): string {
  if (product.goal === "Lose Weight") return "Weight loss / GLP-1";
  if (product.goal === "Hormones") return "Hormones / HRT";
  if (product.goal === "Supplies") return "Injection supplies";
  return "BoomRx sheet peptides";
}

console.log(`Catalog SKUs: ${all.length}`);
console.log(`Client-visible: ${CLIENT_VISIBLE_PRODUCTS.length}`);
console.log(`Hidden from clients: ${CLIENT_HIDDEN_PRODUCTS.length}\n`);

console.log("— Client-visible by group —");
const groups = new Map<string, CatalogProduct[]>();
for (const product of CLIENT_VISIBLE_PRODUCTS) {
  const key = group(product);
  groups.set(key, [...(groups.get(key) ?? []), product]);
}
for (const [key, list] of Array.from(groups)) {
  console.log(`${key}: ${list.length}`);
}

console.log("\n— Client-visible by goal (was → now) —");
const before = byGoal(all);
const after = byGoal(CLIENT_VISIBLE_PRODUCTS);
for (const [goal, list] of Array.from(before)) {
  console.log(`${goal}: ${list.length} → ${after.get(goal)?.length ?? 0}`);
}

console.log(`\nGoal cards shown to clients: ${CLIENT_SHOP_GOALS.join(", ")}`);

console.log("\n— Hidden from clients —");
for (const [goal, list] of Array.from(byGoal(CLIENT_HIDDEN_PRODUCTS))) {
  console.log(`\n${goal} (${list.length})`);
  for (const product of list) {
    console.log(`  ${product.id}  ${product.name} · ${product.form}`);
  }
}

console.log("\n— Sheet peptides now client-visible —");
for (const product of CLIENT_VISIBLE_PRODUCTS.filter(isBoomRxSheetProduct)) {
  console.log(`  ${product.id}  ${product.name}`);
}

const unmatched = boomRxSheetRowsWithoutCatalogMatch();
console.log(`\n— Sheet rows with no catalog SKU (${unmatched.length}) —`);
for (const name of unmatched) console.log(`  ${name}`);

console.log("\n— Client prices (sanity check for absurd quotes) —");
const quotes = CLIENT_VISIBLE_PRODUCTS.map((product) => ({
  product,
  usd: catalogClientMonthlyUsd(product) ?? price30(product, product.variants[0]),
})).sort((a, b) => b.usd - a.usd);
for (const { product, usd } of quotes.slice(0, 12)) {
  console.log(`  $${usd.toLocaleString("en-US")}  ${product.id} ${product.name}`);
}

console.log("\n— Stacks —");
const visibleIds = new Set(CLIENT_VISIBLE_PRODUCTS.map((p) => p.id));
for (const bundle of CATALOG_BUNDLES) {
  const picks = bundle.pick.map((pick) => {
    const product = all.find((p) => p.drugKey === pick[0]);
    return product
      ? `${product.name}${visibleIds.has(product.id) ? "" : " [HIDDEN]"}`
      : `${pick[0]} [MISSING]`;
  });
  const clientLadder = (CLIENT_STACK_IDS as readonly string[]).includes(bundle.id);
  console.log(`  ${clientLadder ? "client" : "staff "} ${bundle.id}: ${picks.join(" + ")}`);
}
