import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { createProposalPaymentLink, type ProposalPaymentKind } from "@/lib/proposals/payment";
import type { ProposalOption } from "@/lib/proposals/utils";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Proposal id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const kind = (body.kind === "deposit" ? "deposit" : "full") as ProposalPaymentKind;
  const optionIndex = Number.isFinite(Number(body.optionIndex)) ? Number(body.optionIndex) : 0;
  const amountUsd =
    body.amountUsd != null && Number.isFinite(Number(body.amountUsd))
      ? Number(body.amountUsd)
      : undefined;
  const depositPercent =
    body.depositPercent != null && Number.isFinite(Number(body.depositPercent))
      ? Number(body.depositPercent)
      : undefined;

  const { data: proposal, error } = await supabase
    .from("treatment_proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !proposal) {
    return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  }

  if (proposal.payment_status === "paid") {
    return NextResponse.json({ error: "Proposal is already paid in full." }, { status: 400 });
  }

  const options = (proposal.options || []) as ProposalOption[];
  if (!options.length) {
    return NextResponse.json({ error: "Proposal has no options to charge." }, { status: 400 });
  }

  const result = await createProposalPaymentLink({
    proposalId: proposal.id,
    publicId: proposal.public_id,
    clientName: proposal.client_name,
    clientEmail: proposal.client_email,
    clientPhone: proposal.client_phone,
    options,
    kind,
    optionIndex,
    amountUsd,
    depositPercent,
    sentBy: session.email || "staff",
    supabase,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    success: true,
    url: result.url,
    amountUsd: result.amountUsd,
    kind: result.kind,
    optionName: result.optionName,
    planTotalUsd: result.planTotalUsd,
    paymentLinkId: result.paymentLinkId,
    orderId: result.orderId,
  });
}
