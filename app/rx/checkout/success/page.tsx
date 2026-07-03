import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { completeRegenOrderAndNotify } from "@/lib/regen/order-complete";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  REGEN_CHECKOUT_SUCCESS_PATH,
  regenCheckoutCompleteUrl,
  regenCheckoutIntakeUrl,
} from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Payment Received | RE GEN by Hello Gorgeous Med Spa",
  description: "Your payment was successful. Complete your health intake next.",
  path: REGEN_CHECKOUT_SUCCESS_PATH,
});

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

/** Marks order paid, pings staff, then routes to intake or telehealth step. */
export default async function RegenCheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderRef = params.ref?.trim() || null;

  if (!orderRef) {
    redirect("/rx");
  }

  await completeRegenOrderAndNotify(orderRef);

  const admin = getSupabaseAdminClient();
  if (admin) {
    const { data: order } = await admin
      .from("regen_orders")
      .select("intake_completed_at")
      .eq("reference", orderRef)
      .maybeSingle();

    if (order?.intake_completed_at) {
      redirect(regenCheckoutCompleteUrl(orderRef));
    }
  }

  redirect(regenCheckoutIntakeUrl(orderRef));
}
