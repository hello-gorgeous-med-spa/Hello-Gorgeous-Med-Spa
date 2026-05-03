// ============================================================
// CRON: Sync Hello Gorgeous customer segments to Square Groups
// Runs weekly (Monday 6:00 UTC / ~1:00 AM Central).
// Creates/maintains: HG First-Time, HG Lapsed (90+), HG Birthday Month, HG All Opt-In
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { syncSquareSegments } from "@/lib/marketing/square-segments";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min — large customer lists

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncSquareSegments();
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[cron/sync-square-segments]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
