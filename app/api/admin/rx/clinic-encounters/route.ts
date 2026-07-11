import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { resolveStaffSellerById } from "@/lib/regen/sales-attribution";
import {
  computeClinicSalePricing,
  createClinicEncounterChartNote,
  getClinicEncounter,
  insertClinicEncounter,
  listClinicEncountersWithClient,
  type RxClinicEncounterStatus,
  type RxClinicEncounterType,
} from "@/lib/rx-clinic-encounter";
import {
  REGEN_CLINIC_CATALOG_GROUPS,
  computeRegenClinicPricing,
  insertRegenClinicEncounter,
} from "@/lib/rx-clinic-regen-sale";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";
import {
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
} from "@/lib/glp1-dose-tiers";
import { RX_SUPPLY_CYCLES } from "@/lib/rx-supply-cycle";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/clinic-encounters — list + pricing catalog */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const clientId = req.nextUrl.searchParams.get("client_id") || undefined;
  const status = req.nextUrl.searchParams.get("status") || "all";
  const catalog = req.nextUrl.searchParams.get("catalog") === "1";

  if (catalog) {
    return NextResponse.json({
      medications: [
        { id: "Semaglutide", label: "Semaglutide", tiers: GLP1_SEMAGLUTIDE_DOSE_TIERS },
        { id: "Tirzepatide", label: "Tirzepatide", tiers: GLP1_TIRZEPATIDE_DOSE_TIERS },
      ],
      supplyCycles: Object.values(RX_SUPPLY_CYCLES),
      regenCatalog: REGEN_CLINIC_CATALOG_GROUPS,
    });
  }

  const { rows, tableReady } = await listClinicEncountersWithClient({
    clientId,
    status: status as RxClinicEncounterStatus | "all",
    limit: parseInt(req.nextUrl.searchParams.get("limit") || "30", 10),
  });

  return NextResponse.json({ rows, tableReady });
}

/** POST /api/admin/rx/clinic-encounters — create encounter or preview quote */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const previewOnly = body.preview === true;
  const saleMode = body.saleMode === "regen_catalog" ? "regen_catalog" : "glp1";

  if (saleMode === "regen_catalog") {
    let soldByUserId = auth.user.id;
    let soldByEmail = auth.user.email;
    const requestedSeller = String(body.soldByUserId || "").trim();
    if (requestedSeller && requestedSeller !== auth.user.id) {
      const override = await resolveStaffSellerById(requestedSeller);
      if (override) {
        soldByUserId = override.userId;
        soldByEmail = override.email;
      }
    }

    const regenInput = {
      clientId: String(body.clientId || "").trim(),
      lineItems: Array.isArray(body.lineItems) ? body.lineItems : [],
      includeShipping: body.includeShipping !== false,
      consultFeeUsd: Number(body.consultFeeUsd || 0),
      discountUsd: Number(body.discountUsd || 0),
      discountReason: body.discountReason ?? null,
      discountAuthorizedBy: body.discountAuthorizedBy ?? auth.user.email,
      shipAddressLine1: body.shipAddressLine1 ?? null,
      shipAddressLine2: body.shipAddressLine2 ?? null,
      shipCity: body.shipCity ?? null,
      shipState: body.shipState ?? "IL",
      shipZip: body.shipZip ?? null,
      pharmacy: body.pharmacy ?? "boomrx",
      sig: body.sig ?? null,
      clinical: body.clinical ?? {},
      staffNotes: body.staffNotes ?? null,
      appointmentId: body.appointmentId ?? null,
      createdBy: auth.user.email,
      soldByUserId,
      soldByEmail,
    };

    const pricing = computeRegenClinicPricing({
      lineItems: regenInput.lineItems,
      includeShipping: regenInput.includeShipping,
      consultFeeUsd: regenInput.consultFeeUsd,
      discountUsd: regenInput.discountUsd,
      discountReason: regenInput.discountReason,
      discountAuthorizedBy: regenInput.discountAuthorizedBy,
    });
    if ("error" in pricing) {
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    }

    if (previewOnly) {
      return NextResponse.json({ ok: true, snapshot: pricing.snapshot, lineItems: pricing.lineItems });
    }

    if (!regenInput.clientId) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    const result = await insertRegenClinicEncounter(regenInput);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await createClinicEncounterChartNote(result.row, auth.user.email);
    const withChart = (await getClinicEncounter(result.row.id)) ?? result.row;
    return NextResponse.json({ ok: true, encounter: withChart });
  }

  const input = {
    clientId: String(body.clientId || "").trim(),
    encounterType: (body.encounterType || "new_consult") as RxClinicEncounterType,
    medication: String(body.medication || "").trim(),
    doseTierId: String(body.doseTierId || "").trim(),
    supplyCycle: (body.supplyCycle || "90-day") as RxSupplyCycleId,
    consultFeeUsd: Number(body.consultFeeUsd || 0),
    discountUsd: Number(body.discountUsd || 0),
    discountReason: body.discountReason ?? null,
    discountAuthorizedBy: body.discountAuthorizedBy ?? auth.user.email,
    shipAddressLine1: body.shipAddressLine1 ?? null,
    shipAddressLine2: body.shipAddressLine2 ?? null,
    shipCity: body.shipCity ?? null,
    shipState: body.shipState ?? "IL",
    shipZip: body.shipZip ?? null,
    pharmacy: body.pharmacy ?? null,
    sig: body.sig ?? null,
    clinical: body.clinical ?? {},
    staffNotes: body.staffNotes ?? null,
    appointmentId: body.appointmentId ?? null,
    createdBy: auth.user.email,
  };

  const pricing = computeClinicSalePricing(input);
  if ("error" in pricing) {
    return NextResponse.json({ error: pricing.error }, { status: 400 });
  }

  if (previewOnly) {
    return NextResponse.json({ ok: true, snapshot: pricing.snapshot });
  }

  if (!input.clientId) {
    return NextResponse.json({ error: "Client is required" }, { status: 400 });
  }

  const result = await insertClinicEncounter(input);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, encounter: result.row });
}
