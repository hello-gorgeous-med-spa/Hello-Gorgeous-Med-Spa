import Link from "next/link";

import {
  BROW_JOURNEY_CONTACT,
  BROW_JOURNEY_IMAGES,
  BROW_JOURNEY_PATH,
  BROW_JOURNEY_PRICING,
} from "@/lib/brow-journey-marketing";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  soft: "#FFB8DC",
};

export function BrowJourneyHomeBand() {
  const pricing = BROW_JOURNEY_PRICING;

  return (
    <section className="relative overflow-hidden border-y-4 border-black bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 20%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, ${BRAND.pinkHot}22 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a0a12 45%, #0a0a0a 100%)
          `,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFB8DC] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E6007E]" />
            Brow PMU · Oswego, IL
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
            Jen Vokoun · Permanent Makeup Artist
          </p>

          <h2 className="mt-3 text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Wake up with brows{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              you love.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Your Brow Journey — microblading, powder, combo & nano brows with custom mapping, Tina
            Davies pigments, and NP-directed screening at Hello Gorgeous.
          </p>

          <div className="mt-8 rounded-3xl border-4 border-black bg-white p-5 text-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Meet Jen special
                </span>
                <h3 className="mt-3 text-xl font-black sm:text-2xl">Microblading from {pricing.meetMicroblading}</h3>
                <p className="mt-1 text-sm font-medium text-black/70">
                  Combo from {pricing.meetCombo} · perfecting touch-up included
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#E6007E] sm:text-4xl">{pricing.microblading}</p>
                <p className="text-xs font-semibold text-black/55">standard micro · combo {pricing.combo}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={BROW_JOURNEY_PATH}
                className="inline-flex rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white transition hover:opacity-90"
              >
                Your Brow Journey
              </Link>
              <Link
                href={BROW_JOURNEY_CONTACT.bookHref}
                className="inline-flex rounded-full border-2 border-black px-6 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
              >
                Book free consult
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border-4 border-[#E6007E]/40 shadow-[0_20px_60px_rgba(255,45,142,0.22)] lg:max-w-lg">
          <div className="relative aspect-video w-full bg-black">
            <video
              src={BROW_JOURNEY_IMAGES.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-contain"
              aria-label="Microblading and brow PMU at Hello Gorgeous Med Spa"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
