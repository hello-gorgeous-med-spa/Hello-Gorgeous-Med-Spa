/**
 * Hims-compete Phase 2 — auto-approve dispatch when paid and clinically clear.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { evaluateGlp1RefillEligibility } from "@/lib/glp1-refill-intake";
import { evaluateGlp1Eligibility } from "@/lib/glp1-intake";
import { evaluatePeptideEligibility } from "@/lib/peptide-intake";
import {
  glp1TelehealthRequiredBeforeShip,
  glp1TelehealthWaivedForOrder,
} from "@/lib/glp1-telehealth-policy";
import { isGlp1FormSlug } from "@/lib/glp1-form-alert";
import { isPeptideFormSlug } from "@/lib/peptide-form-alert";
import type { RxDispatchStatus } from "@/lib/rx-dispatch";
import { getLatestLedgerForSubmission } from "@/lib/rx-payment-ledger";

const BLOCKING_FLAG_PATTERNS = [
  /side effect/i,
  /dose change/i,
  /switch/i,
  /insurance pharmacy/i,
  /pick-up/i,
  /telehealth check-in required/i,
  /disqualif/i,
];

function hasBlockingProviderFlags(flags: string[]): boolean {
  return flags.some((flag) => BLOCKING_FLAG_PATTERNS.some((re) => re.test(flag)));
}

function peptideSlugAutoApprove(slug: string, responses: Record<string, unknown>): boolean {
  if (!isPeptideFormSlug(slug)) return false;
  const eligibility = evaluatePeptideEligibility(responses);
  if (!eligibility.qualified) return false;
  return !hasBlockingProviderFlags(eligibility.providerFlags);
}

function glp1SlugAutoApprove(slug: string, responses: Record<string, unknown>): boolean {
  if (!isGlp1FormSlug(slug)) return false;

  const eligibility =
    slug.includes("refill")
      ? evaluateGlp1RefillEligibility(responses)
      : evaluateGlp1Eligibility(responses);

  if (!eligibility.qualified) return false;
  if (hasBlockingProviderFlags(eligibility.providerFlags)) return false;

  if (glp1TelehealthRequiredBeforeShip({
    supplyCycleRaw: responses.supply_cycle,
    lastVisitWithin90Days: responses.last_visit_within_12mo,
    doseChanges: responses.dose_changes,
    sideEffects: responses.side_effects,
    monthlyAutopayCommitment: responses.monthly_autopay_commitment === true,
  })) {
    return false;
  }

  return glp1TelehealthWaivedForOrder({
    supplyCycleRaw: responses.supply_cycle,
    monthlyAutopayCommitment: responses.monthly_autopay_commitment === true,
  }) || responses.last_visit_within_12mo === "Yes";
}

export async function maybeAutoApproveRxDispatch(
  admin: SupabaseClient,
  submissionId: string,
): Promise<{ approved: boolean; reason?: string }> {
  if (process.env.RX_AUTO_APPROVE_DISPATCH_ENABLED === "false") {
    return { approved: false, reason: "disabled" };
  }

  const { data: sub } = await admin
    .from("hg_form_submissions")
    .select("id, signer_name, responses_json, template:hg_form_templates(slug)")
    .eq("id", submissionId)
    .maybeSingle();

  if (!sub) return { approved: false, reason: "submission not found" };

  const slug = (sub as { template?: { slug?: string } }).template?.slug ?? "";
  const responses = (sub.responses_json ?? {}) as Record<string, unknown>;

  const ledger = await getLatestLedgerForSubmission(submissionId, admin);
  if (!ledger || ledger.payment_status !== "paid") {
    return { approved: false, reason: "payment not complete" };
  }

  const { data: dispatch } = await admin
    .from("hg_rx_dispatch")
    .select("status")
    .eq("submission_id", submissionId)
    .maybeSingle();

  if (!dispatch) return { approved: false, reason: "no dispatch row" };
  if (dispatch.status === "approved" || dispatch.status === "sent") {
    return { approved: false, reason: "already approved or sent" };
  }

  const canApprove =
    peptideSlugAutoApprove(slug, responses) || glp1SlugAutoApprove(slug, responses);

  if (!canApprove) {
    return { approved: false, reason: "clinical review required" };
  }

  const status: RxDispatchStatus = "approved";
  const staffNotes = [
    "Auto-approved — paid + clinically clear (Hims-compete Phase 2).",
    responses.autopay_renewal ? "Auto-pay renewal." : null,
    "Staff: place BoomRx order and mark sent.",
  ]
    .filter(Boolean)
    .join(" ");

  const { error } = await admin
    .from("hg_rx_dispatch")
    .update({
      status,
      staff_notes: staffNotes,
      updated_at: new Date().toISOString(),
      updated_by: "system:auto-approve",
    })
    .eq("submission_id", submissionId)
    .in("status", ["new", "reviewed"]);

  if (error) return { approved: false, reason: error.message };
  return { approved: true };
}
