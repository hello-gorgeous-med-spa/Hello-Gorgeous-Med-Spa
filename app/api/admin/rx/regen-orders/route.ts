import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  listRegenFulfillmentOrders,
  regenFulfillmentSummary,
  regenOrderNeedsReview,
  regenOrderReadyToShip,
} from "@/lib/regen/order-fulfillment";

export const dynamic = "force-dynamic";

type Filter = "needs_review" | "ready_to_ship" | "shipped" | "all";

function parseFilter(raw: string | null): Filter {
  if (
    raw === "needs_review" ||
    raw === "ready_to_ship" ||
    raw === "shipped" ||
    raw === "all"
  ) {
    return raw;
  }
  return "needs_review";
}

/** GET /api/admin/rx/regen-orders — RE GEN online fulfillment queue */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const filter = parseFilter(req.nextUrl.searchParams.get("filter"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "50", 10)),
  );

  const orders = await listRegenFulfillmentOrders(admin, { limit: 100, filter: "all" });
  const filtered = await listRegenFulfillmentOrders(admin, { limit, filter });

  return NextResponse.json({
    filter,
    counts: {
      needsReview: orders.filter(regenOrderNeedsReview).length,
      readyToShip: orders.filter(regenOrderReadyToShip).length,
      shipped: orders.filter(
        (o) => Boolean(o.shipped_at) || o.status === "shipped" || o.status === "delivered",
      ).length,
      total: orders.length,
    },
    orders: filtered.map(regenFulfillmentSummary),
  });
}
