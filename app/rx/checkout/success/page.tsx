import type { Metadata } from "next";
import Link from "next/link";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { REGEN_SITE } from "@/lib/regen-site";

export const metadata: Metadata = {
  title: "Order Received | RE GEN by Hello Gorgeous Med Spa",
  description: "Your order has been received. A provider will review your intake and reach out.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Link href="/rx" className="inline-block">
          <RegenLogo width={160} />
        </Link>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-neutral-900">Order received!</h1>

          <p className="mt-4 text-neutral-600">
            Thanks for your order. A nurse-practitioner-directed provider will review your intake
            and reach out — often the same day.
          </p>

          <p className="mt-4 text-sm text-neutral-500">
            You'll receive an email confirmation shortly. Your medication will ship after provider
            approval.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/rx/start"
              className="block w-full rounded-lg bg-[#E6007E] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
            >
              Complete your intake form
            </Link>

            <Link
              href={`tel:+16306366193`}
              className="block w-full rounded-lg border border-neutral-300 py-3 text-center text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Call {REGEN_SITE.phone}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Questions? Email hello@hellogorgeousmedspa.com
        </p>
      </div>
    </div>
  );
}
