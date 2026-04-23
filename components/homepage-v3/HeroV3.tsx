"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";

const PINK = "#E6007E";

export function HeroV3() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bg-black text-white">
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 transition-all duration-700 md:grid-cols-2 md:items-center md:gap-10 md:px-8 md:py-16 lg:py-20 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* flex-col-reverse on small screens: image (strong result) first on mobile */}
        <div
          className={`relative order-1 flex min-h-[220px] w-full flex-col justify-center md:order-2 ${
            mounted ? "translate-y-0" : "translate-y-3"
          } transition-all delay-100 duration-700`}
        >
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl sm:aspect-[3/2]">
            <Image
              src="/images/quantum-rf/clinical-ba-abdomen-skin-tightening.png"
              alt="Hello Gorgeous Contour Lift — clinical abdomen skin tightening and contour result powered by InMode Quantum RF, Oswego medical aesthetics"
              fill
              priority
              className="object-cover object-[50%_32%] sm:object-[50%_38%] md:object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </div>

        <div
          className={`order-2 space-y-4 md:order-1 ${
            mounted ? "translate-y-0" : "translate-y-3"
          } transition-all duration-700`}
        >
          <h1 className="text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.1rem] lg:leading-[1.08]">
            The Non-Surgical Alternative to Skin Tightening Surgery
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
            Advanced contouring designed to improve loose skin, refine targeted areas, and restore definition—without
            surgery.
          </p>
          <div>
            <p className="text-lg font-bold leading-snug text-white md:text-xl">
              Introducing The Hello Gorgeous Contour Lift™
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Powered by Quantum RF</p>
          </div>
          <p className="max-w-lg text-sm font-light leading-relaxed text-white/85">
            Advanced contouring procedures performed under medical supervision.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:max-w-md sm:flex-row sm:gap-4">
            <Link
              href="/services/quantum-rf"
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-md px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-95"
              style={{ backgroundColor: PINK }}
            >
              Explore Contour Lift
            </Link>
            <a
              href={BOOKING_URL}
              data-book-now
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-md border-2 border-white px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black"
            >
              Book consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
