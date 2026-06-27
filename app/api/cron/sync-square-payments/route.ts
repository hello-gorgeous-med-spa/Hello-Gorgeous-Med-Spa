// ============================================================
// CRON: Sync Square Payments → hg_square_transactions
// Schedule: every 6 hours (vercel.json)
// Manual: GET /api/cron/sync-square-payments?days=90
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { syncSquarePayments } from "@/lib/square/sync-payments";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const isVercelCron =
    req.headers.get("x-vercel-cron") === "1" ||
    (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`);

  if (!isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const daysParam = parseInt(req.nextUrl.searchParams.get("days") || "3", 10);
  const result = await syncSquarePayments({ days: daysParam });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.error?.includes("not configured") ? 500 : 502 });
  }

  return NextResponse.json(result);
}
