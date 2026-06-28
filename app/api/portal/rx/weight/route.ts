import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPortalClientSession } from "@/lib/portal/session";
import {
  backfillRxWeightLogsFromSubmissions,
  loadRxWeightProgress,
  recordRxWeightLog,
  upsertRxWeightGoal,
} from "@/lib/rx-weight-log";

export const dynamic = "force-dynamic";

/** GET /api/portal/rx/weight — weight progress chart data */
export async function GET(req: NextRequest) {
  const session = await getPortalClientSession(req);
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  await backfillRxWeightLogsFromSubmissions(admin, session.clientId, session.email);
  const progress = await loadRxWeightProgress(admin, session.clientId, session.email);

  return NextResponse.json(progress);
}

/** POST /api/portal/rx/weight — log weight or update goal */
export async function POST(req: NextRequest) {
  const session = await getPortalClientSession(req);
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: { weightLbs?: number; goalWeightLbs?: number; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.goalWeightLbs != null) {
    const goal = await upsertRxWeightGoal(admin, session.clientId, body.goalWeightLbs);
    if (!goal.ok) return NextResponse.json({ error: goal.error }, { status: 400 });
  }

  if (body.weightLbs != null) {
    const logged = await recordRxWeightLog(admin, {
      clientId: session.clientId,
      patientEmail: session.email,
      weightLbs: body.weightLbs,
      source: "portal",
      notes: body.notes,
    });
    if (!logged.ok) return NextResponse.json({ error: logged.error }, { status: 400 });
  }

  const progress = await loadRxWeightProgress(admin, session.clientId, session.email);
  return NextResponse.json(progress);
}
