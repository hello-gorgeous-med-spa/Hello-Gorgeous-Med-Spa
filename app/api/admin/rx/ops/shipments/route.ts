import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  listPharmacyShipments,
  markPharmacyShipmentShipped,
  submitPharmacyShipment,
} from "@/lib/rx-pharmacy-fulfillment/shipments";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/ops/shipments — unified pharmacy queue (HGRX-043) */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const activeOnly = req.nextUrl.searchParams.get("active") !== "0";
  const rows = await listPharmacyShipments({
    status: activeOnly ? "active" : undefined,
    limit: 60,
  });

  return NextResponse.json({ shipments: rows });
}

type PatchBody = {
  action?: "submit" | "ship";
  trackingNumber?: string;
  carrier?: string;
};

/** PATCH /api/admin/rx/ops/shipments?id=... */
export async function PATCH(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as PatchBody;
  if (body.action === "submit") {
    const result = await submitPharmacyShipment(id, auth.user.email);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, shipment: result.row });
  }

  if (body.action === "ship") {
    const result = await markPharmacyShipmentShipped(id, {
      trackingNumber: body.trackingNumber,
      carrier: body.carrier,
      actorEmail: auth.user.email,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "action must be submit or ship" }, { status: 400 });
}
