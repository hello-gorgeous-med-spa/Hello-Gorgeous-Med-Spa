import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { setupClinicEncounterAutopay } from "@/lib/rx-clinic-autopay";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** POST /api/admin/rx/clinic-encounters/[id]/autopay */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const result = await setupClinicEncounterAutopay(id, {
    sentBy: auth.user.email,
    sendSms: body.sendSms === true,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ...result.result });
}
