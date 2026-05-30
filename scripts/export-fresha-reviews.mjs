#!/usr/bin/env node
/**
 * Export ALL Fresha reviews (authenticated, one-time).
 *
 * Output: fresha_reviews_export.csv
 * Columns: legacy_review_id,client_name,rating,review_text,service_name,created_at
 *
 * Strategy (robust — captures far more than the old DOM-only scroll):
 *   1. Log in once (saved session reused on reruns).
 *   2. Open Marketing → Reviews.
 *   3. Passively CAPTURE every JSON network response and harvest anything that
 *      looks like a review (rating + comment/text). Fresha loads reviews from an
 *      internal API as you scroll/paginate, so this catches the full history.
 *   4. Actively DRIVE loading: repeatedly scroll to the bottom and click any
 *      "Load more" / "Show more" / next-page control until nothing new appears.
 *   5. Also DOM-scrape visible cards as a fallback.
 *   6. Merge + dedupe (by stable content hash), then write CSV.
 *
 * Then import with: node scripts/import-fresha-reviews.mjs
 */

import fs from "fs";
import crypto from "crypto";
import { chromium } from "playwright";

const OUTPUT = "fresha_reviews_export.csv";
const SESSION_FILE = ".playwright-fresha-session.json";
const REVIEWS_URL = "https://partners.fresha.com/marketing/reviews";

function hashLegacyId({ client_name, created_at, review_text }) {
  return crypto
    .createHash("sha1")
    .update(`${client_name || ""}|${created_at || ""}|${(review_text || "").slice(0, 200)}`)
    .digest("hex");
}

const normRating = (v) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : 5;
};

/** Try to pull review-like objects out of an arbitrary JSON blob. */
function harvestReviews(node, out, depth = 0) {
  if (!node || depth > 8) return;
  if (Array.isArray(node)) {
    for (const item of node) harvestReviews(item, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;

  const keys = Object.keys(node);
  const lower = Object.fromEntries(keys.map((k) => [k.toLowerCase(), k]));
  const pick = (...names) => {
    for (const n of names) if (lower[n] != null && node[lower[n]] != null) return node[lower[n]];
    return null;
  };

  const text = pick("comment", "review", "reviewtext", "text", "body", "message", "content");
  const rating = pick("rating", "score", "stars", "ratingvalue", "rate");

  if (typeof text === "string" && text.trim().length > 0 && rating != null) {
    out.push({
      client_name:
        pick("clientname", "customername", "authorname", "name", "reviewer", "firstname") || null,
      rating: normRating(rating),
      review_text: text.trim(),
      service_name: pick("servicename", "service", "treatment", "appointmenttype") || null,
      created_at:
        pick("createdat", "created", "date", "reviewdate", "datetime", "submittedat") || null,
    });
  }

  // Recurse into nested objects (data, items, reviews, edges, node, results, etc.)
  for (const k of keys) {
    const val = node[k];
    if (val && typeof val === "object") harvestReviews(val, out, depth + 1);
  }
}

async function run() {
  console.log("\nExport ALL Fresha reviews (authenticated, one-time).\n");

  const browser = await chromium.launch({ headless: false });
  const context = fs.existsSync(SESSION_FILE)
    ? await browser.newContext({ storageState: SESSION_FILE })
    : await browser.newContext();
  const page = await context.newPage();

  // ---- 1. Capture every JSON response and harvest reviews ----------------
  const captured = [];
  let apiResponses = 0;
  page.on("response", async (resp) => {
    try {
      const ct = (resp.headers()["content-type"] || "").toLowerCase();
      if (!ct.includes("json")) return;
      const json = await resp.json().catch(() => null);
      if (!json) return;
      const before = captured.length;
      harvestReviews(json, captured);
      if (captured.length > before) {
        apiResponses++;
        process.stdout.write(`\r   API reviews captured: ${captured.length}   `);
      }
    } catch {
      /* ignore */
    }
  });

  // ---- Login (auto-detected — no keypress needed) ------------------------
  console.log("Opening Fresha Reviews page...");
  await page.goto(REVIEWS_URL, { waitUntil: "domcontentloaded" }).catch(() => {});

  // Poll until the reviews UI is visible. If Fresha bounced us to a login
  // screen, the human just logs in in the open window; we detect it and go.
  console.log(
    "\n>>> If a Fresha login appears, log in in the browser window. I'll continue automatically once your reviews load (waiting up to 8 minutes). <<<\n"
  );
  let loggedIn = false;
  for (let i = 0; i < 96; i++) {
    const ok = await page.$('p[data-qa="review-text"]').catch(() => null);
    if (ok) {
      loggedIn = true;
      break;
    }
    // If we look logged out / drifted, nudge back to the reviews page.
    const url = page.url();
    if (/login|sign|auth/i.test(url) === false && i % 6 === 5) {
      await page.goto(REVIEWS_URL, { waitUntil: "domcontentloaded" }).catch(() => {});
    }
    await page.waitForTimeout(5000);
    process.stdout.write(`\r   waiting for login / reviews to render... ${(i + 1) * 5}s   `);
  }
  console.log("");
  if (!loggedIn) {
    console.error("❌ Reviews never rendered (login not completed in time). Aborting.");
    await browser.close();
    process.exit(1);
  }
  // Persist session so reruns skip login.
  await context.storageState({ path: SESSION_FILE }).catch(() => {});
  await page.waitForTimeout(1500);

  // ---- 2. Drive loading: scroll + click "load more" until stable ---------
  console.log("\nLoading full review history (scroll + paginate)...");
  let stable = 0;
  let lastCount = -1;
  for (let i = 0; i < 400 && stable < 6; i++) {
    await page.mouse.wheel(0, 4000).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
    await page.waitForTimeout(700);

    // Click any "load more / show more / next" control if present.
    const clicked = await page
      .evaluate(() => {
        const rx = /load more|show more|view more|see more|next|more reviews/i;
        const els = Array.from(document.querySelectorAll('button,a,[role="button"]'));
        const btn = els.find((e) => rx.test((e.textContent || "").trim()) && !e.disabled);
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      })
      .catch(() => false);
    if (clicked) await page.waitForTimeout(900);

    const domCount = await page
      .$$eval('p[data-qa="review-text"]', (n) => n.length)
      .catch(() => 0);
    const total = Math.max(captured.length, domCount);
    if (total === lastCount) stable++;
    else {
      stable = 0;
      lastCount = total;
    }
    process.stdout.write(`\r   captured(api)=${captured.length} domCards=${domCount} pass=${i + 1}   `);
  }
  console.log("");

  // ---- 5. DOM fallback scrape -------------------------------------------
  const domReviews = await page
    .$$eval('p[data-qa="review-text"]', (nodes) =>
      nodes.map((node) => {
        const card = node.closest("div");
        const review_text = node.innerText.trim();
        let rating = 5;
        const ratingEl = card?.querySelector('div[data-qa="rating-stars-component"]');
        if (ratingEl) {
          const stars = ratingEl.querySelectorAll('[data-qa^="stars-rate-"]');
          if (stars.length) rating = stars.length;
        }
        const nameEl =
          card?.querySelector("strong") || card?.querySelector("h3") || card?.querySelector("h4");
        const timeEl = card?.querySelector("time");
        return {
          client_name: nameEl ? nameEl.innerText.trim() : null,
          rating,
          review_text,
          service_name: null,
          created_at: timeEl
            ? timeEl.getAttribute("datetime") || timeEl.innerText.trim()
            : null,
        };
      })
    )
    .catch(() => []);

  // ---- 6. Merge + dedupe -------------------------------------------------
  const all = [...captured, ...domReviews].filter(
    (r) => r && r.review_text && String(r.review_text).trim().length > 0
  );
  const seen = new Map();
  for (const r of all) {
    const id = hashLegacyId(r);
    if (!seen.has(id)) seen.set(id, { legacy_review_id: id, ...r });
  }
  const rows = [...seen.values()];

  console.log(
    `\nCaptured ${captured.length} via API + ${domReviews.length} via DOM → ${rows.length} unique reviews.`
  );

  if (!rows.length) {
    console.error("❌ No reviews extracted. Aborting (nothing written).");
    await browser.close();
    process.exit(1);
  }

  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  const header = "legacy_review_id,client_name,rating,review_text,service_name,created_at\n";
  const lines = rows.map((r) =>
    [r.legacy_review_id, r.client_name, r.rating, r.review_text, r.service_name, r.created_at]
      .map(esc)
      .join(",")
  );
  fs.writeFileSync(OUTPUT, header + lines.join("\n"), "utf8");
  console.log(`✅ Export complete: ${OUTPUT} (${rows.length} reviews)`);

  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
    console.log("Session file removed.");
  }

  await browser.close();
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
