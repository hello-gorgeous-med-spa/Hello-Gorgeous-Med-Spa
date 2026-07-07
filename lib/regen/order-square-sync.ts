/**
 * Sync RE GEN order shipping address from Square after payment.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  fetchSquareOrderShippingAddressWithRetry,
  type SquareShippingAddress,
} from "@/lib/square/order-shipping";

export type RegenShippingAddressRow = SquareShippingAddress;

async function findSquareOrderIdByReference(reference: string): Promise<string | null> {
  const { getAccessToken } = await import("@/lib/square/oauth");
  const token = (await getAccessToken().catch(() => null)) || process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;

  const host =
    process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

  const res = await fetch(`${host}/v2/orders/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": "2024-12-18",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        filter: {
          state_filter: { states: ["OPEN", "COMPLETED"] },
        },
        sort: { sort_field: "CREATED_AT", sort_order: "DESC" },
      },
      limit: 100,
    }),
  });

  if (!res.ok) return null;

  const data = (await res.json().catch(() => ({}))) as {
    orders?: Array<{ id?: string; reference_id?: string }>;
  };

  const match = (data.orders ?? []).find((o) => o.reference_id === reference);
  return match?.id ?? null;
}

async function fetchSquareOrderReferenceId(orderId: string): Promise<string | null> {
  const { getAccessToken } = await import("@/lib/square/oauth");
  const token = (await getAccessToken().catch(() => null)) || process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;

  const host =
    process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

  const res = await fetch(`${host}/v2/orders/${encodeURIComponent(orderId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": "2024-12-18",
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;

  const data = (await res.json().catch(() => ({}))) as {
    order?: { reference_id?: string };
  };
  return data.order?.reference_id?.trim() || null;
}

async function linkRegenOrderBySquareOrderId(
  admin: SupabaseClient,
  squareOrderId: string,
): Promise<string | null> {
  const referenceId = await fetchSquareOrderReferenceId(squareOrderId);
  if (!referenceId?.startsWith("RG-")) return null;

  const { data, error } = await admin
    .from("regen_orders")
    .update({
      square_order_id: squareOrderId,
      updated_at: new Date().toISOString(),
    })
    .eq("reference", referenceId)
    .select("reference")
    .maybeSingle();

  if (error || !data?.reference) return null;
  return data.reference as string;
}

export async function syncRegenOrderShippingFromSquare(
  admin: SupabaseClient,
  orderRef: string,
  opts?: { squareOrderId?: string | null; retry?: boolean },
): Promise<{ ok: boolean; shippingAddress: SquareShippingAddress | null }> {
  const ref = orderRef.trim();
  if (!ref) return { ok: false, shippingAddress: null };

  let squareOrderId = opts?.squareOrderId?.trim() || null;

  if (!squareOrderId) {
    const { data } = await admin
      .from("regen_orders")
      .select("square_order_id, shipping_address")
      .eq("reference", ref)
      .maybeSingle();

    if (data?.shipping_address && typeof data.shipping_address === "object") {
      return {
        ok: true,
        shippingAddress: data.shipping_address as SquareShippingAddress,
      };
    }

    squareOrderId = (data?.square_order_id as string | null) ?? null;

    if (!squareOrderId) {
      squareOrderId = await findSquareOrderIdByReference(ref);
      if (squareOrderId) {
        await admin
          .from("regen_orders")
          .update({ square_order_id: squareOrderId, updated_at: new Date().toISOString() })
          .eq("reference", ref);
      }
    }
  }

  if (!squareOrderId) {
    return { ok: false, shippingAddress: null };
  }

  const shippingAddress = opts?.retry !== false
    ? await fetchSquareOrderShippingAddressWithRetry(squareOrderId)
    : await fetchSquareOrderShippingAddressWithRetry(squareOrderId, { attempts: 1 });

  if (!shippingAddress) {
    return { ok: false, shippingAddress: null };
  }

  const { error } = await admin
    .from("regen_orders")
    .update({
      shipping_address: shippingAddress,
      square_order_id: squareOrderId,
      updated_at: new Date().toISOString(),
    })
    .eq("reference", ref);

  if (error) {
    console.error("[regen/order-square-sync] update error:", error);
    return { ok: false, shippingAddress };
  }

  return { ok: true, shippingAddress };
}

/** Webhook helper — match paid Square payment to RE GEN order by square_order_id. */
export async function syncRegenShippingForSquarePayment(
  admin: SupabaseClient,
  payment: {
    order_id?: string | null;
    id?: string | null;
    status?: string | null;
    updated_at?: string | null;
  },
): Promise<{ synced: boolean; orderRef?: string; markedPaid?: boolean }> {
  const orderId = payment.order_id?.trim();
  if (!orderId) return { synced: false };

  let { data: order } = await admin
    .from("regen_orders")
    .select("reference, shipping_address, status, payment_id")
    .eq("square_order_id", orderId)
    .maybeSingle();

  if (!order?.reference) {
    const linked = await linkRegenOrderBySquareOrderId(admin, orderId);
    if (linked) {
      order = { reference: linked, shipping_address: null };
    }
  }

  if (!order?.reference) return { synced: false };

  const paymentCompleted = payment.status === "COMPLETED";
  let markedPaid = false;

  if (paymentCompleted && payment.id) {
    const paidUpdates: Record<string, unknown> = {
      payment_id: payment.id,
      square_order_id: orderId,
      updated_at: new Date().toISOString(),
    };
    if (order.status === "pending_payment" || !order.payment_id) {
      paidUpdates.status = "paid";
      paidUpdates.paid_at = payment.updated_at || new Date().toISOString();
      markedPaid = order.status === "pending_payment";
    }
    await admin.from("regen_orders").update(paidUpdates).eq("reference", order.reference);
  }

  if (order.shipping_address && typeof order.shipping_address === "object") {
    return { synced: true, orderRef: order.reference as string, markedPaid };
  }

  const result = await syncRegenOrderShippingFromSquare(admin, order.reference as string, {
    squareOrderId: orderId,
    retry: true,
  });

  if (payment.id && !paymentCompleted) {
    await admin
      .from("regen_orders")
      .update({ payment_id: payment.id, updated_at: new Date().toISOString() })
      .eq("reference", order.reference);
  }

  return { synced: result.ok, orderRef: order.reference as string, markedPaid };
}
