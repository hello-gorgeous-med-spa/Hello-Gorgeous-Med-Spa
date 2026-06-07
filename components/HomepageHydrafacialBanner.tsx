import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";

/** Compact homepage promo — HydraFacial $99 + free dermaplaning */
export function HomepageHydrafacialBanner() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-0 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full blur-[50px]"
          style={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 md:px-10 md:py-3.5">
        <div
          className="relative hidden shrink-0 overflow-hidden rounded-lg sm:block"
          style={{
            backgroundColor: "rgba(24, 24, 27, 0.8)",
            border: "1px solid rgba(236, 72, 153, 0.3)",
          }}
        >
          <Image
            src="/images/specials/hydrafacial-99-glow-up.png"
            alt="HydraFacial $99 Glow-Up Special — Hello Gorgeous Med Spa Oswego IL"
            width={120}
            height={155}
            className="h-auto w-[72px] md:w-[84px]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#f472b6" }}>
            Limited-time · Oswego
          </p>
          <p className="mt-0.5 text-sm font-bold leading-snug text-white sm:text-base">
            HydraFacial{" "}
            <span style={{ color: "#f472b6" }}>$99</span> Glow-Up
            <span className="font-semibold text-white/70"> · free dermaplaning</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-book-now
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-[11px] font-bold text-white sm:px-4 sm:text-xs"
            style={{ background: "linear-gradient(to right, #ec4899, #db2777)" }}
          >
            Book →
          </Link>
          <Link
            href="/facials-oswego"
            className="hidden rounded-lg border px-3 py-2 text-[11px] font-bold text-white/90 sm:inline-flex sm:text-xs"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Details
          </Link>
        </div>
      </div>
    </section>
  );
}
