import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { updateRefillPlanStatus } from "@/lib/rx-refill-plans/plans";
import type { RxRefillPlanStatus } from "@/lib/rx-refill-plans/types";

export const dynamic = "force-dynamic";

const VALID_STATUS = new Set<RxRefillPlanStatus>(["active", "paused", "cancelled"]);

/** PATCH /api/admin/rx/ops/refill-plans — pause / resume / cancel (HGRX-070) */
export async function PATCH(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: { planId?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planId = String(body.planId || "").trim();
  const status = body.status?.trim() as RxRefillPlanStatus | undefined;
  if (!planId || !status || !VALID_STATUS.has(status)) {
    return NextResponse.json({ error: "planId and valid status required" }, { status: 400 });
  }

  const row = await updateRefillPlanStatus(planId, status, auth.user.email);
  if (!row) {
    return NextResponse.json({ error: "Could not update plan" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, plan: row });
}
