"use client";

import Link from "next/link";

export function FaceBlueprintSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-pink-50/30 to-white py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,45,141,0.08),transparent)]" />
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-[#FF2D8D] text-sm font-semibold uppercase tracking-wider mb-4">
              HG Face Blueprint™
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
              See your aesthetic{" "}
              <span className="text-[#FF2D8D]">potential</span>
            </h2>
            <p className="mt-6 text-lg text-black/80 max-w-xl leading-relaxed">
              Upload a selfie, select treatments, and get a personalized AI-backed blueprint. 
              No pressure—just clarity before your consultation. Licensed professionals. Real results.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/face-blueprint"
                className="inline-flex items-center justify-center bg-[#FF2D8D] text-white px-8 py-4 rounded-xl font-semibold text-base hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FF2D8D]/25"
              >
                Get my blueprint
              </Link>
              <Link
                href="/face-blueprint"
                className="inline-flex items-center justify-center border-2 border-[#FF2D8D] text-[#FF2D8D] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#FF2D8D]/10 transition-all duration-300"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-black/70 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF2D8D]/10 flex items-center justify-center text-[#FF2D8D] font-bold">1</span>
              <div>
                <span className="font-semibold text-black">Upload a selfie</span> — Front-facing, good lighting. We never store your photo without consent.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF2D8D]/10 flex items-center justify-center text-[#FF2D8D] font-bold">2</span>
              <div>
                <span className="font-semibold text-black">Choose treatments</span> — Botox smoothing, lip filler, jawline, under-eye, and more.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF2D8D]/10 flex items-center justify-center text-[#FF2D8D] font-bold">3</span>
              <div>
                <span className="font-semibold text-black">Get your blueprint</span> — A personalized summary and suggested plan. Then book with confidence.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
