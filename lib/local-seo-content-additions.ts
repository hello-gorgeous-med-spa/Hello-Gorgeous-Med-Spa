import type { LocationContentSection } from "./local-seo-content-types.ts";
import { LOCATION_PAGE_CONTENT_ADDITIONS_1 } from "./local-seo-content-additions-1.ts";
import { LOCATION_PAGE_CONTENT_SUBURBS } from "./local-seo-content-suburbs-generated.ts";

/** Merged long-form blocks for GBP + regional med-spa slugs (see REQUIRED_SLUGS). */
export const ADDITIONAL_LOCATION_PAGE_CONTENT: Record<string, LocationContentSection> = {
  ...LOCATION_PAGE_CONTENT_ADDITIONS_1,
  ...LOCATION_PAGE_CONTENT_SUBURBS,
};
