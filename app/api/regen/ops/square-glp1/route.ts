import { NextRequest, NextResponse } from "next/server";

import { requireOpsAuth } from "@/lib/regen/ops-session";
import {
  inviteSquareGlp1Clients,
  listSquareGlp1Report,
  pullSquareGlp1Clients,
} from "@/lib/regen/square-glp1-bridge";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const auth = await requireOpsAuth(request);
  if (auth.error) return auth.error;
  const result = await listSquareGlp1Report();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}

export async function POST(request: NextRequest) {
  const auth = await requireOpsAuth(request);
  if (auth.error) return auth.error;
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    maxBatch?: number;
    dryRun?: boolean;
  };
  const action = body.action || "pull";

  if (action === "invite" || action === "launch") {
    const result = await inviteSquareGlp1Clients({
      maxBatch: body.maxBatch,
      dryRun: body.dryRun,
      variant: action === "launch" ? "launch" : "invite",
    });
    return NextResponse.json(result, { status: result.ok || result.eligible === 0 ? 200 : 502 });
  }

  const result = await pullSquareGlp1Clients();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
