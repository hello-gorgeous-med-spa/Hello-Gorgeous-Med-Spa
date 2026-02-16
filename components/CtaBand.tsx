"use client";

import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

export function CtaBand() {
  return (
    <section className="bg-[#FF2D8E] py-[100px] px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto text-center">
        <h2 className="text-[38px] md:text-[52px] font-bold text-white mb-8">
          Ready to Look & Feel Gorgeous?
        </h2>
        <Link
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center px-8 py-4 rounded-[8px] text-base font-semibold bg-black hover:bg-white text-white hover:text-black transition-all duration-200"
        >
          Book Free Consultation
        </Link>
      </div>
    </section>
  );
}
