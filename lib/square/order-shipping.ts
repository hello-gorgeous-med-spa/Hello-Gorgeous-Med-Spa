/**
 * Pull ship-to address from Square Orders (online checkout / payment links).
 */

import "server-only";

import { getAccessToken } from "@/lib/square/oauth";

const SQUARE_API_HOST =
  process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const SQUARE_API_VERSION = "2024-12-18";

export type SquareShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  recipientName?: string;
};

type SquareAddressLike = {
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  administrative_district_level_1?: string;
  postal_code?: string;
  country?: string;
};

function parseSquareAddress(
  raw: SquareAddressLike | null | undefined,
  recipientName?: string | null,
): SquareShippingAddress | null {
  if (!raw?.address_line_1?.trim()) return null;
  return {
    line1: raw.address_line_1.trim(),
    line2: raw.address_line_2?.trim() || undefined,
    city: raw.locality?.trim() || "",
    state: raw.administrative_district_level_1?.trim() || "",
    postalCode: raw.postal_code?.trim() || "",
    country: raw.country?.trim() || undefined,
    recipientName: recipientName?.trim() || undefined,
  };
}

export function formatSquareShippingAddress(addr: SquareShippingAddress | null | undefined): string {
  if (!addr?.line1) return "";
  const lines = [
    addr.recipientName,
    addr.line1,
    addr.line2,
    [addr.city, addr.state, addr.postalCode].filter(Boolean).join(", "),
    addr.country && addr.country !== "US" ? addr.country : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function formatSquareShippingAddressOneLine(addr: SquareShippingAddress | null | undefined): string {
  return formatSquareShippingAddress(addr).replace(/\n+/g, ", ");
}

async function squareFetch<T>(path: string): Promise<T | null> {
  let token: string | null = null;
  try {
    token = await getAccessToken();
  } catch {
    token = process.env.SQUARE_ACCESS_TOKEN || null;
  }
  if (!token) return null;

  const res = await fetch(`${SQUARE_API_HOST}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.warn("[square/order-shipping] Square API", res.status, path);
    return null;
  }

  return (await res.json().catch(() => null)) as T | null;
}

type SquareOrderPayload = {
  order?: {
    fulfillments?: Array<{
      type?: string;
      shipment_details?: {
        recipient?: {
          display_name?: string;
          address?: SquareAddressLike;
        };
      };
    }>;
  };
};

/** Read shipping address from a Square order (online checkout fulfillments). */
export async function fetchSquareOrderShippingAddress(
  orderId: string,
): Promise<SquareShippingAddress | null> {
  const id = orderId.trim();
  if (!id) return null;

  const data = await squareFetch<SquareOrderPayload>(`/v2/orders/${encodeURIComponent(id)}`);
  const fulfillments = data?.order?.fulfillments ?? [];

  for (const f of fulfillments) {
    if (f.type !== "SHIPMENT" && f.type !== "DELIVERY") continue;
    const recipient = f.shipment_details?.recipient;
    const parsed = parseSquareAddress(recipient?.address, recipient?.display_name);
    if (parsed) return parsed;
  }

  return null;
}

/** Retry — Square may attach fulfillments a moment after payment completes. */
export async function fetchSquareOrderShippingAddressWithRetry(
  orderId: string,
  opts?: { attempts?: number; delayMs?: number },
): Promise<SquareShippingAddress | null> {
  const attempts = opts?.attempts ?? 3;
  const delayMs = opts?.delayMs ?? 1200;

  for (let i = 0; i < attempts; i++) {
    const addr = await fetchSquareOrderShippingAddress(orderId);
    if (addr) return addr;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
}
