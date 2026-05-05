import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { buildProposalPdf } from "@/lib/proposals/pdf";
import { SITE } from "@/lib/seo";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

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

  const body = await request.json();
  const proposalId = String(body?.proposalId || "");
  const recipientEmail = String(body?.email || "").trim().toLowerCase();
  if (!proposalId) return NextResponse.json({ error: "proposalId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase.from("treatment_proposals").select("*").eq("id", proposalId).single();
  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  const proposal = data as TreatmentProposalRecord;
  const publicId = proposal.public_id || crypto.randomUUID().replace(/-/g, "").slice(0, 20);

  const to = recipientEmail || proposal.client_email || "";
  if (!to) return NextResponse.json({ error: "Recipient email is required." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "RESEND_API_KEY is not configured." }, { status: 503 });

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM || `${SITE.name} <onboarding@resend.dev>`;
  const pdfBytes = buildProposalPdf(proposal);
  const base64Pdf = Buffer.from(pdfBytes).toString("base64");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE.url;
  const proposalUrl = `${baseUrl}/proposals/${publicId}`;
  const publicPdfUrl = `${baseUrl}/api/proposals/public/${publicId}/pdf`;

  const { error: sendError, data: sendData } = await resend.emails.send({
    from,
    to,
    bcc: [SITE.email],
    subject: "Your Personalized Treatment Plan | Hello Gorgeous Med Spa",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #E6007E; margin-bottom: 10px;">Your treatment plan is ready</h1>
        <p style="font-size: 15px; color: #222;">
          Hi ${escapeHtml(proposal.client_name)},
        </p>
        <p style="font-size: 15px; color: #222; line-height: 1.6;">
          Thank you for meeting with us. Your personalized Good / Better / Best options are attached as a PDF.
          Reply to this email or call us at <strong>${SITE.phone}</strong> to lock in your plan.
        </p>
        <p style="margin: 12px 0; font-size: 14px; color: #222;">
          View your proposal online: <a href="${proposalUrl}" style="color:#E6007E;font-weight:700;">${proposalUrl}</a>
        </p>
        <p style="margin: 22px 0;">
          <a href="${SITE.url}/book" style="background:#E6007E;color:white;padding:12px 20px;border-radius:30px;text-decoration:none;font-weight:700;">
            Book your first treatment
          </a>
        </p>
        <p style="font-size: 13px; color: #666;">
          ${SITE.name} · ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion}
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `hello-gorgeous-treatment-plan-${proposal.client_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
        content: base64Pdf,
      },
    ],
  });

  if (sendError) {
    return NextResponse.json({ error: sendError.message || "Failed to send email." }, { status: 502 });
  }

  const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL || SITE.url}/api/proposals/${proposal.id}/pdf`;
  await supabase
    .from("treatment_proposals")
    .update({
      public_id: publicId,
      status: "sent",
      sent_at: new Date().toISOString(),
      pdf_url: publicPdfUrl,
      client_email: to,
    })
    .eq("id", proposal.id);

  return NextResponse.json({ success: true, messageId: sendData?.id, pdfUrl, proposalUrl });
}
