import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getFlowWaveIntake, updateFlowWaveIntake } from "@/lib/flowwave-intake";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const auth = requireProviderAreaAccess(_req);
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const intake = await getFlowWaveIntake(id);
  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ intake });
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const result = await updateFlowWaveIntake(id, {
    intakeData: body.intakeData,
    soapData: body.soapData,
    policyData: body.policyData,
    appointmentId: body.appointmentId,
    status: body.status,
    createdBy: auth.user.email,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, intake: result.row });
}
