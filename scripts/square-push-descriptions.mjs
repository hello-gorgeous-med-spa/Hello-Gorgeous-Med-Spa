#!/usr/bin/env node
// Phase 2.1 — push descriptions for the 5 bare live items.
// One-shot. Reads SERVICE_CONTENT + latest snapshot, upserts via Square Catalog API.

import { readFileSync, writeFileSync } from "node:fs";
import { config } from "dotenv";
import { SERVICE_CONTENT } from "./square-service-content.mjs";

config({ path: ".env.local" });

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("SQUARE_ACCESS_TOKEN missing");
  process.exit(1);
}

const ENV = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "").toLowerCase();
const HOST = ENV === "production"
  ? "https://connect.squareup.com"
  : "https://connect.squareupsandbox.com";

const SQUARE_VERSION = "2024-12-18";
const SNAPSHOT = "tmp/square-backups/snapshot-post-phase2-2026-05-02T14-16-25-851Z.json";

const TARGETS = [
  "Tirzepatide",
  "Retatrutide",
  "Vitamin Injection",
  "Neuromodulator",
  "Quantum RF, Morpheous 8 x3 package, and Solaria CO2",
];

const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const items = snap.objects.filter(
  (o) => o.type === "ITEM" && TARGETS.includes(o.item_data?.name),
);

if (items.length !== TARGETS.length) {
  console.error(
    `Expected ${TARGETS.length} items, found ${items.length}. Aborting.`,
  );
  console.error(
    "Found:",
    items.map((i) => i.item_data.name),
  );
  process.exit(1);
}

console.log(`Host: ${HOST}`);
console.log(`Pushing descriptions for ${items.length} items...\n`);

const results = [];
for (const item of items) {
  const name = item.item_data.name;
  const description = SERVICE_CONTENT[name]?.d;
  if (!description) {
    console.log(`SKIP ${name} — no source description`);
    continue;
  }

  const obj = JSON.parse(JSON.stringify(item));
  obj.item_data.description = description;
  // Square will regenerate description_html / description_plaintext from `description`.
  delete obj.item_data.description_html;
  delete obj.item_data.description_plaintext;

  const res = await fetch(`${HOST}/v2/catalog/object`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
    body: JSON.stringify({
      idempotency_key: `seo-fill-${item.id}-${Date.now()}`,
      object: obj,
    }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error(`FAIL ${name}: ${JSON.stringify(json.errors || json)}`);
    results.push({ name, ok: false, error: json.errors || json });
  } else {
    console.log(`OK   ${name}  v${json.catalog_object?.version}`);
    results.push({ name, ok: true, version: json.catalog_object?.version });
  }
}

console.log(`\nDone. ${results.filter((r) => r.ok).length}/${results.length} succeeded.`);

const outPath = `tmp/square-backups/push-phase2.1-result-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(outPath, JSON.stringify({ host: HOST, results }, null, 2));
console.log(`Receipt: ${outPath}`);
