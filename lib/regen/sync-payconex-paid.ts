import { isBluefinChargeConfigured, payconexFindApprovedByCustomId } from "@/lib/bluefin-payconex";
import { markRegenOrderPayconexPaid } from "@/lib/regen/mark-payconex-paid";
import { getSupabase } from "@/lib/supabase-server";

const OPEN = ["pending", "processing", "awaiting_payment", "pharmacy_issue"];

export async function syncPayconexPaidOrders(opts?: { orderId?: string; orderNumber?: string }) {
  const supabase = getSupabase();
  if (!supabase) return { checked: 0, marked: 0, error: "Database not configured" };
  if (!isBluefinChargeConfigured()) {
    return { checked: 0, marked: 0, error: "PayConex API key is not on the server." };
  }

  let query = supabase
    .from("regen_orders")
    .select("id, order_number, notes, status")
    .in("status", OPEN)
    .order("created_at", { ascending: false })
    .limit(40);

  if (opts?.orderId) query = query.eq("id", opts.orderId);
  if (opts?.orderNumber) query = query.eq("order_number", opts.orderNumber);

  const { data: orders, error } = await query;
  if (error) return { checked: 0, marked: 0, error: error.message };

  let marked = 0;
  const hits: Array<{ orderNumber: string; transactionId: string }> = [];
  for (const order of orders || []) {
    const orderNumber = String(order.order_number || "").trim();
    if (!orderNumber) continue;
    const sale = await payconexFindApprovedByCustomId(orderNumber);
    if (!sale) continue;
    await markRegenOrderPayconexPaid({
      orderId: String(order.id),
      existingNotes: String(order.notes || ""),
      transactionId: sale.transactionId,
      authCode: sale.authCode,
    });
    marked += 1;
    hits.push({ orderNumber, transactionId: sale.transactionId });
  }

  return { checked: (orders || []).length, marked, hits };
}
