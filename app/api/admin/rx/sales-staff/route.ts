import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { listSalesStaffOptions } from "@/lib/regen/sales-attribution";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/sales-staff — active staff for sold-by picker */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const staff = await listSalesStaffOptions();
  return NextResponse.json({ staff });
}
