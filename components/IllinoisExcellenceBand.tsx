import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ReviewTrustStrip } from "@/components/ReviewTrustStrip";
import { CONVERSION_HIERARCHY, ILLINOIS_EXCELLENCE } from "@/lib/illinois-excellence";

type Props = {
  className?: string;
};

/** Phase 6 — statewide positioning + one clear booking path. */
export function IllinoisExcellenceBand({ className = "" }: Props) {
  return (
    <section
      className={`relative overflow-hidden border-y-4 border-black bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] py-14 md:py-16 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
          {ILLINOIS_EXCELLENCE.eyebrow}
        </p>
        <h2 className="mt-4 text-center text-3xl font-black text-white md:text-4xl lg:text-5xl">
          {ILLINOIS_EXCELLENCE.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/90 md:text-lg">
          {ILLINOIS_EXCELLENCE.subline}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {ILLINOIS_EXCELLENCE.proofChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border-2 border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <ReviewTrustStrip theme="dark" className="justify-center" />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <CTA
            href={CONVERSION_HIERARCHY.primary.href}
            variant="outline"
            className="!border-white !bg-white !text-black hover:!bg-[#FFF0F7]"
          >
            {CONVERSION_HIERARCHY.primary.label}
          </CTA>
          <CTA
            href={CONVERSION_HIERARCHY.rxCatalog.href}
            variant="outline"
            className="!border-white/80 !text-white hover:!bg-white hover:!text-black"
          >
            {CONVERSION_HIERARCHY.rxCatalog.label}
          </CTA>
          <Link
            href={CONVERSION_HIERARCHY.secondary.app.href}
            className="text-sm font-semibold text-white/90 underline underline-offset-4 hover:text-white"
          >
            {CONVERSION_HIERARCHY.secondary.app.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
