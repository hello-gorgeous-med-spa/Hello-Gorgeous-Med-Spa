// ============================================================
// REVIEW REQUEST API
// Sends Google review request via SMS + Email after completed appointment.
// Trigger: when appointment status changes to "completed".
// Admin toggle: REVIEW_REQUESTS_ENABLED env (default: true).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSmsTelnyx } from "@/lib/notifications/telnyx";
import { GOOGLE_REVIEW_URL, REVIEW_UTM } from "@/lib/local-seo";

export const dynamic = "force-dynamic";

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
    const body = await request.json();
    const { appointment_id } = body;

    if (!appointment_id) {
      return NextResponse.json({ error: "appointment_id required" }, { status: 400 });
    }

    // Check if already sent
    const { data: existing } = await supabase
      .from("review_requests_sent")
      .select("id")
      .eq("appointment_id", appointment_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ skipped: true, reason: "Already sent" });
    }

    // Get appointment to resolve client_id
    const { data: apt, error: aptErr } = await supabase
      .from("appointments")
      .select("id, client_id")
      .eq("id", appointment_id)
      .single();

    if (aptErr || !apt?.client_id) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Get client contact info from user_profiles (same pattern as aftercare)
    const { data: client } = await supabase
      .from("clients")
      .select(`
        id,
        user_profiles:user_id(first_name, last_name, email, phone)
      `)
      .eq("id", apt.client_id)
      .single();

    const profile = client?.user_profiles
      ? (Array.isArray(client.user_profiles) ? client.user_profiles[0] : client.user_profiles)
      : null;
    if (!profile) {
      return NextResponse.json({ error: "Client contact info not found" }, { status: 404 });
    }

    const firstName = profile.first_name || "there";
    const reviewUrl = GOOGLE_REVIEW_URL.includes("utm_source")
      ? GOOGLE_REVIEW_URL
      : `${GOOGLE_REVIEW_URL}&${REVIEW_UTM}`;

    const results: { sms?: boolean; email?: boolean; error?: string } = {};

    // Send SMS
    if (profile.phone) {
      const smsText = `Hello Gorgeous: Hi ${firstName}! We hope you loved your visit. Would you mind leaving us a Google review? It means the world to us: ${reviewUrl}`;
      const smsResult = await sendSmsTelnyx(profile.phone, smsText);
      results.sms = smsResult.success;
      if (!smsResult.success) results.error = smsResult.error;
    }

    // Send Email (Resend)
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

    // Record sent
    await supabase.from("review_requests_sent").insert({
      appointment_id,
      client_id: apt.client_id,
      sms_sent: results.sms ?? false,
      email_sent: results.email ?? false,
    }).select("id").single().catch(() => ({}));

    return NextResponse.json({
      success: true,
      sms: results.sms,
      email: results.email,
    });
  } catch (e) {
    console.error("[reviews/request]", e);
    return NextResponse.json({ error: "Failed to send review request" }, { status: 500 });
  }
}
