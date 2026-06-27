/**
 * Patient SMS when clinic RX medication ships.
 */

import { sendSms } from "@/lib/notifications/sms-outbound";
import type { RxClinicEncounterRow } from "@/lib/rx-clinic-encounter";

export async function notifyPatientClinicRxShipped(opts: {
  phone: string | null | undefined;
  patientName: string;
  carrier?: string | null;
  trackingNumber?: string | null;
  encounter: RxClinicEncounterRow;
}): Promise<{ ok: boolean; error?: string }> {
  const phone = String(opts.phone || "").trim();
  if (!phone) {
    return { ok: false, error: "No phone on file" };
  }

  const first = opts.patientName.split(/\s+/)[0] || "there";
  const tracking =
    opts.trackingNumber && opts.carrier
      ? `${opts.carrier} tracking ${opts.trackingNumber}`
      : opts.trackingNumber
        ? `Tracking ${opts.trackingNumber}`
        : null;

  const lines = [
    `Hi ${first}! Hello Gorgeous Med Spa here — your weight loss medication has shipped to your home.`,
    tracking,
    "Questions? Reply here or call us. Reply STOP to opt out.",
  ].filter(Boolean);

  const result = await sendSms(phone, lines.join(" "));
  return result.success ? { ok: true } : { ok: false, error: result.error };
}
