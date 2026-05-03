// ============================================================
// API: Win-Back Agent
// GET /api/agents/winback — Cron-triggered (Monday 10 AM Central)
// Contacts lapsed clients (90+ days) with $25 off SMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runWinbackAgent } from "@/lib/agents/winback-agent";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 min for SMS batch

export async function GET(request: NextRequest) {
  // Auth: Vercel Cron or manual with secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if agent is enabled
  if (process.env.WINBACK_AGENT_ENABLED !== "true") {
    return NextResponse.json({
      enabled: false,
      message:
        "Set WINBACK_AGENT_ENABLED=true on Vercel to activate. This agent sends real SMS to real clients.",
    });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dry") === "1";
  const maxBatch = url.searchParams.has("max")
    ? parseInt(url.searchParams.get("max")!, 10)
    : undefined;

  try {
    const result = await runWinbackAgent({ dryRun, maxBatch });

    if (!result.ok && result.errors.length > 0 && result.contacted === 0) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[agents/winback]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
