"use client";

import Script from "next/script";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import {
  BOOKING_URL,
  SQUARE_APPOINTMENTS_EMBED_SCRIPT_URL,
} from "@/lib/flows";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

export function SquareBookPageContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        <Section className="relative border-b-4 border-black py-12 md:py-16 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-6">
            <FadeUp>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
                Square Online Booking
              </div>
              <p className="mb-3 text-sm font-semibold text-[#FFB8DC] md:text-base">{HG_TAGLINE}</p>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/70 md:text-sm">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="mb-4 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-5xl">
                Book your{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  visit
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
                Choose a service, staff, and time — appointments sync straight into Square at Hello Gorgeous.
              </p>
            </FadeUp>
          </div>
        </Section>

        <Section className="border-b-4 border-black bg-white py-10 md:py-14 !px-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FadeUp>
              <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    Select service · provider · time
                  </p>
                </div>
                <div className="min-h-[520px] bg-white p-2 sm:p-4" id="square-appointments-embed">
                  <Script
                    src={SQUARE_APPOINTMENTS_EMBED_SCRIPT_URL}
                    strategy="afterInteractive"
                  />
                </div>
              </div>
            </FadeUp>

            <FadeUp delayMs={40}>
              <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
                <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                  Open full Square booking
                </CTA>
                <CTA
                  href={`tel:${SITE.phone.replace(/\D/g, "")}`}
                  variant="outline"
                  className="!border-black !text-black hover:!bg-[#FFF0F7] !px-8 !py-4"
                >
                  Call {SITE.phone}
                </CTA>
              </div>
              <p className="mt-4 text-center text-sm text-black/60">
                Prefer the full booking site?{" "}
                <a
                  href={BOOKING_URL}
                  className="font-bold text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-2 hover:text-[#FF2D8E]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Square in a new tab
                </a>
                . Need help choosing? See our{" "}
                <Link href="/faq" className="font-bold text-[#E6007E] hover:underline">
                  FAQ
                </Link>
                .
              </p>
            </FadeUp>
          </div>
        </Section>
      </main>
    </div>
  );
}
