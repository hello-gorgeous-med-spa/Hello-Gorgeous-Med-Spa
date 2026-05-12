import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { runContentGrowthAgent } from "@/lib/agents/content-growth-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await runContentGrowthAgent({ mode: "plan", maxTasks: 20 });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const mode = body?.mode === "execute" ? "execute" : "plan";
  const maxTasks = typeof body?.maxTasks === "number" ? body.maxTasks : 20;
  const result = await runContentGrowthAgent({ mode, maxTasks });
  return NextResponse.json(result);
}
