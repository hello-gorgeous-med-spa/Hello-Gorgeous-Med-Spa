import { PHASE1_UNCONTESTED_PAGES } from "./phase1-uncontested";
import { PHASE2_PAGES } from "./phase2-pages";
import type { ServicePageData } from "./types";

export type { ServicePageData, ServicePageFaq } from "./types";

/** Full 23-page Oswego service catalog: Phase 2 (19) + Phase 1 uncontested (4). */
export const SERVICE_PAGES_OSwego: ServicePageData[] = [
  ...PHASE2_PAGES,
  ...PHASE1_UNCONTESTED_PAGES,
];

export const SERVICE_PAGE_OSWEGO_SLUGS = SERVICE_PAGES_OSwego.map((p) => p.slug);

const BY_SLUG: Record<string, ServicePageData> = Object.fromEntries(
  SERVICE_PAGES_OSwego.map((p) => [p.slug, p])
);

export function getServicePageOswego(slug: string): ServicePageData | undefined {
  return BY_SLUG[slug];
}

export function isServicePageOswegoSlug(slug: string): boolean {
  return slug in BY_SLUG;
}

export { PHASE1_UNCONTESTED_PAGES };
