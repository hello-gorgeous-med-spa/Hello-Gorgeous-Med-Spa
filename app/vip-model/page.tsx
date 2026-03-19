import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/seo";
import { CTA } from "@/components/CTA";
import { BOOKING_URL, VIP_MODEL_SQUARE_URL } from "@/lib/flows";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-model`;

export const metadata: Metadata = {
  title: "VIP Model Program — Up to 50% Off Morpheus8, Solaria CO₂, Trifecta | Hello Gorgeous",
  description:
    "Only 20 spots. Morpheus8 Burst $799, Solaria CO₂ $899, Combo $1,499, Trifecta $1,999. Medical-grade skin transformation at VIP model pricing. Oswego, IL.",
  keywords: [
    "VIP Model Program",
    "Morpheus8 Burst",
    "Solaria CO2",
    "50% off",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
    "skin transformation",
  ],
  openGraph: {
    title: "VIP Model — Up to 50% Off | Morpheus8, Solaria, Trifecta",
    description: "20 spots. Morpheus8 $799, Solaria $899, Combo $1,499, Trifecta $1,999.",
    type: "website",
    url: PAGE_URL,
  },
  alternates: { canonical: PAGE_URL },
};

const tiers = [
  {
    id: "tier1",
    tag: "Collagen Rebuild",
    name: "Morpheus8 Burst",
    retail: 1400,
    vip: 799,
    includes: [
      "Full-face Morpheus8 Burst",
      "Advanced RF microneedling (deep collagen remodeling)",
      "Custom depth mapping + medical-grade protocol",
      "Numbing + post-care",
    ],
    icon: "🧬",
  },
  {
    id: "tier2",
    tag: "Skin Resurfacing",
    name: "Solaria CO₂ Laser",
    retail: 1600,
    vip: 899,
    includes: [
      "Fractional CO₂ laser resurfacing",
      "Improves texture, pores, pigmentation",
      "Full face or targeted area",
      "Recovery protocol included",
    ],
    icon: "☀️",
  },
  {
    id: "tier3",
    tag: "Total Skin Rebuild",
    name: "Morpheus8 + CO₂ Combo",
    retail: 3000,
    vip: 1499,
    popular: true,
    includes: [
      "Morpheus8 Burst (deep remodeling)",
      "CO₂ Laser (surface correction)",
      "Dual-layer skin transformation",
      "Customized treatment plan",
    ],
    icon: "🔥",
  },
  {
    id: "tier4",
    tag: "The Trifecta",
    name: "Morpheus8 + CO₂ + Quantum RF",
    retail: 4500,
    vip: 1999,
    includes: [
      "Morpheus8 (tightening + collagen)",
      "CO₂ Laser (resurfacing + tone)",
      "Quantum RF (fat reduction + contouring)",
      "Full face + neck + sculpting protocol",
    ],
    icon: "⚡",
  },
];

const beforeAfterImages = [
  { src: "/images/vip-model/m8-jawline.png", alt: "Morpheus8 jawline and neck before and after" },
  { src: "/images/vip-model/m8-forehead.png", alt: "Morpheus8 Burst forehead wrinkles before and after" },
  { src: "/images/vip-model/m8-front.png", alt: "Morpheus8 full face before and after" },
  { src: "/images/vip-model/solaria-face.png", alt: "Solaria CO2 laser skin resurfacing before and after" },
  { src: "/images/vip-model/solaria-pigment.png", alt: "Solaria pigmentation before and after 1 treatment" },
  { src: "/images/vip-model/solaria-pigment2.png", alt: "Solaria CO2 laser results before and after" },
];

export default function VIPModelPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Urgency bar */}
      <div className="bg-[#FF2D8E] text-white py-2 px-4 text-center text-sm font-bold uppercase tracking-wider">
        🚨 Only 20 spots — Up to 50% off retail pricing
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D8E]/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#FF2D8E] font-semibold uppercase tracking-widest text-sm mb-4">
            VIP Model Program
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            The Most Advanced Skin Technology
            <span className="block mt-2 text-white">in Oswego</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Morpheus8 Burst. Solaria CO₂. Quantum RF.
            <br />
            <strong className="text-white">20 VIP Model Clients</strong> — up to 50% off retail pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTA
              href={VIP_MODEL_SQUARE_URL}
              variant="gradient"
              className="px-10 py-4 text-lg font-bold animate-pulse shadow-lg shadow-[#FF2D8E]/30"
            >
              Buy Now — Secure Your Spot
            </CTA>
            <CTA href={BOOKING_URL} variant="outline" className="px-10 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-black">
              Book Free Consultation
            </CTA>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Once filled, pricing returns to full retail.

          </p>
        </div>
      </section>

      {/* Before/After Results — Scream Buy Me */}
      <section className="px-4 py-16 md:py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Real Results. Real Transformations.
          </h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            This is what medical-grade skin technology looks like. Morpheus8 Burst. Solaria CO₂. The proof is in the results.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {beforeAfterImages.map((img, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border-2 border-[#FF2D8E]/30 shadow-xl shadow-[#FF2D8E]/10 hover:border-[#FF2D8E] transition-all"
              >
                <div className="relative aspect-[9/16] md:aspect-square">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <CTA
              href={VIP_MODEL_SQUARE_URL}
              variant="gradient"
              className="px-12 py-4 text-lg font-bold"
            >
              Apply for VIP Model — Get 50% Off
            </CTA>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your Transformation
          </h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            We are selecting 20 clients to experience our newest technology at exclusive model pricing before full launch.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl overflow-hidden border-2 ${
                  tier.popular ? "border-[#FF2D8E] bg-[#FF2D8E]/5 shadow-2xl shadow-[#FF2D8E]/20" : "border-white/20 bg-zinc-900/80"
                }`}
              >
                <div className="p-6 md:p-8">
                  {tier.popular && (
                    <span className="inline-block px-3 py-1 text-xs font-bold bg-[#FF2D8E] text-white rounded-full mb-4">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{tier.icon}</span>
                    <span className="text-[#FF2D8E] font-semibold uppercase tracking-wider text-sm">
                      {tier.tag}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{tier.name}</h3>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-white/50 line-through text-lg">${tier.retail}</span>
                    <span className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">${tier.vip}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="text-[#FF2D8E]">✔</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <CTA
                    href={VIP_MODEL_SQUARE_URL}
                    variant={tier.popular ? "gradient" : "outline"}
                    className="w-full justify-center py-4 font-bold"
                  >
                    Buy Now — ${tier.vip}
                  </CTA>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency + CTA */}
      <section className="px-4 py-16 md:py-24 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#FF2D8E] font-bold uppercase tracking-widest text-sm mb-4">
            Limited to 20 Clients
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Once filled, pricing returns to full retail.
          </h2>
          <p className="text-white/70 mb-8">
            DM &quot;MODEL&quot; on Instagram to secure your spot, or apply below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA
              href={VIP_MODEL_SQUARE_URL}
              variant="gradient"
              className="px-12 py-4 text-lg font-bold"
            >
              Apply for VIP Model Program
            </CTA>
            <CTA href={BOOKING_URL} variant="outline" className="px-12 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-black">
              Book Free Consultation
            </CTA>
          </div>
          <p className="mt-8 text-sm text-white/50">
            Hello Gorgeous Med Spa · 74 W Washington St · Oswego, IL · (630) 636-6193
          </p>
        </div>
      </section>
    </div>
  );
}
