import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { applyTwilioStatus } from "@/lib/sms-blast-delivery";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

const DELIVERY_STATUSES = new Set([
  "queued",
  "accepted",
  "sending",
  "sent",
  "delivered",
  "undelivered",
  "failed",
]);

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/twilio-sms
 * Twilio incoming SMS webhook — handles STOP opt-outs
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const raw = await request.text();
    const formObject: Record<string, string> = {};
    const params = new URLSearchParams(raw);
    params.forEach((value, key) => {
      formObject[key] = value;
    });

    // Validate Twilio signature
    const isValid = twilioSignatureValid(request, raw, formObject);
    if (!isValid) {
      console.warn("Invalid Twilio signature");
      return new NextResponse("Forbidden", { status: 403 });
    }

    const from = formObject.From || "";
    const body = (formObject.Body || "").trim().toUpperCase();
    const messageSid = formObject.MessageSid || formObject.SmsSid || "";
    const messageStatus = (formObject.MessageStatus || formObject.SmsStatus || "").toLowerCase();

    if (messageSid && DELIVERY_STATUSES.has(messageStatus)) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      try {
        await applyTwilioStatus(supabase, {
          sid: messageSid,
          status: messageStatus,
          errorCode: formObject.ErrorCode || null,
          errorMessage: formObject.ErrorMessage || null,
        });
      } catch (statusError) {
        console.error("Twilio delivery status update failed:", statusError);
      }
      if (!body) {
        return new NextResponse(
          '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
          { status: 200, headers: { "Content-Type": "text/xml" } },
        );
      }
    }

    console.log(`[Twilio SMS] From: ${from}, Body: ${body}`);

    // Check for opt-out keywords
    const optOutKeywords = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"];
    const isOptOut = optOutKeywords.includes(body);

    if (isOptOut) {
      // Use service role to bypass RLS
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Normalize phone
      const digits = from.replace(/\D/g, "");
      const normalizedPhone = digits.length === 11 && digits.startsWith("1") 
        ? `+${digits}` 
        : `+1${digits}`;

      // Mark contact as opted out
      const { error: updateError } = await supabase
        .from("sms_contacts")
        .update({ 
          opted_out: true, 
          opted_out_at: new Date().toISOString() 
        })
        .or(`phone.eq.${normalizedPhone},phone.eq.${from}`);

      if (updateError) {
        console.error("Error updating opt-out:", updateError);
      }

      // Log the opt-out
      const { error: logError } = await supabase
        .from("sms_optouts")
        .insert({
          phone: from,
          reason: body,
          twilio_sid: messageSid,
        });

      if (logError) {
        console.error("Error logging opt-out:", logError);
      }

      console.log(`[Twilio SMS] Opt-out recorded for ${from}`);
    }

    // Return empty TwiML (Twilio sends auto-STOP confirmation)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      }
    );
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
