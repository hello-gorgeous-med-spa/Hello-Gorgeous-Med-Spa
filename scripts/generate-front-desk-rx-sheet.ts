#!/usr/bin/env npx tsx
/**
 * Generates docs/internal/front-desk-rx-pricing-sheet.html — staff-only, NOT deployed as a route.
 * Open locally or from repo → Print → Save as PDF.
 *
 *   npm run generate-front-desk-sheet
 */

import fs from "fs";
import path from "path";

import { PEPTIDE_CONSULT_FEE_USD } from "../lib/peptide-request-menu";
import {
  formatFromMonthly,
  GLP1_RETAIL_PROGRAM,
  PEPTIDE_PHARMACY_SHIPPING_USD,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
  peptideRetailMenuByCategory,
} from "../lib/peptide-retail-pricing";

const OUT_PATH = path.join(process.cwd(), "docs/internal/front-desk-rx-pricing-sheet.html");

const SITE = {
  phone: "630-636-6193",
  street: "74 W. Washington Street",
  city: "Oswego",
  region: "IL",
  zip: "60543",
  url: "https://www.hellogorgeousmedspa.com",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function main() {
  const updated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const groups = peptideRetailMenuByCategory();

  const tables = groups
    .map(
      (g) => `
    <section class="block">
      <h2 class="cat">${escapeHtml(g.category)}</h2>
      <table>
        <tbody>
          ${g.rows
            .map(
              (row, i) => `
          <tr class="${i % 2 ? "alt" : ""}">
            <td class="name">${escapeHtml(row.name)}</td>
            <td class="note">${escapeHtml(row.note ?? "—")}</td>
            <td class="price">${escapeHtml(formatFromMonthly(row.fromMonthlyUsd))}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </section>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Hello Gorgeous RX — Front Desk Pricing (Internal)</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; color: #111; background: #f3f4f6; }
    .toolbar { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 3px solid #000; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .toolbar p { margin: 0; font-size: 14px; font-weight: 600; }
    .toolbar button { background: #E6007E; color: #fff; border: 2px solid #000; border-radius: 999px; padding: 10px 20px; font-weight: 700; cursor: pointer; font-size: 14px; }
    .toolbar button:hover { background: #000; }
    .sheet { max-width: 8.5in; margin: 24px auto; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,.12); }
    .header { background: linear-gradient(125deg, #FF2D8E 0%, #E6007E 55%, #9b0a4d 100%); color: #fff; padding: 20px 24px; border: 4px solid #000; border-bottom: none; }
    .header .eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.85; margin: 0; }
    .header h1 { margin: 8px 0 0; font-size: 22px; font-weight: 900; line-height: 1.2; }
    .header .sub { margin: 8px 0 0; font-size: 13px; opacity: 0.92; }
    .header .date { margin: 4px 0 0; font-size: 11px; opacity: 0.75; }
    .quick { display: grid; grid-template-columns: repeat(4, 1fr); border: 4px solid #000; border-top: none; }
    .quick div { padding: 12px; text-align: center; background: #FFF0F7; border-right: 1px solid rgba(0,0,0,.12); }
    .quick div:last-child { border-right: none; }
    .quick .lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(0,0,0,.5); margin: 0; }
    .quick .val { font-size: 17px; font-weight: 900; color: #E6007E; margin: 4px 0 0; }
    .block { border-left: 4px solid #000; border-right: 4px solid #000; border-bottom: 4px solid #000; }
    .cat { margin: 0; padding: 8px 16px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; background: #E6007E; border-bottom: 2px solid #000; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    td { padding: 10px 16px; border-bottom: 1px solid rgba(0,0,0,.08); vertical-align: top; }
    tr.alt td { background: rgba(255,240,247,.45); }
    .name { font-weight: 700; width: 38%; }
    .note { color: rgba(0,0,0,.62); font-size: 12px; width: 37%; }
    .price { font-weight: 900; color: #E6007E; text-align: right; white-space: nowrap; width: 25%; }
    .glp1, .talk, .links, .footer { border-left: 4px solid #000; border-right: 4px solid #000; border-bottom: 4px solid #000; padding: 16px 20px; }
    .glp1 { background: #FFF0F7; }
    .glp1 h2, .talk h2, .links h2 { margin: 0 0 10px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
    .talk ul { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.55; color: rgba(0,0,0,.82); }
    .links { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px; }
    .links p { margin: 4px 0; }
    .footer { text-align: center; font-size: 10px; color: rgba(0,0,0,.45); border-bottom: 4px solid #000; }
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { margin: 0; box-shadow: none; max-width: 100%; }
      @page { size: letter; margin: 0.35in; }
      .header, .cat { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <p>Internal only — open this file locally · not on the public website</p>
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <article class="sheet">
    <header class="header">
      <p class="eyebrow">Confidential · Front desk reference</p>
      <h1>Hello Gorgeous RX™ — Peptide &amp; GLP-1 Pricing</h1>
      <p class="sub">${escapeHtml(SITE.street)}, ${escapeHtml(SITE.city)}, ${escapeHtml(SITE.region)} ${escapeHtml(SITE.zip)} · ${escapeHtml(SITE.phone)}</p>
      <p class="date">Updated ${escapeHtml(updated)}</p>
    </header>
    <div class="quick">
      <div><p class="lbl">NP consult (new)</p><p class="val">$${PEPTIDE_CONSULT_FEE_USD}</p></div>
      <div><p class="lbl">Protocols from</p><p class="val">$${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo</p></div>
      <div><p class="lbl">${PEPTIDE_PREPAY_MONTHS}-mo prepay</p><p class="val">${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off meds</p></div>
      <div><p class="lbl">Shipping (typical)</p><p class="val">$${PEPTIDE_PHARMACY_SHIPPING_USD}</p></div>
    </div>
    ${tables}
    <section class="glp1">
      <h2>Medical weight loss (program pricing)</h2>
      <p><strong>Semaglutide:</strong> <span style="color:#E6007E;font-weight:900">From $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo</span></p>
      <p><strong>Tirzepatide:</strong> <span style="color:#E6007E;font-weight:900">From $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo</span></p>
    </section>
    <section class="talk">
      <h2>Front desk talking points</h2>
      <ul>
        <li><strong>New protocols:</strong> $${PEPTIDE_CONSULT_FEE_USD} NP consult → RX request / Start Here → pay invoice → telehealth with Ryan Kent, FNP-BC (Fresha) → pharmacy ships.</li>
        <li><strong>Refills:</strong> existing RX patients skip $${PEPTIDE_CONSULT_FEE_USD} new-patient gate (check-in every 90 days / dose changes).</li>
        <li>Say <strong>&ldquo;from $X per month&rdquo;</strong> — final price after NP evaluation.</li>
        <li><strong>Never quote</strong> pharmacy wholesale or supplier names.</li>
        <li><strong>Order Q&amp;A sheet:</strong> run <code>npm run generate-front-desk-order-qa</code> for full desk scripts.</li>
      </ul>
    </section>
    <section class="links">
      <div>
        <h2>Client links (public site)</h2>
        <p><strong>Peptides:</strong> ${escapeHtml(SITE.url)}/peptides</p>
        <p><strong>Start Here:</strong> ${escapeHtml(SITE.url)}/hello-gorgeous-rx/start-here</p>
        <p><strong>Request / refill:</strong> ${escapeHtml(SITE.url)}/peptide-request</p>
      </div>
      <div>
        <h2>Compliance</h2>
        <p style="color:rgba(0,0,0,.65);line-height:1.5;margin:0">${escapeHtml(PEPTIDE_PRICING_DISCLAIMER)}</p>
      </div>
    </section>
    <footer class="footer">
      Hello Gorgeous Med Spa · Hello Gorgeous RX™ · Staff use only · © ${new Date().getFullYear()}
    </footer>
  </article>
</body>
</html>`;

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, html, "utf8");
  console.log(`✅ Front desk sheet: ${OUT_PATH}`);
  console.log("   Open in Chrome/Safari → Print → Save as PDF (not on public website)\n");
}

main();
