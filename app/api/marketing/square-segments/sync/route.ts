// Run a Square Customer-Group sync. Owner|admin|staff only.
// Reads the Square Customer Directory, computes our marketing buckets,
// reconciles Square Customer Group membership.

import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { syncSquareSegments } from "@/lib/marketing/square-segments";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await syncSquareSegments();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "POST (owner|admin|staff)",
    description:
      "Run a Square Customer-Group reconciliation. Returns per-segment add/remove counts.",
  });
}
