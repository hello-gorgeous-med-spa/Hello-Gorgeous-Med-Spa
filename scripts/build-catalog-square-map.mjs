#!/usr/bin/env node
/**
 * Maps storefront catalog lines (catalog-data.js) → Square variation IDs
 * via regen-best-prices.json + square-regen-catalog-manifest.json.
 *
 *   node scripts/build-catalog-square-map.mjs
 *   → data/catalog-square-map.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function unitsPer(product) {
  const n = (product.name || "").toLowerCase();
  if (/30 day|bottle|insert/.test(n) || product.form === "Vag. Insert") return 1;
  return product.perUnit ? 30 : 1;
}

function price30(product, variant) {
  const base = variant.retail * unitsPer(product);
  return base >= 20 ? Math.round(base / 5) * 5 : base;
}

function price90(product, variant) {
  const base = price30(product, variant) * 3;
  return Math.round((base * 0.9) / 5) * 5;
}

function matchRegenSku(catalogProduct, variant, regenProducts) {
  const nameN = norm(catalogProduct.name);
  const strengthN = norm(variant.strength);
  const formN = norm(catalogProduct.form);

  const hits = regenProducts.filter((p) => {
    const compoundN = norm(p.compound || p.name);
    const concN = norm(p.concentration || p.size || "");
    const formMatch =
      !formN ||
      norm(p.form).includes(formN) ||
      formN.includes(norm(p.form)) ||
      norm(p.route).includes(formN);
    const nameMatch =
      compoundN === nameN ||
      compoundN.includes(nameN) ||
      nameN.includes(compoundN) ||
      norm(p.name) === nameN;
    const strengthMatch =
      concN === strengthN ||
      concN.includes(strengthN) ||
      strengthN.includes(concN);
    return nameMatch && strengthMatch && formMatch;
  });

  if (hits.length === 1) return hits[0];
  if (hits.length > 1) {
    return (
      hits.find((p) => norm(p.concentration || p.size) === strengthN) ||
      hits.find((p) => p.pharmacy === "BoomRx") ||
      hits[0]
    );
  }
  return null;
}

async function main() {
  const { PRODUCTS } = await import("../lib/regen/catalog/catalog-data.js");
  const regen = loadJson("data/regen-best-prices.json").products || [];
  const manifest = loadJson("data/square-regen-catalog-manifest.json");
  const manifestById = new Map((manifest.items || []).map((e) => [e.catalog_id, e]));

  const shippingEntry = manifestById.get("regen-shipping");
  const shipping30 = shippingEntry?.variations?.find((v) => v.key === "30d");

  const lines = {};
  const unmapped = [];

  for (const product of PRODUCTS) {
    product.variants.forEach((variant, variantIndex) => {
      for (const supply of [30, 90]) {
        const key = `${product.id}:${variantIndex}:${supply}`;
        const regenSku = matchRegenSku(product, variant, regen);
        if (!regenSku) {
          unmapped.push({ key, name: product.name, strength: variant.strength });
          return;
        }
        const manifestItem = manifestById.get(regenSku.id);
        if (!manifestItem) {
          unmapped.push({
            key,
            name: product.name,
            strength: variant.strength,
            reason: `no manifest for ${regenSku.id}`,
          });
          return;
        }
        const supplyKey = supply === 90 ? "90d" : "30d";
        const sqVar =
          manifestItem.variations?.find((v) => v.key === supplyKey) ||
          manifestItem.variations?.[0];
        if (!sqVar?.square_variation_id) {
          unmapped.push({
            key,
            name: product.name,
            strength: variant.strength,
            reason: "no square variation",
          });
          return;
        }

        const displayPrice = supply === 90 ? price90(product, variant) : price30(product, variant);
        const squarePriceUsd = (sqVar.price_cents || 0) / 100;

        lines[key] = {
          productId: product.id,
          variantIndex,
          supply,
          regenCatalogId: regenSku.id,
          squareVariationId: sqVar.square_variation_id,
          squareItemId: manifestItem.square_item_id,
          name: product.name,
          strength: variant.strength,
          displayPriceUsd: displayPrice,
          squarePriceUsd,
          priceDeltaUsd: Math.round((displayPrice - squarePriceUsd) * 100) / 100,
        };
      }
    });
  }

  const out = {
    generatedAt: new Date().toISOString(),
    lineCount: Object.keys(lines).length,
    unmappedCount: unmapped.length,
    shipping: shipping30
      ? {
          squareVariationId: shipping30.square_variation_id,
          priceUsd: (shipping30.price_cents || 0) / 100,
        }
      : null,
    lines,
    unmapped: unmapped.slice(0, 50),
  };

  const outPath = path.join(ROOT, "data/catalog-square-map.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`✅ Wrote ${out.lineCount} mapped lines (${unmapped.length} unmapped) → data/catalog-square-map.json`);
  if (unmapped.length) {
    console.log("Unmapped sample:", unmapped.slice(0, 5));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
