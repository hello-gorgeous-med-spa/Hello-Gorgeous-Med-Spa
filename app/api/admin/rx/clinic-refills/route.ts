import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  getRefillPrepForClient,
  listDueClinicRefills,
  type RefillUrgency,
} from "@/lib/rx-clinic-refill";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/clinic-refills/due — clients due soon or overdue */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const urgency = (req.nextUrl.searchParams.get("urgency") || "all") as RefillUrgency | "all";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);

  const { items, tableReady } = await listDueClinicRefills({ limit, urgency });

  return NextResponse.json({
    items,
    tableReady,
    dueSoonDays: 7,
    counts: {
      overdue: items.filter((i) => i.urgency === "overdue").length,
      dueSoon: items.filter((i) => i.urgency === "due_soon").length,
    },
  });
}
