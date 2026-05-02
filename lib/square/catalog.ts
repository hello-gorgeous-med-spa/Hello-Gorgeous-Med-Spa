// ============================================================
// SQUARE CATALOG — live service data for hellogorgeousmedspa.com
// ============================================================
// Server-only. Pulls Appointments services + categories from the Square
// Catalog API, normalizes to a typed shape, and caches via Next.js's
// `fetch` revalidate (10 min). Use from server components / RSC routes.
//
// When pricing or service names change in Square Dashboard, the website
// picks them up within 10 minutes — no deploy needed.
// ============================================================

import "server-only";

const SQUARE_API_HOST =
  process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const SQUARE_API_VERSION = "2024-12-18";
const REVALIDATE_SECONDS = 600; // 10 min — fast enough for marketing changes

export interface SquareServiceVariation {
  id: string;
  name: string | null;
  priceDollars: number | null;
  durationMinutes: number | null;
}

export interface SquareService {
  id: string;
  name: string;
  description: string;
  categoryNames: string[];
  variations: SquareServiceVariation[];
  /** Convenience: max variation price (typically the headline price). */
  maxPriceDollars: number | null;
  /** Convenience: min variation price (often "from" pricing). */
  minPriceDollars: number | null;
  /** Convenience: first variation duration (most services have one). */
  primaryDurationMinutes: number | null;
}

export interface SquareCatalog {
  services: SquareService[];
  categoryNames: string[];
  fetchedAt: string;
}

interface RawCatalogObject {
  type: string;
  id: string;
  is_deleted?: boolean;
  category_data?: { name?: string };
  item_data?: {
    product_type?: string;
    name?: string;
    description?: string;
    description_plaintext?: string;
    categories?: Array<{ id: string }>;
    variations?: Array<{
      id: string;
      item_variation_data?: {
        name?: string;
        price_money?: { amount?: number; currency?: string };
        service_duration?: number; // milliseconds
      };
    }>;
  };
}

interface RawCatalogResponse {
  objects?: RawCatalogObject[];
  cursor?: string;
  errors?: Array<{ category: string; code: string; detail?: string }>;
}

async function fetchCatalogPage(types: string, cursor?: string): Promise<RawCatalogResponse> {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN is not set");
  const url =
    `${SQUARE_API_HOST}/v2/catalog/list?types=${encodeURIComponent(types)}` +
    (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      Accept: "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS, tags: ["square-catalog"] },
  });
  if (!res.ok) {
    throw new Error(`Square catalog fetch failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return (await res.json()) as RawCatalogResponse;
}

async function listAllRaw(types: string): Promise<RawCatalogObject[]> {
  const all: RawCatalogObject[] = [];
  let cursor: string | undefined;
  do {
    const page = await fetchCatalogPage(types, cursor);
    if (page.errors?.length) {
      throw new Error(`Square catalog errors: ${page.errors.map((e) => e.detail || e.code).join("; ")}`);
    }
    if (page.objects) all.push(...page.objects.filter((o) => !o.is_deleted));
    cursor = page.cursor;
  } while (cursor);
  return all;
}

export async function getSquareCatalog(): Promise<SquareCatalog> {
  const raw = await listAllRaw("CATEGORY,ITEM");
  const categoryNames = new Map<string, string>();
  for (const o of raw) {
    if (o.type === "CATEGORY" && o.category_data?.name) {
      categoryNames.set(o.id, o.category_data.name);
    }
  }

  const services: SquareService[] = [];
  for (const o of raw) {
    if (o.type !== "ITEM" || o.item_data?.product_type !== "APPOINTMENTS_SERVICE") continue;
    const d = o.item_data;
    const variations: SquareServiceVariation[] = (d.variations || []).map((v) => ({
      id: v.id,
      name: v.item_variation_data?.name ?? null,
      priceDollars:
        typeof v.item_variation_data?.price_money?.amount === "number"
          ? v.item_variation_data.price_money.amount / 100
          : null,
      durationMinutes:
        typeof v.item_variation_data?.service_duration === "number"
          ? v.item_variation_data.service_duration / 60_000
          : null,
    }));
    const prices = variations.map((v) => v.priceDollars).filter((p): p is number => p !== null);
    services.push({
      id: o.id,
      name: d.name ?? "",
      description: (d.description_plaintext ?? d.description ?? "").trim(),
      categoryNames: (d.categories || [])
        .map((c) => categoryNames.get(c.id))
        .filter((n): n is string => Boolean(n)),
      variations,
      maxPriceDollars: prices.length ? Math.max(...prices) : null,
      minPriceDollars: prices.length ? Math.min(...prices) : null,
      primaryDurationMinutes: variations[0]?.durationMinutes ?? null,
    });
  }

  return {
    services,
    categoryNames: Array.from(new Set(Array.from(categoryNames.values()))).sort(),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Filter services by name pattern (case-insensitive substring match against
 * any of the provided patterns). Useful for grouping services on a landing
 * page (e.g., all Botox-related services).
 */
export function findServicesByPatterns(
  services: SquareService[],
  patterns: Array<string | RegExp>,
): SquareService[] {
  return services.filter((s) =>
    patterns.some((p) =>
      typeof p === "string"
        ? s.name.toLowerCase().includes(p.toLowerCase())
        : p.test(s.name),
    ),
  );
}

/** Filter services by category name (exact match, case-sensitive). */
export function findServicesByCategory(
  services: SquareService[],
  categoryName: string,
): SquareService[] {
  return services.filter((s) => s.categoryNames.includes(categoryName));
}
