"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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
      style={{ backgroundColor: "#000000" }}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: "rgba(245, 158, 11, 0.05)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div 
            className="inline-flex items-center gap-2 backdrop-blur-sm text-sm font-semibold px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#ec4899" }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#ec4899" }}></span>
            </span>
            <span className="uppercase tracking-wider text-xs">The InMode Trifecta</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Three Technologies.{" "}
            <span 
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)" }}
            >
              Infinite Possibilities.
            </span>
          </h2>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            We invested in the most advanced body and skin contouring technologies. 
            From surface to subdermal—every layer, every concern, every transformation.
          </p>
        </div>

        {/* Featured Video */}
        <div 
          className={`mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="max-w-4xl mx-auto">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.1)", paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/skWe-Z-5m_k?si=HiL-3BRzaFfDBcjC"
                title="InMode Morpheus8 & QuantumRF Technology"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              See how InMode&apos;s revolutionary RF technology transforms skin from the inside out
            </p>
          </div>
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
            <div 
              className="relative h-full backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{ backgroundColor: "rgba(24, 24, 27, 0.8)", border: "1px solid rgba(236, 72, 153, 0.3)" }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/trifecta/morpheus8.png"
                  alt="Morpheus8 Burst RF Microneedling Treatment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div 
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(24, 24, 27, 1) 0%, rgba(24, 24, 27, 0.3) 50%, transparent 100%)" }}
                />
                <div className="absolute top-4 right-4 z-10">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg"
                    style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
                  >
                    NEW
                  </span>
                </div>
              </div>

              <div className="relative px-6 pb-6 -mt-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Morpheus8</h3>
                  <p className="text-sm font-semibold" style={{ color: "#f472b6" }}>RF Microneedling</p>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  The deepest RF microneedling available. Penetrates up to 8mm for dramatic skin tightening, fat reduction, and collagen remodeling.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
                    Up to 8mm depth
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
                    Burst Technology
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
                    10, 17, 25 Probes
                  </li>
                </ul>

                <Link
                  href="/services/morpheus8"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-lg"
                  style={{ background: "linear-gradient(to right, #ec4899, #db2777)", color: "#ffffff" }}
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
            <div 
              className="relative h-full backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{ backgroundColor: "rgba(24, 24, 27, 0.8)", border: "1px solid rgba(59, 130, 246, 0.3)" }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/trifecta/quantum-rf.png"
                  alt="QuantumRF Subdermal Contouring Before and After"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div 
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(24, 24, 27, 1) 0%, rgba(24, 24, 27, 0.3) 50%, transparent 100%)" }}
                />
                <div className="absolute top-4 right-4 z-10">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg"
                    style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}
                  >
                    NEW
                  </span>
                </div>
              </div>

              <div className="relative px-6 pb-6 -mt-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>QuantumRF</h3>
                  <p className="text-sm font-semibold" style={{ color: "#60a5fa" }}>Subdermal Contouring</p>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Minimally invasive RF delivered beneath the skin. Surgical-level results for skin tightening and fat reduction—without surgery.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                    Subdermal delivery
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                    Single treatment
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                    Face & body
                  </li>
                </ul>

                <Link
                  href="/services/quantum-rf"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-lg"
                  style={{ background: "linear-gradient(to right, #3b82f6, #6366f1)", color: "#ffffff" }}
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
            <div 
              className="relative h-full backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{ backgroundColor: "rgba(24, 24, 27, 0.8)", border: "1px solid rgba(245, 158, 11, 0.3)" }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/trifecta/solaria-co2.png"
                  alt="Solaria CO2 Fractional Laser Treatment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div 
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(24, 24, 27, 1) 0%, rgba(24, 24, 27, 0.3) 50%, transparent 100%)" }}
                />
                <div className="absolute top-4 right-4 z-10">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg"
                    style={{ background: "linear-gradient(to right, #f59e0b, #f97316)", color: "#ffffff" }}
                  >
                    VIP ACCESS
                  </span>
                </div>
              </div>

              <div className="relative px-6 pb-6 -mt-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Solaria CO₂</h3>
                  <p className="text-sm font-semibold" style={{ color: "#fbbf24" }}>Fractional Laser</p>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Gold standard fractional CO₂ resurfacing. Maximum transformation for wrinkles, scars, sun damage, and overall skin renewal.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                    Deep resurfacing
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                    Scar revision
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                    Skin renewal
                  </li>
                </ul>

                <Link
                  href="/stretch-mark-treatment-oswego-il"
                  className="block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-lg"
                  style={{ background: "linear-gradient(to right, #f59e0b, #f97316)", color: "#ffffff" }}
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
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Not sure which technology is right for you?
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            Book Your Free Consultation
            <span>→</span>
          </Link>
          <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            We&apos;ll create a customized treatment plan combining all three technologies
          </p>
        </div>
      </div>
    </section>
  );
}
