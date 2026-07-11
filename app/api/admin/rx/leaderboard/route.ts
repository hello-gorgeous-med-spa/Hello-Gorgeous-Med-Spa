import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { buildRegenLeaderboard } from "@/lib/regen/staff-goals";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/leaderboard — month-to-date RE GEN sales leaderboard */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const leaderboard = await buildRegenLeaderboard();
  return NextResponse.json({ leaderboard, viewerUserId: auth.user.id });
}
