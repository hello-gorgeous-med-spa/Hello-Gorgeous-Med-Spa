// ============================================================
// REVIEW REQUEST API
// Sends Google review request via SMS + Email after a paying visit.
// Two callable shapes:
//   { appointment_id: "..." }                      ← legacy (HG OS appointments)
//   { client_id: "...", source: "square_payment" } ← Square-only flow
// Trigger: cron `/api/cron/review-requests` polls `review_requests_pending`.
// Admin toggle: REVIEW_REQUESTS_ENABLED env (default: true).
// 60-day per-client cooldown enforced both at enqueue and send time so a
// customer never receives more than one ask in any 60-day window even if
// they have multiple eligible visits queued.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { GOOGLE_REVIEW_URL, REVIEW_UTM } from "@/lib/local-seo";

export const dynamic = "force-dynamic";

const COOLDOWN_DAYS = 60;

interface RequestBody {
  appointment_id?: string;
  client_id?: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  const enabled = process.env.REVIEW_REQUESTS_ENABLED !== "false";
  if (!enabled) {
    return NextResponse.json({ skipped: true, reason: "Review requests disabled" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const { appointment_id, client_id: bodyClientId, source: bodySource } = body;

    if (!appointment_id && !bodyClientId) {
      return NextResponse.json(
        { error: "appointment_id or client_id required" },
        { status: 400 },
      );
    }

    let clientId: string | null = bodyClientId ?? null;
    let resolvedAppointmentId: string | null = appointment_id ?? null;
    const source: string = bodySource ?? (appointment_id ? "appointment_completed" : "manual");

    if (appointment_id) {
      // Don't double-send for the same appointment.
      const { data: existing } = await supabase
        .from("review_requests_sent")
        .select("id")
        .eq("appointment_id", appointment_id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ skipped: true, reason: "Already sent" });
      }

      const { data: apt, error: aptErr } = await supabase
        .from("appointments")
        .select("id, client_id")
        .eq("id", appointment_id)
        .single();

      if (aptErr || !apt?.client_id) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      clientId = apt.client_id;
      resolvedAppointmentId = apt.id;
    }

    if (!clientId) {
      return NextResponse.json({ error: "client_id could not be resolved" }, { status: 400 });
    }

    // 60-day per-client cooldown — protects against review fatigue when a
    // customer has multiple visits in quick succession.
    const cooldownCutoff = new Date(
      Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();
    const { data: recent } = await supabase
      .from("review_requests_sent")
      .select("id, created_at")
      .eq("client_id", clientId)
      .gte("created_at", cooldownCutoff)
      .limit(1);
    if (recent && recent.length > 0) {
      return NextResponse.json({ skipped: true, reason: "cooldown_60d" });
    }

    // Resolve contact info from clients → users (two queries to avoid PostgREST joins).
    const { data: client } = await supabase
      .from("clients")
      .select("id, user_id, first_name, last_name, email, phone")
      .eq("id", clientId)
      .single();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    let profile: { first_name: string; last_name: string | null; email: string | null; phone: string | null } = {
      first_name: client.first_name || "there",
      last_name: client.last_name ?? null,
      email: client.email ?? null,
      phone: client.phone ?? null,
    };

    if (client.user_id) {
      const { data: user } = await supabase
        .from("users")
        .select("first_name, last_name, email, phone")
        .eq("id", client.user_id)
        .maybeSingle();
      if (user) {
        profile = {
          first_name: user.first_name || profile.first_name,
          last_name: user.last_name ?? profile.last_name,
          email: user.email ?? profile.email,
          phone: user.phone ?? profile.phone,
        };
      }
    }

    if (!profile.email && !profile.phone) {
      return NextResponse.json({ error: "Client contact info not found" }, { status: 404 });
    }

    const firstName = profile.first_name || "there";
    const reviewUrl = GOOGLE_REVIEW_URL.includes("utm_source")
      ? GOOGLE_REVIEW_URL
      : `${GOOGLE_REVIEW_URL}&${REVIEW_UTM}`;

    const results: { sms?: boolean; email?: boolean; error?: string } = {};

    if (profile.phone) {
      const smsText = `Hello Gorgeous: Hi ${firstName}! We hope you loved your visit. Would you mind leaving us a Google review? It means the world to us: ${reviewUrl}`;
      const smsResult = await sendSms(profile.phone, smsText);
      results.sms = smsResult.success;
      if (!smsResult.success) results.error = smsResult.error;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && profile.email) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Hello Gorgeous <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: profile.email,
          subject: "We'd love your feedback! ⭐",
          html: `
            <p>Hi ${firstName},</p>
            <p>Thank you for visiting Hello Gorgeous Med Spa. We hope you had a wonderful experience!</p>
            <p>If you have a moment, we'd be so grateful if you could share your experience on Google. Your review helps other clients find us and means a lot to our team.</p>
            <p style="margin: 24px 0;">
              <a href="${reviewUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #ec4899, #f43f5e); color: white; text-decoration: none; font-weight: 600; border-radius: 9999px;">Leave a Google Review</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">Thank you for being part of the Hello Gorgeous family!</p>
          `,
        }),
      });
      results.email = res.ok;
    }

    try {
      await supabase.from("review_requests_sent").insert({
        appointment_id: resolvedAppointmentId,
        client_id: clientId,
        sms_sent: results.sms ?? false,
        email_sent: results.email ?? false,
        source,
      });
    } catch (err) {
      console.warn("[reviews/request] failed to record sent row:", err);
    }

    return NextResponse.json({
      success: true,
      sms: results.sms,
      email: results.email,
      source,
    });
  } catch (e) {
    console.error("[reviews/request]", e);
    return NextResponse.json({ error: "Failed to send review request" }, { status: 500 });
  }
}
