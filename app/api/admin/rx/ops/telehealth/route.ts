import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { markRxTelehealthComplete } from "@/lib/rx-telehealth/sync";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export const dynamic = "force-dynamic";

function parseKind(raw: unknown): RxOpsRequestKind | null {
  if (raw === "intake" || raw === "clinic" || raw === "regen") return raw;
  return null;
}

/**
 * PATCH /api/admin/rx/ops/telehealth
 * HGRX-060 — staff marks telehealth complete or links Fresha appointment.
 */
export async function PATCH(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: {
    requestKind?: string;
    requestId?: string;
    freshaAppointmentId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const requestKind = parseKind(body.requestKind);
  const requestId = String(body.requestId || "").trim();
  if (!requestKind || !requestId) {
    return NextResponse.json({ error: "requestKind and requestId required" }, { status: 400 });
  }

  const result = await markRxTelehealthComplete({
    kind: requestKind,
    id: requestId,
    actorEmail: auth.user.email,
    freshaAppointmentId: body.freshaAppointmentId?.trim() || null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
