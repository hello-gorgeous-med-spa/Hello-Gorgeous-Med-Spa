import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getRefillPrepForClient } from "@/lib/rx-clinic-refill";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/clinic-refills/prep?client_id= */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const clientId = req.nextUrl.searchParams.get("client_id")?.trim();
  if (!clientId) {
    return NextResponse.json({ error: "client_id required" }, { status: 400 });
  }

  const result = await getRefillPrepForClient(clientId, auth.user.email);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ...result });
}
