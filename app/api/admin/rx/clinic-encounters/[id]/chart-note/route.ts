import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  createClinicEncounterChartNote,
  getClinicEncounter,
} from "@/lib/rx-clinic-encounter";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** POST /api/admin/rx/clinic-encounters/[id]/chart-note */
export async function POST(_req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(_req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const encounter = await getClinicEncounter(id);
  if (!encounter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const chartNoteId =
    encounter.chart_note_id ||
    (await createClinicEncounterChartNote(encounter, auth.user.email));

  if (!chartNoteId) {
    return NextResponse.json({ error: "Could not create chart note" }, { status: 500 });
  }

  const refreshed = await getClinicEncounter(id);
  return NextResponse.json({ ok: true, chartNoteId, encounter: refreshed });
}
