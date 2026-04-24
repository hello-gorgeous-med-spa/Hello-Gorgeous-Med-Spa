import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getResendFromAddress, getContactFormToEmail } from "@/lib/resend-config";
import { getUTMFromRequest, recordLead } from "@/lib/leads";


function trim(s: unknown, n: number): string {
  if (s == null || typeof s !== "string") return "";
  return s.trim().slice(0, n);
}

/**
 * Contour Lift™ consultation / candidacy — minimal fields; staff notified via Resend, lead row when Supabase is available.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const fullName = trim(body.name, 200);
    const email = trim(body.email, 200).toLowerCase();
    const phone = trim(body.phone, 50);
    const areaOfConcern = trim(body.area_of_concern, 500);
    const contactMethod = trim(body.contact_method, 30);
    const leadSourceBucket = trim(body.lead_source_bucket, 100);

    if (!fullName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
      return NextResponse.json(
        { error: "Please add your name, a valid email, and phone so we can reach you." },
        { status: 400 }
      );
    }

    if (!areaOfConcern || !contactMethod) {
      return NextResponse.json(
        { error: "Please tell us your area of concern and how you’d like to be contacted." },
        { status: 400 }
      );
    }

    const url = request.url || "";
    const utmFromUrl = getUTMFromRequest(url, request.headers.get("referer"));
    const utm = {
      utm_source: trim(body.utm_source, 255) || utmFromUrl.utm_source,
      utm_medium: trim(body.utm_medium, 255) || utmFromUrl.utm_medium,
      utm_campaign: trim(body.utm_campaign, 255) || utmFromUrl.utm_campaign,
      referrer: utmFromUrl.referrer,
    };

    const sessionId = trim(body.session_id, 100);
    const fromPage = trim(body.from_page, 500);

    const textBody = [
      "Contour Lift™ inquiry (Quantum RF)",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Area of concern: ${areaOfConcern}`,
      `Preferred contact: ${contactMethod}`,
      `Lead source bucket: ${leadSourceBucket || "—"}`,
      `From page: ${fromPage || "—"}`,
      `UTM: source=${utm.utm_source || "—"} medium=${utm.utm_medium || "—"} campaign=${utm.utm_campaign || "—"}`,
      `Session: ${sessionId || "—"}`,
    ].join("\n");

    /** Persist first so a Resend outage does not block thank-you or Supabase. */
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await recordLead(supabase, {
        email,
        phone,
        full_name: fullName,
        source: "website",
        lead_type: "contour_lift",
        session_id: sessionId || undefined,
        ...utm,
        metadata: {
          area_of_concern: areaOfConcern,
          contact_method: contactMethod,
          lead_source_bucket: leadSourceBucket || undefined,
          from_page: fromPage || undefined,
          procedure: "contour_lift",
        },
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = getContactFormToEmail();
    const fromAddress = getResendFromAddress();
    let emailSent = false;

    if (apiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toEmail],
          reply_to: email,
          subject: `Contour Lift inquiry — ${fullName}`,
          text: textBody,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        const errMsg = typeof err.message === "string" ? err.message : JSON.stringify(err);
        console.error(
          "[contour-lift-inquiry] Resend failed:",
          res.status,
          errMsg,
          "| to:",
          toEmail,
          "| fromDomainHint:",
          fromAddress.replace(/.*<([^>]+)>.*/, "$1")
        );
        const payload: Record<string, string | number | boolean> = {
          success: true,
          emailSent: false,
          warning: "email_delivery_failed",
          resendHttpStatus: res.status,
        };
        if (process.env.EXPOSE_RESEND_ERROR_IN_RESPONSE === "1") {
          payload.resendMessage = errMsg;
        }
        return NextResponse.json(payload, { status: 200 });
      }
      emailSent = true;
    } else {
      console.warn("[contour-lift-inquiry] RESEND_API_KEY not set; email not sent.");
    }

    if (!apiKey && process.env.EXPOSE_RESEND_ERROR_IN_RESPONSE === "1") {
      return NextResponse.json({
        success: true,
        emailSent: false,
        resendKeyMissing: true,
      });
    }
    return NextResponse.json({ success: true, emailSent });
  } catch (e) {
    console.error("contour-lift-inquiry", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}
