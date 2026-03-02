"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const TRIFECTA_TECHNOLOGIES = [
  {
    id: "morpheus8",
    name: "Morpheus8",
    tagline: "RF Microneedling",
    description: "The deepest RF microneedling available. Penetrates up to 8mm for dramatic skin tightening, fat reduction, and collagen remodeling.",
    features: ["Up to 8mm depth", "Burst Technology", "10, 17, 25 Probes"],
    icon: "⚡",
    color: "from-pink-500 to-rose-600",
    glowColor: "pink",
    href: "/services/morpheus8",
    badge: "NEW",
  },
  {
    id: "quantum",
    name: "QuantumRF",
    tagline: "Subdermal Contouring",
    description: "Minimally invasive RF delivered beneath the skin. Surgical-level results for skin tightening and fat reduction without surgery.",
    features: ["Subdermal delivery", "Single treatment", "Face & body"],
    icon: "🎯",
    color: "from-blue-500 to-indigo-600",
    glowColor: "blue",
    href: "/services/quantum-rf",
    badge: "NEW",
  },
  {
    id: "solaria",
    name: "Solaria CO₂",
    tagline: "Fractional Laser",
    description: "Gold standard fractional CO₂ resurfacing. Maximum transformation for wrinkles, scars, sun damage, and skin texture.",
    features: ["Deep resurfacing", "Scar revision", "Skin renewal"],
    icon: "✨",
    color: "from-amber-500 to-orange-600",
    glowColor: "amber",
    href: "/stretch-mark-treatment-oswego-il",
    badge: "VIP ACCESS",
  },
];

export function TrifectaSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-black overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header with animated reveal */}
        <div className={`text-center mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-amber-500/20 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span>THE INMODE TRIFECTA</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Three Technologies.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-amber-400 animate-gradient">
              Infinite Possibilities.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            We invested in the most advanced body and skin contouring technologies available. 
            From surface to subdermal—every layer, every concern, every transformation.
          </p>
        </div>

        {/* Trifecta Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TRIFECTA_TECHNOLOGIES.map((tech, index) => (
            <div
              key={tech.id}
              className={`group relative transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 150 + 300}ms` }}
              onMouseEnter={() => setActiveCard(tech.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Glow effect on hover */}
              <div 
                className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500`}
              />
              
              <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/20 transition-all duration-500">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${tech.color} text-white shadow-lg`}>
                    {tech.badge}
                  </span>
                </div>
                
                {/* Icon with animated background */}
                <div className="relative h-48 flex items-center justify-center overflow-hidden">
                  {/* Animated circles behind icon */}
                  <div className={`absolute w-40 h-40 rounded-full bg-gradient-to-r ${tech.color} opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700`} />
                  <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-r ${tech.color} opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500 delay-100`} />
                  <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-r ${tech.color} opacity-40 group-hover:opacity-60 transition-all duration-300`} />
                  
                  {/* Icon */}
                  <div className="relative text-7xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {tech.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-500" 
                        style={{ backgroundImage: activeCard === tech.id ? `linear-gradient(to right, var(--tw-gradient-stops))` : 'none' }}>
                      {tech.name}
                    </h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                      {tech.tagline}
                    </p>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {tech.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {tech.features.map((feature, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-2 text-white/80 text-sm"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tech.color}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Link
                    href={tech.href}
                    className={`group/btn relative inline-flex items-center justify-center w-full py-3 px-6 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-80 group-hover/btn:opacity-100 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      Learn More
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className={`text-center mt-16 md:mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-white/60 mb-6">
            Not sure which technology is right for you?
          </p>
          <Link
            href="/book"
            className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25"
          >
            <span>Book Your Free Consultation</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <p className="mt-4 text-white/40 text-sm">
            We'll create a customized treatment plan combining all three technologies
          </p>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
}
