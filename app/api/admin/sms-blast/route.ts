import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTwilioSmsConfig, isTwilioConfigured } from "@/lib/hgos/twilio-config";
import { sendViaTwilio, validatePhoneNumber } from "@/lib/hgos/sms-marketing";
import { BLAST_AUDIENCES, BLAST_FOOTER } from "@/lib/sms-blast";
import {
  BLAST_STATUS_CALLBACK_URL,
  pullTwilioOutbound,
  rollupBlast,
  summarizeTwilio,
  upsertTwilioMessages,
} from "@/lib/sms-blast-delivery";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SEND_CHUNK = 20;

type ContactRow = {
  id: string;
  phone: string;
  first_name: string | null;
};

type SmsDb = NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>;

function applyAudience<T extends { eq: Function; not: Function; lt: Function; contains: Function; gte: Function }>(
  query: T,
  audienceId: string,
): T {
  let next = query.eq("opted_out", false).not("phone", "is", null) as T;
  if (audienceId === "injectables-due") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    next = next.lt("last_service_date", cutoff.toISOString().split("T")[0]) as T;
  } else if (audienceId === "weight-loss") {
    next = next.contains("tags", ["weight-loss"]) as T;
  } else if (audienceId === "vip") {
    next = next.gte("lifetime_value", 2000) as T;
  } else if (audienceId === "morpheus8-leads") {
    next = next.contains("tags", ["morpheus8-lead"]) as T;
  } else if (audienceId === "consulted") {
    next = next.contains("tags", ["consulted-not-booked"]) as T;
  }
  return next;
}

function audienceQuery(supabase: SmsDb, audienceId: string) {
  return applyAudience(
    supabase.from("sms_contacts").select("id, phone, first_name"),
    audienceId,
  );
}

async function audienceCounts(supabase: SmsDb) {
  return Promise.all(
    BLAST_AUDIENCES.map(async (audience) => {
      const { count } = await applyAudience(
        supabase.from("sms_contacts").select("*", { count: "exact", head: true }),
        audience.id,
      );
      return { id: audience.id, count: count ?? 0 };
    }),
  );
}

/**
 * GET /api/admin/sms-blast
 * Live blast ledger. `?live=1` also pulls Twilio's own message list
 * so a send that Twilio billed still shows delivered / failed.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { count: totalContacts } = await supabase
      .from("sms_contacts")
      .select("*", { count: "exact", head: true })
      .eq("opted_out", false);

    const { count: optedOut } = await supabase
      .from("sms_contacts")
      .select("*", { count: "exact", head: true })
      .eq("opted_out", true);

    const audiences = await audienceCounts(supabase);

    const { data: blasts, error: blastsError } = await supabase
      .from("sms_blasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    let twilio: ReturnType<typeof summarizeTwilio> & { since: string; error?: string } | null = null;
    if (request.nextUrl.searchParams.get("live") === "1" && isTwilioConfigured()) {
      const since = new Date();
      since.setDate(since.getDate() - 14);
      try {
        const messages = await pullTwilioOutbound(since);
        try {
          await upsertTwilioMessages(supabase, messages);
        } catch (persistError) {
          console.error("SMS blast ledger upsert failed:", persistError);
        }
        twilio = { since: since.toISOString(), ...summarizeTwilio(messages) };
      } catch (twilioError) {
        twilio = {
          since: since.toISOString(),
          outbound: 0,
          byStatus: {},
          priceUsd: 0,
          failures: [],
          error: twilioError instanceof Error ? twilioError.message : String(twilioError),
        };
      }
    }

    return NextResponse.json({
      blasts: blasts ?? [],
      blastsError: blastsError?.message ?? null,
      stats: {
        totalContacts: totalContacts ?? 0,
        optedOut: optedOut ?? 0,
        twilioConfigured: isTwilioConfigured(),
        audiences,
      },
      twilio,
    });
  } catch (error) {
    console.error("SMS blast GET error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}

async function sendQueuedChunk(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  blastId: string,
) {
  const { data: blast, error: blastError } = await supabase
    .from("sms_blasts")
    .select("id, message, media_url")
    .eq("id", blastId)
    .single();
  if (blastError || !blast) {
    throw new Error(blastError?.message || "Blast not found");
  }

  const { data: queued, error: queueError } = await supabase
    .from("sms_blast_deliveries")
    .select("id, phone, first_name")
    .eq("blast_id", blastId)
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(SEND_CHUNK);
  if (queueError) throw new Error(queueError.message);

  const config = getTwilioSmsConfig();
  let accepted = 0;
  let failed = 0;

  for (const row of queued ?? []) {
    const { data: claimed } = await supabase
      .from("sms_blast_deliveries")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("status", "queued")
      .select("id")
      .maybeSingle();
    if (!claimed) continue;

    const validation = validatePhoneNumber(row.phone);
    if (!validation.valid) {
      failed++;
      await supabase
        .from("sms_blast_deliveries")
        .update({
          status: "failed",
          error_message: validation.error || "Invalid phone",
          status_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      continue;
    }

    const firstName = (row.first_name || "").trim();
    const personalized = `${blast.message}\n\n${BLAST_FOOTER}`.replace(
      /\{FirstName\}/gi,
      firstName,
    );

    const result = await sendViaTwilio(
      {
        to: validation.formatted,
        body: personalized,
        mediaUrl: blast.media_url || undefined,
        statusCallback: BLAST_STATUS_CALLBACK_URL,
      },
      config,
    );

    if (result.success && result.messageId) {
      accepted++;
      await supabase
        .from("sms_blast_deliveries")
        .update({
          status: "accepted",
          twilio_sid: result.messageId,
          phone: validation.formatted,
          sent_at: new Date().toISOString(),
          status_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    } else {
      failed++;
      await supabase
        .from("sms_blast_deliveries")
        .update({
          status: "failed",
          error_message: (result.error || "Twilio rejected the message").slice(0, 300),
          status_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }
  }

  await rollupBlast(supabase, blastId);

  const { count: remaining } = await supabase
    .from("sms_blast_deliveries")
    .select("*", { count: "exact", head: true })
    .eq("blast_id", blastId)
    .eq("status", "queued");

  const { data: fresh } = await supabase.from("sms_blasts").select("*").eq("id", blastId).single();

  return {
    blastId,
    acceptedThisChunk: accepted,
    failedThisChunk: failed,
    remaining: remaining ?? 0,
    done: (remaining ?? 0) === 0,
    blast: fresh,
  };
}

/**
 * POST /api/admin/sms-blast
 * Test send, or queue a blast and send it in small chunks so a timeout
 * cannot hide messages Twilio already accepted.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { audienceId, message, mediaUrl, testPhone, consentConfirmed, blastId } = body;

    if (!isTwilioConfigured()) {
      return NextResponse.json({ error: "Twilio not configured" }, { status: 400 });
    }

    if (testPhone) {
      if (!message || String(message).trim().length === 0) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
      }
      const validation = validatePhoneNumber(testPhone);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const result = await sendViaTwilio(
        {
          to: validation.formatted,
          body: `${String(message).trim()}\n\n${BLAST_FOOTER}`,
          mediaUrl,
          statusCallback: BLAST_STATUS_CALLBACK_URL,
        },
        getTwilioSmsConfig(),
      );
      return NextResponse.json({
        success: result.success,
        test: true,
        messageId: result.messageId,
        error: result.error,
        debug: {
          to: validation.formatted,
          hasMms: !!mediaUrl,
          messageLength: String(message).length,
        },
      });
    }

    if (!consentConfirmed) {
      return NextResponse.json({ error: "Consent confirmation required" }, { status: 400 });
    }

    let activeBlastId = typeof blastId === "string" ? blastId : "";

    if (!activeBlastId) {
      if (!message || String(message).trim().length === 0) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
      }

      const { data: contacts, error: contactsError } = await audienceQuery(
        supabase,
        audienceId || "all",
      );
      if (contactsError) {
        return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
      }
      const list = (contacts ?? []) as ContactRow[];
      if (list.length === 0) {
        return NextResponse.json({ error: "No contacts in audience" }, { status: 400 });
      }

      const { data: blast, error: blastError } = await supabase
        .from("sms_blasts")
        .insert({
          audience_id: audienceId || "all",
          message: String(message).trim(),
          media_url: mediaUrl || null,
          recipient_count: list.length,
          sent_by: "admin",
          status: "sending",
        })
        .select("id")
        .single();
      if (blastError || !blast) {
        console.error("Error creating blast:", blastError);
        return NextResponse.json({ error: "Failed to create blast record" }, { status: 500 });
      }

      const rows = list.map((contact) => ({
        blast_id: blast.id,
        contact_id: contact.id,
        phone: contact.phone,
        first_name: contact.first_name,
        status: "queued",
      }));
      for (let i = 0; i < rows.length; i += 400) {
        const { error: insertError } = await supabase
          .from("sms_blast_deliveries")
          .insert(rows.slice(i, i + 400));
        if (insertError) {
          return NextResponse.json(
            { error: `Failed to queue recipients: ${insertError.message}` },
            { status: 500 },
          );
        }
      }
      activeBlastId = blast.id;
    }

    const progress = await sendQueuedChunk(supabase, activeBlastId);
    return NextResponse.json({
      success: true,
      ...progress,
      sent: progress.blast?.accepted_count ?? 0,
      delivered: progress.blast?.delivered_count ?? 0,
      failed: progress.blast?.failed_count ?? 0,
      total: progress.blast?.recipient_count ?? 0,
    });
  } catch (error) {
    console.error("SMS blast POST error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
