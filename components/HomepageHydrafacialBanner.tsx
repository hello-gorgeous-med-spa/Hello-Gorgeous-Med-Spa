import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";

/** Single homepage promo — HydraFacial $99 + free dermaplaning (see /facials-oswego). */
export function HomepageHydrafacialBanner() {
  return (
    <section className="border-b-4 border-black bg-gradient-to-r from-[#1a0a12] via-black to-[#2d1020]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-6 md:flex-row md:gap-10 md:px-12 md:py-8">
        <div className="relative shrink-0 overflow-hidden rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.45)]">
          <Image
            src="/images/specials/hydrafacial-99-glow-up.png"
            alt="HydraFacial $99 Glow-Up Special with free dermaplaning — Hello Gorgeous Med Spa Oswego IL"
            width={280}
            height={360}
            className="h-auto w-[220px] sm:w-[260px] md:w-[280px]"
            priority
          />
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">Limited-time special</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            HydraFacial{" "}
            <span className="font-black text-[#FF2D8E]">$99</span> Glow-Up
          </h2>
          <p className="mt-3 text-base font-bold text-white sm:text-lg">
            + <span className="text-[#FFB8DC]">FREE dermaplaning</span> included
          </p>
          <p className="mt-2 max-w-xl text-sm text-white/70 md:text-base">
            Deep cleanse, extract, hydrate — plus silky dermaplaning for instant glow. Zero downtime. Oswego, IL.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-book-now
              className="inline-flex items-center justify-center rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#FF2D8E]"
            >
              Book $99 Glow-Up →
            </Link>
            <Link
              href="/facials-oswego"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:border-[#FFB8DC] hover:text-[#FFB8DC]"
            >
              See details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
