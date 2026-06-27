import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  insertFlowWaveIntake,
  listFlowWaveIntakesWithClient,
  type FlowWaveIntakeStatus,
} from "@/lib/flowwave-intake";
import type { FlowWaveScreeningResult } from "@/lib/flowwave-focus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const clientId = req.nextUrl.searchParams.get("client_id") || undefined;
  const status = (req.nextUrl.searchParams.get("status") || "all") as FlowWaveIntakeStatus | "all";
  const screening = (req.nextUrl.searchParams.get("screening") || "all") as
    | FlowWaveScreeningResult
    | "all";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30", 10);

  const { rows, tableReady } = await listFlowWaveIntakesWithClient({
    clientId,
    status,
    screening,
    limit,
  });

  return NextResponse.json({ rows, tableReady });
}

export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));

  const result = await insertFlowWaveIntake({
    clientId: String(body.clientId || "").trim(),
    appointmentId: body.appointmentId ?? null,
    createdBy: auth.user.email,
    intakeData: body.intakeData ?? {},
    soapData: body.soapData ?? {},
    policyData: body.policyData ?? {},
    status: body.status,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, intake: result.row });
}
