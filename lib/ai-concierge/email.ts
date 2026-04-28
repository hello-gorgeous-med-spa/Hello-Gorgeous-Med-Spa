import { Resend } from "resend";
import { SITE } from "@/lib/seo";
import type { BookingToolInput } from "@/lib/ai-concierge/db";

function staffEmail(): string {
  return process.env.AI_CONCIERGE_STAFF_EMAIL?.trim() || SITE.email;
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${SITE.name} <onboarding@resend.dev>`
  );
}

export async function sendBookingEmailToStaff(
  booking: BookingToolInput,
  opts: { callSid: string; fromNumber: string; startedAt?: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[ai-concierge] RESEND_API_KEY missing — email skipped");
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const resend = new Resend(key);
  const pref =
    [booking.preferred_date, booking.preferred_time].filter(Boolean).join(" ").trim() || "Not specified";

  const dashboardUrl = `${SITE.url}/admin/ai-concierge/bookings`;

  const html = `
<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.5;color:#111">
<h2>New booking request — AI Concierge</h2>
<h3>Client</h3>
<ul>
  <li><strong>Name:</strong> ${escapeHtml(booking.client_name)}</li>
  <li><strong>Phone:</strong> ${escapeHtml(booking.client_phone)}</li>
  <li><strong>Service:</strong> ${escapeHtml(booking.service)}</li>
  <li><strong>Preferred time:</strong> ${escapeHtml(pref)}</li>
  <li><strong>New client:</strong> ${booking.is_new_client === false ? "No / unsure" : "Yes / unsure"}</li>
</ul>
<h3>Call</h3>
<ul>
  <li><strong>CallSid:</strong> ${escapeHtml(opts.callSid)}</li>
  <li><strong>From:</strong> ${escapeHtml(opts.fromNumber)}</li>
  <li><strong>Started:</strong> ${escapeHtml(opts.startedAt ?? "—")}</li>
</ul>
<p><a href="${dashboardUrl}">Open booking requests in admin</a></p>
</body></html>`;

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: staffEmail(),
    subject: `NEW booking — ${booking.client_name} — ${booking.service}`,
    html,
  });

  if (error) {
    console.error("[ai-concierge] Resend:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
