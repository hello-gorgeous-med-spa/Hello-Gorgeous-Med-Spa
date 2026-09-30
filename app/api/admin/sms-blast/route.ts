import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTwilioSmsConfig, isTwilioConfigured } from "@/lib/hgos/twilio-config";
import { sendViaTwilio, validatePhoneNumber } from "@/lib/hgos/sms-marketing";
import { BLAST_FOOTER } from "@/lib/sms-blast";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/sms-blast
 * Fetch blast history + audience stats
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Fetch blast history
    const { data: blasts, error: blastsError } = await supabase
      .from("sms_blasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (blastsError) {
      console.error("Error fetching blasts:", blastsError);
    }

    // Fetch audience counts from sms_contacts
    const { count: totalContacts } = await supabase
      .from("sms_contacts")
      .select("*", { count: "exact", head: true })
      .eq("opted_out", false);

    // Fetch opt-outs
    const { count: optedOut } = await supabase
      .from("sms_contacts")
      .select("*", { count: "exact", head: true })
      .eq("opted_out", true);

    return NextResponse.json({
      blasts: blasts ?? [],
      stats: {
        totalContacts: totalContacts ?? 0,
        optedOut: optedOut ?? 0,
        twilioConfigured: isTwilioConfigured(),
      },
    });
  } catch (error) {
    console.error("SMS blast GET error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}

/**
 * POST /api/admin/sms-blast
 * Send a blast to selected audience
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { audienceId, message, mediaUrl, testPhone, consentConfirmed } = body;

    // Validate consent
    if (!consentConfirmed && !testPhone) {
      return NextResponse.json({ error: "Consent confirmation required" }, { status: 400 });
    }

    // Validate message
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check Twilio config
    if (!isTwilioConfigured()) {
      const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
      const token = process.env.TWILIO_AUTH_TOKEN?.trim();
      const from = process.env.TWILIO_PHONE_NUMBER?.trim();
      const msid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
      return NextResponse.json({ 
        error: `Twilio not configured. SID: ${!!sid}, Token: ${!!token}, From: ${!!from}, MSID: ${!!msid}` 
      }, { status: 400 });
    }

    const config = getTwilioSmsConfig();
    const fullMessage = `${message.trim()}\n\n${BLAST_FOOTER}`;

    // Test mode: send to single phone
    if (testPhone) {
      const validation = validatePhoneNumber(testPhone);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const result = await sendViaTwilio(
        { to: validation.formatted, body: fullMessage, mediaUrl },
        config
      );

      return NextResponse.json({
        success: result.success,
        test: true,
        messageId: result.messageId,
        error: result.error,
      });
    }

    // Blast mode: fetch audience and send
    let query = supabase
      .from("sms_contacts")
      .select("id, phone, first_name, last_service_date")
      .eq("opted_out", false)
      .not("phone", "is", null);

    // Apply audience filter
    if (audienceId === "injectables-due") {
      // 90+ days since last service
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      query = query.lt("last_service_date", cutoff.toISOString().split("T")[0]);
    } else if (audienceId === "weight-loss") {
      query = query.contains("tags", ["weight-loss"]);
    } else if (audienceId === "vip") {
      query = query.gte("lifetime_value", 2000);
    } else if (audienceId === "morpheus8-leads") {
      query = query.contains("tags", ["morpheus8-lead"]);
    } else if (audienceId === "consulted") {
      query = query.contains("tags", ["consulted-not-booked"]);
    }
    // else "all" - no additional filter

    const { data: contacts, error: contactsError } = await query;

    if (contactsError) {
      return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: "No contacts in audience" }, { status: 400 });
    }

    // Create blast record
    const { data: blast, error: blastError } = await supabase
      .from("sms_blasts")
      .insert({
        audience_id: audienceId,
        message: message.trim(),
        media_url: mediaUrl || null,
        recipient_count: contacts.length,
        sent_by: "admin",
        status: "sending",
      })
      .select()
      .single();

    if (blastError) {
      console.error("Error creating blast:", blastError);
      return NextResponse.json({ error: "Failed to create blast record" }, { status: 500 });
    }

    // Send messages (async, don't block response)
    const sendResults = { sent: 0, failed: 0, errors: [] as string[] };

    for (const contact of contacts) {
      const validation = validatePhoneNumber(contact.phone);
      if (!validation.valid) {
        sendResults.failed++;
        sendResults.errors.push(`${contact.phone}: Invalid phone`);
        continue;
      }

      // Personalize message
      let personalizedMessage = fullMessage;
      if (contact.first_name) {
        personalizedMessage = personalizedMessage.replace(/\{FirstName\}/gi, contact.first_name);
      } else {
        personalizedMessage = personalizedMessage.replace(/\{FirstName\}/gi, "");
      }

      const result = await sendViaTwilio(
        { to: validation.formatted, body: personalizedMessage, mediaUrl },
        config
      );

      if (result.success) {
        sendResults.sent++;
      } else {
        sendResults.failed++;
        if (sendResults.errors.length < 10) {
          sendResults.errors.push(`${contact.phone}: ${result.error}`);
        }
      }

      // Rate limit: 100ms between messages
      await new Promise((r) => setTimeout(r, 100));
    }

    // Update blast record with results
    await supabase
      .from("sms_blasts")
      .update({
        status: "sent",
        delivered_count: sendResults.sent,
        failed_count: sendResults.failed,
        sent_at: new Date().toISOString(),
      })
      .eq("id", blast.id);

    return NextResponse.json({
      success: true,
      blastId: blast.id,
      total: contacts.length,
      sent: sendResults.sent,
      failed: sendResults.failed,
      errors: sendResults.errors.slice(0, 5),
    });
  } catch (error) {
    console.error("SMS blast POST error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
