import Link from "next/link";

import { GBP_POST_PRESETS, type GbpPostPreset } from "@/lib/google-business-post-presets";
import { SITE } from "@/lib/seo";

/** Public-facing GBP highlights — synced with admin post presets. */
export const GBP_PUBLIC_SPOTLIGHT_IDS = [
  "blast-glp1",
  "botox-10-unit",
  "blast-memberships",
] as const;

export function getGbpPublicSpotlights(): GbpPostPreset[] {
  return GBP_PUBLIC_SPOTLIGHT_IDS.map(
    (id) => GBP_POST_PRESETS.find((p) => p.id === id)!,
  ).filter(Boolean);
}

export function gbpSpotlightHref(linkPath: `/${string}`): string {
  return `${SITE.url}${linkPath}`;
}
