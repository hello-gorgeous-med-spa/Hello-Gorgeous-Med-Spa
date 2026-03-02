"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const TRIFECTA_TECHNOLOGIES = [
  {
    id: "morpheus8",
    name: "Morpheus8",
    tagline: "RF Microneedling",
    description: "The deepest RF microneedling available. Penetrates up to 8mm for dramatic skin tightening, fat reduction, and collagen remodeling.",
    features: ["Up to 8mm depth", "Burst Technology", "10, 17, 25 Probes"],
    icon: "⚡",
    gradient: "from-[#E6007E] to-[#ff4da6]",
    bgGradient: "from-pink-500/20 via-pink-500/10 to-transparent",
    borderColor: "border-pink-500/30",
    href: "/services/morpheus8",
    badge: "NEW",
    badgeColor: "bg-[#E6007E]",
  },
  {
    id: "quantum",
    name: "QuantumRF",
    tagline: "Subdermal Contouring",
    description: "Minimally invasive RF delivered beneath the skin. Surgical-level results for skin tightening and fat reduction—without surgery.",
    features: ["Subdermal delivery", "Single treatment", "Face & body"],
    icon: "🎯",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    borderColor: "border-blue-500/30",
    href: "/services/quantum-rf",
    badge: "NEW",
    badgeColor: "bg-blue-500",
  },
  {
    id: "solaria",
    name: "Solaria CO₂",
    tagline: "Fractional Laser",
    description: "Gold standard fractional CO₂ resurfacing. Maximum transformation for wrinkles, scars, sun damage, and overall skin renewal.",
    features: ["Deep resurfacing", "Scar revision", "Skin renewal"],
    icon: "✨",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    borderColor: "border-amber-500/30",
    href: "/stretch-mark-treatment-oswego-il",
    badge: "VIP ACCESS",
    badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
];

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E6007E]/10 rounded-full blur-[100px]" />
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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6007E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6007E]"></span>
            </span>
            <span className="uppercase tracking-wider text-xs">The InMode Trifecta</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Three Technologies.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6007E] via-blue-400 to-amber-400">
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
          {TRIFECTA_TECHNOLOGIES.map((tech, index) => (
            <div
              key={tech.id}
              className={`group relative transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              {/* Card */}
              <div className={`relative h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border ${tech.borderColor} hover:border-white/30 overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl`}>
                
                {/* Top Gradient Glow */}
                <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${tech.bgGradient} opacity-50`} />

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`${tech.badgeColor} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg`}>
                    {tech.badge}
                  </span>
                </div>

                {/* Icon Area */}
                <div className="relative pt-10 pb-6 flex justify-center">
                  <div className="relative">
                    {/* Animated rings */}
                    <div className={`absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-br ${tech.gradient} opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500`} />
                    <div className={`absolute inset-2 w-24 h-24 rounded-full bg-gradient-to-br ${tech.gradient} opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500 delay-75`} />
                    <div className={`absolute inset-4 w-20 h-20 rounded-full bg-gradient-to-br ${tech.gradient} opacity-40 group-hover:opacity-60 transition-all duration-500 delay-100`} />
                    
                    {/* Icon container */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative px-6 pb-6">
                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {tech.name}
                    </h3>
                    <p className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${tech.gradient}`}>
                      {tech.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed mb-5">
                    {tech.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {tech.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tech.gradient}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={tech.href}
                    className={`relative block w-full py-3 px-6 rounded-xl font-semibold text-white text-center overflow-hidden transition-all duration-300 bg-gradient-to-r ${tech.gradient} hover:shadow-lg hover:shadow-${tech.id === 'morpheus8' ? 'pink' : tech.id === 'quantum' ? 'blue' : 'amber'}-500/25`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Learn More
                      <svg 
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-[#E6007E] hover:text-white transition-all duration-300 hover:scale-105"
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
