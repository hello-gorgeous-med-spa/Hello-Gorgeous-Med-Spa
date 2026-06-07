import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";

/** Single homepage promo — HydraFacial $99 + free dermaplaning (see /facials-oswego). */
export function HomepageHydrafacialBanner() {
  return (
    <section className="relative overflow-hidden border-b-4 border-black" style={{ backgroundColor: "#000000" }}>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-72 w-72 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(236, 72, 153, 0.12)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-12 md:py-10">
        <div
          className="relative shrink-0 overflow-hidden rounded-2xl backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(24, 24, 27, 0.8)",
            border: "1px solid rgba(236, 72, 153, 0.3)",
          }}
        >
          <Image
            src="/images/specials/hydrafacial-99-glow-up.png"
            alt="HydraFacial $99 Glow-Up Special with free dermaplaning — Hello Gorgeous Med Spa Oswego IL"
            width={280}
            height={360}
            className="h-auto w-[220px] sm:w-[260px] md:w-[280px]"
            priority
          />
          <span
            className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg"
            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
          >
            Special
          </span>
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#f472b6" }}>
            Limited-time special
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            HydraFacial{" "}
            <span
              className="bg-clip-text font-black text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, #ec4899, #f472b6)" }}
            >
              $99
            </span>{" "}
            Glow-Up
          </h2>
          <p className="mt-3 text-base font-bold text-white sm:text-lg">
            + <span style={{ color: "#f472b6" }}>FREE dermaplaning</span> included
          </p>
          <p className="mt-2 max-w-xl text-sm md:text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
            Deep cleanse, extract, hydrate — plus silky dermaplaning for instant glow. Zero downtime. Oswego, IL.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-book-now
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ background: "linear-gradient(to right, #ec4899, #db2777)" }}
            >
              Book $99 Glow-Up →
            </Link>
            <Link
              href="/facials-oswego"
              className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold text-white transition hover:scale-105"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
            >
              See details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
