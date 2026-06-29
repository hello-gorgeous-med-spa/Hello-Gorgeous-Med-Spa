"use client";

import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/Section";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { HOMEPAGE_TRACK_FORK } from "@/lib/homepage-buyer-paths";
import { SITE_TWO_DOORS_HEADLINE, SITE_TWO_DOORS_SUBLINE } from "@/lib/site-two-doors";

const BRAND = {
  pink: "#E6007E",
  hot: "#FF2D8E",
  tint: "#FFB8DC",
  blue: "#60a5fa",
  blueBtn: "#2563eb",
};

const ACCENT = {
  blue: {
    pill: "border-[#60a5fa]/40 bg-[#60a5fa]/15 text-[#93c5fd]",
    badge: "from-[#2563eb] to-[#1d4ed8]",
    button: "bg-[#2563eb] hover:bg-[#1d4ed8] shadow-[4px_4px_0_0_rgba(37,99,235,0.55)]",
    chip: "border-[#60a5fa]/35 bg-[#60a5fa]/10 text-[#bfdbfe]",
    chipHover: "group-hover:border-[#60a5fa]/60 group-hover:bg-[#60a5fa]/20",
    glow: "group-hover:shadow-[10px_10px_0_0_rgba(37,99,235,0.35)]",
    micro: "text-[#60a5fa]",
    ring: "ring-[#60a5fa]/30",
  },
  pink: {
    pill: "border-[#E6007E]/40 bg-[#E6007E]/15 text-[#FFB8DC]",
    badge: "from-[#FF2D8E] to-[#E6007E]",
    button: "bg-[#E6007E] hover:bg-[#FF2D8E] shadow-[4px_4px_0_0_rgba(230,0,126,0.55)]",
    chip: "border-[#E6007E]/35 bg-[#E6007E]/10 text-[#FFB8DC]",
    chipHover: "group-hover:border-[#E6007E]/60 group-hover:bg-[#E6007E]/20",
    glow: "group-hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]",
    micro: "text-[#FFB8DC]",
    ring: "ring-[#E6007E]/30",
  },
} as const;

function TrackColumn({
  column,
  index,
}: {
  column: (typeof HOMEPAGE_TRACK_FORK)[number];
  index: number;
}) {
  const accent = ACCENT[column.accent];
  const step = String(index + 1).padStart(2, "0");

  return (
    <FadeUp delayMs={index * 80}>
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-[#0a0a0f] shadow-[8px_8px_0_0_rgba(230,0,126,0.22)] transition duration-300 hover:-translate-y-1 ${accent.glow}`}
      >
        {/* Poster */}
        <div className="relative aspect-[16/10] overflow-hidden border-b-4 border-black sm:aspect-[16/9]">
          <Image
            src={column.posterImage}
            alt={column.posterAlt}
            fill
            className={`object-cover transition duration-700 group-hover:scale-[1.04] ${column.imagePosition ?? "object-center"}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.08) 100%),
                linear-gradient(135deg, ${column.accent === "pink" ? "rgba(230,0,126,0.25)" : "rgba(37,99,235,0.2)"} 0%, transparent 55%)
              `,
            }}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-md ${accent.pill}`}
            >
              {column.track === "aesthetics" ? "Med spa" : "Programs & RX"}
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br text-xs font-black text-white ${accent.badge}`}
            >
              {step}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
              {column.imageHeadline}
            </p>
            <p className="mt-1 font-serif text-2xl font-bold leading-tight text-white sm:text-[1.75rem]">
              {column.title}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-white/75 sm:text-[15px]">{column.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {column.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${accent.chip} ${accent.chipHover}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              href={`#${column.anchor}`}
              className={`inline-flex items-center justify-center rounded-full border-2 border-black px-6 py-3.5 text-sm font-bold text-white transition ${accent.button}`}
            >
              {column.ctaLabel}
            </Link>
            <Link
              href={column.hubHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/10"
            >
              Full {column.track === "aesthetics" ? "services" : "medical"} hub →
            </Link>
          </div>

          <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-4">
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-gradient-to-br text-sm ${accent.badge}`}
              aria-hidden
            >
              {column.track === "aesthetics" ? "✦" : "Rx"}
            </span>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${accent.micro}`}>
                {column.microLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">{column.microDetail}</p>
            </div>
          </div>
        </div>
      </article>
    </FadeUp>
  );
}

export function HomepageTrackFork() {
  return (
    <section
      id="choose-your-track"
      className="scroll-mt-20 border-b-4 border-black px-4 py-12 sm:py-16"
      aria-labelledby="homepage-track-fork-heading"
      style={{
        background: `
          radial-gradient(ellipse 70% 45% at 15% 0%, rgba(37,99,235,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 65% 45% at 85% 10%, rgba(230,0,126,0.22) 0%, transparent 55%),
          linear-gradient(180deg, #0a0a0a 0%, #12101a 50%, #0a0a0a 100%)
        `,
      }}
    >
      <div className="mx-auto max-w-6xl px-1">
        <FadeUp className="mb-8 text-center md:mb-11">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E6007E] animate-pulse" />
            Start here
          </p>
          <h2
            id="homepage-track-fork-heading"
            className="mt-4 text-3xl font-black text-white sm:text-4xl md:text-[2.65rem] leading-tight"
          >
            {SITE_TWO_DOORS_HEADLINE.split(".")[0]}.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${BRAND.blue}, ${BRAND.tint}, ${BRAND.hot})`,
                WebkitBackgroundClip: "text",
              }}
            >
              One team.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            {SITE_TWO_DOORS_SUBLINE}
          </p>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {HOMEPAGE_TRACK_FORK.map((column, index) => (
            <TrackColumn key={column.track} column={column} index={index} />
          ))}
        </div>

        <FadeUp delayMs={150}>
          <p className="mt-8 text-center text-sm text-white/45">
            Not sure which track?{" "}
            <Link href={PRIMARY_BOOKING_CTA.href} className="font-semibold text-[#FFB8DC] underline underline-offset-2 hover:text-white">
              {PRIMARY_BOOKING_CTA.label}
            </Link>{" "}
            — we&apos;ll point you in the right direction.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
