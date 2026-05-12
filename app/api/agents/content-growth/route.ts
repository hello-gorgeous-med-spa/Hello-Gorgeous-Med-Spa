import { NextRequest, NextResponse } from "next/server";
import { runContentGrowthAgent } from "@/lib/agents/content-growth-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = process.env.CONTENT_GROWTH_AGENT_ENABLED === "true";
  if (!enabled) {
    return NextResponse.json({
      ok: false,
      message: "Content Growth Agent disabled (set CONTENT_GROWTH_AGENT_ENABLED=true)",
    });
  }

  const result = await runContentGrowthAgent({ mode: "execute", maxTasks: 20 });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  return GET(request);
}
