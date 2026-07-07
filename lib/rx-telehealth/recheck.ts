import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { rxTelehealthCadenceDays } from "@/lib/rx-telehealth/cadence";
import { isRxConsultServiceName } from "@/lib/rx-telehealth/requirement";

export type TelehealthRecheckStatus = {
  due: boolean;
  lastCompletedAt: string | null;
  daysSinceLast: number | null;
  cadenceDays: number;
};

function daysBetween(older: Date, newer: Date): number {
  return Math.floor((newer.getTime() - older.getTime()) / (24 * 60 * 60 * 1000));
}

async function lastFromTelehealthEvents(
  admin: SupabaseClient,
  clientId: string,
): Promise<string | null> {
  const { data } = await admin
    .from("hg_rx_telehealth_events")
    .select("completed_at")
    .eq("client_id", clientId)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.completed_at ? String(data.completed_at) : null;
}

async function lastFromAppointments(
  admin: SupabaseClient,
  clientId: string,
): Promise<string | null> {
  const { data: appts } = await admin
    .from("appointments")
    .select("starts_at, ends_at, status, service_id")
    .eq("client_id", clientId)
    .eq("status", "completed")
    .order("starts_at", { ascending: false })
    .limit(20);

  if (!appts?.length) return null;

  const serviceIds = [
    ...new Set(appts.map((a) => a.service_id).filter(Boolean) as string[]),
  ];
  const serviceNames = new Map<string, string>();
  if (serviceIds.length) {
    const { data: services } = await admin
      .from("services")
      .select("id, name")
      .in("id", serviceIds);
    for (const svc of services ?? []) {
      serviceNames.set(String(svc.id), String(svc.name || ""));
    }
  }

  for (const row of appts) {
    const name = row.service_id ? serviceNames.get(String(row.service_id)) ?? "" : "";
    if (!isRxConsultServiceName(name)) continue;
    const at = row.ends_at || row.starts_at;
    if (at) return String(at);
  }
  return null;
}

async function lastFromRegenOrders(
  admin: SupabaseClient,
  clientId: string,
): Promise<string | null> {
  const { data: client } = await admin
    .from("clients")
    .select("email, phone")
    .eq("id", clientId)
    .maybeSingle();
  if (!client) return null;

  const email = String(client.email || "").trim().toLowerCase();
  const phone = String(client.phone || "").replace(/\D/g, "").slice(-10);

  let query = admin
    .from("regen_orders")
    .select("telehealth_completed_at")
    .not("telehealth_completed_at", "is", null)
    .order("telehealth_completed_at", { ascending: false })
    .limit(1);

  if (email) {
    query = query.ilike("customer_email", email);
  } else if (phone) {
    query = query.ilike("customer_phone", `%${phone}`);
  } else {
    return null;
  }

  const { data } = await query.maybeSingle();
  return data?.telehealth_completed_at ? String(data.telehealth_completed_at) : null;
}

/** HGRX-061 — is a 90-day (configurable) NP telehealth recheck due for this client? */
export async function getTelehealthRecheckStatus(
  clientId: string,
  client?: SupabaseClient | null,
): Promise<TelehealthRecheckStatus> {
  const admin = client ?? getSupabaseAdminClient();
  const cadenceDays = rxTelehealthCadenceDays();
  const empty: TelehealthRecheckStatus = {
    due: true,
    lastCompletedAt: null,
    daysSinceLast: null,
    cadenceDays,
  };
  if (!admin || !clientId) return empty;

  const candidates = await Promise.all([
    lastFromTelehealthEvents(admin, clientId),
    lastFromAppointments(admin, clientId),
    lastFromRegenOrders(admin, clientId),
  ]);

  const timestamps = candidates.filter(Boolean) as string[];
  if (!timestamps.length) return empty;

  const lastCompletedAt = timestamps.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )[0];
  const last = new Date(lastCompletedAt);
  const daysSinceLast = daysBetween(last, new Date());

  return {
    due: daysSinceLast >= cadenceDays,
    lastCompletedAt,
    daysSinceLast,
    cadenceDays,
  };
}

export async function assertTelehealthRecheckClear(
  clientId: string,
  client?: SupabaseClient | null,
): Promise<{ ok: true } | { ok: false; error: string; bookingUrl?: string }> {
  const status = await getTelehealthRecheckStatus(clientId, client);
  if (!status.due) return { ok: true };

  const { HG_RX_TELEHEALTH_BOOKING_URL } = await import("@/lib/flows");
  return {
    ok: false,
    error: `NP telehealth recheck required — last visit was ${status.daysSinceLast ?? "unknown"} days ago (policy: every ${status.cadenceDays} days).`,
    bookingUrl: HG_RX_TELEHEALTH_BOOKING_URL,
  };
}
