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
    careGuide: "/pre-post-care/morpheus8-burst",
    description:
      "Morpheus8 Burst is the deepest RF microneedling available—delivering radiofrequency energy at three depths simultaneously, including up to 8mm (double the depth of standard Morpheus8). That deeper penetration targets collagen and elastin where they're produced, so you get tightening and remodeling from the inside out, not just surface-level improvement. The device uses ultrafine needles to create controlled micro-channels while delivering RF energy at multiple depths in a single pass. The heat triggers your body's natural healing response, ramping up collagen and elastin production. Over the following weeks and months, skin becomes firmer, smoother, and more lifted. The 'Burst' technology means more coverage and more consistent results in fewer sessions than older RF microneedling devices. Ideal for loose skin, fine lines, acne scars, jowls, jawline laxity, crepey skin, enlarged pores, and post-weight-loss laxity. Most clients see improvement within weeks, with results continuing to refine for 3–6 months. Hello Gorgeous has Morpheus8 Burst—most local providers only have standard Morpheus8. An NP is on site seven days a week for same-day consultations.",
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
    careGuide: "/pre-post-care/solaria-co2",
    description:
      "Solaria is a medical-grade fractional CO₂ laser—the gold standard in skin resurfacing. It removes damaged outer layers of skin while stimulating collagen and elastin production deep in the dermis. The laser creates microscopic treatment zones, and your body heals them by replacing damaged tissue with smoother, healthier skin. Fractional technology leaves healthy skin between treated areas, which speeds healing and reduces downtime compared to older fully ablative lasers. Solaria improves texture, pores, pigmentation, sun damage, age spots, fine lines, wrinkles, acne scars, and skin laxity. It can be used on the full face or targeted areas like around the eyes, mouth, or forehead. Many clients see dramatic improvement after just one treatment. Downtime is typically 5–7 days of redness and peeling. Results continue to improve for 3–6 months as collagen remodels. Hello Gorgeous is one of the only med spas in the western Chicago suburbs with Solaria CO₂—no other provider in Oswego, Naperville, Aurora, or Plainfield offers this technology. An NP is on site seven days a week.",
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
    careGuide: "/pre-post-care/solaria-co2", // Combo: follow both Morpheus8 + Solaria (Solaria is stricter)
    description:
      "The Total Skin Rebuild combines Morpheus8 Burst and Solaria CO₂ in one comprehensive plan. Morpheus8 works at depth to tighten and remodel collagen; Solaria works at the surface to resurface and refine texture. Together they address both the deep and superficial layers of your skin for a complete transformation. Morpheus8 Burst delivers RF energy at multiple depths to stimulate collagen and tighten tissue from within. Solaria CO₂ resurfaces the outer layers to improve texture, pores, and tone. The combination produces a dual-layer effect: tightening and remodeling from below, resurfacing from above. Ideal for loose skin, fine lines, wrinkles, acne scars, sun damage, pigmentation, uneven texture, enlarged pores, jowls, and skin laxity. Most clients see dramatic improvement after one combo cycle, with results continuing to refine for 3–6 months. Hello Gorgeous offers both technologies and designs customized protocols. An NP is on site seven days a week for consultations and oversight.",
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
    careGuide: "/pre-post-care/quantum-rf", // Trifecta: see all three guides
    description:
      "The Trifecta combines three InMode technologies in one luxury transformation package: Morpheus8 Burst, Solaria CO₂, and Quantum RF. Morpheus8 tightens and remodels collagen at depth. Solaria resurfaces and improves tone at the surface. Quantum RF delivers RF energy beneath the skin to heat fat and tighten tissue for contouring—surgical-level results without surgery. Together they address face, neck, and body for a complete transformation. The Trifecta treats loose facial skin, jowls, neck laxity, double chin, post-weight-loss laxity, abdominal looseness, arm and thigh laxity, and body contouring—plus texture, pores, pigmentation, and fine lines. Quantum RF is exclusive to Hello Gorgeous in the entire western Chicago suburbs; no other provider from Naperville to Yorkville offers subdermal RF contouring. An NP is on site seven days a week for same-day consultations and prescriptions. This is the most comprehensive package we offer.",
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
              href={BOOKING_URL}
              variant="gradient"
              className="px-10 py-4 text-lg font-bold animate-pulse shadow-lg shadow-[#FF2D8E]/30"
            >
              Book Now
            </CTA>
            <CTA
              href={VIP_MODEL_SQUARE_URL}
              variant="outline"
              className="px-10 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-black"
            >
              Leave Deposit to Secure Appointment
            </CTA>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Once filled, pricing returns to full retail.
          </p>
          <Link
            href="/vip-model/terms"
            className="mt-4 inline-block text-[#FF2D8E] font-semibold hover:underline underline-offset-2"
          >
            Terms and Conditions →
          </Link>
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
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTA href={BOOKING_URL} variant="gradient" className="px-12 py-4 text-lg font-bold">
              Book Now
            </CTA>
            <CTA href={VIP_MODEL_SQUARE_URL} variant="outline" className="px-12 py-4 text-lg font-semibold border-[#FF2D8E] text-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-white">
              Leave Deposit to Secure Appointment
            </CTA>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your Transformation
          </h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            We are selecting 20 clients to experience our newest technology at exclusive model pricing before full launch.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl overflow-hidden border-2 border-[#FF2D8E] bg-black p-6 md:p-8 ${
                  tier.popular ? "shadow-2xl shadow-[#FF2D8E]/20" : ""
                }`}
              >
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
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 font-serif">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-white/50 line-through text-lg">${tier.retail}</span>
                  <span className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">${tier.vip}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/90 text-sm">
                      <span className="text-[#FF2D8E] flex-shrink-0">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.careGuide}
                  className="inline-flex items-center gap-2 text-[#FF2D8E] text-sm font-semibold hover:underline mb-4"
                >
                  📋 Pre & Post Care Protocol →
                </Link>
                <details className="group mb-6">
                  <summary className="cursor-pointer list-none flex items-center gap-2 text-[#FF2D8E] text-sm font-semibold hover:text-[#FF2D8E]/90 transition-colors">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    Read full description
                  </summary>
                  <p className="mt-4 text-white/80 text-sm leading-relaxed">
                    {tier.description}
                  </p>
                </details>
                <div className="flex flex-col gap-3">
                  <CTA href={BOOKING_URL} variant="gradient" className="w-full justify-center py-4 font-bold">
                    Book Now
                  </CTA>
                  <CTA
                    href={VIP_MODEL_SQUARE_URL}
                    variant="outline"
                    className="w-full justify-center py-3 font-semibold border-[#FF2D8E] text-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-white"
                  >
                    Leave Deposit — Secure Spot
                  </CTA>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 rounded-2xl border-2 border-[#FF2D8E]/40 bg-black/50">
            <h3 className="text-lg font-bold text-[#FF2D8E] mb-4">📋 Pre & Post Treatment Protocols</h3>
            <p className="text-white/80 text-sm mb-4">
              Each treatment has detailed preparation and aftercare instructions. Review before your appointment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/pre-post-care/morpheus8-burst" className="text-[#FF2D8E] hover:underline text-sm font-semibold">
                Morpheus8 Burst Protocol →
              </Link>
              <Link href="/pre-post-care/solaria-co2" className="text-[#FF2D8E] hover:underline text-sm font-semibold">
                Solaria CO₂ Protocol →
              </Link>
              <Link href="/pre-post-care/quantum-rf" className="text-[#FF2D8E] hover:underline text-sm font-semibold">
                Quantum RF Protocol →
              </Link>
              <Link href="/pre-post-care" className="text-white/70 hover:text-white text-sm">
                All care guides
              </Link>
            </div>
            <p className="mt-4 text-sm">
              <Link
                href="/vip-model/terms"
                className="text-[#FF2D8E] font-semibold hover:underline underline-offset-2"
              >
                Terms and Conditions (deposit, schedule, policies) →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Leave Deposit Section */}
      <section className="px-4 py-16 md:py-20 bg-[#FF2D8E]/10 border-y-2 border-[#FF2D8E]/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Leave Deposit to Secure Your Appointment
          </h2>
          <p className="text-white/90 mb-6">
            Pay a <strong className="text-[#FF2D8E]">$250 non-refundable deposit</strong> to lock in your VIP Model spot. The deposit is applied to your service at checkout. Limited to 20 clients—once filled, pricing returns to full retail.
          </p>
          <CTA
            href={VIP_MODEL_SQUARE_URL}
            variant="gradient"
            className="px-12 py-4 text-lg font-bold"
          >
            Leave $250 Deposit — Secure Spot
          </CTA>
          <p className="mt-6 text-sm text-white/70">
            <Link href="/vip-model/terms" className="text-[#FF2D8E] font-semibold hover:underline">
              Terms and Conditions →
            </Link>
          </p>
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
            <CTA href={BOOKING_URL} variant="gradient" className="px-12 py-4 text-lg font-bold">
              Book Now
            </CTA>
            <CTA
              href={VIP_MODEL_SQUARE_URL}
              variant="outline"
              className="px-12 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-black"
            >
              Leave Deposit to Secure Appointment
            </CTA>
          </div>
          <p className="mt-8 text-sm text-white/50">
            Hello Gorgeous Med Spa · 74 W Washington St · Oswego, IL · (630) 636-6193
          </p>
          <Link
            href="/vip-model/terms"
            className="mt-4 inline-block text-[#FF2D8E] font-semibold hover:underline underline-offset-2"
          >
            Terms and Conditions →
          </Link>
        </div>
      </section>
    </div>
  );
}
