import type { Metadata } from "next";
import Link from "next/link";

import { Glp1IntakeForm } from "@/components/forms/Glp1IntakeForm";
import { GLP1_INTAKE_PATH, GLP1_REFILL_PATH } from "@/lib/flows";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 Secure Intake | Hello Gorgeous Med Spa | Oswego, IL",
  description:
    "Start your GLP-1 weight loss screening for Hello Gorgeous Med Spa. Eligible patients can book their consultation after submission. Oswego, IL — serving Naperville, Aurora & Plainfield.",
  path: GLP1_INTAKE_PATH,
});

export default function GLP1IntakePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50/80 via-white to-white text-black">
      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="text-black/70 text-sm font-sans font-medium ml-2">MED SPA</span>
          </Link>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/glp1-weight-loss" className="text-[#E6007E] font-medium hover:underline">
              Program overview
            </Link>
            <span className="text-black/30">|</span>
            <Link href={GLP1_REFILL_PATH} className="text-black/70 hover:text-[#E6007E]">
              Existing patient refill
            </Link>
            <span className="text-black/30">|</span>
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-black/70 hover:text-[#E6007E]">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
          <div className="shrink-0 justify-center md:justify-start flex">
            <img
              src="/images/shop-rx/glp1-intake-flyer.png"
              alt="GLP-1 intake — Hello Gorgeous Med Spa medical weight loss screening"
              width={220}
              height={330}
              className="rounded-2xl border-2 border-black/10 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">
              Secure screening
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-black leading-tight mb-3">
              GLP-1 program intake
            </h1>
            <p className="text-black/70 text-sm md:text-base leading-relaxed max-w-xl">
              Complete the form below so our clinical team can review eligibility. This is screening only—not a
              diagnosis or prescription. If you qualify, you&apos;ll be able to book your consultation as the next
              step.
            </p>
          </div>
        </div>

        <Glp1IntakeForm />

        <p className="mt-10 text-xs text-black/50 text-center max-w-2xl mx-auto leading-relaxed">
          Questions? Call{" "}
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-[#E6007E] font-medium">
            {SITE.phone}
          </a>
          . By continuing you agree we may contact you at the information you provide. See our{" "}
          <Link href="/privacy" className="text-[#E6007E] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
