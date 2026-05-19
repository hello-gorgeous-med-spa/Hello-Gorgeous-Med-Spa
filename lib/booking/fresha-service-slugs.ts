import "server-only";

/**
 * Map `/book?service=<slug>` → Fresha `serviceId` when Dani provides the CSV.
 * Until IDs are set, `/book` uses the generic org Fresha URL.
 */
const FRESHA_SERVICE_ID_BY_SLUG: Record<string, string> = {
  // Example: botox: "xxxxxxxx",
};

export async function resolveFreshaServiceIdForSlug(slug: string): Promise<string | null> {
  const key = slug.trim().toLowerCase();
  return FRESHA_SERVICE_ID_BY_SLUG[key] ?? null;
}
