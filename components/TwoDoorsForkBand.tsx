"use client";

import Link from "next/link";

import { FadeUp } from "@/components/Section";
import {
  SITE_TWO_DOORS,
  SITE_TWO_DOORS_HEADLINE,
  SITE_TWO_DOORS_SUBLINE,
  type SiteDoor,
  type SiteDoorId,
} from "@/lib/site-two-doors";

const ACCENT = {
  blue: {
    pill: "border-[#60a5fa]/40 bg-[#60a5fa]/15 text-[#93c5fd]",
    card: "hover:border-[#60a5fa]/50 hover:shadow-[6px_6px_0_0_rgba(37,99,235,0.35)]",
    button: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    micro: "text-[#60a5fa]",
    activeRing: "ring-2 ring-[#60a5fa]/60",
  },
  pink: {
    pill: "border-[#E6007E]/40 bg-[#E6007E]/15 text-[#FFB8DC]",
    card: "hover:border-[#E6007E]/50 hover:shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]",
    button: "bg-[#E6007E] hover:bg-[#FF2D8E]",
    micro: "text-[#FFB8DC]",
    activeRing: "ring-2 ring-[#E6007E]/60",
  },
} as const;

function DoorCard({
  door,
  active,
  variant,
}: {
  door: SiteDoor;
  active: boolean;
  variant: "compact" | "footer";
}) {
  const accent = ACCENT[door.accent];
  const isFooter = variant === "footer";

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border-4 border-black bg-[#0a0a0f] p-5 transition duration-300 sm:p-6 ${
        accent.card
      } ${active ? accent.activeRing : ""}`}
    >
      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${accent.pill}`}
      >
        {door.shortLabel}
        {active ? (
          <span className="rounded-full bg-white/20 px-1.5 py-px text-[9px] text-white">You are here</span>
        ) : null}
      </span>
      <h3 className={`mt-3 text-lg font-black text-white ${isFooter ? "sm:text-xl" : "sm:text-2xl"}`}>
        {door.title}
      </h3>
      <p className={`mt-2 flex-1 leading-relaxed text-white/60 ${isFooter ? "text-xs sm:text-sm" : "text-sm"}`}>
        {door.description}
      </p>
      <p className={`mt-3 text-[10px] font-bold uppercase tracking-[0.16em] ${accent.micro}`}>
        {door.microLabel}
      </p>
      <p className="mt-1 text-xs text-white/45">{door.microDetail}</p>
      {!active ? (
        <Link
          href={door.hubHref}
          className={`mt-5 inline-flex w-fit items-center gap-2 rounded-xl border-2 border-black px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_rgba(0,0,0,0.9)] transition ${accent.button}`}
        >
          {door.hubCta}
          <span aria-hidden>→</span>
        </Link>
      ) : (
        <p className="mt-5 text-xs font-semibold text-white/40">Continue below — or switch doors anytime.</p>
      )}
    </article>
  );
}

export type TwoDoorsForkBandProps = {
  /** Highlights the door the visitor is already on. */
  activeDoor?: SiteDoorId;
  variant?: "compact" | "footer";
  /** Heading contrast — use `light` on pale page sections. */
  surface?: "dark" | "light";
  className?: string;
  showHeading?: boolean;
};

export function TwoDoorsForkBand({
  activeDoor,
  variant = "compact",
  surface = "dark",
  className = "",
  showHeading = true,
}: TwoDoorsForkBandProps) {
  const isFooter = variant === "footer";
  const isLight = surface === "light";

  return (
    <section
      className={`${className}`}
      aria-labelledby={showHeading ? "two-doors-fork-heading" : undefined}
    >
      {showHeading ? (
        <FadeUp className={isFooter ? "mb-5 text-left" : "mb-8 text-center"}>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.28em] ${isLight ? "text-[#E6007E]" : "text-[#FFB8DC]"}`}
          >
            Start here
          </p>
          <h2
            id="two-doors-fork-heading"
            className={`mt-2 font-black ${isLight ? "text-black" : "text-white"} ${isFooter ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}
          >
            {SITE_TWO_DOORS_HEADLINE}
          </h2>
          <p
            className={`mt-2 ${isLight ? "text-black/65" : "text-white/60"} ${isFooter ? "max-w-2xl text-sm" : "mx-auto max-w-xl text-sm sm:text-base"}`}
          >
            {SITE_TWO_DOORS_SUBLINE}
          </p>
        </FadeUp>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {SITE_TWO_DOORS.map((door, index) => (
          <FadeUp key={door.id} delayMs={index * 60}>
            <DoorCard door={door} active={activeDoor === door.id} variant={variant} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
