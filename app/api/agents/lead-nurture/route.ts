// ============================================================
// CRON: Lead Nurture Agent
// Runs daily to process new leads through 3-step nurture sequence
// Requires CRON_SECRET + LEAD_NURTURE_ENABLED=true
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runLeadNurtureAgent } from "@/lib/agents/lead-nurture-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = process.env.LEAD_NURTURE_ENABLED === "true";
  if (!enabled) {
    return NextResponse.json({
      ok: false,
      message: "Lead Nurture Agent disabled (set LEAD_NURTURE_ENABLED=true)",
    });
  }

  try {
    const result = await runLeadNurtureAgent();

    console.log("[LeadNurtureAgent]", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[LeadNurtureAgent] Error:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
