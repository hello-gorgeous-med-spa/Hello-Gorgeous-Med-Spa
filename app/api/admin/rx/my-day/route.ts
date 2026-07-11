import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { buildStaffMyDay } from "@/lib/regen/staff-my-day";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/my-day — prioritized work queue for the signed-in staff member */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const board = await buildStaffMyDay(auth.user.id);
  if (!board) {
    return NextResponse.json({ error: "Could not load work queue" }, { status: 500 });
  }
  return NextResponse.json({ board });
}
