/**
 * HG_DEV_011 — map legacy /services/* slugs to canonical Oswego SEO URLs.
 * Used by footer and internal links to avoid link → 301 chains.
 */
export const SERVICE_SLUG_TO_OSWEGO_PATH: Record<string, string> = {
  "botox-dysport-jeuveau": "/botox-oswego",
  "dermal-fillers": "/dermal-fillers-oswego",
  "lip-filler": "/lip-filler-oswego",
  "weight-loss-therapy": "/glp-1-weight-loss-oswego",
  "biote-hormone-therapy": "/biote-hormone-therapy-oswego",
  "trt-replacement-therapy": "/testosterone-replacement-oswego",
  "sermorelin-growth-peptide": "/peptide-therapy-oswego",
  "iv-therapy": "/iv-therapy-oswego",
  "vitamin-injections": "/vitamin-injections-oswego",
  "rf-microneedling": "/morpheus8-burst-oswego",
  "laser-hair-removal": "/laser-hair-removal-oswego",
  "chemical-peels": "/chemical-peel-oswego",
  "hydra-facial": "/facials-oswego",
  "geneo-facial": "/facials-oswego",
  // prp / prp-facial / prp-joint-injections / prf-prp intentionally NOT mapped —
  // they now have dedicated dark menu hubs at /services/* (see publicPath in lib/seo.ts).
};

/** Oswego city chips in LocationsServed — direct canonical paths (no GBP redirect slugs). */
export const OSWEGO_CHIP_CANONICAL_PATH: Record<string, string> = {
  "med-spa": "/med-spa-oswego-il",
  botox: "/botox-oswego",
  "lip-filler": "/lip-filler-oswego",
  "weight-loss": "/glp-1-weight-loss-oswego",
  "laser-hair-removal": "/laser-hair-removal-oswego",
  morpheus8: "/morpheus8-burst-oswego",
  "co2-laser": "/solaria-co2-oswego",
  "dermal-fillers": "/dermal-fillers-oswego",
};

export function oswegoPathForServiceSlug(slug: string): string | undefined {
  return SERVICE_SLUG_TO_OSWEGO_PATH[slug];
}
