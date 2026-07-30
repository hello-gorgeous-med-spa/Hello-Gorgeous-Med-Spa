#!/usr/bin/env node
/**
 * Restore CatalogItem.reporting_category from each item's service category.
 *
 * Needed after scripts that accidentally stripped reporting_category on upsert.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-restore-reporting-categories.mjs --dry-run
 *   node --env-file=.env.local scripts/square-restore-reporting-categories.mjs --apply
 */

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (
  process.env.SQUARE_ENVIRONMENT ||
  process.env.SQUARE_ENV ||
  "production"
).toLowerCase();
const HOST =
  envName === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const VER = "2025-04-16";

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function square(method, path, body) {
  const res = await fetch(`${HOST}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": VER,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      json?.errors?.[0]?.detail || json?.errors?.[0]?.code || `HTTP ${res.status}`,
    );
  }
  return json;
}

async function listItems() {
  const out = [];
  let cursor;
  for (;;) {
    const q = new URLSearchParams({ types: "ITEM" });
    if (cursor) q.set("cursor", cursor);
    const data = await square("GET", `/v2/catalog/list?${q}`);
    for (const o of data.objects || []) out.push(o);
    cursor = data.cursor;
    if (!cursor) break;
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(
    DRY_RUN
      ? "DRY RUN — restore reporting categories\n"
      : "APPLY — restore reporting categories\n",
  );

  const items = await listItems();
  const todos = [];

  for (const item of items) {
    const data = item.item_data || {};
    const cat = data.categories?.[0];
    const catId = cat?.id || data.category_id || null;
    if (!catId) continue;
    const current = data.reporting_category?.id || null;
    if (current === catId) continue;
    const ordinal =
      typeof cat?.ordinal === "number" ? cat.ordinal : 0;
    todos.push({
      id: item.id,
      name: data.name || item.id,
      from: current,
      to: catId,
      ordinal,
      object: item,
      productType: data.product_type || null,
    });
  }

  console.log(`Items missing / mismatched reporting_category: ${todos.length}`);
  for (const t of todos.slice(0, 25)) {
    console.log(
      `  • ${t.name.slice(0, 60)}  ${t.from || "(none)"} → ${t.to}${t.productType ? ` [${t.productType}]` : ""}`,
    );
  }
  if (todos.length > 25) console.log(`  … +${todos.length - 25} more`);

  if (DRY_RUN) {
    console.log("\nRe-run with --apply to write reporting_category.\n");
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const t of todos) {
    try {
      const fresh = await square("GET", `/v2/catalog/object/${t.id}`);
      const obj = fresh.object || structuredClone(t.object);
      delete obj.item_data.category_id;
      // Must match categories[0].ordinal — ordinal 0 collides with Square's token field
      const ord =
        typeof obj.item_data.categories?.[0]?.ordinal === "number"
          ? obj.item_data.categories[0].ordinal
          : t.ordinal;
      obj.item_data.reporting_category = { id: t.to, ordinal: ord };
      await square("POST", "/v2/catalog/object", {
        idempotency_key: `hg-restore-report3-${t.id.slice(-10)}-${Date.now().toString(36).slice(-4)}`,
        object: obj,
      });
      ok++;
      if (ok % 20 === 0) console.log(`  … ${ok}/${todos.length}`);
      await sleep(150);
    } catch (err) {
      fail++;
      console.error(
        `  ✕ ${t.name}:`,
        err instanceof Error ? err.message.slice(0, 280) : err,
      );
    }
  }

  console.log(`\nDone. Restored ${ok}, failed ${fail}.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
