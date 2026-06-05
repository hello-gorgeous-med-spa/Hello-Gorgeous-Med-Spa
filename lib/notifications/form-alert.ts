import {
  getContactFormToEmail,
  getResendFromAddress,
  isResendBlockedAddressDomain,
} from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";

const OWNER_CELL =
  process.env.FORM_ALERT_PHONE?.trim() ||
  process.env.REVIEW_ALERT_PHONE?.trim() ||
  "+16308813398";

function truncate(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

/**
 * SMS the owner when a public website form is submitted (Twilio).
 * Fire-and-forget — never blocks the HTTP response.
 */
export function notifyOwnerFormSubmission(opts: {
  formName: string;
  lines: string[];
}): void {
  const body = truncate(
    ["HG website form", opts.formName, ...opts.lines.filter(Boolean)].join("\n"),
    1500
  );
  void sendSms(OWNER_CELL, body).then((r) => {
    if (!r.success) {
      console.warn("[form-alert] owner SMS not sent:", r.error || "unknown");
    }
  });
}

/** Email staff inbox via Resend when configured. */
export async function emailStaffFormSubmission(opts: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const toEmail = getContactFormToEmail();
  const fromAddress = getResendFromAddress();
  const replyTo = opts.replyTo?.trim();
  const payload: Record<string, unknown> = {
    from: fromAddress,
    to: [toEmail],
    subject: opts.subject,
    text: opts.text,
  };
  if (replyTo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo) && !isResendBlockedAddressDomain(replyTo)) {
    payload.reply_to = replyTo;
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
    console.error("[form-alert] Resend failed:", res.status, err);
    return false;
  }
  return true;
}

/** SMS + email in parallel; safe to call after DB persist. */
export async function alertStaffOnFormSubmission(opts: {
  formName: string;
  emailSubject: string;
  emailBody: string;
  smsLines: string[];
  replyTo?: string;
}): Promise<void> {
  notifyOwnerFormSubmission({ formName: opts.formName, lines: opts.smsLines });
  await emailStaffFormSubmission({
    subject: opts.emailSubject,
    text: opts.emailBody,
    replyTo: opts.replyTo,
  }).catch((e) => console.error("[form-alert] email error:", e));
}
