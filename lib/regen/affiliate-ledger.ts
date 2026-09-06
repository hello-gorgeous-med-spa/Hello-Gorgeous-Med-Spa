import type { SupabaseClient } from "@supabase/supabase-js";

import {
  AFFILIATE_HOLDING_DAYS,
  AFFILIATE_INTAKE_BONUS_USD,
  AFFILIATE_RECURRING_MONTHS,
  AFFILIATE_RECURRING_PERCENT,
  hashAffiliateEmail,
  qualifiesForIntakeBonus,
  type AffiliatePartnerType,
} from "@/lib/regen-affiliates";

type AffiliateRow = {
  id: string;
  code: string;
  partner_type: AffiliatePartnerType;
  status: string;
};

export async function findActiveAffiliate(
  supabase: SupabaseClient,
  code: string | null | undefined,
): Promise<AffiliateRow | null> {
  if (!code) return null;
  const { data } = await supabase
    .from("regen_affiliates")
    .select("id, code, partner_type, status")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (!data || data.status !== "active") return null;
  return data as AffiliateRow;
}

export async function recordAffiliateClick(
  supabase: SupabaseClient,
  affiliate: AffiliateRow,
  path: string,
  source?: string,
) {
  await supabase.from("regen_affiliate_clicks").insert({
    affiliate_id: affiliate.id,
    code: affiliate.code,
    path: path.slice(0, 200),
    source: source?.slice(0, 80) || null,
  });
}

export async function touchAffiliateAttribution(
  supabase: SupabaseClient,
  affiliate: AffiliateRow,
  email: string,
  extras?: { signup?: boolean; intakeId?: string },
) {
  const patient_email_hash = await hashAffiliateEmail(email);
  const { data: existing } = await supabase
    .from("regen_affiliate_attributions")
    .select("id")
    .eq("affiliate_id", affiliate.id)
    .eq("patient_email_hash", patient_email_hash)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("regen_affiliate_attributions")
      .update({
        signup_at: extras?.signup ? new Date().toISOString() : undefined,
        intake_id: extras?.intakeId || undefined,
      })
      .eq("id", existing.id);
    return;
  }

  await supabase.from("regen_affiliate_attributions").insert({
    affiliate_id: affiliate.id,
    code: affiliate.code,
    patient_email_hash,
    signup_at: extras?.signup ? new Date().toISOString() : null,
    intake_id: extras?.intakeId || null,
  });
}

export async function recordIntakeBonus(
  supabase: SupabaseClient,
  code: string | null | undefined,
  email: string,
  intakeId: string,
) {
  const affiliate = await findActiveAffiliate(supabase, code);
  if (!affiliate || !qualifiesForIntakeBonus(affiliate.partner_type)) return;
  const patient_email_hash = await hashAffiliateEmail(email);
  await touchAffiliateAttribution(supabase, affiliate, email, { signup: true, intakeId });
  const payableAt = new Date(Date.now() + AFFILIATE_HOLDING_DAYS * 24 * 60 * 60 * 1000);
  await supabase.from("regen_affiliate_commissions").insert({
    affiliate_id: affiliate.id,
    kind: "intake_bonus",
    status: "holding",
    amount_usd: AFFILIATE_INTAKE_BONUS_USD,
    basis_usd: 0,
    intake_id: intakeId,
    patient_email_hash,
    payable_at: payableAt.toISOString(),
    notes: "Clinic partner completed-intake bonus",
  });
}

export async function recordPaidOrderCommission(
  supabase: SupabaseClient,
  code: string | null | undefined,
  email: string,
  orderReference: string,
  medicationUsd: number,
) {
  const affiliate = await findActiveAffiliate(supabase, code);
  if (!affiliate) return;
  const patient_email_hash = await hashAffiliateEmail(email);
  await touchAffiliateAttribution(supabase, affiliate, email, { signup: true });

  const { count } = await supabase
    .from("regen_affiliate_commissions")
    .select("id", { count: "exact", head: true })
    .eq("affiliate_id", affiliate.id)
    .eq("patient_email_hash", patient_email_hash)
    .eq("kind", "recurring_percent")
    .neq("status", "void");

  const monthIndex = (count || 0) + 1;
  if (monthIndex > AFFILIATE_RECURRING_MONTHS) return;

  const basis = Math.max(0, Number(medicationUsd) || 0);
  const amount = Math.round(basis * (AFFILIATE_RECURRING_PERCENT / 100) * 100) / 100;
  if (amount <= 0) return;

  const payableAt = new Date(Date.now() + AFFILIATE_HOLDING_DAYS * 24 * 60 * 60 * 1000);
  await supabase.from("regen_affiliate_commissions").insert({
    affiliate_id: affiliate.id,
    kind: "recurring_percent",
    status: "holding",
    amount_usd: amount,
    basis_usd: basis,
    month_index: monthIndex,
    order_reference: orderReference,
    patient_email_hash,
    payable_at: payableAt.toISOString(),
    notes: `${AFFILIATE_RECURRING_PERCENT}% of medication (month ${monthIndex} of ${AFFILIATE_RECURRING_MONTHS})`,
  });
}
