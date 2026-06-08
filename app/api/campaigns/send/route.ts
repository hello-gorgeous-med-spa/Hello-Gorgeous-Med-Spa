// ============================================================
// CAMPAIGN SEND API — queues campaign; cron sends in batches
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import { fetchCampaignRecipients, processCampaignBatch } from "@/lib/campaign-processor";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { isTwilioConfigured } from "@/lib/hgos/twilio-config";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface SendBody {
  name: string;
  channel: "email" | "sms" | "multichannel";
  subject?: string;
  previewText?: string;
  emailHtml?: string;
  smsContent?: string;
  audienceSegment: string;
  schedule?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendBody = await request.json();
    const { name, channel, subject, previewText, emailHtml, smsContent, audienceSegment, schedule } = body;

    if (!name || !channel) {
      return NextResponse.json({ error: "name and channel are required" }, { status: 400 });
    }
    if ((channel === "email" || channel === "multichannel") && !emailHtml) {
      return NextResponse.json({ error: "emailHtml required for email campaigns" }, { status: 400 });
    }
    if ((channel === "sms" || channel === "multichannel") && !smsContent) {
      return NextResponse.json({ error: "smsContent required for SMS campaigns" }, { status: 400 });
    }
    if ((channel === "email" || channel === "multichannel") && !process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Resend not configured. Add RESEND_API_KEY env var." }, { status: 500 });
    }
    if ((channel === "sms" || channel === "multichannel") && !isTwilioConfigured()) {
      return NextResponse.json(
        {
          error:
            "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER.",
        },
        { status: 500 },
      );
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const recipients = await fetchCampaignRecipients(supabase);
    const emailRecipients = recipients.length;
    const smsRecipients = recipients.filter((r) => r.acceptsSms && r.phone).length;

    const totalRecipients =
      channel === "email"
        ? emailRecipients
        : channel === "sms"
          ? smsRecipients
          : new Set(recipients.map((r) => r.email)).size;

    if (totalRecipients === 0) {
      return NextResponse.json(
        { error: "No opted-in recipients with valid email addresses found" },
        { status: 400 },
      );
    }

    const campaignStatus = schedule ? "scheduled" : "queued";
    const { data: campaign, error: insertErr } = await supabase
      .from("campaigns")
      .insert({
        name,
        channel,
        status: campaignStatus,
        subject: subject || null,
        preview_text: previewText || null,
        email_html: emailHtml || null,
        sms_content: smsContent || null,
        audience_segment: audienceSegment || "all-clients",
        total_recipients: totalRecipients,
        audience_filters: { sendCursor: 0 },
        scheduled_at: schedule || null,
        started_at: schedule ? null : new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertErr || !campaign) {
      console.error("Campaign insert error:", insertErr);
      return NextResponse.json({ error: "Failed to save campaign" }, { status: 500 });
    }

    if (schedule) {
      return NextResponse.json({
        success: true,
        campaignId: campaign.id,
        status: "scheduled",
        scheduledAt: schedule,
        totalRecipients,
        emailRecipients,
        smsRecipients,
      });
    }

    // Kick off first batch in this request (cron continues the rest).
    const firstBatch = await processCampaignBatch(supabase, campaign, { emailBatchSize: 40 });

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      status: firstBatch.done ? "sent" : "sending",
      totalRecipients,
      emailRecipients,
      smsRecipients,
      firstBatch,
      message: firstBatch.done
        ? `Campaign sent to ${totalRecipients} recipients.`
        : `Campaign queued — sending in batches (${firstBatch.emailSent} sent this pass). Cron will finish the rest.`,
    });
  } catch (error) {
    console.error("Campaign send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
