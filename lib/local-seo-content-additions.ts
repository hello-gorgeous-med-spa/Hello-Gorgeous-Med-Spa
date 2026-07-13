import { CITY_FIVE_PAGE_COPY } from "./city-five-page-copy.ts";
import type { LocationContentSection } from "./local-seo-content-types.ts";
import { LOCATION_PAGE_CONTENT_ADDITIONS_1 } from "./local-seo-content-additions-1.ts";
import { LOCATION_PAGE_CONTENT_DEVICES_GAP } from "./local-seo-content-devices-gap.ts";
import { LOCATION_PAGE_CONTENT_SEO001_GAP } from "./local-seo-content-seo001-gap.ts";
import { LOCATION_PAGE_CONTENT_SUBURBS } from "./local-seo-content-suburbs-generated.ts";

const MERGED_BASE: Record<string, LocationContentSection> = {
  ...LOCATION_PAGE_CONTENT_ADDITIONS_1,
  ...LOCATION_PAGE_CONTENT_SUBURBS,
  ...LOCATION_PAGE_CONTENT_SEO001_GAP,
  ...LOCATION_PAGE_CONTENT_DEVICES_GAP,
};

/** Apply owner-approved 5-city PDF intros on GBP botox / weight-loss suburb landers. */
function withCityFiveIntros(
  base: Record<string, LocationContentSection>,
): Record<string, LocationContentSection> {
  const out: Record<string, LocationContentSection> = { ...base };
  for (const [slug, copy] of Object.entries(CITY_FIVE_PAGE_COPY)) {
    if (slug.startsWith("morpheus8-")) continue;
    const existing = out[slug];
    if (!existing) continue;
    out[slug] = { ...existing, intro: copy.intro };
  }
  return out;
}

/** Merged long-form blocks for GBP + regional med-spa slugs (see REQUIRED_SLUGS). */
export const ADDITIONAL_LOCATION_PAGE_CONTENT: Record<string, LocationContentSection> =
  withCityFiveIntros(MERGED_BASE);
