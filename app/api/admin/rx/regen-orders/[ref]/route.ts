import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  applyRegenFulfillmentAction,
  fetchRegenFulfillmentOrder,
  regenFulfillmentSummary,
} from "@/lib/regen/order-fulfillment";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ ref: string }> };

/** GET /api/admin/rx/regen-orders/[ref] */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { ref } = await params;
  const order = await fetchRegenFulfillmentOrder(admin, decodeURIComponent(ref));
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return NextResponse.json({
    summary: regenFulfillmentSummary(order),
    order: {
      ...order,
      items,
    },
  });
}

type PatchBody = {
  action?: string;
  npNotes?: string;
  pharmacySource?: string;
  trackingNumber?: string;
  carrier?: string;
};

/** PATCH /api/admin/rx/regen-orders/[ref] — approve, ship, etc. */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { ref } = await params;
  const body = (await req.json().catch(() => ({}))) as PatchBody;

  const actionType = body.action;
  if (
    actionType !== "telehealth_complete" &&
    actionType !== "approve" &&
    actionType !== "pharmacy_ordered" &&
    actionType !== "ship" &&
    actionType !== "delivered"
  ) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const result = await applyRegenFulfillmentAction(decodeURIComponent(ref), {
    type: actionType,
    npNotes: body.npNotes,
    pharmacySource: body.pharmacySource,
    trackingNumber: body.trackingNumber,
    carrier: body.carrier,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    notified: result.notified ?? false,
    summary: regenFulfillmentSummary(result.order),
  });
}
