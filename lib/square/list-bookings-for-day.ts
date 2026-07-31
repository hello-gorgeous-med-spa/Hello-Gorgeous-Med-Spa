/**
 * Live Square Appointments (Bookings API) for a Chicago calendar day.
 * Used by Hub and Admin dashboard — Square is the scheduling source of truth.
 */
import {
  resolveHubSquareBookingsToken,
  resolveHubSquareBookingsTokenFallback,
  hubSquareApiBase,
  HUB_SQUARE_API_VERSION,
  type HubSquareTokenOk,
  type HubSquareTokenErr,
} from "@/lib/hub/square-hub-token";
import { SQUARE_STAFF_APPOINTMENTS_URL } from "@/lib/flows";

export type SquareDayBooking = {
  id: string;
  status: string;
  startAt: string | undefined;
  customerId: string | null;
  customerName: string;
  serviceName: string;
  priceCents: number;
  likelyUnpaid: boolean;
  hasPaymentToday: boolean;
  locationId: string | null;
  durationMinutes: number | null;
  teamMemberId: string | null;
};

export type SquareDayBookingsResult =
  | {
      ok: true;
      date: string;
      appointments: SquareDayBooking[];
      unpaidCount: number;
      totalCount: number;
      calendarUrl: string;
      connection: "oauth" | "env";
      note: string;
      checkoutHint: string;
    }
  | {
      ok: false;
      date?: string;
      appointments: [];
      error: string;
      setupPath?: string;
      calendarUrl: string;
    };

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
};

type CatalogMap = Map<string, { name: string; priceCents: number }>;

/** America/Chicago calendar day bounds as UTC Date objects. */
export function chicagoDayBounds(
  now = new Date(),
): { start: Date; end: Date; label: string } {
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

/** Parse YYYY-MM-DD as a Chicago calendar day (noon Chicago → correct DST offset). */
export function chicagoDayBoundsForDateLabel(dateLabel: string): {
  start: Date;
  end: Date;
  label: string;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateLabel.trim());
  if (!match) return chicagoDayBounds();
  const [, ys, mos, ds] = match;
  const probe = new Date(`${ys}-${mos}-${ds}T12:00:00-05:00`);
  return chicagoDayBounds(probe);
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

async function listPaymentsFrom(token: string, start: Date): Promise<SquarePayment[]> {
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
  const unique = Array.from(new Set(variationIds.filter(Boolean)));
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
  const unique = Array.from(new Set(ids.filter(Boolean)));
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

function mapSquareStatus(status: string | undefined): string {
  switch (status) {
    case "ACCEPTED":
      return "confirmed";
    case "PENDING":
      return "pending";
    case "CANCELLED_BY_SELLER":
    case "CANCELLED_BY_CUSTOMER":
    case "DECLINED":
      return "cancelled";
    case "NO_SHOW":
      return "no_show";
    default:
      return (status || "confirmed").toLowerCase();
  }
}

export function squareBookingDisplayStatus(status: string | undefined): string {
  return mapSquareStatus(status);
}

/**
 * Fetch non-cancelled Square bookings for today (or a YYYY-MM-DD Chicago day).
 */
export async function listSquareBookingsForDay(options?: {
  dateLabel?: string;
  tokenOverride?: HubSquareTokenOk | HubSquareTokenErr;
}): Promise<SquareDayBookingsResult> {
  const calendarUrl = SQUARE_STAFF_APPOINTMENTS_URL;
  const bounds = options?.dateLabel
    ? chicagoDayBoundsForDateLabel(options.dateLabel)
    : chicagoDayBounds();

  const resolved = options?.tokenOverride ?? (await resolveHubSquareBookingsToken());
  if ("error" in resolved) {
    return {
      ok: false,
      date: bounds.label,
      appointments: [],
      error: resolved.error,
      setupPath: resolved.setupPath,
      calendarUrl,
    };
  }

  try {
    let tokenInfo: HubSquareTokenOk = resolved;
    let bookings = await listBookings(tokenInfo.token, bounds.start, bounds.end);

    if (bookings.length === 0) {
      const fallback = await resolveHubSquareBookingsTokenFallback(tokenInfo);
      if (fallback) {
        const alt = await listBookings(fallback.token, bounds.start, bounds.end);
        if (alt.length > 0) {
          bookings = alt;
          tokenInfo = fallback;
        }
      }
    }

    const payments = await listPaymentsFrom(tokenInfo.token, bounds.start);
    const paidCustomers = new Set(
      payments
        .filter((p) => p.status === "COMPLETED" && p.customer_id)
        .map((p) => p.customer_id as string),
    );

    const variationIds = bookings
      .map((b) => b.appointment_segments?.[0]?.service_variation_id)
      .filter(Boolean) as string[];
    const services = await resolveServiceNames(tokenInfo.token, variationIds);
    const names = await customerNames(
      tokenInfo.token,
      bookings.map((b) => b.customer_id || "").filter(Boolean),
    );

    const now = Date.now();
    const appointments: SquareDayBooking[] = bookings
      .filter(
        (b) =>
          b.status !== "CANCELLED_BY_SELLER" &&
          b.status !== "CANCELLED_BY_CUSTOMER" &&
          b.status !== "DECLINED",
      )
      .map((b) => {
        const seg = b.appointment_segments?.[0];
        const varId = seg?.service_variation_id || "";
        const svc = services.get(varId);
        const priceCents = svc?.priceCents ?? 0;
        const startMs = b.start_at ? new Date(b.start_at).getTime() : 0;
        const pastStart = startMs > 0 && startMs < now;
        const hasPayment = !!(b.customer_id && paidCustomers.has(b.customer_id));
        const likelyUnpaid = priceCents > 0 && !hasPayment && pastStart;
        return {
          id: b.id || `unknown-${b.start_at}`,
          status: b.status || "ACCEPTED",
          startAt: b.start_at,
          customerId: b.customer_id || null,
          customerName: (b.customer_id && names.get(b.customer_id)) || "Guest",
          serviceName: svc?.name || "Service",
          priceCents,
          likelyUnpaid,
          hasPaymentToday: hasPayment,
          locationId: b.location_id || null,
          durationMinutes: seg?.duration_minutes ?? null,
          teamMemberId: seg?.team_member_id || null,
        };
      })
      .sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)));

    return {
      ok: true,
      date: bounds.label,
      appointments,
      unpaidCount: appointments.filter((a) => a.likelyUnpaid).length,
      totalCount: appointments.length,
      calendarUrl,
      connection: tokenInfo.connection,
      checkoutHint:
        "Check out from the appointment (Review and Check Out → Terminal). Do not open a blank POS sale.",
      note: "Live from Square Appointments. Unpaid is best-effort (no COMPLETED payment for that customer today + priced service).",
    };
  } catch (error) {
    return {
      ok: false,
      date: bounds.label,
      appointments: [],
      error: error instanceof Error ? error.message : "Square appointments fetch failed",
      calendarUrl,
    };
  }
}
