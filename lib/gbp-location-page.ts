import type { Metadata } from "next";

import { isDeindexedLocalSlug } from "@/lib/city-seo-tier";
import { GBP_SLUG_TO_SERVICE, type GbpServiceSlug } from "@/lib/gbp-urls";
import { pageMetadata, SERVICES, SITE } from "@/lib/seo";

export { gbpLocalFaqs } from "@/lib/gbp-aeo-faqs";

export const GBP_CONTEXTUAL_LINKS: Record<string, string> = {
  "Weight Loss in Oswego": "/weight-loss-oswego-il",
  "PRF Hair Restoration in Oswego": "/prf-hair-restoration-oswego-il",
  "Hormone Therapy in Oswego": "/hormone-therapy-oswego-il",
  "Botox in Oswego": "/botox-oswego",
};

export function geoContextCityForGbpSlug(slug: string): "naperville" | "plainfield" | "aurora" | "oswego" {
  if (slug.includes("naperville")) return "naperville";
  if (slug.includes("plainfield")) return "plainfield";
  if (slug.includes("aurora")) return "aurora";
  return "oswego";
}

export function isWeightLossGbpSlug(slug: string): boolean {
  return GBP_SLUG_TO_SERVICE[slug]?.serviceSlug === "weight-loss-therapy";
}

/** Metadata for indexed GBP location pages (850+ word content in LOCATION_PAGE_CONTENT). */
export function gbpLocationMetadata(slug: GbpServiceSlug): Metadata {
  const mapping = GBP_SLUG_TO_SERVICE[slug];
  if (!mapping) {
    return pageMetadata({ title: "Service", description: "Service.", path: `/${slug}` });
  }

  const { serviceSlug, cityLabel } = mapping;
  const s = SERVICES.find((x) => x.slug === serviceSlug);
  if (!s) {
    return pageMetadata({ title: "Service", description: "Service.", path: `/${slug}` });
  }

  const base = pageMetadata({
    title: `${s.name} in ${cityLabel} — ${SITE.name}`,
    description: `${s.name} in ${cityLabel} with licensed nurse practitioners at Hello Gorgeous Med Spa. ${s.short} Free consultations. Call ${SITE.phone}.`,
    path: `/${slug}`,
  });

  if (isDeindexedLocalSlug(slug)) {
    return { ...base, robots: { index: false, follow: true } };
  }

  return base;
}

/**
 * GBP slugs that keep bespoke flagship pages (reviews, ISR). All other GBP URLs
 * should be served only via app/[slug] + LOCATION_PAGE_CONTENT — no thin duplicates.
 */
export const GBP_FLAGSHIP_DEDICATED_SLUGS = new Set<GbpServiceSlug>([
  "botox-oswego-il",
  "hormone-therapy-oswego-il",
]);
