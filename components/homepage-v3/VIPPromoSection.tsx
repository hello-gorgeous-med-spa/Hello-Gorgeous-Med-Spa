"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function VIPPromoSection() {
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
      style={{ backgroundColor: "#0f0f10" }}
      className="relative py-16 md:py-24 overflow-hidden border-t border-b"
      aria-labelledby="vip-promo-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-40"
          style={{ backgroundColor: "#ec4899" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-30"
          style={{ backgroundColor: "#a855f7" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: "rgba(236, 72, 153, 0.2)",
              border: "1px solid rgba(236, 72, 153, 0.5)",
              color: "#f9a8d4",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#ec4899" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#ec4899" }}
              />
            </span>
            Limited Spots
          </span>
        </div>

        <div
          className={`text-center mb-6 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            id="vip-promo-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: "#ffffff" }}
          >
            VIP Skin Tightening{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(to right, #ec4899, #a855f7)" }}
            >
              Launch
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
            Be among the first to experience Quantum RF & Morpheus8 at introductory pricing.
            Secure your spot with a $500 refundable deposit—applied toward your treatment.
          </p>
        </div>

        <div
          className={`grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div
            className="rounded-xl p-5 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(236, 72, 153, 0.35)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "#f9a8d4" }}>
              First 10 Quantum RF Clients
            </p>
            <p className="text-xl font-bold" style={{ color: "#ffffff" }}>
              FREE Full Face CO₂
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              $1,800 value
            </p>
          </div>
          <div
            className="rounded-xl p-5 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "#c084fc" }}>
              First 20 Morpheus8 Deposits
            </p>
            <p className="text-xl font-bold" style={{ color: "#ffffff" }}>
              FREE Full Face CO₂
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              $1,800 value
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/vip-skin-tightening"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(to right, #ec4899, #db2777)",
              color: "#ffffff",
            }}
          >
            Secure My VIP Spot
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/trifecta-vip"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "#ffffff",
            }}
          >
            $100 Off Any Service
          </Link>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          $500 deposit applied toward treatment. Refundable within 14 days; limited spots available.
        </p>
      </div>
    </section>
  );
}
