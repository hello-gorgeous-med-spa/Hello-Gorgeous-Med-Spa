import type { SupabaseClient } from "@supabase/supabase-js";
import { businessDayToISOBounds } from "@/lib/business-timezone";
import { getBusinessTodayDateString } from "@/lib/business-today";
import { normalizeToE164 } from "@/lib/phone-e164";

/** Last 10 digits for loose DB match (US-centric). */
export function phoneLast10(raw: string): string | null {
  const e164 = normalizeToE164(raw);
  if (!e164) return null;
  const d = e164.replace(/\D/g, "");
  if (d.length < 10) return null;
  return d.slice(-10);
}

export async function findClientsByPhoneLoose(
  admin: SupabaseClient,
  rawPhone: string,
): Promise<{ id: string; first_name: string | null; last_name: string | null; phone: string | null }[]> {
  const last10 = phoneLast10(rawPhone);
  if (!last10) return [];

  const { data, error } = await admin
    .from("clients")
    .select("id, first_name, last_name, phone")
    .ilike("phone", `%${last10}%`);

  if (error || !data?.length) return [];
  return data;
}

export async function checkInClientForToday(
  admin: SupabaseClient,
  clientId: string,
  displayName: string,
  phoneNorm: string | null,
): Promise<{
  ok: true;
  appointment_id: string | null;
  starts_at: string | null;
  already_checked_in?: boolean;
} | { ok: false; error: string; status: number }> {
  const dateOnly = getBusinessTodayDateString();
  const { startISO, endISO } = businessDayToISOBounds(dateOnly);

  const { data: apts, error } = await admin
    .from("appointments")
    .select("id, starts_at, checked_in_at, status")
    .eq("client_id", clientId)
    .gte("starts_at", startISO)
    .lt("starts_at", endISO)
    .neq("status", "cancelled")
    .order("starts_at", { ascending: true });

  if (error) {
    return { ok: false, error: error.message, status: 500 };
  }

  if (!apts?.length) {
    return { ok: false, error: "No appointment found for you today. See the front desk.", status: 404 };
  }

  const nextOpen = apts.find((a) => !a.checked_in_at) ?? apts[0];
  if (nextOpen.checked_in_at) {
    await admin.from("hg_checkins").insert({
      appointment_id: nextOpen.id,
      client_id: clientId,
      phone_normalized: phoneNorm,
      display_name: displayName,
      source: "qr_public",
    });
    return {
      ok: true,
      appointment_id: nextOpen.id,
      starts_at: nextOpen.starts_at,
      already_checked_in: true,
    };
  }

  const now = new Date().toISOString();
  await admin
    .from("appointments")
    .update({ checked_in_at: now })
    .eq("id", nextOpen.id);

  await admin.from("hg_checkins").insert({
    appointment_id: nextOpen.id,
    client_id: clientId,
    phone_normalized: phoneNorm,
    display_name: displayName,
    source: "qr_public",
  });

  return {
    ok: true,
    appointment_id: nextOpen.id,
    starts_at: nextOpen.starts_at,
  };
}
