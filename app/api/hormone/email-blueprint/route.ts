/**
 * POST /api/hormone/email-blueprint
 * Sends Harmony AI™ blueprint email via Resend. Updates conversion_status = 'emailed'.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase-server";
import { SITE } from "@/lib/seo";
import type { HormoneBlueprintOutput } from "@/lib/hormone-types";

const BUSINESS_EMAIL = SITE.email;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBlueprintHtml(params: {
  blueprint: HormoneBlueprintOutput;
  bookUrl: string;
  isBusinessCopy?: boolean;
  userEmail?: string;
}): string {
  const { blueprint, bookUrl, isBusinessCopy, userEmail } = params;
  const patternsHtml =
    blueprint.likely_patterns?.length
      ? `<p style="margin:8px 0;"><strong>Likely patterns:</strong> ${escapeHtml(blueprint.likely_patterns.join(", "))}</p>`
      : "";
  const labsHtml =
    blueprint.recommended_labs?.length
      ? `<h3 style="font-size:16px;margin:16px 0 8px;">Recommended labs</h3><ul style="margin:0 0 16px;padding-left:20px;">${blueprint.recommended_labs.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`
      : "";
  const protocolHtml =
    blueprint.recommended_protocol?.length
      ? `<h3 style="font-size:16px;margin:16px 0 8px;">Optimization pathway</h3><ul style="margin:0 0 16px;padding-left:20px;">${blueprint.recommended_protocol.map((p) => `<li><strong>${escapeHtml(p.therapy)}</strong> – ${escapeHtml(p.reason)}</li>`).join("")}</ul>`
      : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#333;background:#fff;">
  <h1 style="color:#FF2D8E;font-size:24px;margin-bottom:8px;">${escapeHtml(blueprint.blueprint_title)}</h1>
  ${isBusinessCopy && userEmail ? `<p style="color:#666;font-size:14px;">Request from: <strong>${escapeHtml(userEmail)}</strong></p>` : ""}
  <p style="color:#333;line-height:1.5;">${escapeHtml(blueprint.confidence_message || "Your personalized Harmony AI™ hormone blueprint from Hello Gorgeous Med Spa.")}</p>
  ${blueprint.severity_score != null ? `<p style="margin:12px 0;"><strong>Severity score:</strong> ${blueprint.severity_score}/100</p>` : ""}
  ${patternsHtml}
  ${labsHtml}
  ${protocolHtml}
  <p style="margin:12px 0;"><strong>Timeline:</strong> ${escapeHtml(blueprint.timeline_expectation || "—")}</p>
  <p style="margin:12px 0;"><strong>Estimated investment:</strong> ${escapeHtml(blueprint.estimated_investment_range || "To be reviewed at consultation")}</p>
  <p style="margin:24px 0 16px;">
    <a href="${escapeHtml(bookUrl)}" style="display:inline-block;background:#FF2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Book Consultation</a>
  </p>
  <p style="font-size:12px;color:#888;">This is an educational insight and not a medical diagnosis. Must be reviewed by a licensed provider.</p>
</body>
</html>`;
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
        { error: "Service not configured" },
        { status: 503 }
      );
    }

    const { data: session, error: fetchError } = await supabase
      .from("hormone_sessions")
      .select("id, ai_summary, conversion_status")
      .eq("id", session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const blueprint = session.ai_summary as HormoneBlueprintOutput;
    if (!blueprint) {
      return NextResponse.json(
        { error: "Blueprint not found" },
        { status: 404 }
      );
    }

    const bookUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://www.hellogorgeousmedspa.com/book";
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || `${SITE.name} <onboarding@resend.dev>`;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Email is not configured." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const subject = "Your Personalized Harmony AI™ Hormone Blueprint";
    const htmlUser = buildBlueprintHtml({ blueprint, bookUrl });
    const htmlBusiness = buildBlueprintHtml({ blueprint, bookUrl, isBusinessCopy: true, userEmail: email });

    const { error: errUser } = await resend.emails.send({
      from,
      to: email,
      bcc: [BUSINESS_EMAIL],
      subject,
      html: htmlUser,
    });

    if (errUser) {
      console.error("Resend hormone email failed", errUser);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 502 }
      );
    }

    const isResendTestFrom = from.includes("onboarding@resend.dev");
    if (isResendTestFrom) {
      await resend.emails.send({
        from,
        to: BUSINESS_EMAIL,
        subject: `[Harmony Blueprint] Request from ${email}`,
        html: htmlBusiness,
      }).catch((e) => console.error("Resend copy to business failed", e));
    }

    await supabase
      .from("hormone_sessions")
      .update({ conversion_status: "emailed" })
      .eq("id", session_id);

    return NextResponse.json({
      success: true,
      message: "Your hormone blueprint has been sent to your email.",
    });
  } catch (e) {
    console.error("hormone/email-blueprint error", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
