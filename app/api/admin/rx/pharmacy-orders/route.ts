import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { listPharmacyOrderLines } from "@/lib/rx-pharmacy-orders";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/pharmacy-orders — vials to order for paid GLP-1 RX */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const includeShipped = req.nextUrl.searchParams.get("include_shipped") === "1";
  const data = await listPharmacyOrderLines({ includeShipped });

  return NextResponse.json(data);
}
