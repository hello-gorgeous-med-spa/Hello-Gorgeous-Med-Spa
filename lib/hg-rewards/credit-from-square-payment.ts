import type { SupabaseClient } from "@supabase/supabase-js";

import { getTierForVisits } from "@/lib/loyalty-tiers";
import { getAccessToken } from "@/lib/square/oauth";
import { calculatePointsEarned } from "@/lib/unit-bank";

export type SquarePaymentLike = {
  id: string;
  status?: string;
  customer_id?: string | null;
  amount_money?: { amount?: number | bigint | null } | null;
  total_money?: { amount?: number | bigint | null } | null;
};

export type CreditHgRewardsResult =
  | { credited: true; client_id: string; points_earned: number; new_balance: number; tier: string; payment_id: string }
  | { credited: false; reason: string; payment_id?: string; square_customer_id?: string | null };

function paymentNote(paymentId: string) {
  return `Square payment ${paymentId}`;
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "").slice(-10);
}

function dollarsFromPayment(payment: SquarePaymentLike): number {
  const totalCents = Number(payment.total_money?.amount ?? payment.amount_money?.amount ?? 0);
  return totalCents / 100;
}

/** Find HG client for a Square customer — prefer square_customer_id on file. */
export async function findHgClientForSquareCustomer(
  supabase: SupabaseClient,
  opts: {
    squareCustomerId?: string | null;
    email?: string | null;
    phone?: string | null;
  },
): Promise<{ id: string; total_visits: number | null } | null> {
  if (opts.squareCustomerId) {
    const { data } = await supabase
      .from("clients")
      .select("id, total_visits")
      .eq("square_customer_id", opts.squareCustomerId)
      .maybeSingle();
    if (data) return data;
  }

  if (opts.email) {
    const { data } = await supabase
      .from("clients")
      .select("id, total_visits")
      .ilike("email", opts.email.trim())
      .maybeSingle();
    if (data) return data;
  }

  if (opts.phone) {
    const last10 = normalizePhone(opts.phone);
    if (last10.length === 10) {
      const { data: matches } = await supabase
        .from("clients")
        .select("id, total_visits, phone")
        .ilike("phone", `%${last10}%`)
        .limit(5);
      const exact = matches?.find((c) => c.phone && normalizePhone(c.phone) === last10);
      if (exact) return exact;
    }
  }

  return null;
}

async function fetchSquareCustomerHints(customerId: string) {
  try {
    const token = await getAccessToken();
    if (!token) return {};
    const squareRes = await fetch(`https://connect.squareup.com/v2/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-12-18",
      },
    });
    if (!squareRes.ok) return {};
    const squareData = await squareRes.json();
    return {
      email: squareData.customer?.email_address ?? null,
      phone: squareData.customer?.phone_number ?? null,
    };
  } catch {
    return {};
  }
}

/** Auto-credit HG Rewards points when a Square payment completes. Idempotent per payment ID. */
export async function creditHgRewardsFromSquarePayment(
  supabase: SupabaseClient,
  payment: SquarePaymentLike,
  customerHints?: { email?: string | null; phone?: string | null },
): Promise<CreditHgRewardsResult> {
  const paymentId = payment.id;
  if (!paymentId) return { credited: false, reason: "Missing payment id" };

  if (payment.status && payment.status !== "COMPLETED") {
    return { credited: false, reason: `Payment status: ${payment.status}`, payment_id: paymentId };
  }

  const { data: existing } = await supabase
    .from("unit_bank")
    .select("id")
    .eq("note", paymentNote(paymentId))
    .maybeSingle();

  if (existing) {
    return { credited: false, reason: "Already processed", payment_id: paymentId };
  }

  const totalDollars = dollarsFromPayment(payment);
  if (totalDollars < 1) {
    return { credited: false, reason: "Amount too small", payment_id: paymentId };
  }

  const squareCustomerId = payment.customer_id ?? null;
  if (!squareCustomerId) {
    return { credited: false, reason: "No customer_id on payment", payment_id: paymentId };
  }

  let hgClient = await findHgClientForSquareCustomer(supabase, {
    squareCustomerId,
    email: customerHints?.email,
    phone: customerHints?.phone,
  });

  if (!hgClient && squareCustomerId) {
    const hints = await fetchSquareCustomerHints(squareCustomerId);
    hgClient = await findHgClientForSquareCustomer(supabase, {
      squareCustomerId,
      email: hints.email ?? customerHints?.email,
      phone: hints.phone ?? customerHints?.phone,
    });
  }

  if (!hgClient) {
    return {
      credited: false,
      reason: "No matching HG client",
      payment_id: paymentId,
      square_customer_id: squareCustomerId,
    };
  }

  const visits = hgClient.total_visits ?? 0;
  const tier = getTierForVisits(visits);
  const pointsEarned = calculatePointsEarned(totalDollars, tier.id);

  if (pointsEarned <= 0) {
    return { credited: false, reason: "Zero points calculated", payment_id: paymentId };
  }

  const { data: balanceRow } = await supabase
    .from("unit_bank_balances")
    .select("balance")
    .eq("client_id", hgClient.id)
    .maybeSingle();

  const currentBalance = balanceRow?.balance ?? 0;
  const newBalance = currentBalance + pointsEarned;

  const { error } = await supabase.from("unit_bank").insert({
    client_id: hgClient.id,
    type: "earned",
    units: pointsEarned,
    balance_after: newBalance,
    units_purchased: totalDollars,
    note: paymentNote(paymentId),
    created_by: "square-webhook",
  });

  if (error) {
    console.error("[HG Rewards] unit_bank insert failed", error);
    return { credited: false, reason: error.message, payment_id: paymentId };
  }

  await supabase
    .from("clients")
    .update({
      total_visits: visits + 1,
      last_visit_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      square_customer_id: squareCustomerId,
    })
    .eq("id", hgClient.id);

  console.log(
    `[HG Rewards] ${pointsEarned} pts → client ${hgClient.id} ($${totalDollars}, ${tier.id}, balance ${newBalance})`,
  );

  return {
    credited: true,
    client_id: hgClient.id,
    points_earned: pointsEarned,
    new_balance: newBalance,
    tier: tier.id,
    payment_id: paymentId,
  };
}
