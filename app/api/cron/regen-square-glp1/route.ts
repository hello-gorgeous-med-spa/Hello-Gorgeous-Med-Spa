import { NextRequest, NextResponse } from "next/server";

import { pullSquareGlp1Clients } from "@/lib/regen/square-glp1-bridge";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Weekly Square → REGEN GLP-1 group refresh. Does not send SMS. */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pullSquareGlp1Clients();
  return NextResponse.json(
    {
      clients: result.clients.length,
      tagged: result.tagged,
      upserted: result.upserted,
      ordersScanned: result.ordersScanned,
      error: result.error || null,
    },
    { status: result.ok ? 200 : 500 },
  );
}
