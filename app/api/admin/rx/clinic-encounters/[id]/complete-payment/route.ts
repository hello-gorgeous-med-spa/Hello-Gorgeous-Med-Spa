import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getClinicEncounter, markClinicEncounterPaid } from "@/lib/rx-clinic-encounter";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** POST /api/admin/rx/clinic-encounters/[id]/complete-payment */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const encounter = await getClinicEncounter(id);
  if (!encounter) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }

  const admin = getSupabaseAdminClient();
  let squareOrderId = body.squareOrderId ?? null;
  let squarePaymentId = body.squarePaymentId ?? null;

  if (encounter.sale_id && admin) {
    const { data: payment } = await admin
      .from("sale_payments")
      .select("square_order_id, square_payment_id, status")
      .eq("sale_id", encounter.sale_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (payment) {
      squareOrderId = squareOrderId || payment.square_order_id;
      squarePaymentId = squarePaymentId || payment.square_payment_id;
    }
  }

  const result = await markClinicEncounterPaid(id, {
    paymentMethod: "terminal",
    squareOrderId,
    squarePaymentId,
    sentBy: auth.user.email,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, encounter: result.row });
}
