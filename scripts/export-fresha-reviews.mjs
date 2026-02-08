#!/usr/bin/env node
/**
 * Export Fresha reviews (authenticated automation)
 *
 * Output: fresha_reviews_export.csv
 * Columns:
 * legacy_review_id,client_name,rating,review_text,service_name,created_at
 */

import fs from "fs";
import crypto from "crypto";
import readline from "readline";
import { chromium } from "playwright";

const OUTPUT = "fresha_reviews_export.csv";
const SESSION_FILE = ".playwright-fresha-session.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function waitForEnter(msg) {
  return new Promise((resolve) => {
    rl.question(msg, () => resolve());
  });
}

function hashLegacyId({ client_name, created_at, review_text }) {
  return crypto
    .createHash("sha1")
    .update(`${client_name || ""}|${created_at || ""}|${review_text || ""}`)
    .digest("hex");
}

async function run() {
  console.log("\nExport Fresha reviews (authenticated, one-time).\n");

  const browser = await chromium.launch({ headless: false });
  const context = fs.existsSync(SESSION_FILE)
    ? await browser.newContext({ storageState: SESSION_FILE })
    : await browser.newContext();

  const page = await context.newPage();

  if (!fs.existsSync(SESSION_FILE)) {
    console.log("No saved session. Opening Fresha Partner login...\n");
    await page.goto("https://partners.fresha.com", { waitUntil: "networkidle" });

    await waitForEnter(
      ">>> Log in in the browser. When you see the dashboard, come back here and press Enter. <<<\n"
    );

    await context.storageState({ path: SESSION_FILE });
    console.log("Session saved (will be deleted after export).");
  }

  console.log("Navigating to Marketing → Reviews...");
  await page.goto("https://partners.fresha.com/marketing/reviews", {
    waitUntil: "networkidle",
  });

  console.log("Waiting for reviews to render...");
  await page.waitForSelector('p[data-qa="review-text"]', { timeout: 30000 });

  // Simple scroll (Fresha shows ~36 on this page; no Load more)
  console.log("Scrolling page...");
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
  }

  console.log("Extracting reviews...");
  const reviews = await page.$$eval(
    'p[data-qa="review-text"]',
    nodes => {
      return nodes.map(node => {
        const card = node.closest("div");

        const review_text = node.innerText.trim();

        // Rating — Fresha uses div[data-qa^="stars-rate-"] (0–4)
        let rating = 5;
        const ratingEl = card?.querySelector('div[data-qa="rating-stars-component"]');
        if (ratingEl) {
          const stars = ratingEl.querySelectorAll('[data-qa^="stars-rate-"]');
          if (stars.length) rating = stars.length;
        }

        // Client name (best-effort)
        let client_name = null;
        const nameEl =
          card?.querySelector("strong") ||
          card?.querySelector("h3") ||
          card?.querySelector("h4");
        if (nameEl) client_name = nameEl.innerText.trim();

        // Date
        let created_at = null;
        const timeEl = card?.querySelector("time");
        if (timeEl) {
          created_at = timeEl.getAttribute("datetime") || timeEl.innerText.trim();
        }

        return {
          client_name,
          rating,
          review_text,
          service_name: null,
          created_at,
        };
      });
    }
  );

  console.log(`Extracted ${reviews.length} reviews.`);

  if (!reviews.length) {
    console.error("❌ No reviews extracted. Aborting.");
    await browser.close();
    process.exit(1);
  }

  const withIds = reviews.map(r => ({
    legacy_review_id: hashLegacyId(r),
    ...r,
  }));

  console.log("Writing CSV...");
  const header =
    "legacy_review_id,client_name,rating,review_text,service_name,created_at\n";

  const csvLines = withIds.map(r => {
    const esc = v =>
      `"${String(v ?? "")
        .replace(/"/g, '""')
        .replace(/\n/g, " ")}"`;

    return [
      esc(r.legacy_review_id),
      esc(r.client_name),
      esc(r.rating),
      esc(r.review_text),
      esc(r.service_name),
      esc(r.created_at),
    ].join(",");
  });

  fs.writeFileSync(OUTPUT, header + csvLines.join("\n"), "utf8");

  console.log(`✅ Export complete: ${OUTPUT}`);

  // Cleanup
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
    console.log("Session file removed.");
  }

  await browser.close();
  rl.close();
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
