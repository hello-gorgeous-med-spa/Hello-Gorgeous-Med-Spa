/**
 * Phase 4 — city SEO tiers: primary Fox Valley hubs vs deindexed far-flung pages.
 * Keep redirect targets in sync with next.config.js `DEINDEXED_CITY_REDIRECT_TARGETS`.
 */

/** Core service area — index, sitemap, internal links, content depth required. */
export const PRIMARY_CITY_SLUGS = [
  "oswego",
  "naperville",
  "aurora",
  "plainfield",
  "yorkville",
  "montgomery",
] as const;

export type PrimaryCitySlug = (typeof PRIMARY_CITY_SLUGS)[number];

/** Secondary — indexed with custom pages; lower sitemap priority. */
export const SECONDARY_CITY_SLUGS = ["joliet"] as const;

/**
 * Far-flung / thin templated cities — 301 to nearest primary hub (next.config.js).
 * noindex on any catch-all that still renders before redirect in edge cases.
 */
export const DEINDEXED_CITY_REDIRECT_TARGETS: Record<string, PrimaryCitySlug> = {
  "sugar-grove": "aurora",
  ottawa: "yorkville",
  sandwich: "yorkville",
  bolingbrook: "naperville",
  geneva: "aurora",
  batavia: "aurora",
  "st-charles": "aurora",
  "north-aurora": "aurora",
};

export const DEINDEXED_CITY_SLUGS = Object.keys(
  DEINDEXED_CITY_REDIRECT_TARGETS,
) as (keyof typeof DEINDEXED_CITY_REDIRECT_TARGETS)[];

/** Full path suffixes, e.g. `sugar-grove-il` — used by sitemap + [slug] metadata. */
export const DEINDEXED_CITY_SUFFIXES = DEINDEXED_CITY_SLUGS.map((c) => `${c}-il`);

export const PRIMARY_CITY_HUB_PATHS = PRIMARY_CITY_SLUGS.map((c) => `/${c}-il`) as const;

const GBP_DEINDEXED_PREFIXES = ["botox", "lip-filler", "weight-loss", "med-spa"] as const;

/** Catch-all local slugs like `botox-sugar-grove-il`. */
export function isDeindexedLocalSlug(slug: string): boolean {
  if (DEINDEXED_CITY_SUFFIXES.some((suffix) => slug === suffix)) return true;
  return DEINDEXED_CITY_SLUGS.some(
    (city) =>
      slug.endsWith(`-${city}-il`) ||
      GBP_DEINDEXED_PREFIXES.some((prefix) => slug === `${prefix}-${city}-il`),
  );
}

/** Sitemap / path filter — `/botox-sugar-grove-il`, `/sugar-grove-il`, etc. */
export function isDeindexedSeoPath(path: string): boolean {
  const normalized = path.replace(/^\//, "").replace(/\/$/, "");
  if (DEINDEXED_CITY_SUFFIXES.includes(normalized)) return true;
  return isDeindexedLocalSlug(normalized);
}

export function primaryCityHubPath(slug: PrimaryCitySlug): string {
  return `/${slug}-il`;
}

/** Build Next.js redirect rules — mirrored in next.config.js. */
export function buildDeindexedCityRedirects(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  const rules: Array<{ source: string; destination: string; permanent: boolean }> = [];

  for (const [from, to] of Object.entries(DEINDEXED_CITY_REDIRECT_TARGETS)) {
    rules.push({
      source: `/${from}-il`,
      destination: primaryCityHubPath(to),
      permanent: true,
    });
    for (const prefix of GBP_DEINDEXED_PREFIXES) {
      rules.push({
        source: `/${prefix}-${from}-il`,
        destination: `/${prefix}-${to}-il`,
        permanent: true,
      });
    }
  }

  return rules;
}
