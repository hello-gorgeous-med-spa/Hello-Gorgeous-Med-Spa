/**
 * Email / SMS for staff-sent membership payment links.
 */

import { getResendFromAddress, isResendBlockedAddressDomain } from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";

export async function emailClientMembershipLink(opts: {
  to: string;
  clientName: string;
  planName: string;
  priceLabel: string;
  url: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Email not configured (RESEND_API_KEY missing)" };
  }

  const to = opts.to.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { ok: false, error: "Invalid email address" };
  }

  const greeting = opts.clientName.trim() || "there";
  const text = [
    `Hi ${greeting},`,
    "",
    `Here is your secure membership checkout link from ${SITE.name}:`,
    `${opts.planName} — ${opts.priceLabel}`,
    "",
    opts.url,
    "",
    "Hosted by Square. Questions? Reply to this email or call us.",
    "",
    SITE.name,
    SITE.phone,
  ].join("\n");

  const html = `
    <p>Hi ${greeting},</p>
    <p>Your membership checkout link from <strong>${SITE.name}</strong>:</p>
    <p><strong>${opts.planName}</strong> — ${opts.priceLabel}</p>
    <p><a href="${opts.url}">Join securely with Square</a></p>
    <p>Questions? Call ${SITE.phone}.</p>
  `;

  const payload: Record<string, unknown> = {
    from: getResendFromAddress(),
    to: [to],
    subject: `${SITE.name} — ${opts.planName} membership`,
    text,
    html,
  };

  if (!isResendBlockedAddressDomain(to)) {
    payload.reply_to = to;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { ok: false, error: "Failed to send email" };
  }
  return { ok: true };
}

export async function smsClientMembershipLink(opts: {
  phone: string;
  clientName: string;
  planName: string;
  priceLabel: string;
  url: string;
}): Promise<{ ok: boolean; error?: string }> {
  const name = opts.clientName.trim() || "there";
  const message = `Hello Gorgeous Med Spa: Hi ${name}! Join ${opts.planName} (${opts.priceLabel}): ${opts.url}`;
  const result = await sendSms(opts.phone, message);
  if (!result.success) {
    return { ok: false, error: result.error || "Failed to send text" };
  }
  return { ok: true };
}
