import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL, GLP1_INTAKE_PATH } from "@/lib/flows";
import { pageMetadata, SITE } from "@/lib/seo";

const INTAKE_IFRAME_SRC = process.env.NEXT_PUBLIC_INTAKEQ_GLP1_IFRAME_SRC?.trim();

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 Secure Intake | Hello Gorgeous Med Spa | Oswego, IL",
  description:
    "Start your HIPAA-compliant GLP-1 weight loss screening for Hello Gorgeous Med Spa. Eligible patients can book their consultation after submission. Oswego, IL — serving Naperville, Aurora & Plainfield.",
  path: GLP1_INTAKE_PATH,
});

export default function GLP1IntakePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50/80 via-white to-white text-black">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="text-black/70 text-sm font-sans font-medium ml-2">MED SPA</span>
          </Link>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/glp1-weight-loss" className="text-[#E6007E] font-medium hover:underline">
              Program overview
            </Link>
            <span className="text-black/30">|</span>
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-black/70 hover:text-[#E6007E]">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
          <div className="flex gap-4 shrink-0 justify-center md:justify-start">
            <Image
              src="/images/marketing/glp1-vial-hello-gorgeous.svg"
              alt=""
              width={100}
              height={150}
              className="drop-shadow-md"
            />
            <Image
              src="/images/marketing/glp1-tablets-hello-gorgeous.svg"
              alt=""
              width={100}
              height={172}
              className="drop-shadow-md"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">HIPAA-compliant screening</p>
            <h1 className="font-serif text-3xl md:text-4xl text-black leading-tight mb-3">
              GLP-1 program intake
            </h1>
            <p className="text-black/70 text-sm md:text-base leading-relaxed max-w-xl">
              Complete the secure form below so our clinical team can review eligibility. This is screening only—not a diagnosis
              or prescription. If you qualify, you&apos;ll be able to book your consultation as the next step.
            </p>
          </div>
        </div>

        {INTAKE_IFRAME_SRC ? (
          <div className="rounded-2xl border-2 border-black overflow-hidden bg-white shadow-lg">
            <iframe
              title="Hello Gorgeous GLP-1 intake form"
              src={INTAKE_IFRAME_SRC}
              className="w-full min-h-[920px] border-0"
              allow="clipboard-write"
            />
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-black/25 bg-white p-8 md:p-10 text-center">
            <p className="text-black font-semibold mb-2">Intake form coming online</p>
            <p className="text-black/65 text-sm max-w-md mx-auto mb-6">
              Our secure IntakeQ form is being connected. You can still book a consultation directly—we&apos;ll complete screening
              in the office.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              Book consultation (Fresha) →
            </a>
          </div>
        )}

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
