#!/usr/bin/env node
/**
 * SEO content depth check — uses merged LOCATION_PAGE_CONTENT (same as runtime).
 * Run: node --experimental-strip-types scripts/check-seo-content-depth.ts
 */
import {
  getLocationPageWordCount,
  getMinWords,
  REQUIRED_SLUGS,
} from "../lib/local-seo-content.ts";

const MIN_WORDS = getMinWords();
let failed = 0;

for (const slug of REQUIRED_SLUGS) {
  const words = getLocationPageWordCount(slug);
  const ok = words >= MIN_WORDS;
  if (!ok) {
    console.error(
      `[SEO] FAIL: /${slug} has ~${words} words (minimum ${MIN_WORDS} required). Expand sections in lib/local-seo-content*.ts`
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
