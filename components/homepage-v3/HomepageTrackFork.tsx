"use client";

import Image from "next/image";
import Link from "next/link";

import { HOMEPAGE_TRACK_FORK } from "@/lib/homepage-buyer-paths";

const ACCENT_STYLES = {
  blue: {
    pill: "text-[#60a5fa]",
    button: "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-[4px_4px_0_0_rgba(37,99,235,0.45)]",
    micro: "text-[#60a5fa]",
    borderHover: "hover:border-[#60a5fa]/60",
  },
  pink: {
    pill: "text-[#FFB8DC]",
    button: "bg-[#E6007E] hover:bg-[#FF2D8E] text-white shadow-[4px_4px_0_0_rgba(230,0,126,0.45)]",
    micro: "text-[#FFB8DC]",
    borderHover: "hover:border-[#E6007E]/70",
  },
} as const;

function TrackColumn({
  column,
}: {
  column: (typeof HOMEPAGE_TRACK_FORK)[number];
}) {
  const accent = ACCENT_STYLES[column.accent];

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-white/10 bg-[#0d1018] shadow-[8px_8px_0_0_rgba(230,0,126,0.12)] transition duration-300 hover:-translate-y-0.5 ${accent.borderHover}`}
    >
      <div className="relative aspect-[16/11] overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={column.posterImage}
          alt={column.posterAlt}
          fill
          className={
            column.track === "medical"
              ? "object-contain object-center p-2 transition duration-500 group-hover:scale-[1.02]"
              : "object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(13,16,24,0.92) 0%, rgba(13,16,24,0.2) 50%, transparent 100%)",
          }}
        />
        <span
          className={`absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm ${accent.pill}`}
        >
          {column.track === "aesthetics" ? "Med spa" : "Programs & RX"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-[1.65rem]">{column.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/72 sm:text-[15px]">
          {column.description}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={`#${column.anchor}`}
            className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition ${accent.button}`}
          >
            {column.ctaLabel}
          </Link>
          <Link
            href={column.hubHref}
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-white/35 hover:bg-white/10"
          >
            Full {column.track === "aesthetics" ? "services" : "medical"} hub →
          </Link>
        </div>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${accent.micro}`}>
            {column.microLabel}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/50">{column.microDetail}</p>
        </div>
      </div>
    </article>
  );
}

export function HomepageTrackFork() {
  return (
    <section
      id="choose-your-track"
      className="scroll-mt-20 border-b-4 border-black bg-black px-4 py-10 sm:py-14"
      aria-labelledby="homepage-track-fork-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">Start here</p>
          <h2
            id="homepage-track-fork-heading"
            className="mt-2 text-2xl font-black text-white sm:text-3xl md:text-4xl"
          >
            Choose your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #60a5fa, #E6007E)",
                WebkitBackgroundClip: "text",
              }}
            >
              track
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
            Aesthetics and medical programs live under one roof — pick the door that matches what you
            need today.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {HOMEPAGE_TRACK_FORK.map((column) => (
            <TrackColumn key={column.track} column={column} />
          ))}
        </div>
      </div>
    </section>
  );
}
