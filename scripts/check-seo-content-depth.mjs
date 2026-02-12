#!/usr/bin/env node
/**
 * SEO content depth check - FAILS build if key location pages have < 850 words.
 * Run during build: node scripts/check-seo-content-depth.mjs
 * Uses lib/local-seo-content.ts - parses it to count words.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, "../lib/local-seo-content.ts");
const text = readFileSync(contentPath, "utf-8");

const REQUIRED_SLUGS = [
  "botox-oswego-il",
  "med-spa-oswego-il",
  "weight-loss-oswego-il",
  "prf-hair-restoration-oswego-il",
  "hormone-therapy-oswego-il",
];

const MIN_WORDS = 850;

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const SECTION_KEYS = [
  "intro",
  "aboutTreatment",
  "candidacy",
  "whatToExpect",
  "safetyAndTraining",
  "communityContext",
  "callToAction",
];

function extractSlugContent(slug, rawText) {
  const escapedSlug = slug.replace(/-/g, "\\-");
  const blockRegex = new RegExp(
    `"${escapedSlug}"\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\},?`,
    "m"
  );
  const block = rawText.match(blockRegex);
  if (!block) return null;
  const blockStr = block[1];
  let total = 0;
  for (const key of SECTION_KEYS) {
    const keyRegex = new RegExp(
      `${key}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`,
      "s"
    );
    const match = blockStr.match(keyRegex);
    if (match) {
      const unescaped = match[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .replace(/<[^>]*>/g, " ");
      total += wordCount(unescaped);
    }
  }
  return total;
}

let failed = 0;
const results = [];

for (const slug of REQUIRED_SLUGS) {
  const words = extractSlugContent(slug, text) ?? 0;
  const ok = words >= MIN_WORDS;
  results.push({ slug, words, ok });
  if (!ok) {
    console.error(
      `[SEO] FAIL: /${slug} has ~${words} words (minimum ${MIN_WORDS} required). Add content in lib/local-seo-content.ts`
    );
    failed++;
  }
}

if (failed > 0) {
  console.error(`[SEO] ${failed} page(s) below ${MIN_WORDS}-word minimum. Build FAILED.`);
  process.exit(1);
}

console.log(
  `[SEO] All ${REQUIRED_SLUGS.length} location pages meet ${MIN_WORDS}+ word requirement.`
);
