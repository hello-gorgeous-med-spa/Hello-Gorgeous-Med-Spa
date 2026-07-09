import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

import {
  ALL_REGEN_PRICING,
  REGEN_SHIPPING_USD,
  REGEN_WEIGHT_LOSS_PRICING,
  REGEN_SEXUAL_HEALTH_PRICING,
  REGEN_PEPTIDE_PRICING,
  REGEN_HORMONE_PRICING,
  REGEN_HAIR_SKIN_PRICING,
  REGEN_VITAMIN_PRICING,
} from "@/lib/regen/pricing-sync";

export const runtime = "nodejs";

/**
 * GET /api/regen/pricing
 * Returns current RE GEN product pricing.
 * Can be used by storefront to display live prices.
 */
export async function GET() {
  let catalogUpdatedAt: string | undefined;
  const catalogPath = join(process.cwd(), "data/regen-best-prices.json");
  if (existsSync(catalogPath)) {
    try {
      const raw = JSON.parse(readFileSync(catalogPath, "utf-8"));
      catalogUpdatedAt = raw.generatedAt;
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({
    success: true,
    shipping: REGEN_SHIPPING_USD,
    categories: {
      "weight-loss": REGEN_WEIGHT_LOSS_PRICING,
      "sexual-health": REGEN_SEXUAL_HEALTH_PRICING,
      "daily-wellness": REGEN_PEPTIDE_PRICING,
      hormones: REGEN_HORMONE_PRICING,
      "hair-skin": REGEN_HAIR_SKIN_PRICING,
      vitamins: REGEN_VITAMIN_PRICING,
    },
    all: ALL_REGEN_PRICING,
    updatedAt: catalogUpdatedAt || new Date().toISOString(),
  });
}
