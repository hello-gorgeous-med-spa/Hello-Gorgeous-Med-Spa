/**
 * GET /api/cron/warm-lead-nurture
 * Daily auto-SMS for warm RX intakes at 24h and 72h (if not yet sent to pharmacy).
 */

import { NextRequest, NextResponse } from "next/server";

import { runWarmLeadNurture } from "@/lib/oswego-warm-lead-nurture";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.WARM_LEAD_NURTURE_ENABLED?.trim().toLowerCase() !== "true") {
    return NextResponse.json({
      enabled: false,
      message:
        "Set WARM_LEAD_NURTURE_ENABLED=true on Vercel to activate 24h/72h warm-lead SMS.",
    });
  }

  const dryRun = new URL(request.url).searchParams.get("dry") === "1";

  try {
    const result = await runWarmLeadNurture({ dryRun });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[cron/warm-lead-nurture]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
