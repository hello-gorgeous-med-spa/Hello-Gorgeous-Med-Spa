import Link from "next/link";
import { Metadata } from "next";

import { BESTIE_SQUARE_DISCOUNT } from "@/lib/square/bestie-discount";

export const metadata: Metadata = {
  title: "Bestie $100 Off | Admin",
  robots: { index: false, follow: false },
};

export default function AdminBestiePromoPage() {
  const d = BESTIE_SQUARE_DISCOUNT;
  return (
    <div className="max-w-lg mx-auto p-6 md:p-10">
      <Link href="/admin" className="text-sm text-[#E6007E] font-semibold hover:underline">
        ← Admin
      </Link>
      <h1 className="mt-4 text-2xl font-black text-black">Bestie Program — Square Discount</h1>
      <p className="mt-2 text-sm text-black/60">
        ${d.amountUsd} off any sale. Redeemable only in Square (POS or hosted checkout) — not in the
        Hello Gorgeous app.
      </p>

      <div className="mt-6 rounded-2xl border-4 border-black bg-gradient-to-br from-[#FFF0F7] to-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Square code</p>
        <p className="mt-1 text-4xl font-black tracking-tight">{d.code}</p>
        <p className="mt-2 text-lg font-bold text-black">${d.amountUsd}.00 off</p>
        <p className="mt-1 text-sm text-black/55">{d.posName}</p>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-black/45">At the register (POS)</h2>
        <ol className="mt-3 space-y-2">
          {d.posSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-black/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-black/45">
          Square checkout (online / payment links)
        </h2>
        <ol className="mt-3 space-y-2">
          {d.checkoutSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-black/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-bold">Not in the client app</p>
        <p className="mt-1 text-amber-900/80">
          Clients cannot enter BESTIE100 inside the Hello Gorgeous app. App pre-pay sends them to
          Square — they apply the code on Square&apos;s checkout page.
        </p>
      </section>

      <section className="mt-8 rounded-xl border-2 border-black/10 bg-gray-50 p-4 text-xs text-black/55 space-y-1">
        <p>
          <span className="font-semibold text-black/70">Discount ID:</span> {d.discountId}
        </p>
        <p>
          <span className="font-semibold text-black/70">Pricing rule:</span> {d.pricingRuleId}
        </p>
        <p className="pt-2">{d.dashboardNote}</p>
      </section>

      <p className="mt-6 text-xs text-black/45">
        Create another catalog discount:{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5">npm run square:discount-code:local</code>
      </p>
    </div>
  );
}
