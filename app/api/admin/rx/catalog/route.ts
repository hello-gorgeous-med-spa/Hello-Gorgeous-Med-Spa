import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { regenCatalogToCsv, type RegenCatalogProduct } from "@/lib/regen-catalog-csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function loadCatalog() {
  const catalogPath = join(process.cwd(), "data/regen-best-prices.json");
  if (!existsSync(catalogPath)) {
    return null;
  }
  return JSON.parse(readFileSync(catalogPath, "utf-8"));
}

export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  try {
    const catalogData = loadCatalog();
    if (!catalogData) {
      return NextResponse.json(
        { error: "Catalog not found. Run: node scripts/build-regen-catalog.js" },
        { status: 404 }
      );
    }

    const format = req.nextUrl.searchParams.get("format");
    const category = req.nextUrl.searchParams.get("category");
    let products = (catalogData.products || []) as RegenCatalogProduct[];

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    if (format === "csv") {
      const filename =
        category && category !== "all"
          ? `regen-catalog-${category}.csv`
          : "regen-catalog-all.csv";
      return new NextResponse(regenCatalogToCsv(products), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({ ...catalogData, products });
  } catch (err) {
    console.error("[admin/rx/catalog] Error:", err);
    return NextResponse.json({ error: "Failed to load catalog" }, { status: 500 });
  }
}
