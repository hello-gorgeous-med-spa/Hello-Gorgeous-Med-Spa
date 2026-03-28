"use client";

import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

type FinalCTAProps = {
  /** Side-by-side homepage row: no outer section, tighter type and left-aligned */
  compact?: boolean;
};

export function FinalCTA({ compact = false }: FinalCTAProps) {
  const inner = (
    <div className={compact ? "text-left" : "max-w-4xl mx-auto px-6 md:px-12 text-center"}>
      <h2
        id={compact ? "elevate-look-heading" : undefined}
        className={
          compact
            ? "text-2xl md:text-3xl font-bold text-white leading-tight"
            : "text-4xl md:text-5xl font-semibold text-white"
        }
      >
        Ready to Elevate Your Look?
      </h2>
      <p
        className={
          compact
            ? "mt-3 text-sm md:text-base text-white/80 max-w-md"
            : "mt-6 text-lg text-white/80 max-w-xl mx-auto"
        }
      >
        Book your consultation today and discover the Hello Gorgeous difference.
      </p>
      <p className={compact ? "mt-1.5 text-xs text-white/65" : "mt-2 text-sm text-white/70"}>
        Free consultation · No obligation
      </p>
      <div
        className={
          compact
            ? "mt-5 flex flex-col gap-2.5"
            : "mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        }
      >
        <Link
          href={BOOKING_URL}
          data-book-now
          className={
            compact
              ? "inline-flex items-center justify-center bg-[#E6007E] text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
              : "inline-flex items-center justify-center bg-[#E6007E] text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
          }
        >
          Book Consultation
        </Link>
        <a
          href="tel:630-636-6193"
          className={
            compact
              ? "inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
              : "inline-flex items-center justify-center border-2 border-white text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300"
          }
        >
          Call 630-636-6193
        </a>
      </div>
    </div>
  );

  if (compact) {
    return inner;
  }

  return <section className="bg-black py-24">{inner}</section>;
}
