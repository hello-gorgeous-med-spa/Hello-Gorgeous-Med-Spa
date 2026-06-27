/**
 * In-person clinic RX — 30-day monthly auto-pay via Square subscription.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { SITE } from "@/lib/seo";
import { createMembershipCheckoutUrl } from "@/lib/square/membership-checkout";
import {
  computeClinicSalePricing,
  getClinicEncounter,
  updateClinicEncounter,
  type RxClinicEncounterRow,
} from "@/lib/rx-clinic-encounter";

export type ClinicAutopayResult = {
  url: string;
  amountUsd: number;
  lineLabel: string;
  ledgerId: string | null;
  smsSent?: boolean;
};

export function clinicEncounterEligibleForAutopay(row: RxClinicEncounterRow): {
  ok: boolean;
  reason?: string;
} {
  if (row.supply_cycle !== "30-day") {
    return { ok: false, reason: "Auto-pay is for 30-day (monthly) supply only" };
  }
  if (!["paid", "ready_to_ship", "shipped", "complete"].includes(row.status)) {
    return { ok: false, reason: "Encounter must be paid before enrolling in auto-pay" };
  }
  if (row.autopay_status === "active") {
    return { ok: false, reason: "Auto-pay is already active on this encounter" };
  }
  return { ok: true };
}

export async function setupClinicEncounterAutopay(
  encounterId: string,
  opts: {
    sentBy: string;
    sendSms?: boolean;
  },
  client?: SupabaseClient | null,
): Promise<{ result: ClinicAutopayResult } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const encounter = await getClinicEncounter(encounterId, admin);
  if (!encounter) return { error: "Encounter not found" };

  const eligible = clinicEncounterEligibleForAutopay(encounter);
  if (!eligible.ok) return { error: eligible.reason || "Not eligible" };

  const pricing = computeClinicSalePricing({
    medication: encounter.medication,
    doseTierId: encounter.dose_tier_id,
    supplyCycle: "30-day",
    consultFeeUsd: 0,
    discountUsd: 0,
  });
  if ("error" in pricing) return { error: pricing.error };

  const quote = pricing.snapshot.quote;
  if (!quote) return { error: "Could not compute monthly price" };

  const amountUsd = pricing.snapshot.finalTotalUsd;
  const lineLabel = quote.lineLabel;
  const templateId = quote.invoiceTemplateId;

  const { data: clientRow } = await admin
    .from("clients")
    .select("first_name, last_name, email, phone")
    .eq("id", encounter.client_id)
    .maybeSingle();

  const clientName = clientRow
    ? `${clientRow.first_name || ""} ${clientRow.last_name || ""}`.trim()
    : "Client";

  const redirectUrl = `${SITE.url}/rx/status?clinicAutopay=1`;

  try {
    const checkout = await createMembershipCheckoutUrl({
      membershipId: `clinic-rx-${encounterId.slice(0, 8)}-${templateId}`,
      name: `${encounter.medication} — monthly ship-to-home`,
      priceDollars: amountUsd,
      redirectUrl,
    });

    const ledger = await insertRxPaymentLedger(
      {
        clientId: encounter.client_id,
        clientName,
        clientEmail: clientRow?.email,
        clientPhone: clientRow?.phone,
        source: "clinic_autopay",
        templateId,
        templateName: `${encounter.medication} monthly auto-pay`,
        track: "weight-loss",
        lineLabel,
        amountUsd,
        paymentUrl: checkout.url,
        squarePaymentLinkId: checkout.paymentLinkId ?? null,
        squareOrderId: checkout.orderId ?? null,
        deliveryMethod: "sms",
        sentBy: opts.sentBy,
        metadata: {
          clinicEncounterId: encounterId,
          supplyCycle: "30-day",
          mode: checkout.mode,
        },
      },
      admin,
    );

    await updateClinicEncounter(
      encounterId,
      {
        autopayStatus: "pending",
        autopayPaymentUrl: checkout.url,
        autopayLedgerId: ledger?.id ?? null,
      },
      admin,
    );

    let smsSent = false;
    if (opts.sendSms && clientRow?.phone) {
      const first = clientName.split(/\s+/)[0] || "there";
      const sms = await sendSms(
        clientRow.phone,
        `Hi ${first}! Set up monthly Hello Gorgeous RX billing ($${amountUsd.toFixed(0)}/mo, ships to your home): ${checkout.url} Reply STOP to opt out.`,
      );
      smsSent = sms.success;
    }

    return {
      result: {
        url: checkout.url,
        amountUsd,
        lineLabel,
        ledgerId: ledger?.id ?? null,
        smsSent,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[rx-clinic-autopay]", msg);
    return { error: "Auto-pay setup failed. Try again or enroll manually in Square." };
  }
}
