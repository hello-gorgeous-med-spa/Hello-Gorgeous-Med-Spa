#!/usr/bin/env node
/**
 * One-off generator: clone full-depth Oswego LOCATION_PAGE_CONTENT blocks for suburb GBP keys.
 * Run: node scripts/generate-suburb-local-seo.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function extractObjectLiteral(text, slug) {
  const needle = `"${slug}":`;
  const start = text.indexOf(needle);
  if (start < 0) return null;
  const braceStart = text.indexOf("{", start);
  let depth = 0;
  let i = braceStart;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return text.slice(braceStart, i);
}

function adaptClone(body, { label, lead }) {
  let s = body.replace(/(intro:\s*\n\s*")/m, `$1${lead} `);
  s = s.replace(/Kendall County residents/g, `${label} and Kendall County residents`);
  s = s.replace(/the Oswego community/g, `the ${label} and Oswego communities`);
  return s;
}

const main = readFileSync(join(root, "lib/local-seo-content.ts"), "utf-8");
const add1 = readFileSync(join(root, "lib/local-seo-content-additions-1.ts"), "utf-8");

const botox = extractObjectLiteral(main, "botox-oswego-il");
const weight = extractObjectLiteral(main, "weight-loss-oswego-il");
const medspa = extractObjectLiteral(main, "med-spa-oswego-il");
const lipOswego = extractObjectLiteral(add1, "lip-filler-oswego-il");

if (!botox || !weight || !medspa || !lipOswego) {
  console.error("Failed to extract source blocks");
  process.exit(1);
}

const dermalAurora = lipOswego
  .replace(/lip filler/gi, "dermal fillers")
  .replace(/Lip filler/g, "Dermal fillers")
  .replace(/Lips/g, "Face")
  .replace(/lips/g, "treatment areas");

const pairs = [
  ["botox-naperville-il", adaptClone(botox, { label: "Naperville, IL", lead: "For Naperville, IL and nearby DuPage and Will county clients," })],
  ["weight-loss-naperville-il", adaptClone(weight, { label: "Naperville, IL", lead: "For Naperville, IL residents," })],
  ["lip-filler-naperville-il", adaptClone(lipOswego, { label: "Naperville, IL", lead: "For Naperville, IL clients," })],
  ["botox-aurora-il", adaptClone(botox, { label: "Aurora, IL", lead: "For Aurora, IL clients across Kane, DuPage, Kendall, and Will counties," })],
  ["weight-loss-aurora-il", adaptClone(weight, { label: "Aurora, IL", lead: "For Aurora, IL residents," })],
  ["dermal-fillers-aurora-il", adaptClone(dermalAurora, { label: "Aurora, IL", lead: "For Aurora, IL clients," })],
  ["lip-filler-aurora-il", adaptClone(lipOswego, { label: "Aurora, IL", lead: "For Aurora, IL clients," })],
  ["botox-plainfield-il", adaptClone(botox, { label: "Plainfield, IL", lead: "For Plainfield, IL and Will county clients," })],
  ["weight-loss-plainfield-il", adaptClone(weight, { label: "Plainfield, IL", lead: "For Plainfield, IL residents," })],
  ["med-spa-naperville-il", adaptClone(medspa, { label: "Naperville, IL", lead: "For Naperville, IL and western suburb clients," })],
  ["med-spa-aurora-il", adaptClone(medspa, { label: "Aurora, IL", lead: "For Aurora, IL clients," })],
  ["med-spa-plainfield-il", adaptClone(medspa, { label: "Plainfield, IL", lead: "For Plainfield, IL and Will county clients," })],
  ["med-spa-yorkville-il", adaptClone(medspa, { label: "Yorkville, IL", lead: "For Yorkville, IL and Kendall county neighbors," })],
  // Additional service areas (GBP + med-spa expansion)
  ["botox-montgomery-il", adaptClone(botox, { label: "Montgomery, IL", lead: "For Montgomery, IL neighbors just minutes from downtown Oswego," })],
  ["weight-loss-montgomery-il", adaptClone(weight, { label: "Montgomery, IL", lead: "For Montgomery, IL residents," })],
  ["lip-filler-montgomery-il", adaptClone(lipOswego, { label: "Montgomery, IL", lead: "For Montgomery, IL clients," })],
  ["med-spa-montgomery-il", adaptClone(medspa, { label: "Montgomery, IL", lead: "For Montgomery, IL and Fox Valley neighbors," })],
  ["botox-yorkville-il", adaptClone(botox, { label: "Yorkville, IL", lead: "For Yorkville, IL and Kendall County clients," })],
  ["weight-loss-yorkville-il", adaptClone(weight, { label: "Yorkville, IL", lead: "For Yorkville, IL residents," })],
  ["lip-filler-yorkville-il", adaptClone(lipOswego, { label: "Yorkville, IL", lead: "For Yorkville, IL clients," })],
  ["botox-sugar-grove-il", adaptClone(botox, { label: "Sugar Grove, IL", lead: "For Sugar Grove, IL and western Kane County clients," })],
  ["weight-loss-sugar-grove-il", adaptClone(weight, { label: "Sugar Grove, IL", lead: "For Sugar Grove, IL residents," })],
  ["lip-filler-sugar-grove-il", adaptClone(lipOswego, { label: "Sugar Grove, IL", lead: "For Sugar Grove, IL clients," })],
  ["med-spa-sugar-grove-il", adaptClone(medspa, { label: "Sugar Grove, IL", lead: "For Sugar Grove, IL and Fox Valley travelers," })],
  ["botox-ottawa-il", adaptClone(botox, { label: "Ottawa, IL", lead: "For Ottawa, IL and LaSalle County clients visiting our Oswego flagship," })],
  ["weight-loss-ottawa-il", adaptClone(weight, { label: "Ottawa, IL", lead: "For Ottawa, IL residents," })],
  ["lip-filler-ottawa-il", adaptClone(lipOswego, { label: "Ottawa, IL", lead: "For Ottawa, IL clients," })],
  ["med-spa-ottawa-il", adaptClone(medspa, { label: "Ottawa, IL", lead: "For Ottawa, IL and Starved Rock area clients who book care in Oswego," })],
  ["botox-sandwich-il", adaptClone(botox, { label: "Sandwich, IL", lead: "For Sandwich, IL and DeKalb County clients heading to Oswego," })],
  ["weight-loss-sandwich-il", adaptClone(weight, { label: "Sandwich, IL", lead: "For Sandwich, IL residents," })],
  ["lip-filler-sandwich-il", adaptClone(lipOswego, { label: "Sandwich, IL", lead: "For Sandwich, IL clients," })],
  ["med-spa-sandwich-il", adaptClone(medspa, { label: "Sandwich, IL", lead: "For Sandwich, IL and Plano-area clients scheduling at Hello Gorgeous Oswego," })],
  ["botox-bolingbrook-il", adaptClone(botox, { label: "Bolingbrook, IL", lead: "For Bolingbrook, IL and southwest Will County clients," })],
  ["weight-loss-bolingbrook-il", adaptClone(weight, { label: "Bolingbrook, IL", lead: "For Bolingbrook, IL residents," })],
  ["lip-filler-bolingbrook-il", adaptClone(lipOswego, { label: "Bolingbrook, IL", lead: "For Bolingbrook, IL clients," })],
  ["med-spa-bolingbrook-il", adaptClone(medspa, { label: "Bolingbrook, IL", lead: "For Bolingbrook, IL clients who prefer our Oswego med spa location," })],
];

const out = `import type { LocationContentSection } from "./local-seo-content-types.ts";

/** Auto-generated from Oswego master blocks — full depth for suburb GBP + med-spa slugs. */
export const LOCATION_PAGE_CONTENT_SUBURBS: Record<string, LocationContentSection> = {
${pairs.map(([k, v]) => `  "${k}": ${v},`).join("\n")}
};
`;

writeFileSync(join(root, "lib/local-seo-content-suburbs-generated.ts"), out);
console.log("Wrote lib/local-seo-content-suburbs-generated.ts");
