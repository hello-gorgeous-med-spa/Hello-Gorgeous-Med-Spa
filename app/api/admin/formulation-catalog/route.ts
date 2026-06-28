import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  FORMULATION_CATALOG_CATEGORIES,
  formulationCatalogBySku,
  searchFormulationCatalog,
} from "@/lib/formulation-pharmacy-catalog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireProviderAreaAccess(req);
  if (!auth.ok) return auth.response;

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const sku = req.nextUrl.searchParams.get("sku")?.trim() ?? "";
  const category = req.nextUrl.searchParams.get("category")?.trim() ?? undefined;

  if (sku) {
    const item = formulationCatalogBySku(sku);
    return NextResponse.json({ item: item ?? null });
  }

  if (!q) {
    return NextResponse.json({
      categories: FORMULATION_CATALOG_CATEGORIES,
      items: [],
    });
  }

  const items = searchFormulationCatalog(q, { category, limit: 25 });
  return NextResponse.json({ items });
}
