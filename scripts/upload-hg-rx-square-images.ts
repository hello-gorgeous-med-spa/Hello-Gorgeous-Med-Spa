#!/usr/bin/env npx tsx
/**
 * Hello Gorgeous RX™ — attach branded peptide thumbnails to Square catalog items.
 *
 * Reads data/square-hg-rx-catalog-manifest.json (square_item_id per slug) and uploads
 * public/images/peptides/*-thumbnail.png via POST /v2/catalog/images.
 *
 * Usage:
 *   npm run upload-square-hg-rx-images:dry-run
 *   npm run upload-square-hg-rx-images:local
 *
 * Env: SQUARE_ACCESS_TOKEN, optional SQUARE_ENVIRONMENT=sandbox
 */

import fs from "fs";
import path from "path";

import { PEPTIDE_EDUCATION_THUMBNAILS } from "../lib/peptide-thumbnails";
import { PEPTIDE_REQUEST_ITEMS } from "../lib/peptide-request-menu";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
const SQUARE_VERSION = "2024-11-20";
const MANIFEST_PATH = path.join(process.cwd(), "data/square-hg-rx-catalog-manifest.json");

const PEPTIDE_SLUGS = new Set(PEPTIDE_REQUEST_ITEMS.map((p) => p.id));

type ManifestEntry = {
  slug: string;
  name: string;
  square_item_id: string;
  square_image_id?: string;
  square_image_url?: string;
};

type ManifestFile = {
  imported_at: string;
  square_environment: string;
  item_count: number;
  items: ManifestEntry[];
};

function apiRoot(): string {
  const env = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
  return env === "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";
}

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENV = apiRoot();

function thumbnailPathForSlug(slug: string): string | null {
  const edu = PEPTIDE_EDUCATION_THUMBNAILS.find((e) => e.slug === slug);
  if (!edu) return null;
  const abs = path.join(process.cwd(), "public", edu.thumbnailPng.slice(1));
  return fs.existsSync(abs) ? abs : null;
}

async function uploadCatalogImage(
  objectId: string,
  slug: string,
  displayName: string,
  imagePath: string,
): Promise<{ imageId: string; url?: string }> {
  const idempotencyKey = FORCE ? `hg-rx-thumb-${slug}-${Date.now()}` : `hg-rx-thumb-${slug}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`,
      image_data: {
        name: displayName,
        caption: `${displayName} — Hello Gorgeous Med Spa patient education`,
      },
    },
  };

  const form = new FormData();
  form.append(
    "request",
    new Blob([JSON.stringify(requestBody)], { type: "application/json" }),
  );
  const bytes = fs.readFileSync(imagePath);
  form.append(
    "file",
    new Blob([bytes], { type: "image/png" }),
    path.basename(imagePath),
  );

  const res = await fetch(`${ENV}/catalog/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
    },
    body: form,
  });

  const data = (await res.json()) as {
    image?: { id: string; image_data?: { url?: string } };
    errors?: Array<{ detail?: string; code?: string }>;
  };

  if (!res.ok || data.errors?.length) {
    throw new Error(data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText);
  }

  const imageId = data.image?.id;
  if (!imageId) throw new Error("No image id in Square response");

  return { imageId, url: data.image?.image_data?.url };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("❌ Missing manifest — run npm run import-square-hg-rx:local first");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as ManifestFile;
  const peptideItems = manifest.items.filter((i) => PEPTIDE_SLUGS.has(i.slug));

  console.log(`\n🖼  Hello Gorgeous RX™ → Square catalog images`);
  console.log(`   ${peptideItems.length} peptide items · ${ENV.replace("/v2", "")}\n`);

  if (DRY_RUN) {
    for (const item of peptideItems.slice(0, 5)) {
      const thumb = thumbnailPathForSlug(item.slug);
      console.log(`  • ${item.name}`);
      console.log(`    item ${item.square_item_id} ← ${thumb ?? "(missing file)"}`);
    }
    console.log(`  … and ${Math.max(0, peptideItems.length - 5)} more`);
    console.log("\nRun: npm run upload-square-hg-rx-images:local\n");
    return;
  }

  if (!TOKEN || TOKEN.length < 10) {
    console.error("❌ Set SQUARE_ACCESS_TOKEN (or use upload-square-hg-rx-images:local with .env.local)");
    process.exit(1);
  }

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of peptideItems) {
    if (item.square_image_id && !FORCE) {
      console.log(`  ↷ ${item.slug} — already has image (${item.square_image_id})`);
      skipped += 1;
      continue;
    }

    const imagePath = thumbnailPathForSlug(item.slug);
    if (!imagePath) {
      console.log(`  ✕ ${item.slug}: thumbnail PNG not found`);
      failed += 1;
      continue;
    }

    try {
      const { imageId, url } = await uploadCatalogImage(
        item.square_item_id,
        item.slug,
        item.name,
        imagePath,
      );
      item.square_image_id = imageId;
      if (url) item.square_image_url = url;
      console.log(`  ✓ ${item.slug} → ${imageId}`);
      ok += 1;
      await sleep(200);
    } catch (e) {
      console.log(`  ✕ ${item.slug}: ${e instanceof Error ? e.message : e}`);
      failed += 1;
    }
  }

  manifest.imported_at = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\n✅ Done: ${ok} uploaded · ${skipped} skipped · ${failed} failed`);
  console.log(`📄 Manifest updated: data/square-hg-rx-catalog-manifest.json\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
