/**
 * POST /api/journey/email-roadmap
 * Sends roadmap email via Resend to the user and a copy to hellogorgeousskin@yahoo.com.
 * Body: { session_id: string, email: string }
 *
 * Setup:
 * 1. npm install resend
 * 2. Create API key at https://resend.com/api-keys
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxx
 * 4. Add from address (verified domain in Resend): RESEND_FROM="Hello Gorgeous <hello@yourdomain.com>"
 *    For testing you can use: RESEND_FROM="Hello Gorgeous <onboarding@resend.dev>"
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase-server";
import { SITE } from "@/lib/seo";

const BUSINESS_EMAIL = SITE.email; // hellogorgeousskin@yahoo.com

function buildRoadmapHtml(params: {
  roadmapTitle: string;
  costRange: string;
  timeline: string;
  bookUrl: string;
  recommendedServices?: Array<{ service: string; reason: string; priority_order: number }>;
  maintenancePlan?: string;
  isBusinessCopy?: boolean;
  userEmail?: string;
}) {
  const {
    roadmapTitle,
    costRange,
    timeline,
    bookUrl,
    recommendedServices = [],
    maintenancePlan,
    isBusinessCopy,
    userEmail,
  } = params;

  const servicesHtml =
    recommendedServices.length > 0
      ? `
    <h3 style="color:#111;font-size:16px;margin:16px 0 8px;">Your treatment plan</h3>
    <ul style="margin:0 0 16px;padding-left:20px;color:#333;">
      ${recommendedServices
        .sort((a, b) => a.priority_order - b.priority_order)
        .map(
          (s) =>
            `<li><strong>${escapeHtml(s.service)}</strong> – ${escapeHtml(s.reason)}</li>`
        )
        .join("")}
    </ul>`
      : "";

  const maintenanceHtml = maintenancePlan
    ? `<p style="margin:8px 0;color:#333;"><strong>Maintenance:</strong> ${escapeHtml(maintenancePlan)}</p>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#333;background:#fff;">
  <h1 style="color:#FF2D8E;font-size:24px;margin-bottom:8px;">${escapeHtml(roadmapTitle)}</h1>
  ${isBusinessCopy && userEmail ? `<p style="color:#666;font-size:14px;">Request from: <strong>${escapeHtml(userEmail)}</strong></p>` : ""}
  <p style="color:#333;line-height:1.5;">Your personalized HG Roadmap™ summary from Hello Gorgeous Med Spa.</p>
  ${servicesHtml}
  <p style="margin:12px 0;"><strong>Estimated investment:</strong> ${escapeHtml(costRange)}</p>
  <p style="margin:12px 0;"><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
  ${maintenanceHtml}
  <p style="margin:24px 0 16px;">
    <a href="${escapeHtml(bookUrl)}" style="display:inline-block;background:#FF2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Book My Consultation</a>
  </p>
  <p style="font-size:12px;color:#888;">This plan is educational and must be reviewed by a licensed provider. Results vary by individual.</p>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session_id = body?.session_id;
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!session_id || !email) {
      return NextResponse.json(
        { error: "session_id and email are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { data: session, error: fetchError } = await supabase
      .from("journey_sessions")
      .select("id, ai_summary, estimated_cost_range, recommended_timeline, conversion_status")
      .eq("id", session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const summary = session.ai_summary as Record<string, unknown> | null;
    const roadmapTitle = (summary?.roadmap_title as string) ?? "Your HG Roadmap™";
    const costRange =
      session.estimated_cost_range ??
      (summary?.estimated_cost_range as string) ??
      "";
    const timeline =
      session.recommended_timeline ??
      (summary?.timeline_estimate as string) ??
      "";
    const bookUrl =
      process.env.NEXT_PUBLIC_BOOKING_URL || "https://www.hellogorgeousmedspa.com/book";
    const recommendedServices = (summary?.recommended_services as Array<{
      service: string;
      reason: string;
      priority_order: number;
    }>) || [];
    const maintenancePlan = (summary?.maintenance_plan as string) || undefined;

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || `${SITE.name} <onboarding@resend.dev>`;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not set. Add it to .env.local to send journey emails.");
      return NextResponse.json(
        { error: "Email is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const subject = "Your Personalized HG Confidence Blueprint Is Ready";
    const htmlUser = buildRoadmapHtml({
      roadmapTitle,
      costRange,
      timeline,
      bookUrl,
      recommendedServices,
      maintenancePlan,
    });
    const htmlBusiness = buildRoadmapHtml({
      roadmapTitle,
      costRange,
      timeline,
      bookUrl,
      recommendedServices,
      maintenancePlan,
      isBusinessCopy: true,
      userEmail: email,
    });

    // 1. Send to the client
    const { error: errUser } = await resend.emails.send({
      from,
      to: email,
      bcc: [BUSINESS_EMAIL],
      subject,
      html: htmlUser,
    });

    if (errUser) {
      console.error("Resend send to user failed", errUser);
      // If BCC fails (e.g. unverified domain), send a separate copy to business
      await resend.emails.send({
        from,
        to: BUSINESS_EMAIL,
        subject: `[Copy] ${subject} – ${email}`,
        html: htmlBusiness,
      }).catch(() => {});
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 502 }
      );
    }

    // 2. If BCC might not work (e.g. onboarding@resend.dev), also send a dedicated copy to business
    const isResendTestFrom = from.includes("onboarding@resend.dev");
    if (isResendTestFrom) {
      await resend.emails.send({
        from,
        to: BUSINESS_EMAIL,
        subject: `[Journey Roadmap] Request from ${email}`,
        html: htmlBusiness,
      }).catch((e) => console.error("Resend copy to business failed", e));
    }

    const { error: updateError } = await supabase
      .from("journey_sessions")
      .update({ conversion_status: "emailed" })
      .eq("id", session_id);

    if (updateError) {
      console.error("journey_sessions update error", updateError);
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your roadmap has been sent to your email.",
    });
  } catch (e) {
    console.error("journey/email-roadmap error", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
