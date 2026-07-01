import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Read from the generated catalog
    const catalogPath = join(process.cwd(), "data/regen-best-prices.json");
    
    if (!existsSync(catalogPath)) {
      return NextResponse.json(
        { error: "Catalog not found. Run: node scripts/build-regen-catalog.js" },
        { status: 404 }
      );
    }

    const catalogData = JSON.parse(readFileSync(catalogPath, "utf-8"));

    return NextResponse.json(catalogData);
  } catch (err) {
    console.error("[admin/rx/catalog] Error:", err);
    return NextResponse.json(
      { error: "Failed to load catalog" },
      { status: 500 }
    );
  }
}
