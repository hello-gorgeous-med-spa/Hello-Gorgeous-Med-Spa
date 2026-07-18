import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  CHERRY_FINANCING_URL,
  QUANTUM_RF_LAUNCH_PACKAGES,
  QUANTUM_RF_LAUNCH_PATH,
  QUANTUM_RF_LAUNCH_STATS,
} from "@/lib/quantum-rf-launch-promo";
import { SITE } from "@/lib/seo";

export function QuantumRFLaunchPromoSection({ id = "quantum-rf-launch" }: { id?: string }) {
  return (
    <>
      <Section
        id={id}
        className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-black via-[#1a0a12] to-black text-white py-14 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeUp>
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
                Now introducing · InMode Quantum RF
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-black leading-tight">
                The new standard in{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent italic"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  body contouring
                </span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-white/80 font-medium">
                Lipo results. No surgery. No operating room.
              </p>
              <p className="mt-2 text-sm text-white/55">
                Ryan Kent, FNP-BC · Danielle Alcala, RN-S · {SITE.address.addressLocality}, IL
              </p>
            </div>
          </FadeUp>

        </div>
      </Section>

      <Section className="border-b-4 border-black bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeUp>
            <h3 className="text-center text-2xl md:text-3xl font-black text-black mb-8">
              Launch packages — each includes{" "}
              <span className="text-[#E6007E]">FREE Morpheus8 Burst</span>
            </h3>
          </FadeUp>
          <div className="grid gap-6 md:grid-cols-2">
            {QUANTUM_RF_LAUNCH_PACKAGES.map((pkg, idx) => (
              <FadeUp key={pkg.id} delayMs={idx * 60}>
                <article className="relative flex h-full flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.3)]">
                  {pkg.badge ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-[#E6007E] px-3 py-1 text-[10px] font-bold uppercase text-white">
                      {pkg.badge}
                    </span>
                  ) : null}
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">{pkg.name}</p>
                  <p className="mt-2 text-4xl font-black text-black">{pkg.price}</p>
                  <p className="mt-1 text-sm font-semibold text-black/60">{pkg.financing}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-black/80">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="text-[#E6007E]" aria-hidden>
                          ▸
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3 text-sm font-bold text-[#E6007E]">
                    {pkg.bonus}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-[#FFF0F7] py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeUp>
            <h3 className="text-xl font-black text-black mb-6">What is Quantum RF?</h3>
            <p className="max-w-3xl text-black/80 leading-relaxed">
              A minimally invasive, one-session treatment using local anesthesia. InMode technology delivers
              fractionated bipolar RF energy beneath the skin via ultra-thin micro-cannulas — breaking down fat
              and contracting tissue at the same time for immediate sculpting that continues to improve as collagen
              builds.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {QUANTUM_RF_LAUNCH_STATS.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-2xl border-2 border-black bg-white p-5 text-center shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                >
                  <p className="text-3xl font-black text-[#E6007E]">{stat.value}</p>
                  <p className="mt-2 text-sm text-black/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section
        className="border-b-4 border-black py-12 md:py-16 text-white"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <FadeUp>
            <h3 className="text-2xl md:text-3xl font-black">Ready for your consultation?</h3>
            <p className="mt-3 text-white/90">
              Cherry financing available — as low as 0% APR · instant approval · no hard credit pull.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <CTA href={BOOKING_URL} variant="white" className="min-h-[44px]">
                Book free consult
              </CTA>
              <a
                href={CHERRY_FINANCING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-white px-8 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Apply with Cherry
              </a>
              <Link
                href={QUANTUM_RF_LAUNCH_PATH}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-white/70 px-8 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Full Quantum RF details →
              </Link>
            </div>
            <p className="mt-8 text-[10px] text-white/60 leading-relaxed max-w-xl mx-auto">
              Results may vary. Not a weight loss procedure. Consult required for candidacy. Financing subject to
              approval. Morpheus8 Burst bonus included with qualifying Quantum RF packages while offer is active.
            </p>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
