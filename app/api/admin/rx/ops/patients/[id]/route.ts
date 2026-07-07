import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getRxPatientDetail, updateRxPatientChart } from "@/lib/rx-patients/detail";
import { addRxPatientClinicalNote } from "@/lib/rx-patients/notes";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

/** GET /api/admin/rx/ops/patients/[id] — patient chart (HGRX-020 / HGRX-023) */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { id } = await ctx.params;
  const detail = await getRxPatientDetail(id, auth.user.email, admin);
  if (!detail) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  return NextResponse.json({ patient: detail });
}

/** PATCH /api/admin/rx/ops/patients/[id] — update allergies, meds, notes */
export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await updateRxPatientChart(
    id,
    {
      allergies: body.allergies != null ? String(body.allergies) : undefined,
      medications: body.medications != null ? String(body.medications) : undefined,
      conditions: body.conditions != null ? String(body.conditions) : undefined,
      internalNotes: body.internalNotes != null ? String(body.internalNotes) : undefined,
      state: body.state != null ? String(body.state) : undefined,
    },
    auth.user.email,
    admin,
  );

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const patient = await getRxPatientDetail(id, auth.user.email, admin);
  return NextResponse.json({ ok: true, patient });
}

/** POST /api/admin/rx/ops/patients/[id] — add audited clinical note */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { id } = await ctx.params;
  let body: { noteBody?: string; title?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await addRxPatientClinicalNote(
    {
      clientId: id,
      body: String(body.noteBody || ""),
      actorEmail: auth.user.email,
      title: body.title,
    },
    admin,
  );

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const patient = await getRxPatientDetail(id, auth.user.email, admin);
  return NextResponse.json({ ok: true, noteId: result.noteId, patient });
}
