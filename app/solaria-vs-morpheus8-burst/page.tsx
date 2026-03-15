import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO₂ vs Morpheus8 Burst | Which Is Right For You? | Hello Gorgeous",
  description:
    "Compare Solaria CO₂ fractional laser and Morpheus8 Burst RF microneedling. Learn which treatment is best for wrinkles, acne scars, skin tightening, and more at Hello Gorgeous Med Spa Oswego IL.",
  path: "/solaria-vs-morpheus8-burst",
  keywords: [
    "Solaria vs Morpheus8",
    "CO2 laser vs RF microneedling",
    "best skin tightening treatment",
    "acne scar treatment comparison",
    "Morpheus8 Burst vs CO2 laser",
  ],
});

const COMPARISONS = [
  { feature: "Technology", solaria: "Fractional CO₂ Laser", morpheus: "RF Microneedling (Burst)" },
  { feature: "Mechanism", solaria: "Ablative — removes outer skin layers", morpheus: "Non-ablative — heats tissue beneath surface" },
  { feature: "Depth", solaria: "Surface to mid-dermis", morpheus: "Up to 8mm (subdermal)" },
  { feature: "Best for wrinkles", solaria: "Excellent — gold standard", morpheus: "Very good — deep collagen stimulation" },
  { feature: "Best for acne scars", solaria: "Excellent — resurfaces scar tissue", morpheus: "Very good — remodels from below" },
  { feature: "Skin tightening", solaria: "Good — surface contraction", morpheus: "Excellent — deep tissue tightening" },
  { feature: "Skin types", solaria: "Best for lighter skin tones", morpheus: "Safe for ALL skin types" },
  { feature: "Downtime", solaria: "5–7 days (peeling, redness)", morpheus: "3–5 days (redness, mild swelling)" },
  { feature: "Sessions needed", solaria: "1–3 sessions", morpheus: "1–3 sessions" },
  { feature: "Results timeline", solaria: "Visible in 7 days, peak at 3–6 months", morpheus: "Visible in 7 days, peak at 3–6 months" },
];

const BEST_FOR = [
  { concern: "Deep wrinkles & fine lines", recommendation: "Solaria CO₂", color: "#E91E8C" },
  { concern: "Severe acne scarring", recommendation: "Solaria CO₂", color: "#E91E8C" },
  { concern: "Sun damage & age spots", recommendation: "Solaria CO₂", color: "#E91E8C" },
  { concern: "Loose/sagging skin", recommendation: "Morpheus8 Burst", color: "#00BFFF" },
  { concern: "Jowls & jawline", recommendation: "Morpheus8 Burst", color: "#00BFFF" },
  { concern: "Post-weight loss skin", recommendation: "Both (Trifecta)", color: "#FFD700" },
  { concern: "Body skin tightening", recommendation: "Morpheus8 Burst", color: "#00BFFF" },
  { concern: "Darker skin tones", recommendation: "Morpheus8 Burst", color: "#00BFFF" },
  { concern: "Uneven texture + laxity", recommendation: "Both (Trifecta)", color: "#FFD700" },
];

export default function ComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Solaria CO₂ vs Morpheus8 Burst: Which Treatment Is Right For You?",
            author: { "@type": "Organization", name: SITE.name },
            publisher: { "@type": "Organization", name: SITE.name },
          }),
        }}
      />
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-black text-white py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">
              Treatment Comparison
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 font-serif">
              Solaria CO₂ <span className="text-[#E91E8C]">vs</span> Morpheus8 Burst
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Two powerful technologies. Different mechanisms. Both available exclusively
              at Hello Gorgeous Med Spa. Here&apos;s how to choose.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-black mb-10 font-serif">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-black/50 text-sm font-semibold border-b-2 border-black/10">Feature</th>
                    <th className="text-left p-4 text-sm font-bold border-b-2" style={{ color: "#E91E8C", borderColor: "#E91E8C" }}>
                      Solaria CO₂
                    </th>
                    <th className="text-left p-4 text-sm font-bold border-b-2" style={{ color: "#00BFFF", borderColor: "#00BFFF" }}>
                      Morpheus8 Burst
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISONS.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-black/[0.02]" : ""}>
                      <td className="p-4 font-semibold text-black text-sm">{row.feature}</td>
                      <td className="p-4 text-black/75 text-sm">{row.solaria}</td>
                      <td className="p-4 text-black/75 text-sm">{row.morpheus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Best For Section */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 font-serif">Which Is Best For Your Concern?</h2>
            <div className="space-y-3">
              {BEST_FOR.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-white/10">
                  <span className="text-white/90">{item.concern}</span>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: `${item.color}30`, color: item.color, border: `1px solid ${item.color}50` }}
                  >
                    {item.recommendation}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm mt-8">
              Not sure? Our providers will recommend the optimal treatment (or combination) during your free consultation.
            </p>
          </div>
        </section>

        {/* Trifecta Upsell */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-black via-[#0a0510] to-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">
              The Best of Both Worlds
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              The InMode Trifecta
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Combine Solaria CO₂ + Morpheus8 Burst + QuantumRF for comprehensive
              skin resurfacing, deep tightening, and body contouring — all in one practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-[#E91E8C]/40"
              >
                Book Free Consultation
              </Link>
              <a
                href="tel:6306366193"
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full text-lg transition-all"
              >
                📞 630-636-6193
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link href="/solaria-co2-laser-oswego-il" className="px-4 py-2 rounded-full border border-[#E91E8C]/40 text-[#E91E8C] text-sm hover:bg-[#E91E8C]/10 transition-colors">
                Solaria CO₂ Details
              </Link>
              <Link href="/morpheus8-burst-oswego-il" className="px-4 py-2 rounded-full border border-[#00BFFF]/40 text-[#00BFFF] text-sm hover:bg-[#00BFFF]/10 transition-colors">
                Morpheus8 Burst Details
              </Link>
              <Link href="/quantum-rf-oswego-il" className="px-4 py-2 rounded-full border border-[#FFD700]/40 text-[#FFD700] text-sm hover:bg-[#FFD700]/10 transition-colors">
                QuantumRF Details
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
