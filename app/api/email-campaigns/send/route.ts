import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

interface Recipient {
  email: string;
  firstName: string;
  lastName: string;
}

interface SendCampaignRequest {
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  htmlContent: string;
  recipients: Recipient[];
}

const SITE_ORIGIN = "https://www.hellogorgeousmedspa.com";

/** Plain-text fallback for multipart/alternative — improves spam scoring vs HTML-only. */
function htmlToPlainText(html: string): string {
  let t = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (t.length > 120_000) {
    t = `${t.slice(0, 120_000)}\n\n[Truncated]`;
  }
  return t;
}

function personalizeContent(template: string, recipient: Recipient, unsubscribeUrl: string): string {
  return template
    .replace(/\{\{first_name\}\}/g, recipient.firstName || "Friend")
    .replace(/\{\{last_name\}\}/g, recipient.lastName || "")
    .replace(/\{\{email\}\}/g, recipient.email)
    .replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl);
}

export async function POST(request: Request) {
  try {
    const body: SendCampaignRequest = await request.json();
    const { subject, fromName, fromEmail, replyTo, htmlContent, recipients } = body;

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No recipients provided" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { success: false, error: "Resend API key not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    console.log(`[Email Campaign] Sending to ${recipients.length} recipients`);

    for (const recipient of recipients) {
      try {
        const unsubscribeUrl = `${SITE_ORIGIN}/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
        const personalizedHtml = personalizeContent(htmlContent, recipient, unsubscribeUrl);
        const textBody = htmlToPlainText(personalizedHtml);
        const entityRefId = randomUUID();

        const result = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: recipient.email,
          replyTo: replyTo || undefined,
          subject: subject,
          html: personalizedHtml,
          text: textBody,
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            "X-Entity-Ref-ID": entityRefId,
          },
        });

        if (result.error) {
          console.error(`[Email Campaign] Failed to send to ${recipient.email}:`, result.error);
          errors.push(`${recipient.email}: ${result.error.message}`);
          failedCount++;
        } else {
          console.log(`[Email Campaign] Sent to ${recipient.email}`);
          sentCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[Email Campaign] Error sending to ${recipient.email}:`, error);
        errors.push(`${recipient.email}: ${message}`);
        failedCount++;
      }
    }

    console.log(`[Email Campaign] Complete: ${sentCount} sent, ${failedCount} failed`);

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      totalRecipients: recipients.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Email Campaign] Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
