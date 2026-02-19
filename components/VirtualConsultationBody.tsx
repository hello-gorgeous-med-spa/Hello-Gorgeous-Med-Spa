"use client";

import Link from "next/link";
import { BodyConsultationTool } from "./BodyConsultationTool";
import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

export function VirtualConsultationBody() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — black, white text, brand pink (Opus style) */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeUp>
            <p className="text-[#E6007E] text-lg md:text-xl font-semibold mb-4 tracking-wide uppercase">
              Free · No pressure
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Virtual Consultation
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Click the areas you&apos;d like to improve. Your personalized treatment plan is one tap away.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <p className="text-white/70 text-sm flex items-center">
                Know what you want?{" "}
                <Link href={BOOKING_URL} className="text-[#E6007E] hover:underline font-semibold">
                  Book directly →
                </Link>
              </p>
              <CTA href={BOOKING_URL} variant="gradient" className="inline-flex w-fit">
                Get My Plan
              </CTA>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Tool — white section */}
      <div className="border-t border-black/10 bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <BodyConsultationTool embedded={false} />
        </div>
      </div>
    </div>
  );
}
