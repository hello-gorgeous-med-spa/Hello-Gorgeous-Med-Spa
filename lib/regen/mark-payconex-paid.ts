import { getSupabase } from "@/lib/supabase-server";

export async function markRegenOrderPayconexPaid(input: {
  orderId: string;
  existingNotes?: string;
  transactionId: string;
  authCode?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const now = new Date().toISOString();
  const payNote = `PAYCONEX ${input.transactionId}${input.authCode ? ` · AUTH ${input.authCode}` : ""}`;
  await supabase
    .from("regen_orders")
    .update({
      status: "paid",
      payment_id: input.transactionId,
      notes: `${String(input.existingNotes || "").slice(0, 1400)} · ${payNote}`.slice(0, 1800),
      pharmacy_error: `Paid ${input.transactionId}. Send to Formulation.`,
      updated_at: now,
    })
    .eq("id", input.orderId);

  await supabase.from("regen_order_status_history").insert({
    order_id: input.orderId,
    status: "paid",
    actor_type: "system",
    notes: payNote,
    metadata: { payment_id: input.transactionId, processor: "bluefin-payconex" },
  });
}
