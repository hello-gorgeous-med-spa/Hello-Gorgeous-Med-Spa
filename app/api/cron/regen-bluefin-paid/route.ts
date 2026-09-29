import { NextRequest, NextResponse } from "next/server";

import { syncPayconexPaidOrders } from "@/lib/regen/sync-payconex-paid";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await syncPayconexPaidOrders();
  return NextResponse.json(result);
}
