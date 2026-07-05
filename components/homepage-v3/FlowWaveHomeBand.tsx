import Image from "next/image";
import Link from "next/link";

import {
  FLOWWAVE_INTRO_SPECIAL,
  FLOWWAVE_MARKETING,
  FLOWWAVE_PATH,
  FLOWWAVE_WHAT_IT_DOES,
} from "@/lib/flowwave-marketing";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  soft: "#FFB8DC",
};

export function FlowWaveHomeBand() {
  const { images } = FLOWWAVE_MARKETING;

  return (
    <section className="relative overflow-hidden border-y-4 border-black bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 80% 20%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 10% 80%, ${BRAND.pinkHot}22 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a0a12 45%, #0a0a0a 100%)
          `,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFB8DC] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E6007E]" />
            {FLOWWAVE_MARKETING.eyebrow}
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
            {FLOWWAVE_MARKETING.product} · Shockwave therapy
          </p>

          <h2 className="mt-3 font-black text-3xl leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Deep-tissue relief.{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Minutes, not months.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {FLOWWAVE_MARKETING.subhead}
          </p>

          {/* Intro special */}
          <div className="mt-8 rounded-3xl border-4 border-black bg-white p-5 text-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {FLOWWAVE_INTRO_SPECIAL.badge}
                </span>
                <h3 className="mt-3 text-xl font-black sm:text-2xl">
                  {FLOWWAVE_INTRO_SPECIAL.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-black/70">
                  {FLOWWAVE_INTRO_SPECIAL.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#E6007E] sm:text-4xl">
                  {FLOWWAVE_INTRO_SPECIAL.priceLabel}
                </p>
                <p className="text-xs font-semibold text-black/55">
                  {FLOWWAVE_INTRO_SPECIAL.priceNote}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={FLOWWAVE_PATH}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/25 transition hover:scale-[1.02]"
              >
                {FLOWWAVE_INTRO_SPECIAL.ctaLabel}
              </Link>
              <Link
                href={FLOWWAVE_MARKETING.bookHref}
                className="inline-flex items-center justify-center rounded-full border-2 border-black bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-rose-50"
              >
                Book free consult
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <Image
              src={images.recoveryBanner}
              alt="FlowWave FOCUS shockwave recovery — treat knees, shoulders, elbows, feet, and low back"
              width={1672}
              height={941}
              className="h-auto w-full object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border-2 border-white/15 bg-black/40">
            <Image
              src={images.providerHero}
              alt="Hello Gorgeous provider with FlowWave FOCUS shockwave device"
              width={1024}
              height={1536}
              className="mx-auto h-48 w-auto object-contain object-top sm:h-56"
              sizes="280px"
            />
          </div>
        </div>
      </div>

      {/* 4-column what it does */}
      <div className="relative border-t-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">
                What it does
              </p>
              <h3 className="mt-1 text-2xl font-black sm:text-3xl">
                The FlowWave difference
              </h3>
            </div>
            <Link
              href={FLOWWAVE_PATH}
              className="text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-4"
            >
              Full FlowWave guide →
            </Link>
          </div>

          <p className="mb-6 text-center text-xs font-semibold text-black/50 sm:text-left">
            Shockwave near you:{" "}
            {[
              { href: "/shockwave-therapy-oswego-il", label: "Oswego" },
              { href: "/shockwave-therapy-naperville-il", label: "Naperville" },
              { href: "/shockwave-therapy-aurora-il", label: "Aurora" },
              { href: "/shockwave-therapy-plainfield-il", label: "Plainfield" },
            ].map((city, i, arr) => (
              <span key={city.href}>
                <Link href={city.href} className="text-[#E6007E] hover:underline">
                  {city.label}
                </Link>
                {i < arr.length - 1 ? " · " : null}
              </span>
            ))}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOWWAVE_WHAT_IT_DOES.map((item, i) => (
              <article
                key={item.id}
                className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.28)]"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                  {i + 1}
                </span>
                <p className="mt-4 text-3xl font-black text-[#E6007E]">{item.stat}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/45">
                  {item.statLabel}
                </p>
                <h4 className="mt-3 text-lg font-bold text-[#E6007E]">▸ {item.title}</h4>
                <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-black/80">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
