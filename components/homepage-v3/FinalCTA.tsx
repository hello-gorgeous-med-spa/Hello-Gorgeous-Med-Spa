"use client";

import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

export function FinalCTA() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-white">
          Ready to Elevate Your Look?
        </h2>
        <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
          Book your consultation today and discover the Hello Gorgeous difference.
        </p>
        <p className="mt-2 text-sm text-white/70">Free consultation · No obligation</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={BOOKING_URL}
            data-book-now
            className="inline-flex items-center justify-center bg-[#E6007E] text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
          >
            Book Consultation
          </Link>
          <a
            href="tel:630-636-6193"
            className="inline-flex items-center justify-center border-2 border-white text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300"
          >
            Call 630-636-6193
          </a>
        </div>
      </div>
    </section>
  );
}
