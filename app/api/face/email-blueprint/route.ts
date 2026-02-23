/**
 * POST /api/face/email-blueprint
 * Sends HG Face Blueprint™ email via Resend. Updates conversion_status = 'emailed'.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase-server";
import { SITE } from "@/lib/seo";
import type { FaceBlueprintAIOutput } from "@/lib/face-types";

const BUSINESS_EMAIL = SITE.email;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBlueprintHtml(params: {
  blueprint: FaceBlueprintAIOutput;
  selectedServices: string[];
  intensityLevel: string;
  bookUrl: string;
  isBusinessCopy?: boolean;
  userEmail?: string;
}): string {
  const { blueprint, selectedServices, intensityLevel, bookUrl, isBusinessCopy, userEmail } = params;
  const servicesList =
    selectedServices.length > 0
      ? `<ul style="margin:0 0 16px;padding-left:20px;">${selectedServices.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
      : "";
  const orderList =
    blueprint.recommended_priority_order?.length > 0
      ? `<p style="margin:8px 0;"><strong>Suggested order:</strong> ${escapeHtml(blueprint.recommended_priority_order.join(" → "))}</p>`
      : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#333;background:#fff;">
  <h1 style="color:#FF2D8E;font-size:24px;margin-bottom:8px;">Your HG Face Blueprint™ Is Ready</h1>
  ${isBusinessCopy && userEmail ? `<p style="color:#666;font-size:14px;">Request from: <strong>${escapeHtml(userEmail)}</strong></p>` : ""}
  <p style="color:#333;line-height:1.5;">${escapeHtml(blueprint.aesthetic_summary)}</p>
  <p style="margin:12px 0;"><strong>Intensity:</strong> ${escapeHtml(intensityLevel)}</p>
  <h3 style="font-size:16px;margin:16px 0 8px;">Selected treatments</h3>
  ${servicesList}
  ${orderList}
  <p style="margin:12px 0;"><strong>Estimated investment:</strong> ${escapeHtml(blueprint.estimated_investment_range || "To be reviewed during consult")}</p>
  <p style="margin:12px 0;">${escapeHtml(blueprint.confidence_message || "")}</p>
  <p style="margin:24px 0 16px;">
    <a href="${escapeHtml(bookUrl)}" style="display:inline-block;background:#FF2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Book Consultation</a>
  </p>
  <p style="font-size:12px;color:#888;">Results vary by individual. All treatments performed by licensed professionals. Client consent on file.</p>
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
      .from("face_sessions")
      .select("id, ai_summary, selected_services, intensity_level, conversion_status")
      .eq("id", session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const blueprint = session.ai_summary as FaceBlueprintAIOutput;
    if (!blueprint) {
      return NextResponse.json(
        { error: "Blueprint not found" },
        { status: 404 }
      );
    }

    const serviceLabels: Record<string, string> = {
      botox_smoothing: "Botox smoothing",
      lip_filler_volume: "Lip filler volume",
      chin_projection: "Chin projection",
      jawline_contour: "Jawline contour",
      undereye_correction: "Under-eye correction",
      co2_texture_smoothing: "CO₂ texture smoothing",
    };
    const selectedServices = (session.selected_services as string[] || []).map(
      (id) => serviceLabels[id] || id
    );
    const intensityLevel = String(session.intensity_level || "balanced");

    const bookUrl =
      process.env.NEXT_PUBLIC_BOOKING_URL || "https://www.hellogorgeousmedspa.com/book";
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || `${SITE.name} <onboarding@resend.dev>`;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Email is not configured." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const subject = "Your HG Face Blueprint™ Is Ready";
    const htmlUser = buildBlueprintHtml({
      blueprint,
      selectedServices,
      intensityLevel,
      bookUrl,
    });
    const htmlBusiness = buildBlueprintHtml({
      blueprint,
      selectedServices,
      intensityLevel,
      bookUrl,
      isBusinessCopy: true,
      userEmail: email,
    });

    const { error: errUser } = await resend.emails.send({
      from,
      to: email,
      bcc: [BUSINESS_EMAIL],
      subject,
      html: htmlUser,
    });

    if (errUser) {
      console.error("Resend face blueprint email failed", errUser);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 502 }
      );
    }

    const isResendTestFrom = from.includes("onboarding@resend.dev");
    if (isResendTestFrom) {
      await resend.emails
        .send({
          from,
          to: BUSINESS_EMAIL,
          subject: `[Face Blueprint] Request from ${email}`,
          html: htmlBusiness,
        })
        .catch((e) => console.error("Resend copy to business failed", e));
    }

    await supabase
      .from("face_sessions")
      .update({ conversion_status: "emailed" })
      .eq("id", session_id);

    return NextResponse.json({
      success: true,
      message: "Your face blueprint has been sent to your email.",
    });
  } catch (e) {
    console.error("face/email-blueprint error", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
