import Link from "next/link";

import { FadeUp } from "@/components/Section";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  HOMEPAGE_AESTHETICS_ANCHOR,
  homepageBuyerPathsForTrack,
} from "@/lib/homepage-buyer-paths";

import { TrifectaSection } from "./TrifectaSection";

function AestheticPathCard({
  title,
  summary,
  href,
  cta,
  treatments,
}: {
  title: string;
  summary: string;
  href: string;
  cta: string;
  treatments: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border-2 border-white/10 bg-[#0d1018] p-5 shadow-[6px_6px_0_0_rgba(96,165,250,0.15)] transition hover:-translate-y-0.5 hover:border-[#60a5fa]/50 hover:shadow-[8px_8px_0_0_rgba(96,165,250,0.3)]"
    >
      <h3 className="text-xl font-black text-white group-hover:text-[#93c5fd]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{summary}</p>
      <ul className="mt-3 space-y-1 text-xs text-white/45">
        {treatments.slice(0, 4).map((t) => (
          <li key={t}>· {t}</li>
        ))}
      </ul>
      <span className="mt-4 text-sm font-bold text-[#60a5fa] group-hover:text-[#FFB8DC]">
        {cta} →
      </span>
    </Link>
  );
}

/** Single aesthetics lane — in-office med spa treatments + signature technology. */
export function HomepageAestheticsLane() {
  const paths = homepageBuyerPathsForTrack("aesthetics");

  return (
    <div id={HOMEPAGE_AESTHETICS_ANCHOR} className="scroll-mt-20">
      <section
        className="border-b-4 border-black px-4 py-12 sm:py-16"
        aria-labelledby="homepage-aesthetics-lane-heading"
        style={{
          background: `
            radial-gradient(ellipse 65% 45% at 20% 0%, rgba(37,99,235,0.18) 0%, transparent 55%),
            linear-gradient(180deg, #0a0a0a 0%, #0d1018 100%)
          `,
        }}
      >
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#93c5fd]">
              Aesthetics track · In-office
            </p>
            <h2
              id="homepage-aesthetics-lane-heading"
              className="mt-4 text-3xl font-black text-white sm:text-4xl"
            >
              Med spa{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to right, #60a5fa, #93c5fd, #FFB8DC)",
                  WebkitBackgroundClip: "text",
                }}
              >
                treatments
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Injectables, skin &amp; laser, and body contouring — NP-directed care in downtown Oswego.
              Book a free consult and we&apos;ll build your plan.
            </p>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {paths.map((path) => (
                <AestheticPathCard
                  key={path.id}
                  title={path.title}
                  summary={path.summary}
                  href={path.href}
                  cta={path.cta}
                  treatments={path.treatments}
                />
              ))}
            </div>
          </FadeUp>

          <FadeUp delayMs={120}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={PRIMARY_BOOKING_CTA.href}
                className="inline-flex items-center justify-center rounded-full bg-[#2563eb] px-8 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_0_rgba(37,99,235,0.55)] transition hover:bg-[#1d4ed8]"
              >
                {PRIMARY_BOOKING_CTA.label}
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-[#60a5fa]"
              >
                Full services menu →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <TrifectaSection />
    </div>
  );
}
