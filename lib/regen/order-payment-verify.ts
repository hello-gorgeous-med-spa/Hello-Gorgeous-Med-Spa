/**
 * Verify RE GEN Square payment before marking an order paid.
 */

import { getAccessToken } from "@/lib/square/oauth";

type SquarePaymentStatus = "COMPLETED" | "APPROVED" | "PENDING" | "CANCELED" | "FAILED";

function squareHost(): string {
  return process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

async function squareToken(): Promise<string | null> {
  try {
    return (await getAccessToken()) || process.env.SQUARE_ACCESS_TOKEN || null;
  } catch {
    return process.env.SQUARE_ACCESS_TOKEN || null;
  }
}

async function squareGet<T>(path: string): Promise<T | null> {
  const token = await squareToken();
  if (!token) return null;

  const res = await fetch(`${squareHost()}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": "2024-12-18",
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as T;
}

async function findSquareOrderIdByReference(reference: string): Promise<string | null> {
  const token = await squareToken();
  if (!token) return null;

  const res = await fetch(`${squareHost()}/v2/orders/search`, {
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

  return (data.orders ?? []).find((o) => o.reference_id === reference)?.id ?? null;
}

async function paymentIsCompleted(paymentId: string): Promise<boolean> {
  const data = await squareGet<{ payment?: { status?: SquarePaymentStatus } }>(
    `/v2/payments/${encodeURIComponent(paymentId)}`,
  );
  return data?.payment?.status === "COMPLETED";
}

export type RegenSquarePaymentVerification = {
  paid: boolean;
  paymentId?: string;
  squareOrderId?: string;
  reason?: string;
};

/**
 * Returns paid=true only when Square has a COMPLETED payment for this order.
 */
export async function verifyRegenSquarePayment(
  orderRef: string,
  existing?: { paymentId?: string | null; squareOrderId?: string | null },
): Promise<RegenSquarePaymentVerification> {
  if (existing?.paymentId) {
    const ok = await paymentIsCompleted(existing.paymentId);
    return ok
      ? { paid: true, paymentId: existing.paymentId, squareOrderId: existing.squareOrderId ?? undefined }
      : { paid: false, reason: "Stored payment_id is not COMPLETED in Square" };
  }

  let squareOrderId = existing?.squareOrderId?.trim() || null;
  if (!squareOrderId) {
    squareOrderId = await findSquareOrderIdByReference(orderRef);
  }
  if (!squareOrderId) {
    return { paid: false, reason: "No Square order linked to this RE GEN reference" };
  }

  const orderData = await squareGet<{
    order?: { state?: string; tenders?: Array<{ payment_id?: string }> };
  }>(`/v2/orders/${encodeURIComponent(squareOrderId)}`);

  const tenders = orderData?.order?.tenders ?? [];
  if (!tenders.length) {
    return {
      paid: false,
      squareOrderId,
      reason: "Square order exists but checkout was never completed (no payment tenders)",
    };
  }

  for (const tender of tenders) {
    const paymentId = tender.payment_id?.trim();
    if (!paymentId) continue;
    if (await paymentIsCompleted(paymentId)) {
      return { paid: true, paymentId, squareOrderId };
    }
  }

  return {
    paid: false,
    squareOrderId,
    reason: "Square order found but no COMPLETED payment",
  };
}

/** DB row is only considered financially settled when Square payment_id is on file. */
export function regenOrderPaymentVerified(order: {
  payment_id?: string | null;
}): boolean {
  return Boolean(order.payment_id?.trim());
}
