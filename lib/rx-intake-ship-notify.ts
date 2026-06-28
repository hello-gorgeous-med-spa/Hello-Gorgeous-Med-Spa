/**
 * Patient SMS when an online RX intake is marked sent to pharmacy.
 */

import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";

export async function notifyPatientIntakeRxShipped(opts: {
  phone: string | null | undefined;
  patientName: string;
  intakeRef?: string | null;
  staffNotes?: string | null;
  track?: "glp1" | "peptide" | "unknown";
}): Promise<{ ok: boolean; error?: string }> {
  const phone = String(opts.phone || "").trim();
  if (!phone) return { ok: false, error: "No phone on file" };

  const first = opts.patientName.split(/\s+/)[0] || "there";
  const medLabel =
    opts.track === "peptide" ? "peptide protocol" : "prescription";

  const notes = opts.staffNotes?.trim() || "";
  const trackingMatch = notes.match(
    /(?:tracking|track(?:ing)?\s*#?)\s*[:#]?\s*([A-Z0-9]{8,})/i,
  );
  const trackingLine = trackingMatch
    ? `Tracking: ${trackingMatch[1]}`
    : notes.length > 0 && notes.length < 120
      ? notes
      : null;

  const portalLine = `${SITE.url}/portal/rx`;

  const lines = [
    `Hi ${first}! ${SITE.name} — your ${medLabel} order${opts.intakeRef ? ` (${opts.intakeRef})` : ""} has shipped.`,
    trackingLine,
    `Track status: ${portalLine}`,
    "Questions? Call us or reply STOP to opt out.",
  ].filter(Boolean);

  const result = await sendSms(phone, lines.join(" "));
  return result.success ? { ok: true } : { ok: false, error: result.error };
}
