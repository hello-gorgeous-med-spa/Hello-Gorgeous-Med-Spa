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
        const personalizedHtml = htmlContent
          .replace(/\{\{first_name\}\}/g, recipient.firstName || "Friend")
          .replace(/\{\{last_name\}\}/g, recipient.lastName || "")
          .replace(/\{\{email\}\}/g, recipient.email)
          .replace(/\{\{unsubscribe_url\}\}/g, `https://hellogorgeousmedspa.com/unsubscribe?email=${encodeURIComponent(recipient.email)}`);

        const result = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: recipient.email,
          replyTo: replyTo,
          subject: subject,
          html: personalizedHtml,
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

      } catch (error: any) {
        console.error(`[Email Campaign] Error sending to ${recipient.email}:`, error);
        errors.push(`${recipient.email}: ${error.message}`);
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

  } catch (error: any) {
    console.error("[Email Campaign] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
