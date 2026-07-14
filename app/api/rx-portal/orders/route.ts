import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  listRegenFulfillmentOrders,
  regenOrderNeedsReview,
  regenOrderReadyToShip,
} from "@/lib/regen/order-fulfillment";
import { regenOrderTotalUsd } from "@/lib/regen/order-patient-status";
import {
  rxPortalShipDestination,
  rxPortalShipSpeed,
  rxPortalStatusStamp,
  rxPortalTrackingUrl,
} from "@/lib/rx-portal/pipeline";

export const dynamic = "force-dynamic";

function parseLineItems(raw: unknown): Array<{ name: string; qty: number; price?: string }> {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    const name = String(row.name || row.title || "Item");
    const qty = Number(row.qty ?? row.quantity ?? 1) || 1;
    const price =
      row.price != null
        ? String(row.price)
        : row.priceUsd != null
          ? `$${Number(row.priceUsd).toFixed(2)}`
          : undefined;
    return { name, qty, price };
  });
}

/** GET /api/rx-portal/orders — Provider Portal order history */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "80", 10)),
  );

  const orders = await listRegenFulfillmentOrders(admin, { limit, filter: "all" });

  return NextResponse.json({
    counts: {
      needsReview: orders.filter(regenOrderNeedsReview).length,
      readyToShip: orders.filter(regenOrderReadyToShip).length,
      shipped: orders.filter(
        (o) => Boolean(o.shipped_at) || o.status === "shipped" || o.status === "delivered",
      ).length,
      total: orders.length,
    },
    orders: orders.map((o) => {
      const intake = (o.intake_data ?? null) as Record<string, unknown> | null;
      const dob =
        (intake?.dob as string) ||
        (intake?.date_of_birth as string) ||
        (intake?.dateOfBirth as string) ||
        null;
      const shipDestination = rxPortalShipDestination({
        shippingAddress: o.shipping_address as Record<string, unknown> | null,
        salesChannel: o.sales_channel,
      });
      const items = parseLineItems(o.items);
      const signals = {
        status: o.status,
        paidAt: o.paid_at,
        npApprovedAt: o.np_approved_at,
        pharmacyOrderedAt: o.pharmacy_ordered_at,
        shippedAt: o.shipped_at,
        deliveredAt: o.delivered_at,
        trackingNumber: o.tracking_number,
      };
      return {
        reference: o.reference,
        createdAt: o.created_at,
        status: o.status,
        patientName: o.customer_name,
        patientEmail: o.customer_email,
        dob: dob ? String(dob).slice(0, 10) : null,
        totalUsd: regenOrderTotalUsd(o),
        paidAt: o.paid_at,
        npApprovedAt: o.np_approved_at,
        pharmacyOrderedAt: o.pharmacy_ordered_at,
        pharmacySource: o.pharmacy_source ?? null,
        shippedAt: o.shipped_at,
        deliveredAt: o.delivered_at,
        trackingNumber: o.tracking_number,
        trackingUrl: rxPortalTrackingUrl(o.tracking_number),
        shipSpeed: rxPortalShipSpeed(o.shipping_usd),
        shipDestination,
        shipLabel: shipDestination,
        statusAt: rxPortalStatusStamp(signals),
        items,
        itemCount: items.length,
        detailHref: `/admin/rx/regen-orders/${encodeURIComponent(o.reference)}`,
        patientStatusHref: `/rx/status?ref=${encodeURIComponent(o.reference)}`,
        reorderHref: `/rx-portal/place-order${
          o.customer_email
            ? `?patient=${encodeURIComponent(String(o.customer_email))}`
            : ""
        }`,
      };
    }),
  });
}
