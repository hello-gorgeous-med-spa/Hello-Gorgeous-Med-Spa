import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  formatClinicDispatchPreview,
  getClinicEncounter,
  markClinicEncounterPaid,
  updateClinicEncounter,
  type RxClinicEncounterType,
  type RxClinicPharmacy,
} from "@/lib/rx-clinic-encounter";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** GET /api/admin/rx/clinic-encounters/[id] */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const encounter = await getClinicEncounter(id);
  if (!encounter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = getSupabaseAdminClient();
  let clientName = "Patient";
  if (admin) {
    const { data } = await admin
      .from("clients")
      .select("first_name, last_name")
      .eq("id", encounter.client_id)
      .maybeSingle();
    if (data) {
      clientName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || clientName;
    }
  }

  return NextResponse.json({
    encounter,
    dispatchPreview: formatClinicDispatchPreview(encounter, clientName),
  });
}

/** PATCH /api/admin/rx/clinic-encounters/[id] */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (body.action === "mark_paid_cash") {
    const result = await markClinicEncounterPaid(id, {
      paymentMethod: "cash",
      sentBy: auth.user.email,
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, encounter: result.row });
  }

  const result = await updateClinicEncounter(id, {
    encounterType: body.encounterType as RxClinicEncounterType | undefined,
    medication: body.medication,
    doseTierId: body.doseTierId,
    supplyCycle: body.supplyCycle as RxSupplyCycleId | undefined,
    consultFeeUsd: body.consultFeeUsd != null ? Number(body.consultFeeUsd) : undefined,
    discountUsd: body.discountUsd != null ? Number(body.discountUsd) : undefined,
    discountReason: body.discountReason,
    discountAuthorizedBy: body.discountAuthorizedBy ?? auth.user.email,
    shipAddressLine1: body.shipAddressLine1,
    shipAddressLine2: body.shipAddressLine2,
    shipCity: body.shipCity,
    shipState: body.shipState,
    shipZip: body.shipZip,
    pharmacy: body.pharmacy as RxClinicPharmacy | undefined,
    sig: body.sig,
    clinical: body.clinical,
    staffNotes: body.staffNotes,
    status: body.status,
    dispatchStatus: body.dispatchStatus,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, encounter: result.row });
}
