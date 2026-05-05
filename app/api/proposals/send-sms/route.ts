import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const proposalId = String(body?.proposalId || "");
  const recipientPhone = String(body?.phone || "").trim();
  if (!proposalId) return NextResponse.json({ error: "proposalId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase.from("treatment_proposals").select("*").eq("id", proposalId).single();
  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  const proposal = data as TreatmentProposalRecord;
  const publicId = proposal.public_id || crypto.randomUUID().replace(/-/g, "").slice(0, 20);

  const to = recipientPhone || proposal.client_phone || "";
  if (!to) return NextResponse.json({ error: "Recipient phone is required." }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE.url;
  const proposalUrl = `${baseUrl}/proposals/${publicId}`;
  const publicPdfUrl = `${baseUrl}/api/proposals/public/${publicId}/pdf`;
  const smsText = `Hello ${proposal.client_name}, your personalized treatment plan from ${SITE.name} is ready: ${proposalUrl} Questions? ${SITE.phone}`;
  const result = await sendSms(to, smsText);

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed to send SMS." }, { status: 502 });
  }

  await supabase
    .from("treatment_proposals")
    .update({
      public_id: publicId,
      status: "sent",
      sent_at: new Date().toISOString(),
      pdf_url: publicPdfUrl,
      client_phone: to,
    })
    .eq("id", proposal.id);

  return NextResponse.json({ success: true, providerMessageId: result.providerMessageId, proposalUrl, pdfUrl: publicPdfUrl });
}
