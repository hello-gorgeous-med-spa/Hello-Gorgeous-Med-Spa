"use client";

import Link from "next/link";
import Image from "next/image";
import { SPRING_BREAK_SPECIAL, SpringBreakCity } from "@/data/spring-break-special";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

interface SpringBreakPromoProps {
  city?: SpringBreakCity | null;
}

export function SpringBreakPromo({ city }: SpringBreakPromoProps) {
  const isCityPage = !!city;
  const cityName = city?.name ?? "Oswego";
  const cityNote = city?.note ?? "Located in downtown Oswego";

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero — Spring Break Hook */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d2137] to-black" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#E91E8C]/20 rounded-full blur-[80px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#FFD700] font-bold text-sm md:text-base tracking-[0.3em] uppercase mb-4">
              ☀️ {SPRING_BREAK_SPECIAL.promoLabel} ☀️
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4">
              {SPRING_BREAK_SPECIAL.headline}
            </h1>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#E91E8C] to-[#FF69B4] bg-clip-text text-transparent mb-2">
              {SPRING_BREAK_SPECIAL.subheadline}
            </p>
            <p className="text-white/80 text-lg mb-8">{cityNote}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center px-10 py-5 bg-[#E91E8C] hover:bg-[#d0187a] text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-[#E91E8C]/30"
              >
                {SPRING_BREAK_SPECIAL.cta}
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/-/g, "")}`}
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-black transition-all"
              >
                📞 {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Price Block */}
      <section className="py-16 md:py-20 bg-black border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#FFD700] font-bold text-sm tracking-widest uppercase mb-4">
            {SPRING_BREAK_SPECIAL.limitedTime}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div>
              <span className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-[#E91E8C] via-[#FF69B4] to-[#E91E8C] bg-clip-text text-transparent">
                {SPRING_BREAK_SPECIAL.price}
              </span>
              <span className="text-2xl md:text-4xl font-bold text-white/90 ml-1">
                {SPRING_BREAK_SPECIAL.priceUnit}
              </span>
            </div>
            <p className="text-white/60 line-through text-xl md:text-2xl">
              Regular {SPRING_BREAK_SPECIAL.originalPrice}/mo
            </p>
          </div>
          <p className="text-[#FFD700] font-semibold text-lg mt-6 uppercase tracking-wider">
            {SPRING_BREAK_SPECIAL.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {SPRING_BREAK_SPECIAL.benefits.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-[#E91E8C]/40"
              >
                <span className="text-3xl">{b.icon}</span>
                <div className="text-left">
                  <p className="font-bold text-white">{b.label}</p>
                  <p className="text-sm text-white/70">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + Location */}
      <section className="py-16 bg-gradient-to-b from-black to-[#0a0a14]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#E91E8C]/30">
              <Image
                src="/images/services/hg-weight-loss.png"
                alt="Medical weight loss Semaglutide at Hello Gorgeous Med Spa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Medical Weight Loss Near <span className="text-[#E91E8C]">{cityName}</span>
              </h2>
              <p className="text-white/80 text-lg mb-6">
                🏆 Best of Oswego — #1 Best Med Spa & Best Medical Weight Loss. Hello Gorgeous Med Spa offers physician-supervised Semaglutide (Ozempic) weight loss
                programs. Our nurse practitioners are on-site 7 days a week. Same-day consultations
                available. Get beach-ready this spring — start your transformation today.
              </p>
              <div className="space-y-3 text-white/90">
                <p className="flex items-center gap-2">
                  <span className="text-[#E91E8C]">✓</span> FDA-approved GLP-1 medication
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#E91E8C]">✓</span> Average 15–20% body weight loss
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#E91E8C]">✓</span> Weekly injections, monthly check-ins
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#E91E8C]">✓</span> Serving Oswego, Naperville, Aurora, Plainfield & more
                </p>
              </div>
              <Link
                href={BOOKING_URL}
                className="mt-8 inline-flex items-center justify-center px-10 py-5 bg-[#E91E8C] hover:bg-[#d0187a] text-white font-bold text-lg rounded-xl transition-all"
              >
                {SPRING_BREAK_SPECIAL.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* City Links — Internal SEO */}
      <section className="py-12 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/70 text-sm mb-6">
            Semaglutide weight loss available near you:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SPRING_BREAK_SPECIAL.cities.map((c) => (
              <Link
                key={c.slug}
                href={`/semaglutide-spring-break/${c.slug}-il`}
                className="px-4 py-2 bg-white/5 hover:bg-[#E91E8C]/20 border border-white/10 hover:border-[#E91E8C]/50 rounded-full text-sm font-medium text-white transition-all"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-t from-[#1a0a14] to-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Beach-Ready?
          </h2>
          <p className="text-white/80 mb-8">
            $299/month — oversight, screening & medicine included. Limited Spring Break special.
          </p>
          <Link
            href={BOOKING_URL}
            className="inline-flex items-center justify-center px-12 py-5 bg-[#E91E8C] hover:bg-[#d0187a] text-white font-bold text-xl rounded-xl transition-all shadow-lg shadow-[#E91E8C]/30"
          >
            Book Now — 630-636-6193
          </Link>
          <p className="mt-6 text-white/50 text-sm">
            Hello Gorgeous Med Spa • 74 W Washington St, Oswego, IL
          </p>
        </div>
      </section>
    </main>
  );
}
