// ============================================================
// CAMPAIGN SEND API — queues campaign; cron sends in batches
// Text Studio: channel=sms → opt-in ledger + Messaging Service
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import { requireMarketingAccess } from "@/lib/api-auth";
import {
  fetchCampaignRecipients,
  processCampaignBatch,
  seedSmsCampaignRecipients,
} from "@/lib/campaign-processor";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { isTwilioConfigured } from "@/lib/hgos/twilio-config";
import { normalizeToE164 } from "@/lib/phone-e164";
import {
  ensureCustomSmsOptIns,
  fetchSmsStudioRecipients,
  resolveCustomSmsRecipients,
  SMS_STUDIO_BATCH_SIZE,
  SMS_STUDIO_THROTTLE_MS,
} from "@/lib/sms-studio";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface SendBody {
  name: string;
  channel: "email" | "sms" | "multichannel";
  subject?: string;
  previewText?: string;
  emailHtml?: string;
  smsContent?: string;
  audienceSegment?: string;
  schedule?: string;
  /** Custom phone list (SMS only) — must already be opted in unless confirmConsentAndOptIn */
  customPhones?: string[];
  /** Staff asserts prior SMS marketing consent; opt-in these custom numbers before send */
  confirmConsentAndOptIn?: boolean;
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  try {
    const body: SendBody = await request.json();
    const {
      name,
      channel,
      subject,
      previewText,
      emailHtml,
      smsContent,
      audienceSegment,
      schedule,
      customPhones,
      confirmConsentAndOptIn,
    } = body;

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
            "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_MESSAGING_SERVICE_SID (or TWILIO_PHONE_NUMBER).",
        },
        { status: 500 },
      );
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    let totalRecipients = 0;
    let emailRecipients = 0;
    let smsRecipients = 0;
    let skippedNotOptedIn = 0;
    let skippedInvalid = 0;
    let smsAudience: Awaited<ReturnType<typeof fetchSmsStudioRecipients>> = [];

    if (channel === "sms") {
      if (customPhones?.length) {
        if (confirmConsentAndOptIn) {
          await ensureCustomSmsOptIns(supabase, customPhones);
        }
        const resolved = await resolveCustomSmsRecipients(supabase, customPhones);
        smsAudience = resolved.recipients;
        skippedNotOptedIn = resolved.skippedNotOptedIn;
        skippedInvalid = resolved.skippedInvalid;

        // After staff opt-in, include any still-unmatched valid E.164s as ad-hoc recipients
        if (confirmConsentAndOptIn && skippedNotOptedIn > 0) {
          const have = new Set(smsAudience.map((r) => r.phoneE164));
          for (const raw of customPhones) {
            const e164 = normalizeToE164(String(raw || "").trim());
            if (!e164 || have.has(e164)) continue;
            have.add(e164);
            smsAudience.push({
              clientId: null,
              phoneE164: e164,
              firstName: "",
              lastName: "",
            });
            skippedNotOptedIn = Math.max(0, skippedNotOptedIn - 1);
          }
        }
      } else {
        smsAudience = await fetchSmsStudioRecipients(supabase);
      }
      smsRecipients = smsAudience.length;
      totalRecipients = smsRecipients;
      if (totalRecipients === 0) {
        return NextResponse.json(
          {
            error:
              skippedNotOptedIn > 0
                ? `None of those numbers are SMS opt-ins (${skippedNotOptedIn} skipped). Have them text JOIN to (630) 864-5231, or check “Confirm consent & opt in” for numbers that already agreed.`
                : "No SMS opt-in recipients found.",
            skippedNotOptedIn,
            skippedInvalid,
          },
          { status: 400 },
        );
      }
    } else {
      const recipients = await fetchCampaignRecipients(supabase);
      emailRecipients = recipients.length;
      smsRecipients = recipients.filter((r) => r.acceptsSms && r.phone).length;
      totalRecipients =
        channel === "email" ? emailRecipients : new Set(recipients.map((r) => r.email)).size;
      if (totalRecipients === 0) {
        return NextResponse.json(
          { error: "No opted-in recipients with valid email addresses found" },
          { status: 400 },
        );
      }
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
        audience_segment: audienceSegment || (customPhones?.length ? "custom" : "sms-opt-in"),
        total_recipients: totalRecipients,
        audience_filters: { sendCursor: 0 },
        scheduled_at: schedule || null,
        started_at: schedule ? null : new Date().toISOString(),
        created_by: auth.user.email || auth.user.id,
      })
      .select("*")
      .single();

    if (insertErr || !campaign) {
      console.error("Campaign insert error:", insertErr);
      return NextResponse.json({ error: "Failed to save campaign" }, { status: 500 });
    }

    if (channel === "sms") {
      try {
        await seedSmsCampaignRecipients(supabase, campaign.id, smsAudience);
      } catch (e) {
        await supabase.from("campaigns").update({ status: "failed" }).eq("id", campaign.id);
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Failed to seed recipients" },
          { status: 500 },
        );
      }
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
        skippedNotOptedIn,
        skippedInvalid,
      });
    }

    const firstBatch = await processCampaignBatch(supabase, campaign, {
      emailBatchSize: 40,
      smsBatchSize: channel === "sms" ? SMS_STUDIO_BATCH_SIZE : 2,
      throttleMs: channel === "sms" ? SMS_STUDIO_THROTTLE_MS : 450,
    });

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      status: firstBatch.done ? "sent" : "sending",
      totalRecipients,
      emailRecipients,
      smsRecipients,
      skippedNotOptedIn,
      skippedInvalid,
      firstBatch,
      message: firstBatch.done
        ? `Campaign sent to ${totalRecipients} recipients.`
        : `Campaign queued — ${firstBatch.smsSent || firstBatch.emailSent} sent this pass. Cron finishes the rest every 2 minutes.`,
    });
  } catch (error) {
    console.error("Campaign send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
