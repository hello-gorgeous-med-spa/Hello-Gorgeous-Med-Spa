import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegenPostPaymentIntakeForm } from "@/components/regen/RegenPostPaymentIntakeForm";
import { completeRegenOrderAndNotify } from "@/lib/regen/order-complete";
import {
  prefillRegenIntakeFromOrder,
  resolveOrderCategory,
} from "@/lib/regen/post-payment-intake";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  REGEN_CHECKOUT_INTAKE_PATH,
  regenCheckoutCompleteUrl,
} from "@/lib/flows";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Health Intake | RE GEN by Hello Gorgeous",
  description:
    "Complete your post-payment health intake so our NP can review your RE GEN order before shipment.",
  path: REGEN_CHECKOUT_INTAKE_PATH,
});

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function RegenCheckoutIntakePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderRef = params.ref?.trim();

  if (!orderRef) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Missing order reference</h1>
          <p className="text-white/60 mb-6">
            Use the link from your payment confirmation email, or contact us with your order number.
          </p>
          <Link href="/rx" className="text-[#FF2D8E] font-semibold underline">
            Return to RE GEN
          </Link>
        </div>
      </main>
    );
  }

  // Ensure paid + owner notified if patient lands here directly from Square redirect variant
  await completeRegenOrderAndNotify(orderRef);

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <p className="text-white/70">Intake temporarily unavailable. Call {SITE.phone}.</p>
      </main>
    );
  }

  const { data: order } = await admin
    .from("regen_orders")
    .select(
      "reference, status, customer_name, customer_email, customer_phone, goal, allergies, items, intake_completed_at"
    )
    .eq("reference", orderRef)
    .maybeSingle();

  if (!order || order.status === "pending_payment") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Payment not found</h1>
          <p className="text-white/60 mb-6">
            We couldn&apos;t locate a paid order for <span className="font-mono text-[#FF2D8E]">{orderRef}</span>.
            If you just paid, wait a moment and refresh — or call {SITE.phone}.
          </p>
          <Link href="/rx" className="text-[#FF2D8E] font-semibold underline">
            Return to RE GEN
          </Link>
        </div>
      </main>
    );
  }

  if (order.intake_completed_at) {
    redirect(regenCheckoutCompleteUrl(orderRef));
  }

  const category = resolveOrderCategory({
    goal: order.goal,
    items: Array.isArray(order.items) ? order.items : [],
  });

  const items = (Array.isArray(order.items) ? order.items : []) as Array<{
    name?: string;
    quantity?: number;
  }>;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/rx" className="flex items-center gap-2">
            <img src="/images/regen/regen-logo-white.png" alt="RE GEN" className="h-8" />
          </Link>
          <span className="text-xs text-white/50">Step 2 of 3 · Health intake</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        <RegenPostPaymentIntakeForm
          orderRef={orderRef}
          category={category}
          prefill={prefillRegenIntakeFromOrder(order)}
          items={items}
        />
      </div>
    </main>
  );
}
