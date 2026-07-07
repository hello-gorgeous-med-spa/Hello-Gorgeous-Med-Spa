import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { applyClinicalAction } from "@/lib/rx-ops/clinical-actions";
import { parseRxOpsRequestId } from "@/lib/rx-ops/console-data";
import { buildRxOpsRequestDetail } from "@/lib/rx-ops/request-detail";
import type { RxOpsClinicalAction } from "@/lib/rx-ops/types";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** GET /api/admin/rx/ops/requests/[id] — clinical review drawer data */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id: compositeId } = await params;
  const parsed = parseRxOpsRequestId(decodeURIComponent(compositeId));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request id" }, { status: 400 });
  }

  const detail = await buildRxOpsRequestDetail(parsed.kind, parsed.id);
  if (!detail) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

type PatchBody = {
  action?: RxOpsClinicalAction;
  pharmacySource?: string;
  npNotes?: string;
};

/** PATCH — provider clinical actions (HGRX-030–034) */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id: compositeId } = await params;
  const parsed = parseRxOpsRequestId(decodeURIComponent(compositeId));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as PatchBody;
  if (!body.action || !["approve", "decline", "info"].includes(body.action)) {
    return NextResponse.json({ error: "action must be approve, decline, or info" }, { status: 400 });
  }

  const detail = await buildRxOpsRequestDetail(parsed.kind, parsed.id);
  if (!detail) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const result = await applyClinicalAction({
    kind: parsed.kind,
    id: parsed.id,
    request: detail.request,
    action: body.action,
    pharmacySource: body.pharmacySource,
    npNotes: body.npNotes,
    actorEmail: auth.user.email,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: result.message,
    prescriptionId: result.prescriptionId,
  });
}
