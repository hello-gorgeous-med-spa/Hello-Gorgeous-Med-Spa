import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import {
  createProposalPaymentLink,
  type ProposalPaymentKind,
} from "@/lib/proposals/payment";
import { calculateTotal, type ProposalOption } from "@/lib/proposals/utils";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

/**
 * Client-facing: create a Square Payment Link (Proposal type) for a plan option
 * and return the checkout URL. Marks the option accepted when charging.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const { publicId } = await context.params;
  if (!publicId) {
    return NextResponse.json({ error: "Proposal id is required." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const kind = (body.kind === "deposit" ? "deposit" : "full") as ProposalPaymentKind;
  const optionIndex = Number.isFinite(Number(body.optionIndex))
    ? Math.max(0, Math.floor(Number(body.optionIndex)))
    : 0;

  const { data: proposal, error } = await supabase
    .from("treatment_proposals")
    .select("*")
    .eq("public_id", publicId)
    .single();

  if (error || !proposal) {
    return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  }

  if (proposal.payment_status === "paid") {
    return NextResponse.json(
      { error: "This proposal is already paid in full.", paymentUrl: proposal.payment_url },
      { status: 400 },
    );
  }

  if (proposal.status === "declined") {
    return NextResponse.json(
      { error: "This proposal was declined. Contact the spa to reopen it." },
      { status: 400 },
    );
  }

  const options = (proposal.options || []) as ProposalOption[];
  if (!options.length || optionIndex >= options.length) {
    return NextResponse.json({ error: "Invalid plan option." }, { status: 400 });
  }

  const option = options[optionIndex]!;
  const planTotal = calculateTotal(option);

  // Reuse an existing pending link for the same option + kind + amount
  if (
    proposal.payment_url &&
    proposal.payment_status === "pending" &&
    proposal.payment_kind === kind &&
    proposal.payment_option_name === option.name &&
    Number(proposal.payment_amount_usd) > 0
  ) {
    const expected =
      kind === "full"
        ? planTotal
        : Math.round(planTotal * 0.5 * 100) / 100;
    if (Math.abs(Number(proposal.payment_amount_usd) - expected) < 0.02) {
      return NextResponse.json({
        success: true,
        reused: true,
        url: proposal.payment_url,
        amountUsd: Number(proposal.payment_amount_usd),
        kind,
        optionName: option.name,
        planTotalUsd: planTotal,
      });
    }
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
    sentBy: "client-pay-now",
    supabase,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // Record which plan they are paying for
  await supabase
    .from("treatment_proposals")
    .update({
      status: "accepted",
      accepted_option: option.name,
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", proposal.id);

  return NextResponse.json({
    success: true,
    reused: false,
    url: result.url,
    amountUsd: result.amountUsd,
    kind: result.kind,
    optionName: result.optionName,
    planTotalUsd: result.planTotalUsd,
    paymentLinkId: result.paymentLinkId,
    orderId: result.orderId,
  });
}
