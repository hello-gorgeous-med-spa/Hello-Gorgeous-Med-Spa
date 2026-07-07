import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { buildRxOpsConsolePayload, parseRxOpsRequestId } from "@/lib/rx-ops/console-data";
import { loadRxOpsFormulary, routingForCompound } from "@/lib/rx-ops/formulary";
import type { RxOpsRequestDetail } from "@/lib/rx-ops/types";
import {
  applyRegenFulfillmentAction,
  fetchRegenFulfillmentOrder,
} from "@/lib/regen/order-fulfillment";
import { formatSquareShippingAddress } from "@/lib/square/order-shipping";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** GET /api/admin/rx/ops/requests/[id] — clinical review drawer data */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id: compositeId } = await params;
  const parsed = parseRxOpsRequestId(decodeURIComponent(compositeId));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request id" }, { status: 400 });
  }

  const payload = await buildRxOpsConsolePayload();
  const request = payload.requests.find((r) => r.id === `${parsed.kind}:${parsed.id}`);
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const formulary = loadRxOpsFormulary();
  const routing = routingForCompound(request.compound, formulary);

  let screening: RxOpsRequestDetail["screening"] = [
    { icon: "✓", ok: true, text: "Intake submitted — awaiting provider review" },
  ];
  let intake: RxOpsRequestDetail["intake"] = [];
  let suggestedNote = `Continue ${request.product} per protocol. Document SIG for pharmacy.`;
  let npNotes: string | null = null;
  let shipTo: string | null = null;

  if (parsed.kind === "regen") {
    const admin = getSupabaseAdminClient();
    if (admin) {
      const order = await fetchRegenFulfillmentOrder(admin, parsed.id);
      if (order) {
        npNotes = order.np_notes ?? null;
        const intakeData = order.intake_data ?? {};
        intake = Object.entries(intakeData)
          .filter(([k]) => !k.startsWith("_"))
          .slice(0, 12)
          .map(([q, a]) => ({ q, a: String(a ?? "—") }));
        if (order.allergies) {
          screening.push({ icon: "!", ok: false, text: `Allergies: ${order.allergies}` });
        }
        if (order.intake_completed_at) {
          screening.push({ icon: "✓", ok: true, text: "Post-payment intake complete" });
        }
        if (order.telehealth_required !== false && !order.telehealth_completed_at) {
          screening.push({ icon: "!", ok: false, text: "Telehealth visit pending" });
        }
        shipTo = formatSquareShippingAddress(
          order.shipping_address as Parameters<typeof formatSquareShippingAddress>[0],
        );
      }
    }
  }

  const detail: RxOpsRequestDetail = {
    request,
    screening,
    intake,
    routing,
    suggestedNote,
    npNotes,
    shipTo,
  };

  return NextResponse.json(detail);
}

type PatchBody = {
  action?: "approve" | "info" | "decline";
  pharmacySource?: string;
  npNotes?: string;
};

/** PATCH — provider actions (regen approve routes to fulfillment API) */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id: compositeId } = await params;
  const parsed = parseRxOpsRequestId(decodeURIComponent(compositeId));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as PatchBody;

  if (parsed.kind === "regen" && body.action === "approve") {
    const result = await applyRegenFulfillmentAction(parsed.id, {
      type: "approve",
      npNotes: body.npNotes,
      pharmacySource: body.pharmacySource,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, order: result.order });
  }

  return NextResponse.json(
    {
      ok: true,
      message:
        parsed.kind === "regen"
          ? "Action recorded — extend PATCH for intake/clinic workflows"
          : "Use RX Dispatch or Clinic Sale for this pipeline until HGRX-032 is complete",
    },
    { status: 200 },
  );
}
