import type { Metadata } from "next";
import Link from "next/link";

import { HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import { pageMetadata, SITE } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = pageMetadata({
  title: "Payment Received | RE GEN by Hello Gorgeous Med Spa",
  description: "Your payment was successful. Schedule your telehealth visit to complete your order.",
  path: "/rx/checkout/success",
});

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function RegenCheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderRef = params.ref || null;

  // Update order status to paid
  if (orderRef) {
    const supabase = await createClient();
    await supabase
      .from("regen_orders")
      .update({ 
        status: "paid", 
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("reference", orderRef);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
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
        {/* Success Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl font-bold mb-4">Payment received!</h1>
        
        {orderRef && (
          <p className="text-lg text-white/70 mb-2">
            Order reference: <span className="font-mono text-[#FF2D8E]">{orderRef}</span>
          </p>
        )}

        <p className="text-white/60 text-sm mb-8">
          Thank you for your order. Save this reference — you&apos;ll need it for your telehealth visit.
        </p>

        {/* Next Steps Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-left">
          <h2 className="text-xl font-bold mb-6 text-center">
            <span className="text-[#FF2D8E]">Next step:</span> Schedule your telehealth visit
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E6007E] flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-white">Book your video visit</p>
                <p className="text-sm text-white/60">
                  Schedule a quick telehealth appointment with Ryan Kent, FNP-BC. Available same-day or next business day.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-white/80">NP reviews your order</p>
                <p className="text-sm text-white/50">
                  During your visit, Ryan will review your health history and confirm your protocol is safe for you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-white/80">Your Rx ships</p>
                <p className="text-sm text-white/50">
                  Once approved, we order from our pharmacy partner and ship to your door. You&apos;ll get tracking via email/SMS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <a
            href={HG_RX_TELEHEALTH_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-4 text-lg font-bold text-white hover:opacity-90 transition-opacity"
          >
            Schedule Telehealth Now →
          </a>

          <p className="text-xs text-white/40">
            Opens Fresha booking · Select &quot;RE GEN Telehealth&quot; · Mention order ref: {orderRef || "your reference"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
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

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-white/50">
            Questions about your order?{" "}
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-[#FF2D8E] font-medium">
              Call {SITE.phone}
            </a>
            {" "}or email{" "}
            <a href="mailto:hello@hellogorgeousmedspa.com" className="text-[#FF2D8E] font-medium">
              hello@hellogorgeousmedspa.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
