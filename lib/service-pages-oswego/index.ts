import { SERVICE_PAGES_BASE } from "./entries";
import { PHASE1_SLUGS, PHASE1_UNCONTESTED_PAGES } from "./phase1-uncontested";
import type { ServicePageData } from "./types";

export type { ServicePageData, ServicePageFaq } from "./types";

export const SERVICE_PAGES_OSwego: ServicePageData[] = [
  ...SERVICE_PAGES_BASE.filter((p) => !PHASE1_SLUGS.has(p.slug)),
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
