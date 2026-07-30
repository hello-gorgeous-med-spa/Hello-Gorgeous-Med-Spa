/**
 * Treatment proposal → Square Payment Link (deposit or pay in full).
 * Reuses RX checkout helper; redirects back to the public share page.
 */

import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { SITE } from "@/lib/seo";
import { calculateTotal, type ProposalOption } from "@/lib/proposals/utils";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ProposalPaymentKind = "deposit" | "full";

export const DEFAULT_DEPOSIT_PERCENT = 50;

export function proposalOptionTotal(options: ProposalOption[], optionIndex = 0): number {
  const option = options[optionIndex] ?? options[0];
  if (!option) return 0;
  return Math.round(calculateTotal(option) * 100) / 100;
}

export function resolveProposalChargeAmountUsd(input: {
  options: ProposalOption[];
  optionIndex?: number;
  kind: ProposalPaymentKind;
  /** Override amount (e.g. custom deposit). */
  amountUsd?: number;
  depositPercent?: number;
}): { amountUsd: number; optionName: string; planTotalUsd: number } {
  const optionIndex = input.optionIndex ?? 0;
  const option = input.options[optionIndex] ?? input.options[0];
  const planTotalUsd = option ? Math.round(calculateTotal(option) * 100) / 100 : 0;
  const optionName = option?.name || "Treatment plan";

  if (input.amountUsd != null && Number.isFinite(input.amountUsd) && input.amountUsd > 0) {
    return {
      amountUsd: Math.round(input.amountUsd * 100) / 100,
      optionName,
      planTotalUsd,
    };
  }

  if (input.kind === "deposit") {
    const pct = input.depositPercent ?? DEFAULT_DEPOSIT_PERCENT;
    const amountUsd = Math.round(planTotalUsd * (pct / 100) * 100) / 100;
    return { amountUsd: Math.max(amountUsd, 0), optionName, planTotalUsd };
  }

  return { amountUsd: planTotalUsd, optionName, planTotalUsd };
}

export async function createProposalPaymentLink(input: {
  proposalId: string;
  publicId: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  options: ProposalOption[];
  kind: ProposalPaymentKind;
  optionIndex?: number;
  amountUsd?: number;
  depositPercent?: number;
  sentBy?: string | null;
  supabase: SupabaseClient;
}): Promise<
  | {
      ok: true;
      url: string;
      amountUsd: number;
      kind: ProposalPaymentKind;
      optionName: string;
      planTotalUsd: number;
      paymentLinkId?: string;
      orderId?: string;
      ledgerId?: string | null;
    }
  | { ok: false; error: string; status: number }
> {
  const charged = resolveProposalChargeAmountUsd({
    options: input.options,
    optionIndex: input.optionIndex,
    kind: input.kind,
    amountUsd: input.amountUsd,
    depositPercent: input.depositPercent,
  });

  if (charged.amountUsd <= 0) {
    return { ok: false, error: "Charge amount must be greater than zero.", status: 400 };
  }

  const label =
    input.kind === "deposit"
      ? `Deposit · ${charged.optionName}`
      : `Pay in full · ${charged.optionName}`;

  const link = await createRxPaymentLink({
    paymentType: "Proposal",
    squareName: label.slice(0, 100),
    amountUsd: charged.amountUsd,
    description: `Hello Gorgeous treatment proposal (${input.kind}) for ${input.clientName}`,
    clientLabel: input.clientName,
    redirectUrl: `${SITE.url}/proposals/${input.publicId}?paid=1`,
    askForShippingAddress: false,
  });

  if (!link.ok) {
    return { ok: false, error: link.error, status: link.status };
  }

  const ledger = await insertRxPaymentLedger(
    {
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      source: "treatment_proposal",
      templateName: charged.optionName,
      track: "proposals",
      lineLabel: label.startsWith("Proposal") ? label : `Proposal · ${label}`,
      amountUsd: charged.amountUsd,
      paymentStatus: "pending",
      paymentUrl: link.url,
      squarePaymentLinkId: link.paymentLinkId,
      squareOrderId: link.orderId,
      deliveryMethod: "link",
      sentBy: input.sentBy ?? null,
      staffNote: `Proposal ${input.proposalId} · ${input.kind}`,
      metadata: {
        proposal_id: input.proposalId,
        public_id: input.publicId,
        payment_kind: input.kind,
        option_name: charged.optionName,
        plan_total_usd: charged.planTotalUsd,
        payment_type: "Proposal",
        square_payment_type: "Proposal",
      },
    },
    input.supabase,
  );

  const { error } = await input.supabase
    .from("treatment_proposals")
    .update({
      payment_status: "pending",
      payment_kind: input.kind,
      payment_option_name: charged.optionName,
      payment_amount_usd: charged.amountUsd,
      payment_url: link.url,
      square_payment_link_id: link.paymentLinkId ?? null,
      square_order_id: link.orderId ?? null,
      ledger_id: ledger?.id ?? null,
      status: "sent",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.proposalId);

  if (error) {
    return { ok: false, error: error.message, status: 500 };
  }

  return {
    ok: true,
    url: link.url,
    amountUsd: charged.amountUsd,
    kind: input.kind,
    optionName: charged.optionName,
    planTotalUsd: charged.planTotalUsd,
    paymentLinkId: link.paymentLinkId,
    orderId: link.orderId,
    ledgerId: ledger?.id ?? null,
  };
}

export async function reconcileProposalFromSquarePayment(
  payment: {
    id?: string | null;
    status?: string | null;
    order_id?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
  },
  supabase: SupabaseClient,
): Promise<{ updated: number; proposalIds: string[] }> {
  const orderId = payment.order_id?.trim();
  if (!orderId || !payment.id) return { updated: 0, proposalIds: [] };

  const status = String(payment.status || "").toUpperCase();
  if (status !== "COMPLETED") return { updated: 0, proposalIds: [] };

  const paidAt = payment.updated_at || payment.created_at || new Date().toISOString();

  const { data: rows, error } = await supabase
    .from("treatment_proposals")
    .select("id, payment_kind, payment_status")
    .eq("square_order_id", orderId)
    .in("payment_status", ["pending", "unpaid"]);

  if (error || !rows?.length) return { updated: 0, proposalIds: [] };

  const proposalIds: string[] = [];
  for (const row of rows) {
    const nextStatus = row.payment_kind === "deposit" ? "deposit_paid" : "paid";
    const { error: updErr } = await supabase
      .from("treatment_proposals")
      .update({
        payment_status: nextStatus,
        square_payment_id: payment.id,
        paid_at: paidAt,
        status: "accepted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (!updErr) proposalIds.push(String(row.id));
  }

  return { updated: proposalIds.length, proposalIds };
}
