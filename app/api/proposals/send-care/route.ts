import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import {
  absoluteCareGuideUrl,
  careGuidesForProposalOptions,
} from "@/lib/proposals/care-guides";
import { SITE } from "@/lib/seo";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import type { ProposalOption } from "@/lib/proposals/utils";

export const dynamic = "force-dynamic";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const proposalId = String(body?.proposalId || "");
  const channels = Array.isArray(body?.channels)
    ? (body.channels as string[])
    : ["email", "sms"];
  const wantEmail = channels.includes("email");
  const wantSms = channels.includes("sms");

  if (!proposalId) return NextResponse.json({ error: "proposalId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase.from("treatment_proposals").select("*").eq("id", proposalId).single();
  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  const proposal = data as TreatmentProposalRecord;
  const options = (proposal.options || []) as ProposalOption[];
  const guides = careGuidesForProposalOptions(options);

  if (!guides.length) {
    return NextResponse.json(
      { error: "No matching pre/post care guides for the services on this proposal." },
      { status: 400 }
    );
  }

  const email = String(body?.email || proposal.client_email || "")
    .trim()
    .toLowerCase();
  const phone = String(body?.phone || proposal.client_phone || "").trim();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE.url;
  const guideLinks = guides.map((g) => ({
    ...g,
    url: absoluteCareGuideUrl(g.path, baseUrl),
  }));

  const results: { email?: boolean; sms?: boolean; emailError?: string; smsError?: string } = {};

  if (wantEmail) {
    if (!email) {
      results.email = false;
      results.emailError = "Client email is required to send care guides by email.";
    } else {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        results.email = false;
        results.emailError = "RESEND_API_KEY is not configured.";
      } else {
        const resend = new Resend(apiKey);
        const from = process.env.RESEND_FROM || `${SITE.name} <onboarding@resend.dev>`;
        const listHtml = guideLinks
          .map(
            (g) =>
              `<li style="margin:8px 0;"><a href="${g.url}" style="color:#E6007E;font-weight:700;">${escapeHtml(g.title)}</a><br/><span style="color:#555;font-size:13px;">${escapeHtml(g.description)}</span></li>`
          )
          .join("");

        const { error: sendError } = await resend.emails.send({
          from,
          to: email,
          bcc: [SITE.email],
          subject: `Your pre & post care guides | ${SITE.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color:#E6007E;margin-bottom:10px;">Pre &amp; post care for your plan</h1>
              <p style="font-size:15px;color:#222;">Hi ${escapeHtml(proposal.client_name)},</p>
              <p style="font-size:15px;color:#222;line-height:1.6;">
                Based on your treatment proposal, please review these official before-and-after care guides.
                Following them helps protect your results and keeps healing on track.
              </p>
              <ul style="padding-left:18px;">${listHtml}</ul>
              <p style="font-size:14px;color:#222;margin-top:18px;">
                Questions? Call or text us at <strong>${SITE.phone}</strong>.
              </p>
              <p style="font-size:13px;color:#666;margin-top:24px;">
                ${SITE.name} · ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion}
              </p>
            </div>
          `,
        });

        if (sendError) {
          results.email = false;
          results.emailError = sendError.message || "Failed to send email.";
        } else {
          results.email = true;
          await supabase
            .from("treatment_proposals")
            .update({
              client_email: email,
              status: proposal.status === "draft" ? "sent" : proposal.status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", proposal.id);
        }
      }
    }
  }

  if (wantSms) {
    if (!phone) {
      results.sms = false;
      results.smsError = "Client phone is required to send care guides by SMS.";
    } else {
      const linkLines = guideLinks.map((g) => `${g.title}: ${g.url}`).join("\n");
      const smsText =
        `Hi ${proposal.client_name} — your Hello Gorgeous pre & post care guides:\n${linkLines}\nQuestions? ${SITE.phone}`.slice(
          0,
          1400
        );
      const smsResult = await sendSms(phone, smsText);
      results.sms = smsResult.success;
      if (!smsResult.success) {
        results.smsError = smsResult.error || "Failed to send SMS.";
      } else {
        await supabase
          .from("treatment_proposals")
          .update({
            client_phone: phone,
            status: proposal.status === "draft" ? "sent" : proposal.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", proposal.id);
      }
    }
  }

  const anyOk = results.email === true || results.sms === true;
  if (!anyOk) {
    return NextResponse.json(
      {
        error: results.emailError || results.smsError || "Failed to send care guides.",
        results,
        guides: guideLinks,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    guides: guideLinks,
    results,
  });
}
