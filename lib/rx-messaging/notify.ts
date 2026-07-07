import type { SupabaseClient } from "@supabase/supabase-js";

import { getResendFromAddress } from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { SITE } from "@/lib/seo";
import { rxMessagesHref, type RxMessageThread } from "@/lib/rx-secure-messages";

export type MessageNotifyChannel = "sms" | "email";

/** HGRX-081 — minimum-necessary alert (no clinical content in SMS/email body). */
export async function notifyPatientRxMessageAlert(
  thread: RxMessageThread,
  messageId: string,
  client?: SupabaseClient | null,
): Promise<{ sms?: string; email?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  const results: { sms?: string; email?: string } = {};

  const first = thread.patientName?.split(/\s+/)[0] || "there";
  const portalUrl = `${SITE.url}${rxMessagesHref(thread.intakeRef, thread.patientEmail)}`;

  const smsBody = [
    `Hi ${first}! You have a new secure message from ${SITE.name}.`,
    `View in your RX portal (not SMS): ${portalUrl}`,
    SITE.phone,
  ].join(" ");

  const emailSubject = `${SITE.name} — new secure message`;
  const emailText = [
    `Hi ${first},`,
    "",
    "Your care team sent you a secure message in the Hello Gorgeous RX patient portal.",
    "For your privacy, message content is not included in this email.",
    "",
    `Open your messages: ${portalUrl}`,
    "",
    SITE.name,
    SITE.phone,
  ].join("\n");

  if (thread.patientPhone?.trim()) {
    const smsRes = await sendSms(thread.patientPhone, smsBody);
    const status = smsRes.success ? "sent" : "failed";
    results.sms = status;
    if (admin) {
      await recordMessageNotification(admin, {
        messageId,
        threadId: thread.id,
        channel: "sms",
        status,
        error: smsRes.error,
      });
    }
  }

  const email = thread.patientEmail?.trim();
  if (email && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: getResendFromAddress(),
          to: email,
          subject: emailSubject,
          text: emailText,
        }),
      });
      const status = res.ok ? "sent" : "failed";
      results.email = status;
      if (admin) {
        const errBody = res.ok ? null : await res.text().catch(() => "email failed");
        await recordMessageNotification(admin, {
          messageId,
          threadId: thread.id,
          channel: "email",
          status,
          error: errBody,
        });
      }
    } catch (e) {
      results.email = "failed";
      if (admin) {
        await recordMessageNotification(admin, {
          messageId,
          threadId: thread.id,
          channel: "email",
          status: "failed",
          error: e instanceof Error ? e.message : "email error",
        });
      }
    }
  }

  return results;
}

async function recordMessageNotification(
  admin: SupabaseClient,
  input: {
    messageId: string;
    threadId: string;
    channel: MessageNotifyChannel;
    status: "sent" | "failed" | "skipped";
    error?: string | null;
  },
): Promise<void> {
  const { error } = await admin.from("hg_rx_message_notifications").insert({
    message_id: input.messageId,
    thread_id: input.threadId,
    channel: input.channel,
    status: input.status,
    error: input.error?.slice(0, 500) ?? null,
    sent_at: input.status === "sent" ? new Date().toISOString() : null,
  });
  if (error?.code === "42P01") return;
  if (error) console.warn("[rx-messaging/notify]", error.message);
}
