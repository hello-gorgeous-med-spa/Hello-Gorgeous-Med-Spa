/**
 * Interim Square → consents bridge.
 * Hub staff pick a Square booking → ensure HG client + appointment + packets → kiosk URL.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

import { createKioskConsentSession } from "@/lib/kiosk/create-kiosk-session";
import { getConsentForm, type ConsentFormType } from "@/lib/hgos/consent-forms";
import { phoneLast10 } from "@/lib/checkin-lookup";
import {
  resolveHubSquareBookingsToken,
  hubSquareApiBase,
  HUB_SQUARE_API_VERSION,
} from "@/lib/hub/square-hub-token";

/** Core protection pack for walk-in / Square-booked visits (matches door plaque trust). */
export const SQUARE_INTERIM_CONSENT_FORM_IDS: ConsentFormType[] = [
  "hipaa_authorization",
  "arbitration_agreement",
  "liability_waiver",
  "general_consent",
];

type SquareBooking = {
  id?: string;
  status?: string;
  start_at?: string;
  customer_id?: string;
  appointment_segments?: Array<{ duration_minutes?: number }>;
};

type SquareCustomer = {
  id?: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
};

export type SquareStartConsentsResult =
  | {
      ok: true;
      appointmentId: string;
      clientId: string;
      clientName: string;
      kioskUrl: string | null;
      wizardUrl: string | null;
      outstandingCount: number;
      packetsCreated: number;
      message: string;
    }
  | { ok: false; error: string; status: number };

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

function digitsOnly(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  return d.length >= 10 ? d.slice(-10) : d || null;
}

async function findOrCreateClient(
  admin: SupabaseClient,
  customer: SquareCustomer,
): Promise<{ id: string; name: string }> {
  const squareId = customer.id || null;
  const phone = digitsOnly(customer.phone_number);
  const first = (customer.given_name || "").trim() || "Guest";
  const last = (customer.family_name || "").trim() || "";
  const name = [first, last].filter(Boolean).join(" ");
  const email = customer.email_address?.trim() || null;

  if (squareId) {
    const { data: bySquare } = await admin
      .from("clients")
      .select("id, first_name, last_name")
      .eq("square_customer_id", squareId)
      .maybeSingle();
    if (bySquare?.id) {
      const patch: Record<string, unknown> = {};
      if (phone) patch.phone = phone;
      if (email) patch.email = email;
      if (Object.keys(patch).length) {
        await admin.from("clients").update(patch).eq("id", bySquare.id);
      }
      return {
        id: bySquare.id,
        name: [bySquare.first_name, bySquare.last_name].filter(Boolean).join(" ") || name,
      };
    }
  }

  if (phone) {
    const last10 = phoneLast10(phone) || phone;
    const { data: byPhone } = await admin
      .from("clients")
      .select("id, first_name, last_name, square_customer_id")
      .ilike("phone", `%${last10}%`)
      .limit(2);
    if (byPhone?.length === 1) {
      const row = byPhone[0];
      const patch: Record<string, unknown> = {};
      if (squareId && !row.square_customer_id) patch.square_customer_id = squareId;
      if (email) patch.email = email;
      if (Object.keys(patch).length) {
        await admin.from("clients").update(patch).eq("id", row.id);
      }
      return {
        id: row.id,
        name: [row.first_name, row.last_name].filter(Boolean).join(" ") || name,
      };
    }
  }

  const { data: created, error } = await admin
    .from("clients")
    .insert({
      square_customer_id: squareId,
      first_name: first,
      last_name: last || null,
      phone: phone,
      email: email,
      source: "square",
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message || "Could not create client from Square customer");
  }
  return { id: created.id, name };
}

async function findOrCreateAppointment(
  admin: SupabaseClient,
  opts: {
    clientId: string;
    bookingId: string;
    startsAt: string;
    durationMinutes: number;
    serviceLabel: string;
  },
): Promise<{ id: string; created: boolean }> {
  const { data: byBooking } = await admin
    .from("appointments")
    .select("id")
    .eq("square_booking_id", opts.bookingId)
    .maybeSingle();

  if (byBooking?.id) {
    return { id: byBooking.id, created: false };
  }

  const start = new Date(opts.startsAt);
  const end = new Date(start.getTime() + Math.max(15, opts.durationMinutes) * 60_000);
  const windowStart = new Date(start.getTime() - 2 * 60_000).toISOString();
  const windowEnd = new Date(start.getTime() + 2 * 60_000).toISOString();

  const { data: nearRows } = await admin
    .from("appointments")
    .select("id, square_booking_id")
    .eq("client_id", opts.clientId)
    .gte("starts_at", windowStart)
    .lte("starts_at", windowEnd)
    .neq("status", "cancelled")
    .limit(1);
  const near = nearRows?.[0];

  if (near?.id) {
    if (!near.square_booking_id) {
      await admin
        .from("appointments")
        .update({ square_booking_id: opts.bookingId })
        .eq("id", near.id);
    }
    return { id: near.id, created: false };
  }

  const { data: created, error } = await admin
    .from("appointments")
    .insert({
      client_id: opts.clientId,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      status: "confirmed",
      booking_source: "square",
      square_booking_id: opts.bookingId,
      client_notes: `Square booking ${opts.bookingId} · ${opts.serviceLabel}`,
      consent_signed: false,
    })
    .select("id")
    .single();

  if (error || !created) {
    // Column may not exist yet in some envs — retry without square_booking_id
    if (error?.message?.includes("square_booking_id")) {
      const { data: fallback, error: err2 } = await admin
        .from("appointments")
        .insert({
          client_id: opts.clientId,
          starts_at: start.toISOString(),
          ends_at: end.toISOString(),
          status: "confirmed",
          booking_source: "square",
          client_notes: `Square booking ${opts.bookingId} · ${opts.serviceLabel}`,
          consent_signed: false,
        })
        .select("id")
        .single();
      if (err2 || !fallback) {
        throw new Error(err2?.message || error.message || "Could not create appointment");
      }
      return { id: fallback.id, created: true };
    }
    throw new Error(error?.message || "Could not create appointment");
  }

  return { id: created.id, created: true };
}

async function ensureConsentPackets(
  admin: SupabaseClient,
  clientId: string,
  appointmentId: string,
): Promise<{ created: number; wizardToken: string | null; outstanding: number }> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data: signed } = await admin
    .from("consent_packets")
    .select("template_name, status, signed_at")
    .eq("client_id", clientId)
    .eq("status", "signed")
    .gte("signed_at", oneYearAgo.toISOString());

  const signedNames = new Set((signed || []).map((s) => (s.template_name || "").toLowerCase()));

  const { data: existingOpen } = await admin
    .from("consent_packets")
    .select("id, template_name, status, wizard_token")
    .eq("appointment_id", appointmentId)
    .not("status", "in", '("signed","voided","expired")');

  const openNames = new Set(
    (existingOpen || []).map((p) => (p.template_name || "").toLowerCase()),
  );

  let wizardToken =
    existingOpen?.find((p) => p.wizard_token)?.wizard_token ||
    crypto.randomBytes(32).toString("base64url");
  const wizardExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const toCreate = [];
  for (const formId of SQUARE_INTERIM_CONSENT_FORM_IDS) {
    const form = getConsentForm(formId);
    if (!form) continue;
    const nameKey = form.name.toLowerCase();
    if (signedNames.has(nameKey) || openNames.has(nameKey)) continue;
    toCreate.push({
      client_id: clientId,
      appointment_id: appointmentId,
      template_id: null,
      template_name: form.name,
      template_version: Number.parseInt(String(form.version), 10) || 1,
      template_content: {
        formId: form.id,
        content: form.content,
        name: form.name,
      },
      status: "draft",
      wizard_token: wizardToken,
      wizard_expires_at: wizardExpiresAt.toISOString(),
    });
  }

  let created = 0;
  if (toCreate.length) {
    const { data: inserted, error } = await admin.from("consent_packets").insert(toCreate).select("id");
    if (error) {
      throw new Error(error.message || "Failed to create consent packets");
    }
    created = inserted?.length || 0;

    for (const packet of inserted || []) {
      await admin.from("consent_events").insert({
        packet_id: packet.id,
        event: "created",
        actor_type: "system",
        meta: { source: "square_hub_interim", appointment_id: appointmentId },
      });
    }
  }

  const { count } = await admin
    .from("consent_packets")
    .select("id", { count: "exact", head: true })
    .eq("appointment_id", appointmentId)
    .not("status", "in", '("signed","voided","expired")');

  const outstanding = count ?? 0;
  if (outstanding === 0) {
    return { created, wizardToken: null, outstanding: 0 };
  }

  // Best-effort SMS/wizard token row (kiosk token is created separately)
  await admin.from("appointment_consent_tokens").insert({
    appointment_id: appointmentId,
    client_id: clientId,
    token: wizardToken,
    token_type: "sms",
    expires_at: wizardExpiresAt.toISOString(),
    is_valid: true,
  });

  return { created, wizardToken, outstanding };
}

export async function startConsentsFromSquareBooking(
  admin: SupabaseClient,
  bookingId: string,
  origin: string,
): Promise<SquareStartConsentsResult> {
  const resolved = await resolveHubSquareBookingsToken();
  if ("error" in resolved) {
    return { ok: false, error: resolved.error, status: 503 };
  }

  const { res, json } = await squareGet(`/v2/bookings/${bookingId}`, resolved.token);
  if (!res.ok) {
    return {
      ok: false,
      error: json?.errors?.[0]?.detail || "Could not load Square booking",
      status: 404,
    };
  }

  const booking = json.booking as SquareBooking | undefined;
  if (!booking?.id || !booking.start_at) {
    return { ok: false, error: "Square booking is missing start time", status: 400 };
  }
  if (
    booking.status === "CANCELLED_BY_SELLER" ||
    booking.status === "CANCELLED_BY_CUSTOMER" ||
    booking.status === "DECLINED"
  ) {
    return { ok: false, error: "This Square booking is cancelled", status: 400 };
  }

  let customer: SquareCustomer = {};
  if (booking.customer_id) {
    const cust = await squareGet(`/v2/customers/${booking.customer_id}`, resolved.token);
    if (cust.res.ok) customer = cust.json.customer || {};
  }

  let client: { id: string; name: string };
  try {
    client = await findOrCreateClient(admin, {
      ...customer,
      id: booking.customer_id || customer.id,
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Client create failed",
      status: 500,
    };
  }

  const duration =
    booking.appointment_segments?.[0]?.duration_minutes ||
    booking.appointment_segments?.reduce((n, s) => n + (s.duration_minutes || 0), 0) ||
    60;

  let appointment: { id: string; created: boolean };
  try {
    appointment = await findOrCreateAppointment(admin, {
      clientId: client.id,
      bookingId: booking.id,
      startsAt: booking.start_at,
      durationMinutes: duration,
      serviceLabel: "Square appointment",
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Appointment create failed",
      status: 500,
    };
  }

  let packets: { created: number; wizardToken: string | null; outstanding: number };
  try {
    packets = await ensureConsentPackets(admin, client.id, appointment.id);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Consent packet create failed",
      status: 500,
    };
  }

  if (packets.outstanding === 0) {
    return {
      ok: true,
      appointmentId: appointment.id,
      clientId: client.id,
      clientName: client.name,
      kioskUrl: null,
      wizardUrl: null,
      outstandingCount: 0,
      packetsCreated: packets.created,
      message: "All core consent forms are already signed for this client (within 12 months).",
    };
  }

  const kiosk = await createKioskConsentSession(admin, appointment.id, {
    staffUserId: null,
    source: "staff",
  });

  const kioskUrl = kiosk.ok ? `${origin}${kiosk.path}` : null;
  const wizardUrl = packets.wizardToken
    ? `${origin}/consents/wizard/${packets.wizardToken}`
    : null;

  if (!kiosk.ok && !wizardUrl) {
    return {
      ok: false,
      error: kiosk.ok === false ? kiosk.message : "Could not create kiosk session",
      status: 500,
    };
  }

  return {
    ok: true,
    appointmentId: appointment.id,
    clientId: client.id,
    clientName: client.name,
    kioskUrl,
    wizardUrl,
    outstandingCount: packets.outstanding,
    packetsCreated: packets.created,
    message: kioskUrl
      ? `Ready — open kiosk for ${client.name} (${packets.outstanding} form${packets.outstanding === 1 ? "" : "s"}).`
      : `Packets ready — use wizard link for ${client.name}.`,
  };
}
