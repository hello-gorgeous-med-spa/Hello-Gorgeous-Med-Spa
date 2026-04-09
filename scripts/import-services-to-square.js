#!/usr/bin/env node
/**
 * Upsert ITEM + one ITEM_VARIATION per row into Square Catalog from JSON (small default list).
 * For the full ~85 Fresha services + categories + appointment durations, use:
 *   node scripts/import-services-to-square.mjs
 *
 * Usage:
 *   SQUARE_ACCESS_TOKEN=EAAA... node scripts/import-services-to-square.js
 *   SQUARE_ACCESS_TOKEN=EAAA... node scripts/import-services-to-square.js path/to/services.json
 *   SQUARE_ACCESS_TOKEN=EAAA... SQUARE_ENVIRONMENT=sandbox node scripts/import-services-to-square.js
 *   node scripts/import-services-to-square.js --dry-run
 *
 * Env:
 *   SQUARE_ACCESS_TOKEN (required unless --dry-run)
 *   SQUARE_ENVIRONMENT    production | sandbox (default production)
 *
 * JSON rows: { id, name, description?, price_cents, category? }
 */

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

function getFetch() {
  if (typeof fetch === "function") return fetch.bind(globalThis);
  return require("node-fetch");
}
const fetchFn = (...args) => getFetch()(...args);

const SQUARE_VERSION = "2024-11-20";

function baseUrl() {
  const env = (process.env.SQUARE_ENVIRONMENT || "production").toLowerCase();
  return env === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";
}

function loadServices(jsonPath) {
  const raw = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error("JSON root must be an array of service objects");
  }
  return data;
}

async function upsertItem(token, service) {
  const itemId = `#hg_${service.id.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  const varId = `${itemId}_var`;

  const body = {
    idempotency_key: randomUUID(),
    object: {
      type: "ITEM",
      id: itemId,
      present_at_all_locations: true,
      item_data: {
        name: service.name,
        description: service.description || undefined,
        available_online: true,
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varId,
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemId,
              name: "Regular",
              pricing_type:
                service.price_cents > 0 ? "FIXED_PRICING" : "VARIABLE_PRICING",
              ...(service.price_cents > 0
                ? {
                    price_money: {
                      amount: service.price_cents,
                      currency: "USD",
                    },
                  }
                : {}),
            },
          },
        ],
      },
    },
  };

  const res = await fetchFn(`${baseUrl()}/v2/catalog/object`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = json.errors?.[0]?.detail || json.errors?.[0]?.code || res.statusText;
    throw new Error(`${service.name}: ${err}`);
  }
  return json;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--dry-run");
  const dryRun = process.argv.includes("--dry-run");

  const defaultJson = path.join(__dirname, "square-catalog-import.json");
  const jsonPath = path.resolve(args[0] || defaultJson);

  if (!fs.existsSync(jsonPath)) {
    console.error("Missing JSON:", jsonPath);
    process.exit(1);
  }

  const services = loadServices(jsonPath);
  const token = process.env.SQUARE_ACCESS_TOKEN;

  if (dryRun) {
    console.log(`Dry run — would upsert ${services.length} items from ${jsonPath}`);
    services.slice(0, 3).forEach((s) => console.log("  sample:", s.name, s.price_cents, "¢"));
    if (services.length > 3) console.log("  ...");
    process.exit(0);
  }

  if (!token || token.length < 10) {
    console.error("Set SQUARE_ACCESS_TOKEN (Square Dashboard → Developers → Access token).");
    process.exit(1);
  }

  console.log(`Square ${baseUrl()} — importing ${services.length} services from ${jsonPath}\n`);

  let ok = 0;
  for (const s of services) {
    if (!s.id || !s.name) {
      console.error("Skip row missing id/name:", s);
      continue;
    }
    const price_cents = Number(s.price_cents) || 0;
    try {
      await upsertItem(token, { ...s, price_cents });
      console.log("✓", s.name);
      ok += 1;
    } catch (e) {
      console.error("✗", e.message || e);
    }
  }

  console.log(`\nDone: ${ok}/${services.length} OK`);
  process.exit(ok === services.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
