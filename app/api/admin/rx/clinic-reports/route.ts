import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { buildClinicRxReport } from "@/lib/rx-clinic-refill";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/clinic-reports?days=30 */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const days = Math.min(365, Math.max(7, parseInt(req.nextUrl.searchParams.get("days") || "30", 10)));
  const report = await buildClinicRxReport(days);

  return NextResponse.json({ report });
}
