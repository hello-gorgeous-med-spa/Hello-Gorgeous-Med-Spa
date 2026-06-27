import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { deleteFlowWaveSession, insertFlowWaveSession, listFlowWaveSessions } from "@/lib/flowwave-intake";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const clientId = req.nextUrl.searchParams.get("client_id") || undefined;
  const intakeId = req.nextUrl.searchParams.get("intake_id") || undefined;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);

  const { rows, tableReady } = await listFlowWaveSessions({ clientId, intakeId, limit });
  return NextResponse.json({ rows, tableReady });
}

export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));

  const result = await insertFlowWaveSession({
    clientId: String(body.clientId || "").trim(),
    intakeId: body.intakeId ?? null,
    appointmentId: body.appointmentId ?? null,
    createdBy: auth.user.email,
    sessionNumber: body.sessionNumber ?? null,
    sessionDate: body.sessionDate,
    treatmentArea: body.treatmentArea,
    handleType: body.handleType,
    intensity: body.intensity ?? null,
    frequencyHz: body.frequencyHz ?? null,
    shotsDelivered: body.shotsDelivered ?? null,
    actualShots: body.actualShots ?? null,
    totalEnergyMj: body.totalEnergyMj,
    durationMin: body.durationMin ?? null,
    painBefore: body.painBefore ?? null,
    painAfter: body.painAfter ?? null,
    clinician: body.clinician,
    notes: body.notes,
    tolerance: body.tolerance,
    sessionData: body.sessionData ?? {},
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, session: result.row });
}

export async function DELETE(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Session id required" }, { status: 400 });

  const result = await deleteFlowWaveSession(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
