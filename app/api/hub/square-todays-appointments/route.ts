import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import {
  resolveHubSquareToken,
  hubSquareApiBase,
  HUB_SQUARE_API_VERSION,
} from "@/lib/hub/square-hub-token";

type SquareBooking = {
  id?: string;
  status?: string;
  start_at?: string;
  customer_id?: string;
  location_id?: string;
  appointment_segments?: Array<{
    duration_minutes?: number;
    service_variation_id?: string;
    team_member_id?: string;
  }>;
};

type SquarePayment = {
  id?: string;
  status?: string;
  customer_id?: string;
  created_at?: string;
  total_money?: { amount?: number };
  note?: string;
};

type CatalogMap = Map<string, { name: string; priceCents: number }>;

const SQUARE_CALENDAR = "https://app.squareup.com/dashboard/appointments/calendar";

/** America/Chicago calendar day bounds as UTC Date objects. */
function chicagoDayBounds(now = new Date()): { start: Date; end: Date; label: string } {
  const label = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const offsetParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeZoneName: "shortOffset",
    hour: "2-digit",
  }).formatToParts(now);
  const tzName = offsetParts.find((p) => p.type === "timeZoneName")?.value || "GMT-5";
  const m = tzName.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/i);
  const offH = m ? Number(m[1]) : -5;
  const offM = m?.[2] ? Number(m[2]) : 0;
  const offsetMs = (offH * 60 + Math.sign(offH || 1) * offM) * 60_000;

  const [y, mo, d] = label.split("-").map(Number);
  const start = new Date(Date.UTC(y, mo - 1, d, 0, 0, 0) - offsetMs);
  const end = new Date(Date.UTC(y, mo - 1, d, 23, 59, 59, 999) - offsetMs);
  return { start, end, label };
}

async function squareGet(path: string, token: string) {
  const res = await fetch(`${hubSquareApiBase()}${path}`, {
    headers: {
      "Square-Version": HUB_SQUARE_API_VERSION,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

async function listBookings(token: string, start: Date, end: Date): Promise<SquareBooking[]> {
  const out: SquareBooking[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({
      start_at_min: start.toISOString(),
      start_at_max: end.toISOString(),
      limit: "100",
    });
    if (cursor) qs.set("cursor", cursor);
    const { res, json } = await squareGet(`/v2/bookings?${qs}`, token);
    if (!res.ok) {
      throw new Error(json?.errors?.[0]?.detail || json?.errors?.[0]?.code || "Bookings API error");
    }
    out.push(...(json.bookings || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

async function listPaymentsToday(token: string, start: Date): Promise<SquarePayment[]> {
  const out: SquarePayment[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({
      begin_time: start.toISOString(),
      limit: "100",
      sort_order: "DESC",
    });
    if (cursor) qs.set("cursor", cursor);
    const { res, json } = await squareGet(`/v2/payments?${qs}`, token);
    if (!res.ok) return out;
    out.push(...(json.payments || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

async function resolveServiceNames(token: string, variationIds: string[]): Promise<CatalogMap> {
  const map: CatalogMap = new Map();
  const unique = [...new Set(variationIds.filter(Boolean))];
  if (!unique.length) return map;

  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100);
    const post = await fetch(`${hubSquareApiBase()}/v2/catalog/batch-retrieve`, {
      method: "POST",
      headers: {
        "Square-Version": HUB_SQUARE_API_VERSION,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ object_ids: chunk, include_related_objects: true }),
      cache: "no-store",
    });
    const body = await post.json().catch(() => ({}));
    const objects = [...(body.objects || []), ...(body.related_objects || [])] as Array<{
      type?: string;
      id: string;
      item_data?: { name?: string };
      item_variation_data?: {
        item_id?: string;
        name?: string;
        price_money?: { amount?: number };
      };
    }>;
    const itemsById = new Map(objects.filter((o) => o.type === "ITEM").map((o) => [o.id, o]));
    for (const o of objects) {
      if (o.type !== "ITEM_VARIATION") continue;
      const item = itemsById.get(o.item_variation_data?.item_id || "");
      map.set(o.id, {
        name: item?.item_data?.name || o.item_variation_data?.name || "Service",
        priceCents: Number(o.item_variation_data?.price_money?.amount ?? 0),
      });
    }
  }
  return map;
}

async function customerNames(token: string, ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(ids.filter(Boolean))];
  for (const id of unique.slice(0, 40)) {
    const { res, json } = await squareGet(`/v2/customers/${id}`, token);
    if (!res.ok) continue;
    const c = json.customer;
    const name =
      [c?.given_name, c?.family_name].filter(Boolean).join(" ") || c?.company_name || "Guest";
    map.set(id, name);
  }
  return map;
}

/**
 * Hub: today's Square appointments with a best-effort unpaid flag
 * (no completed payment for that customer today, and service price > $0).
 */
export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const resolved = await resolveHubSquareToken();
  if ("error" in resolved) {
    return NextResponse.json({
      appointments: [],
      error: resolved.error,
      setupPath: resolved.setupPath,
      calendarUrl: SQUARE_CALENDAR,
    });
  }

  try {
    const { start, end, label } = chicagoDayBounds();
    const bookings = await listBookings(resolved.token, start, end);
    const payments = await listPaymentsToday(resolved.token, start);
    const paidCustomers = new Set(
      payments
        .filter((p) => p.status === "COMPLETED" && p.customer_id)
        .map((p) => p.customer_id as string),
    );

    const variationIds = bookings
      .map((b) => b.appointment_segments?.[0]?.service_variation_id)
      .filter(Boolean) as string[];
    const services = await resolveServiceNames(resolved.token, variationIds);
    const names = await customerNames(
      resolved.token,
      bookings.map((b) => b.customer_id || "").filter(Boolean),
    );

    const now = Date.now();
    const appointments = bookings
      .filter(
        (b) =>
          b.status !== "CANCELLED_BY_SELLER" &&
          b.status !== "CANCELLED_BY_CUSTOMER" &&
          b.status !== "DECLINED",
      )
      .map((b) => {
        const varId = b.appointment_segments?.[0]?.service_variation_id || "";
        const svc = services.get(varId);
        const priceCents = svc?.priceCents ?? 0;
        const startMs = b.start_at ? new Date(b.start_at).getTime() : 0;
        const pastStart = startMs > 0 && startMs < now;
        const hasPayment = !!(b.customer_id && paidCustomers.has(b.customer_id));
        // Flag after start time if no completed payment for this customer today
        const likelyUnpaid = priceCents > 0 && !hasPayment && pastStart;
        return {
          id: b.id,
          status: b.status,
          startAt: b.start_at,
          customerId: b.customer_id || null,
          customerName: (b.customer_id && names.get(b.customer_id)) || "Guest",
          serviceName: svc?.name || "Service",
          priceCents,
          likelyUnpaid,
          hasPaymentToday: hasPayment,
          locationId: b.location_id || null,
        };
      })
      .sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)));

    const unpaid = appointments.filter((a) => a.likelyUnpaid);

    return NextResponse.json({
      date: label,
      appointments,
      unpaidCount: unpaid.length,
      totalCount: appointments.length,
      calendarUrl: SQUARE_CALENDAR,
      checkoutHint:
        "Check out from the appointment (Review and Check Out → Terminal). Do not open a blank POS sale.",
      connection: resolved.connection,
      note: "Unpaid is best-effort: no COMPLETED payment for that customer today + priced service. Prepaid $0 package visits are excluded.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        appointments: [],
        error: error instanceof Error ? error.message : "Square appointments fetch failed",
        calendarUrl: SQUARE_CALENDAR,
      },
      { status: 500 },
    );
  }
}
