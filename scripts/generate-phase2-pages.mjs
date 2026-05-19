/**
 * Parse HG_DEV_011_Phase2_Content.md JSON blocks → phase2-pages.ts
 * Usage: node scripts/generate-phase2-pages.mjs /path/to/HG_DEV_011_Phase2_Content.md
 */
import fs from "fs";

const mdPath = process.argv[2];
if (!mdPath) {
  console.error("Usage: node scripts/generate-phase2-pages.mjs <Phase2_Content.md>");
  process.exit(1);
}

const md = fs.readFileSync(mdPath, "utf8");
const blocks = [...md.matchAll(/```json\n([\s\S]*?)```/g)].map((m) => m[1].trim());

const CONTESTED = new Set([
  "botox-oswego",
  "dysport-oswego",
  "jeuveau-oswego",
  "dermal-fillers-oswego",
  "lip-filler-oswego",
  "morpheus8-burst-oswego",
  "glp-1-weight-loss-oswego",
  "semaglutide-oswego",
  "tirzepatide-oswego",
  "biote-hormone-therapy-oswego",
  "testosterone-replacement-oswego",
]);

const PROCEDURE_MAP = {
  Injection: "Injection",
  Laser: "Laser",
  "Radiofrequency Microneedling": "RF",
  "Hormone Pellet Implant": "Wellness",
  "Hormone Therapy": "Wellness",
  Microneedling: "RF",
  "Topical Skin Treatment": "Topical",
  "Mechanical Exfoliation": "Topical",
  "Chemical Exfoliation": "Topical",
  "Injection / Topical": "Injection",
  "Intravenous Therapy": "IV",
};

function splitParagraphs(text) {
  const t = text.trim();
  if (!t) return [];
  const byBreak = t.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (byBreak.length > 1) return byBreak;
  return [t];
}

function stripBrandTitle(title) {
  return title
    .replace(/\s*\|\s*Hello Gorgeous Med Spa\s*$/i, "")
    .replace(/\s*\|\s*Hello Gorgeous\s*$/i, "")
    .trim();
}

function normalize(raw) {
  const procedureType = PROCEDURE_MAP[raw.procedureType] ?? "Wellness";
  const tier = CONTESTED.has(raw.slug) ? "contested" : "uncontested";
  const page = {
    slug: raw.slug,
    serviceName: raw.serviceName,
    fullServiceName: raw.fullServiceName,
    targetKeyword: raw.targetKeyword,
    metaTitle: stripBrandTitle(raw.metaTitle),
    metaDescription: raw.metaDescription,
    h1: raw.h1,
    valueProp: raw.valueProp,
    bookingUrl: "bookingUrlFor()",
    procedureType,
    tier,
    whyBullets: raw.whyBullets,
    howItWorksParagraphs: splitParagraphs(raw.howItWorksContent ?? ""),
    whatToExpectSteps: raw.whatToExpectSteps,
    faqs: raw.faqs,
    relatedServices: raw.relatedServices,
  };
  if (raw.bodyLocation) page.bodyLocation = raw.bodyLocation;
  if (raw.heroContent) page.heroContent = raw.heroContent;
  if (raw.pricing) page.pricing = raw.pricing;
  if (raw.closingCta) page.closingCta = raw.closingCta;
  if (raw.inModeBadge) page.inModeBadge = raw.inModeBadge;
  return page;
}

const pages = blocks.map((b) => normalize(JSON.parse(b)));
if (pages.length !== 19) {
  console.warn(`Expected 19 pages, got ${pages.length}`);
}

function tsString(s) {
  return JSON.stringify(s);
}

function emitPage(p) {
  const lines = [
    "  {",
    `    slug: ${tsString(p.slug)},`,
    `    serviceName: ${tsString(p.serviceName)},`,
    `    fullServiceName: ${tsString(p.fullServiceName)},`,
    `    targetKeyword: ${tsString(p.targetKeyword)},`,
    `    metaTitle: ${tsString(p.metaTitle)},`,
    `    metaDescription: ${tsString(p.metaDescription)},`,
    `    h1: ${tsString(p.h1)},`,
    `    valueProp: ${tsString(p.valueProp)},`,
    `    bookingUrl: bookingUrlFor(),`,
    `    procedureType: ${tsString(p.procedureType)},`,
  ];
  if (p.bodyLocation) lines.push(`    bodyLocation: ${tsString(p.bodyLocation)},`);
  if (p.inModeBadge) lines.push(`    inModeBadge: ${tsString(p.inModeBadge)},`);
  lines.push(`    tier: ${tsString(p.tier)},`);
  if (p.heroContent) lines.push(`    heroContent: ${tsString(p.heroContent)},`);
  lines.push(`    whyBullets: ${JSON.stringify(p.whyBullets, null, 2).replace(/^/gm, "    ").trim()},`);
  lines.push(
    `    howItWorksParagraphs: ${JSON.stringify(p.howItWorksParagraphs, null, 2).replace(/^/gm, "    ").trim()},`
  );
  lines.push(
    `    whatToExpectSteps: ${JSON.stringify(p.whatToExpectSteps, null, 2).replace(/^/gm, "    ").trim()},`
  );
  if (p.pricing) lines.push(`    pricing: ${tsString(p.pricing)},`);
  lines.push(`    faqs: ${JSON.stringify(p.faqs, null, 2).replace(/^/gm, "    ").trim()},`);
  lines.push(
    `    relatedServices: ${JSON.stringify(p.relatedServices, null, 2).replace(/^/gm, "    ").trim()},`
  );
  if (p.closingCta) lines.push(`    closingCta: ${tsString(p.closingCta)},`);
  lines.push("  },");
  return lines.join("\n");
}

const out = `import { bookingUrlFor } from "./build";
import type { ServicePageData } from "./types";

/** HG_DEV_011 Phase 2 — Dani-reviewed copy (19 remaining service pages). Generated from Phase2_Content.md */
export const PHASE2_PAGES: ServicePageData[] = [
${pages.map(emitPage).join("\n")}
];

export const PHASE2_SLUGS = new Set(PHASE2_PAGES.map((p) => p.slug));
`;

const outPath = new URL("../lib/service-pages-oswego/phase2-pages.ts", import.meta.url);
fs.writeFileSync(outPath, out, "utf8");
console.log(`Wrote ${pages.length} pages → ${outPath.pathname}`);
