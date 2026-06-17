"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HELP_ME_CHOOSE_OPTIONS } from "@/lib/help-me-choose-data";
import { BOOKING_URL } from "@/lib/flows";

const BRAND = {
  pink: "#E6007E",
  hot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

export function HelpMeChooseContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 40%, #fafafa 100%)
          `,
        }}
      />

      <Section className="relative border-b-4 border-black !px-0 py-14 md:py-20">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 50%, #2d1020 100%)`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
              Hello Gorgeous Med Spa · Oswego, IL
            </p>
            <h1 className="mt-3 font-black text-3xl text-white md:text-5xl">
              Not Sure What to{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Book?
              </span>{" "}
              Start Here.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/75 md:text-lg">
              Tell us what you want to improve, and we&apos;ll guide you toward the best treatment
              options at Hello Gorgeous Med Spa.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section className="!px-0 py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {HELP_ME_CHOOSE_OPTIONS.map((option, i) => (
            <FadeUp key={option.id} delayMs={Math.min(i * 40, 200)}>
              <Link
                href={option.href}
                className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
              >
                <h2 className="text-lg font-black text-[#E6007E]">{option.title}</h2>
                <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-black/80">
                  {option.description}
                </p>
                {option.related && option.related.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {option.related.map((link) => (
                      <span
                        key={link.href}
                        className="rounded-full border border-black/15 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-black/70"
                      >
                        {link.label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <span className="mt-4 text-sm font-bold text-black">Learn more →</span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section className="border-t-4 border-black bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] !px-0 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <FadeUp>
            <h2 className="text-2xl font-black text-white md:text-3xl">Still not sure?</h2>
            <p className="mt-3 text-base font-medium text-white/90">
              Book a free consultation and we&apos;ll help you choose the right plan — no pressure,
              no upsell.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={BOOKING_URL} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]">
                Book Free Consultation
              </CTA>
              <Link
                href="/"
                className="text-sm font-bold text-white/90 underline decoration-white/40 hover:text-white"
              >
                Back to homepage
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>
    </div>
  );
}
