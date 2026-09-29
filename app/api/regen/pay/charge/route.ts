import { NextRequest, NextResponse } from "next/server";

import { isBluefinChargeConfigured, payconexSaleWithEtoken } from "@/lib/bluefin-payconex";
import { parsePatientFromOrderNotes } from "@/lib/regen/clinic-invoice";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Invoice system is unavailable." }, { status: 503 });
  }
  if (!isBluefinChargeConfigured()) {
    return NextResponse.json(
      { error: "Online pay is not connected. Call (630) 636-6193." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    orderNumber?: string;
    eToken?: string;
  };
  const orderNumber = String(body.orderNumber || "").trim();
  const eToken = String(body.eToken || "").trim();
  if (!orderNumber || !eToken) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("regen_orders")
    .select("id, order_number, notes, amount_cents, customer_name, customer_email, customer_phone, status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const status = String(order.status || "");
  if (status === "paid" || status === "sent_to_pharmacy" || status === "shipped") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  const amountUsd = Number(order.amount_cents || 0) / 100;
  if (!(amountUsd > 0)) {
    return NextResponse.json({ error: "This invoice has no amount yet." }, { status: 400 });
  }

  const parsed = parsePatientFromOrderNotes(String(order.notes || ""));
  const name = String(order.customer_name || parsed.name || "Patient").trim();
  const parts = name.split(/\s+/);

  const sale = await payconexSaleWithEtoken({
    eToken,
    amountUsd,
    orderNumber: String(order.order_number),
    firstName: parts[0] || "Patient",
    lastName: parts.slice(1).join(" ") || "REGEN",
    email: String(order.customer_email || parsed.email || "") || undefined,
    phone: String(order.customer_phone || "") || undefined,
  });

  if (!sale.ok) {
    return NextResponse.json({ error: sale.error }, { status: 402 });
  }

  const now = new Date().toISOString();
  const payNote = `PAYCONEX ${sale.transactionId}${sale.authCode ? ` · AUTH ${sale.authCode}` : ""}`;
  await supabase
    .from("regen_orders")
    .update({
      status: "paid",
      notes: `${String(order.notes || "").slice(0, 1400)} · ${payNote}`.slice(0, 1800),
      pharmacy_error: `Paid ${sale.transactionId}. Send to Formulation.`,
      updated_at: now,
    })
    .eq("id", order.id);

  await supabase.from("regen_order_status_history").insert({
    order_id: order.id,
    status: "paid",
    actor_type: "system",
    notes: payNote,
    metadata: { payment_id: sale.transactionId, processor: "bluefin-payconex" },
  });

  return NextResponse.json({ ok: true, transactionId: sale.transactionId });
}
