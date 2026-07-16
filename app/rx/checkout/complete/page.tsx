import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ClearCartOnPaidOrder } from "@/components/regen/ClearCartOnPaidOrder";
import { RegenCheckoutCompleteClient } from "@/components/regen/RegenCheckoutCompleteClient";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { buildRegenPatientTracker } from "@/lib/rx-pharmacy-fulfillment/patient-tracker";
import {
  REGEN_CHECKOUT_COMPLETE_PATH,
  REGEN_CHECKOUT_INTAKE_PATH,
  regenCheckoutIntakeUrl,
} from "@/lib/flows";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book Telehealth | RE GEN by Hello Gorgeous",
  description:
    "Schedule your NP telehealth visit. Required before your RE GEN prescription ships.",
  path: REGEN_CHECKOUT_COMPLETE_PATH,
});

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function RegenCheckoutCompletePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderRef = params.ref?.trim();

  if (!orderRef) {
    redirect(REGEN_CHECKOUT_INTAKE_PATH);
  }

  const admin = getSupabaseAdminClient();
  const order = admin
    ? (
        await admin
          .from("regen_orders")
          .select("reference, intake_completed_at, telehealth_required, items")
          .eq("reference", orderRef)
          .maybeSingle()
      ).data
    : null;

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="text-white/60 mb-6">
            We couldn&apos;t find order{" "}
            <span className="font-mono text-[#FF2D8E]">{orderRef}</span>. Check your confirmation
            email or call {SITE.phone}.
          </p>
          <Link href="/rx/status" className="text-[#FF2D8E] font-semibold underline">
            Look up order status
          </Link>
        </div>
      </main>
    );
  }

  if (!order.intake_completed_at) {
    redirect(regenCheckoutIntakeUrl(orderRef));
  }

  const items = (Array.isArray(order.items) ? order.items : []) as Array<{ name?: string }>;
  const tracker = await buildRegenPatientTracker(orderRef);

  return (
    <main className="min-h-screen bg-black text-white">
      <ClearCartOnPaidOrder orderRef={orderRef} />
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/rx" className="flex items-center gap-2">
            <img src="/images/regen/regen-logo-white.png" alt="RE GEN" className="h-8" />
          </Link>
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-sm text-white/70 hover:text-white">
            {SITE.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E]">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="font-serif text-4xl font-bold mb-4">Intake complete!</h1>

        <p className="text-lg text-white/70 mb-2">
          Order: <span className="font-mono text-[#FF2D8E]">{orderRef}</span>
        </p>

        {items.length > 0 && (
          <p className="text-sm text-white/50 mb-8">
            {items.map((i) => i.name).filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-left">
          <h2 className="text-xl font-bold mb-6 text-center">
            <span className="text-[#FF2D8E]">Final step:</span> Book your telehealth visit
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E6007E] flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-white">Payment received</p>
                <p className="text-sm text-white/50">Your order is secured.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E6007E] flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-white">Health intake submitted</p>
                <p className="text-sm text-white/50">
                  Ryan Kent, FNP-BC will review your history before approving your protocol.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FF2D8E] font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-white">Schedule telehealth</p>
                <p className="text-sm text-white/60">
                  Required before your Rx ships. Same-day or next business day availability.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-white/70">Rx ships to your door</p>
                <p className="text-sm text-white/45">
                  After NP approval, we order from our pharmacy partner. Tracking via email/SMS.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left">
          <RegenCheckoutCompleteClient
            orderRef={orderRef}
            telehealthRequired={order.telehealth_required !== false}
          />
        </div>

        <p className="mt-4 text-xs text-white/40">
          After booking on Square, this page updates automatically when your visit is linked to order{" "}
          {orderRef}.
        </p>

        {tracker ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="font-serif text-lg font-bold mb-4">Pharmacy shipment status</h2>
            <p className="text-sm text-white/60 mb-4">
              {tracker.pharmacy ? `Routed to ${tracker.pharmacy}` : "Fulfillment tracking"}
            </p>
            <div className="space-y-3">
              {tracker.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step.complete
                        ? "bg-[#E6007E] text-white"
                        : step.current
                          ? "bg-[#FF2D8E]/20 text-[#FF2D8E] ring-2 ring-[#FF2D8E]"
                          : "bg-white/10 text-white/40"
                    }`}
                  >
                    {step.complete ? "✓" : "·"}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        step.complete || step.current ? "text-white" : "text-white/50"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.detail ? <p className="text-xs text-white/50">{step.detail}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/portal/rx"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            View my RX portal
          </Link>
          <Link
            href="/rx"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
