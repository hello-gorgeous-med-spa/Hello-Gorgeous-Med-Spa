"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export function HeroV3() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Shorter hero band — image native 3:2, capped height so it doesn’t dominate the page */}
      <div className="relative h-[200px] w-full sm:h-[230px] md:h-[260px] lg:h-[280px]">
        <Image
          src="/images/hero-brand.png"
          alt="Hello Gorgeous Med Spa — Medical Aesthetics Oswego IL"
          fill
          priority
          className={`object-cover object-[42%_32%] sm:object-[40%_30%] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            revealed ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
          }`}
          sizes="100vw"
          onLoad={() => setRevealed(true)}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 72%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))" }}
        />

        <div
          className={`absolute inset-0 flex items-center transition-all duration-700 ease-out delay-150 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12">
            <div className="max-w-xl">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFB8DC] sm:text-[11px]">
                Oswego, IL · Medical Aesthetics
              </p>
              <h1 className="text-2xl font-black leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl">
                Modern Aesthetic{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Medicine.
                </span>
              </h1>
              <p className="mt-2 hidden max-w-md text-sm font-medium leading-snug text-white/85 sm:block">
                Botox, Morpheus8, weight loss, hormones &amp; more — NP-directed care in Oswego.
              </p>

              <div className="mt-2.5 hidden items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur sm:inline-flex">
                <span className="text-xs tracking-tight text-[#FFD86B]" aria-hidden="true">
                  ★★★★★
                </span>
                <span className="text-xs font-black text-white">{SITE.freshaReviewRating}</span>
                <span className="text-[11px] font-semibold text-white/80">
                  · {Number(SITE.freshaReviewCount).toLocaleString()} reviews
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={BOOKING_URL}
                  data-book-now
                  className="inline-flex items-center justify-center rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#c9006e] sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Book Free Consultation
                </Link>
                <Link
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-black sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
