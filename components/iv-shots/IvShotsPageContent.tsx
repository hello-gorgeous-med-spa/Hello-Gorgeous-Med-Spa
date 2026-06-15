import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  IV_SHOTS_BUILD_BAG,
  IV_SHOTS_DRIPS,
  IV_SHOTS_FAQS,
  IV_SHOTS_HERO,
  IV_SHOTS_NAD,
  IV_SHOTS_VITAMIN_SHOTS,
} from "@/lib/iv-shots-page";
import { formatIvDripPrice } from "@/lib/iv-drip-menu";

function StampCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

export function IvShotsPageContent() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f3f4f6 100%)",
        }}
      />

      <Section className="scroll-mt-24 border-b-4 border-black bg-gradient-to-br from-black via-[#1a0a12] to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-xs font-bold uppercase tracking-[0.22em] mb-4">
              {IV_SHOTS_HERO.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              IV Therapy &{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Vitamin Shots
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
              {IV_SHOTS_HERO.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <CTA href={BOOKING_URL} variant="gradient">
                Book IV or Shots
              </CTA>
              <CTA href={IV_SHOTS_BUILD_BAG.appUrl} variant="outline">
                Open Hello Gorgeous App
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <StampCard>
              <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-2">
                Build Your IV Bag
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-black mb-3">
                Custom IV from {IV_SHOTS_BUILD_BAG.base500}
              </h2>
              <p className="text-black/85 font-medium leading-relaxed mb-4">
                Pick 500 mL ({IV_SHOTS_BUILD_BAG.base500}) or 1 L ({IV_SHOTS_BUILD_BAG.base1000}), add
                Olympia-sourced boosters in the app, and see a live price before you book. Most custom bags
                land {IV_SHOTS_BUILD_BAG.targetRange}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={IV_SHOTS_BUILD_BAG.builderUrl}
                  className="inline-flex rounded-full border-4 border-black bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:brightness-110"
                >
                  Build in app →
                </Link>
                <Link
                  href="/blog/build-your-iv-bag-app-launch"
                  className="inline-flex rounded-full border-4 border-black bg-white px-5 py-2.5 text-sm font-bold text-[#E6007E] hover:bg-[#FFF0F7]"
                >
                  How the IV builder works
                </Link>
              </div>
            </StampCard>
          </FadeUp>
        </div>
      </Section>

      <Section id="iv-drips" className="scroll-mt-24 border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-black uppercase text-white">
                  01
                </span>
                <h2 className="mt-4 text-3xl font-black text-black">IV Drips</h2>
                <p className="mt-2 text-black/75 font-medium max-w-2xl">
                  Signature Olympia-sourced formulas — each {IV_SHOTS_BUILD_BAG.signatureFrom}. Extra vitamin
                  pushes available at consult.
                </p>
              </div>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {IV_SHOTS_DRIPS.map((drip, idx) => (
              <FadeUp key={drip.id} delayMs={idx * 30}>
                <StampCard className="h-full">
                  <p className="text-2xl font-black text-[#E6007E] tabular-nums">
                    {formatIvDripPrice(drip.priceUsd)}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-black">{drip.name}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#E6007E]/80">
                    {drip.ingredients.join(" • ")}
                  </p>
                  <p className="mt-3 text-sm text-black/80 font-medium leading-relaxed">{drip.description}</p>
                </StampCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section id="vitamin-shots" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-black uppercase text-white">
              02
            </span>
            <h2 className="mt-4 text-3xl font-black text-black">Vitamin Bar Shots</h2>
            <p className="mt-2 text-black/75 font-medium max-w-2xl mb-2">
              Pull up to our drive-thru window or walk in — most visits take about 10 minutes. Pre-pay in the
              app or pay at checkout.
            </p>
            <p className="text-sm font-bold text-[#E6007E] mb-10">
              Member pricing on every shot · Glow Pass from $49/mo
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {IV_SHOTS_VITAMIN_SHOTS.map((shot, idx) => (
              <FadeUp key={shot.id} delayMs={idx * 25}>
                <StampCard className="h-full">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-2xl font-black text-[#E6007E] tabular-nums">${shot.price}</p>
                    {shot.memberPrice ? (
                      <p className="text-xs font-bold text-black/60">Members ${shot.memberPrice}</p>
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-lg font-black text-black">{shot.name}</h3>
                  <p className="mt-3 text-sm text-black/80 font-medium leading-relaxed">{shot.benefit}</p>
                  {shot.consultFirst ? (
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-black/50">
                      Consult / screening first
                    </p>
                  ) : null}
                </StampCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section id="nad" className="scroll-mt-24 border-b-4 border-black bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <StampCard>
              <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-black uppercase text-white">
                03
              </span>
              <h2 className="mt-4 text-3xl font-black text-black">NAD+ Injections & IV</h2>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border-2 border-black/10 bg-[#FFF0F7] p-5">
                  <p className="text-3xl font-black text-[#E6007E]">{IV_SHOTS_NAD.injection}</p>
                  <p className="text-sm font-bold text-black/60 mt-1">
                    Members {IV_SHOTS_NAD.injectionMember}
                  </p>
                  <h3 className="mt-3 font-black text-black">NAD+ Injection</h3>
                  <p className="mt-2 text-sm text-black/80 font-medium">
                    Quick in-office wellness injection for energy, focus, and cellular support.
                  </p>
                  <Link href={IV_SHOTS_NAD.detailPath} className="mt-4 inline-block text-sm font-bold text-[#E6007E] hover:underline">
                    NAD+ injection details →
                  </Link>
                </div>
                <div className="rounded-2xl border-2 border-black/10 bg-[#FFF0F7] p-5">
                  <p className="text-3xl font-black text-[#E6007E]">{IV_SHOTS_NAD.ivFrom}</p>
                  <h3 className="mt-3 font-black text-black">NAD+ IV Infusion</h3>
                  <p className="mt-2 text-sm text-black/80 font-medium">
                    Slow IV protocol over 2–4 hours for deeper cellular recovery — dose set at consult.
                  </p>
                  <Link href={IV_SHOTS_NAD.ivPath} className="mt-4 inline-block text-sm font-bold text-[#E6007E] hover:underline">
                    Full IV therapy menu →
                  </Link>
                </div>
              </div>
            </StampCard>
          </FadeUp>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl font-black text-black mb-8 text-center">Common questions</h2>
            <div className="space-y-4">
              {IV_SHOTS_FAQS.map((faq) => (
                <StampCard key={faq.question}>
                  <h3 className="font-bold text-[#E6007E]">▸ {faq.question}</h3>
                  <p className="mt-3 text-black/85 font-medium leading-relaxed">{faq.answer}</p>
                </StampCard>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to get started?</h2>
          <p className="text-white/90 text-lg mb-8 font-medium">
            Book IV therapy, pull up for a shot, or build your bag in the Hello Gorgeous app — downtown Oswego.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book Now
            </CTA>
            <CTA href={IV_SHOTS_BUILD_BAG.appUrl} variant="outline">
              Open App
            </CTA>
          </div>
        </div>
      </Section>
    </>
  );
}
