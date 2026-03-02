"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function TrifectaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="uppercase tracking-wider text-xs">The InMode Trifecta</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Three Technologies.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-400 to-amber-400">
              Infinite Possibilities.
            </span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We invested in the most advanced body and skin contouring technologies. 
            From surface to subdermal—every layer, every concern, every transformation.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Morpheus8 */}
          <div
            className={`group relative transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-pink-500/30 hover:border-pink-400/60 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20">
              
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-pink-500/20 via-pink-500/10 to-transparent" />

              <div className="absolute top-4 right-4 z-10">
                <span className="bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                  NEW
                </span>
              </div>

              <div className="relative pt-10 pb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-2 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-4 w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 opacity-40 group-hover:opacity-60 transition-all duration-500" />
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">⚡</span>
                  </div>
                </div>
              </div>

              <div className="relative px-6 pb-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">Morpheus8</h3>
                  <p className="text-sm font-semibold text-pink-400">RF Microneedling</p>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  The deepest RF microneedling available. Penetrates up to 8mm for dramatic skin tightening, fat reduction, and collagen remodeling.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    Up to 8mm depth
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    Burst Technology
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    10, 17, 25 Probes
                  </li>
                </ul>

                <Link
                  href="/services/morpheus8"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-white text-center bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: QuantumRF */}
          <div
            className={`group relative transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="relative h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/30 hover:border-blue-400/60 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
              
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-transparent" />

              <div className="absolute top-4 right-4 z-10">
                <span className="bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                  NEW
                </span>
              </div>

              <div className="relative pt-10 pb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-40 group-hover:opacity-60 transition-all duration-500" />
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🎯</span>
                  </div>
                </div>
              </div>

              <div className="relative px-6 pb-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">QuantumRF</h3>
                  <p className="text-sm font-semibold text-blue-400">Subdermal Contouring</p>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  Minimally invasive RF delivered beneath the skin. Surgical-level results for skin tightening and fat reduction—without surgery.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Subdermal delivery
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Single treatment
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Face & body
                  </li>
                </ul>

                <Link
                  href="/services/quantum-rf"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-white text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Solaria CO2 */}
          <div
            className={`group relative transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="relative h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-amber-500/30 hover:border-amber-400/60 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20">
              
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />

              <div className="absolute top-4 right-4 z-10">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                  VIP ACCESS
                </span>
              </div>

              <div className="relative pt-10 pb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-2 w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-4 w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-40 group-hover:opacity-60 transition-all duration-500" />
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">✨</span>
                  </div>
                </div>
              </div>

              <div className="relative px-6 pb-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">Solaria CO₂</h3>
                  <p className="text-sm font-semibold text-amber-400">Fractional Laser</p>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  Gold standard fractional CO₂ resurfacing. Maximum transformation for wrinkles, scars, sun damage, and overall skin renewal.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Deep resurfacing
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Scar revision
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Skin renewal
                  </li>
                </ul>

                <Link
                  href="/stretch-mark-treatment-oswego-il"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-white text-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <p className="text-white/50 text-sm mb-5">
            Not sure which technology is right for you?
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-pink-500 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Book Your Free Consultation
            <span>→</span>
          </Link>
          <p className="mt-4 text-white/40 text-xs">
            We&apos;ll create a customized treatment plan combining all three technologies
          </p>
        </div>
      </div>
    </section>
  );
}
// Force rebuild Mon Mar  2 09:59:44 CST 2026
