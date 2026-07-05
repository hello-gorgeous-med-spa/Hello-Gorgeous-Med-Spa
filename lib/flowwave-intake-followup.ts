/**
 * Auto follow-up to FlowWave landing leads — SMS + email with book link.
 */

import { BOOK_PAGE_PATH } from "@/lib/flows";
import {
  getResendFromAddress,
  isResendBlockedAddressDomain,
} from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";

const BOOK_URL = `${SITE.url.replace(/\/$/, "")}${BOOK_PAGE_PATH}`;

function firstName(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
}

function truncate(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

async function emailPatient(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  if (isResendBlockedAddressDomain(opts.to)) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[flowwave-followup] Resend failed:", res.status, err);
    return false;
  }
  return true;
}

/** Fire-and-forget patient SMS + email after a successful public intake. */
export function notifyFlowWaveLeadFollowUp(payload: {
  fullName: string;
  phone: string;
  email: string;
}): void {
  const name = firstName(payload.fullName);

  const sms = truncate(
    [
      `Hello Gorgeous Med Spa:`,
      `Hi ${name}! We received your FlowWave screening request.`,
      `Book your free NP screening: ${BOOK_URL}`,
      `Questions? ${SITE.phone}`,
    ].join(" "),
    1500,
  );

  void sendSms(payload.phone, sms).then((r) => {
    if (!r.success) {
      console.warn("[flowwave-followup] patient SMS not sent:", r.error || "unknown");
    }
  });

  const subject = "We received your FlowWave request — Hello Gorgeous Med Spa";
  const text = [
    `Hi ${name},`,
    ``,
    `Thank you for submitting your FlowWave screening request at Hello Gorgeous Med Spa.`,
    ``,
    `A nurse practitioner will review your information. When you're ready, book your free screening:`,
    BOOK_URL,
    ``,
    `Questions? Call us at ${SITE.phone} or reply to this email.`,
    ``,
    `${SITE.name}`,
    `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`,
  ].join("\n");

  const html = `
    <p>Hi ${name},</p>
    <p>Thank you for submitting your <strong>FlowWave</strong> screening request at Hello Gorgeous Med Spa.</p>
    <p>A nurse practitioner will review your information. When you're ready, book your free screening:</p>
    <p><a href="${BOOK_URL}" style="color:#E6007E;font-weight:bold;">Book your free NP screening →</a></p>
    <p>Questions? Call <a href="tel:${SITE.phone.replace(/\D/g, "")}">${SITE.phone}</a>.</p>
    <p style="color:#666;font-size:13px;margin-top:24px;">${SITE.name}<br/>${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}</p>
  `.trim();

  void emailPatient({ to: payload.email, subject, text, html }).catch((e) =>
    console.error("[flowwave-followup] email error:", e),
  );
}
