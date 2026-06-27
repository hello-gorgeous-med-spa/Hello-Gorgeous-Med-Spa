import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getFlowWaveCommandCenter } from "@/lib/flowwave-intake";

export const dynamic = "force-dynamic";

/** GET /api/admin/flowwave — command center */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "40", 10);
  const data = await getFlowWaveCommandCenter({ limit });
  return NextResponse.json(data);
}
