/**
 * Create a short-lived kiosk token for consent signing at /kiosk/consents/[token].
 * Used by staff API and by public self check-in (after phone verification).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

export function generateKioskToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export type KioskSessionOk = {
  ok: true;
  token: string;
  path: string;
  expiresAt: string;
  outstandingCount: number;
  templateNames: string[];
};

export type KioskSessionErr = {
  ok: false;
  code: "appointment_not_found" | "no_outstanding" | "db_error";
  message: string;
  outstandingCount: number;
};

export type KioskSessionResult = KioskSessionOk | KioskSessionErr;

export type KioskActorSource = "staff" | "self_checkin";

/**
 * @param supabase — service-role client
 */
export async function createKioskConsentSession(
  supabase: SupabaseClient,
  appointmentId: string,
  opts: { staffUserId: string | null; source: KioskActorSource },
): Promise<KioskSessionResult> {
  const { data: appointment, error: aptError } = await supabase
    .from("appointments")
    .select("id, client_id, service:services(name)")
    .eq("id", appointmentId)
    .single();

  if (aptError || !appointment) {
    return {
      ok: false,
      code: "appointment_not_found",
      message: "Appointment not found",
      outstandingCount: 0,
    };
  }

  const { data: packets, error: packetsError } = await supabase
    .from("consent_packets")
    .select("id, template_name, status")
    .eq("appointment_id", appointmentId)
    .not("status", "in", '("signed","voided","expired")');

  if (packetsError) {
    console.error("[kiosk] consent_packets", packetsError);
    return {
      ok: false,
      code: "db_error",
      message: "Failed to check consent forms",
      outstandingCount: 0,
    };
  }

  if (!packets?.length) {
    return {
      ok: false,
      code: "no_outstanding",
      message: "No outstanding consent forms for this appointment",
      outstandingCount: 0,
    };
  }

  const kioskToken = generateKioskToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await supabase
    .from("appointment_consent_tokens")
    .update({ is_valid: false })
    .eq("appointment_id", appointmentId)
    .eq("token_type", "kiosk");

  const { error: tokenError } = await supabase.from("appointment_consent_tokens").insert({
    appointment_id: appointmentId,
    client_id: appointment.client_id,
    token: kioskToken,
    token_type: "kiosk",
    expires_at: expiresAt.toISOString(),
    is_valid: true,
  });

  if (tokenError) {
    console.error("[kiosk] token insert", tokenError);
    return {
      ok: false,
      code: "db_error",
      message: "Failed to create kiosk session",
      outstandingCount: packets.length,
    };
  }

  const actorType = opts.source === "self_checkin" ? "system" : "staff";
  const metaKiosk = { kiosk_token: kioskToken, source: opts.source };

  for (const packet of packets) {
    await supabase.from("consent_events").insert({
      packet_id: packet.id,
      event: "kiosk_started",
      actor_type: actorType,
      actor_user_id: opts.staffUserId,
      meta: metaKiosk,
    });
  }

  return {
    ok: true,
    token: kioskToken,
    path: `/kiosk/consents/${kioskToken}`,
    expiresAt: expiresAt.toISOString(),
    outstandingCount: packets.length,
    templateNames: packets.map((p) => p.template_name).filter(Boolean) as string[],
  };
}
