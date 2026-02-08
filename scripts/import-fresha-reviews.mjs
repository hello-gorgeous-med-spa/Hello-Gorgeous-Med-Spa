#!/usr/bin/env node
// ============================================================
// ONE-TIME IMPORT: Fresha reviews → client_reviews
// Run after: 1) Running add-client-reviews.sql in Supabase, 2) Having fresha_reviews_export.csv
//
// Usage:
//   node scripts/import-fresha-reviews.mjs [path-to-fresha_reviews_export.csv]
//
// CSV expected columns (any of these; legacy_review_id optional for dedupe):
//   legacy_review_id, client_name, rating, review_text, service_name, created_at
// ============================================================

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes("placeholder")) {
  console.error("❌ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const csvPath = process.argv[2] || path.join(process.cwd(), "fresha_reviews_export.csv");
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV not found: ${csvPath}`);
  console.error("   Usage: node scripts/import-fresha-reviews.mjs [path-to-csv]");
  process.exit(1);
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (const char of lines[i]) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === "," && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ""));
        current = "";
      } else current += char;
    }
    values.push(current.trim().replace(/^"|"$/g, ""));
    const row = {};
    headers.forEach((h, j) => (row[h] = values[j] ?? ""));
    rows.push(row);
  }
  return rows;
}

function normalizeRating(v) {
  const n = parseInt(String(v).trim(), 10);
  if (Number.isNaN(n) || n < 1 || n > 5) return null;
  return n;
}

function parseDate(v) {
  if (!v || !String(v).trim()) return null;
  const d = new Date(String(v).trim());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCSV(raw);

const seenLegacyIds = new Set();
const toInsert = [];
let rowIndex = 0;
for (const r of rows) {
  let legacy_review_id = (r.legacy_review_id || r.id || "").trim() || null;
  if (legacy_review_id && seenLegacyIds.has(legacy_review_id)) continue;
  if (!legacy_review_id) legacy_review_id = `fresha_import_${rowIndex}`;
  seenLegacyIds.add(legacy_review_id);
  rowIndex++;

  const rating = normalizeRating(r.rating);
  const review_text = String(r.review_text || r.review || r.text || "").trim();
  if (rating == null || !review_text) continue;

  const client_name = String(r.client_name || r.first_name || "").trim() || null;
  const service_name = String(r.service_name || r.service || "").trim() || null;
  const created_at_legacy = parseDate(r.created_at);

  toInsert.push({
    rating,
    review_text,
    client_name,
    service_name,
    source: "fresha_legacy",
    legacy_source_id: legacy_review_id,
    is_verified: true,
    created_at: created_at_legacy || new Date().toISOString(),
    created_at_legacy: created_at_legacy,
  });
}

if (toInsert.length === 0) {
  console.log("⚠️ No valid rows to import. Check CSV columns: legacy_review_id, client_name, rating, review_text, service_name, created_at");
  process.exit(0);
}

// Insert in batches of 50
const BATCH = 50;
let imported = 0;
for (let i = 0; i < toInsert.length; i += BATCH) {
  const batch = toInsert.slice(i, i + BATCH);
  const { error } = await supabase.from("client_reviews").upsert(batch, {
    onConflict: "legacy_source_id",
    ignoreDuplicates: true,
  });
  if (error) {
    console.error("❌ Insert error:", error.message);
    process.exit(1);
  }
  imported += batch.length;
  console.log(`   Imported ${imported}/${toInsert.length}...`);
}

console.log(`\n✅ Imported ${imported} legacy reviews (source: fresha_legacy).`);
console.log("   Run once. No ongoing dependency on Fresha.");
