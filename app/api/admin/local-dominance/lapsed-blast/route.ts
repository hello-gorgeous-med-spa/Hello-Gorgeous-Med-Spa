/**
 * Lapsed Square segment reactivation — staff one-click from Oswego command center.
 * GET — preview counts · POST — send RX-focused SMS blast (max 50/batch).
 */

import { NextRequest, NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import {
  previewLapsedRxReactivation,
  runLapsedRxReactivation,
} from "@/lib/marketing/lapsed-rx-reactivation";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const preview = await previewLapsedRxReactivation();
  return NextResponse.json({ ok: true, preview });
}

export async function POST(req: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { dryRun?: boolean; maxBatch?: number } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const dryRun = body.dryRun === true;
  const maxBatch =
    body.maxBatch != null && Number.isFinite(body.maxBatch)
      ? Math.min(Math.max(1, body.maxBatch), 50)
      : 50;

  try {
    const result = await runLapsedRxReactivation({ dryRun, maxBatch });
    if (!result.ok && result.contacted === 0 && result.errors.length > 0) {
      return NextResponse.json(result, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
