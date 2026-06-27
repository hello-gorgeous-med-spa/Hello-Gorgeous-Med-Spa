import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  updateClinicEncounterDispatch,
  type RxClinicDispatchStatus,
} from "@/lib/rx-clinic-encounter";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** PATCH /api/admin/rx/clinic-encounters/[id]/dispatch */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const result = await updateClinicEncounterDispatch(id, {
    dispatchStatus: body.dispatchStatus as RxClinicDispatchStatus | undefined,
    trackingNumber: body.trackingNumber,
    carrier: body.carrier,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, encounter: result.row });
}
