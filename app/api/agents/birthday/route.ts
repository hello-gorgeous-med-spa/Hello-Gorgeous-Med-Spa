// ============================================================
// CRON: Birthday Campaign Agent
// Runs on 1st of each month to send birthday offers
// Requires CRON_SECRET + BIRTHDAY_AGENT_ENABLED=true
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runBirthdayAgent } from "@/lib/agents/birthday-agent";

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

  const enabled = process.env.BIRTHDAY_AGENT_ENABLED === "true";
  if (!enabled) {
    return NextResponse.json({
      ok: false,
      message: "Birthday Agent disabled (set BIRTHDAY_AGENT_ENABLED=true)",
    });
  }

  try {
    const result = await runBirthdayAgent();

    console.log("[BirthdayAgent]", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[BirthdayAgent] Error:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
