/**
 * Email / SMS a Helcim invoice pay link. Server-only.
 */

import { getResendFromAddress, isResendBlockedAddressDomain } from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";

export async function emailHelcimInvoiceLink(opts: {
  to: string;
  clientName: string;
  itemName: string;
  amountUsd: number;
  url: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Email not configured." };

  const to = opts.to.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { ok: false, error: "Invalid email address" };
  }

  const greeting = opts.clientName.trim() || "there";
  const amount = `$${opts.amountUsd.toLocaleString("en-US")}`;
  const text = [
    `Hi ${greeting},`,
    "",
    `Here is your Hello Gorgeous invoice for ${opts.itemName} — ${amount}.`,
    "",
    "Pay in full, or enter a deposit to set up the balance:",
    opts.url,
    "",
    "Event-night pricing. Treatments are subject to clinical eligibility. Individual results vary. A payment is not a prescription.",
    "",
    SITE.name,
    SITE.phone,
  ].join("\n");

  const payload: Record<string, unknown> = {
    from: getResendFromAddress(),
    to: [to],
    subject: `${SITE.name} — invoice for ${opts.itemName} (${amount})`,
    text,
  };
  if (!isResendBlockedAddressDomain(to)) payload.reply_to = to;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return { ok: false, error: "Could not email the invoice." };
  }
  return { ok: true };
}

export async function smsHelcimInvoiceLink(opts: {
  phone: string;
  itemName: string;
  amountUsd: number;
  url: string;
}): Promise<{ ok: boolean; error?: string }> {
  const amount = `$${opts.amountUsd.toLocaleString("en-US")}`;
  const body = `Hello Gorgeous invoice: ${opts.itemName} ${amount}. Pay or set up here: ${opts.url}`;
  const sent = await sendSms(opts.phone, body);
  if (!sent.success) return { ok: false, error: sent.error || "SMS failed" };
  return { ok: true };
}
