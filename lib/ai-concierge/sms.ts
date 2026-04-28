import { SITE } from "@/lib/seo";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { normalizeToE164 } from "@/lib/phone-e164";
import type { BookingToolInput } from "@/lib/ai-concierge/db";

function staffSmsDestination(): string | null {
  const raw =
    process.env.AI_CONCIERGE_STAFF_PHONE_E164 ??
    process.env.AI_CONCIERGE_NOTIFY_SMS ??
    "+16308813398";
  return normalizeToE164(raw);
}

/** SMS Dani / staff when a booking request is collected on the phone. */
export async function sendBookingSmsToStaff(
  booking: BookingToolInput,
  opts?: { recordingUrl?: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const to = staffSmsDestination();
  if (!to) return { ok: false, error: "AI_CONCIERGE_STAFF_PHONE_E164 not configured" };

  const pref =
    [booking.preferred_date, booking.preferred_time].filter(Boolean).join(" ").trim() || "Not specified";

  const lines = [
    `${SITE.name} — NEW booking request (AI concierge)`,
    "",
    `Name: ${booking.client_name}`,
    `Phone: ${booking.client_phone}`,
    `Service: ${booking.service}`,
    `Preferred: ${pref}`,
    `New client: ${booking.is_new_client === false ? "No / unsure" : "Yes / unsure"}`,
  ];
  if (opts?.recordingUrl) lines.push("", `Recording: ${opts.recordingUrl}`);

  lines.push("", "Reply or text the client from your secure workflow.");

  const body = lines.join("\n");
  const result = await sendSms(to, body);
  if (!result.success) return { ok: false, error: result.error };
  return { ok: true };
}
