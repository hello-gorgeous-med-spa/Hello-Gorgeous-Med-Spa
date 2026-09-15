#!/usr/bin/env node
/**
 * Print tirzepatide client laminate + staff protocol PDFs to Desktop.
 *
 *   node scripts/export-tirzepatide-pricing-print.mjs
 */

import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESKTOP = path.join(os.homedir(), "Desktop");
const SRC = path.join(ROOT, "docs/print/tirzepatide-monthly-2026");
const OUT_DIR = path.join(DESKTOP, "Hello Gorgeous — Tirzepatide monthly pricing");

const JOBS = [
  {
    html: path.join(SRC, "client-laminate.html"),
    pdf: path.join(OUT_DIR, "CLIENT laminate — Tirzepatide monthly pricing.pdf"),
    landscape: true,
  },
  {
    html: path.join(SRC, "staff-protocol.html"),
    pdf: path.join(OUT_DIR, "STAFF protocol — Tirzepatide monthly pricing.pdf"),
    landscape: false,
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
for (const job of JOBS) {
  const page = await browser.newPage();
  await page.goto(`file://${job.html}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: job.pdf,
    printBackground: true,
    landscape: job.landscape,
    format: "Letter",
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await page.close();
  console.log("PDF", job.pdf);
}

for (const name of ["client-laminate.html", "staff-protocol.html"]) {
  const dest = path.join(OUT_DIR, name);
  fs.copyFileSync(path.join(SRC, name), dest);
  console.log("HTML", dest);
}

await browser.close();
console.log("\nSaved to", OUT_DIR);
