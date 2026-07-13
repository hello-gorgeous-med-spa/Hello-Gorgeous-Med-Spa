#!/usr/bin/env npx tsx
/**
 * Generates docs/internal/front-desk-order-qa.html — staff-only, NOT a public route.
 * Open locally → Print → Save as PDF.
 *
 *   npm run generate-front-desk-order-qa
 */

import fs from "fs";
import path from "path";

import {
  FRONT_DESK_ORDER_QA_ESCALATE,
  FRONT_DESK_ORDER_QA_LINKS,
  FRONT_DESK_ORDER_QA_QUICK_FACTS,
  FRONT_DESK_ORDER_QA_SECTIONS,
} from "../lib/front-desk-order-qa";
import { SITE } from "../lib/seo";

const OUT_PATH = path.join(process.cwd(), "docs/internal/front-desk-order-qa.html");

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

  const quick = FRONT_DESK_ORDER_QA_QUICK_FACTS.map(
    (f) => `
      <div><p class="lbl">${escapeHtml(f.label)}</p><p class="val">${escapeHtml(f.value)}</p></div>`,
  ).join("");

  const sections = FRONT_DESK_ORDER_QA_SECTIONS.map((sec) => {
    const rows = sec.items
      .map(
        (item, i) => `
      <div class="qa ${i % 2 ? "alt" : ""}">
        <p class="q"><span class="qmark">Q.</span> ${escapeHtml(item.q)}</p>
        <p class="a"><span class="amark">A.</span> ${escapeHtml(item.a)}</p>
        ${
          item.say
            ? `<p class="say"><strong>Say:</strong> ${escapeHtml(item.say)}</p>`
            : ""
        }
      </div>`,
      )
      .join("");
    return `
    <section class="block">
      <h2 class="cat">${escapeHtml(sec.title)}</h2>
      ${rows}
    </section>`;
  }).join("");

  const links = FRONT_DESK_ORDER_QA_LINKS.map(
    (l) => `<p><strong>${escapeHtml(l.label)}:</strong> ${escapeHtml(l.href)}</p>`,
  ).join("\n        ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Hello Gorgeous RX — Front Desk Order Q&amp;A (Internal)</title>
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
    .quick { display: grid; grid-template-columns: repeat(3, 1fr); border: 4px solid #000; border-top: none; }
    .quick div { padding: 10px 8px; text-align: center; background: #FFF0F7; border-right: 1px solid rgba(0,0,0,.12); border-bottom: 1px solid rgba(0,0,0,.08); }
    .quick div:nth-child(3n) { border-right: none; }
    .quick .lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(0,0,0,.5); margin: 0; }
    .quick .val { font-size: 15px; font-weight: 900; color: #E6007E; margin: 4px 0 0; }
    .block { border-left: 4px solid #000; border-right: 4px solid #000; border-bottom: 4px solid #000; }
    .cat { margin: 0; padding: 8px 16px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; background: #E6007E; border-bottom: 2px solid #000; }
    .qa { padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,.08); }
    .qa.alt { background: rgba(255,240,247,.4); }
    .qa:last-child { border-bottom: none; }
    .q { margin: 0 0 6px; font-size: 13px; font-weight: 800; color: #E6007E; line-height: 1.35; }
    .a { margin: 0; font-size: 12.5px; line-height: 1.5; color: rgba(0,0,0,.88); }
    .say { margin: 8px 0 0; padding: 8px 10px; background: #fff; border: 2px solid #000; border-radius: 8px; font-size: 12px; line-height: 1.4; color: #111; }
    .qmark, .amark { font-weight: 900; margin-right: 4px; }
    .escalate, .links, .footer { border-left: 4px solid #000; border-right: 4px solid #000; border-bottom: 4px solid #000; padding: 14px 18px; }
    .escalate { background: #FFF0F7; font-size: 12.5px; line-height: 1.5; font-weight: 600; }
    .escalate h2, .links h2 { margin: 0 0 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
    .links { border-left: 4px solid #000; border-right: 4px solid #000; border-bottom: 4px solid #000; padding: 14px 18px; }
    .links h2 { margin: 0 0 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
    .link-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; font-size: 11.5px; }
    .link-grid p { margin: 2px 0; word-break: break-all; }
    .footer { text-align: center; font-size: 10px; color: rgba(0,0,0,.45); border-bottom: 4px solid #000; }
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { margin: 0; box-shadow: none; max-width: 100%; }
      @page { size: letter; margin: 0.3in; }
      .header, .cat { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .qa { break-inside: avoid; }
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
      <p class="eyebrow">Confidential · Front desk · Most popular order Q&amp;A</p>
      <h1>Hello Gorgeous RX™ — Order Desk Q&amp;A</h1>
      <p class="sub">${escapeHtml(SITE.address.streetAddress)}, ${escapeHtml(SITE.address.addressLocality)}, ${escapeHtml(SITE.address.addressRegion)} ${escapeHtml(SITE.address.postalCode)} · ${escapeHtml(SITE.phone)}</p>
      <p class="date">Updated ${escapeHtml(updated)} · Numbers pull from live admin pricing libs</p>
    </header>
    <div class="quick">${quick}
    </div>
    ${sections}
    <section class="escalate">
      <h2>When to escalate</h2>
      <p style="margin:0">${escapeHtml(FRONT_DESK_ORDER_QA_ESCALATE)}</p>
    </section>
    <section class="links">
      <h2>Send these links</h2>
      <div class="link-grid">
        ${links}
      </div>
    </section>
    <footer class="footer">
      Hello Gorgeous Med Spa · Hello Gorgeous RX™ · Staff use only · Pair with front-desk-rx-pricing-sheet.html · © ${new Date().getFullYear()}
    </footer>
  </article>
</body>
</html>`;

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, html, "utf8");
  console.log(`✅ Front desk Order Q&A: ${OUT_PATH}`);
  console.log("   Open in Chrome/Safari → Print → Save as PDF (not on public website)\n");
}

main();
