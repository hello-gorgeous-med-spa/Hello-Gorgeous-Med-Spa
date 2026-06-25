/**
 * Email / SMS delivery for staff-sent RX payment links.
 */

import { getResendFromAddress, isResendBlockedAddressDomain } from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";

export async function emailClientRxPaymentLink(opts: {
  to: string;
  clientName: string;
  itemName: string;
  amountUsd: number;
  url: string;
  staffNote?: string;
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
  const amount = `$${opts.amountUsd.toFixed(2)}`;
  const noteBlock = opts.staffNote?.trim()
    ? `\n\nNote from our team:\n${opts.staffNote.trim()}`
    : "";

  const text = [
    `Hi ${greeting},`,
    "",
    `Here is your secure payment link from ${SITE.name} for:`,
    `${opts.itemName} — ${amount}`,
    "",
    opts.url,
    "",
    "This link is hosted by Square. If you have questions, reply to this email or text us.",
    noteBlock,
    "",
    SITE.name,
    SITE.phone,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p>Hi ${greeting},</p>
    <p>Here is your secure payment link from <strong>${SITE.name}</strong>:</p>
    <p><strong>${opts.itemName}</strong> — ${amount}</p>
    <p><a href="${opts.url}">Pay securely with Square</a></p>
    ${opts.staffNote?.trim() ? `<p><em>Note from our team:</em> ${opts.staffNote.trim()}</p>` : ""}
    <p>Questions? Reply to this email or call ${SITE.phone}.</p>
  `;

  const payload: Record<string, unknown> = {
    from: getResendFromAddress(),
    to: [to],
    subject: `${SITE.name} — payment link (${amount})`,
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
    const err = await res.json().catch(() => ({}));
    console.error("[rx-invoice-notify] Resend failed:", res.status, err);
    return { ok: false, error: "Failed to send email" };
  }

  return { ok: true };
}

export async function smsClientRxPaymentLink(opts: {
  phone: string;
  clientName: string;
  itemName: string;
  amountUsd: number;
  url: string;
}): Promise<{ ok: boolean; error?: string }> {
  const name = opts.clientName.trim() || "there";
  const amount = `$${opts.amountUsd.toFixed(2)}`;
  const message = `Hello Gorgeous Med Spa: Hi ${name}! Secure payment link for ${opts.itemName} (${amount}): ${opts.url}`;

  const result = await sendSms(opts.phone, message);
  if (!result.success) {
    return { ok: false, error: result.error || "Failed to send text" };
  }
  return { ok: true };
}
