import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Biotin Injections (B7) | Hair, Skin & Nails | RE GEN by Hello Gorgeous",
  description:
    "Biotin (vitamin B7) injections for hair growth, nail strength, and healthy skin. Available in LOW (0.5mg/mL) and HIGH (10mg/mL) concentrations. Prescribed, shipped to your door.",
  keywords: [
    "biotin injections",
    "B7 vitamin shots",
    "biotin for hair loss",
    "biotin for nails",
    "injectable biotin",
    "biotin deficiency treatment",
    "hair growth injections",
    "compounded biotin",
  ],
  alternates: { canonical: `${SITE.url}/rx/biotin` },
  openGraph: {
    title: "Biotin Injections | RE GEN by Hello Gorgeous Med Spa",
    description: "Injectable vitamin B7 for hair, skin & nails. Two concentrations available.",
    url: `${SITE.url}/rx/biotin`,
    type: "website",
  },
};

export default function BiotinPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a0a12] to-[#2d1020] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E6007E]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF2D8E]/15 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#FFB8DC] text-sm font-semibold tracking-widest uppercase mb-4">
                RE GEN Vitamin Injections
              </p>
              <h1 className="text-4xl md:text-5xl font-black mb-6">
                Biotin Injections{" "}
                <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                  (Vitamin B7)
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Support hair growth, strengthen nails, and promote healthy skin with injectable 
                biotin — maximum absorption, bypassing digestion.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/rx#vitamin-injections"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  Order Biotin
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/rx"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <Image
                  src="/regen-site/assets/prod-biotin.png"
                  alt="Biotin Injection Vials - Olympia Pharmacy"
                  width={400}
                  height={300}
                  className="rounded-xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 bg-gradient-to-r from-rose-50 to-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] p-6">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full mb-3">VALUE</span>
              <h3 className="text-xl font-black text-gray-900 mb-1">Biotin LOW</h3>
              <p className="text-gray-600 mb-4">0.5 mg/mL · 10 mL vial</p>
              <p className="text-3xl font-black text-[#E6007E]">$82.65</p>
              <p className="text-sm text-gray-500">Standard maintenance concentration</p>
            </div>
            <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] p-6">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full mb-3">MAX STRENGTH</span>
              <h3 className="text-xl font-black text-gray-900 mb-1">Biotin HIGH</h3>
              <p className="text-gray-600 mb-4">10 mg/mL · 10 mL vial</p>
              <p className="text-3xl font-black text-[#E6007E]">$140.88</p>
              <p className="text-sm text-gray-500">20× stronger for acute deficiency</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Biotin */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-6">What is Biotin?</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              <strong>Biotin</strong>, also known as <strong>vitamin B7</strong>, is a water-soluble vitamin 
              found in foods like eggs, milk, and bananas. It plays a crucial role in:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 list-none pl-0 my-6">
              <li className="flex items-start gap-3 bg-rose-50 rounded-xl p-4">
                <span className="text-[#E6007E] text-xl">✓</span>
                <span><strong>Cell growth</strong> — Essential for healthy cell division</span>
              </li>
              <li className="flex items-start gap-3 bg-rose-50 rounded-xl p-4">
                <span className="text-[#E6007E] text-xl">✓</span>
                <span><strong>Carbohydrate metabolism</strong> — Helps convert food to energy</span>
              </li>
              <li className="flex items-start gap-3 bg-rose-50 rounded-xl p-4">
                <span className="text-[#E6007E] text-xl">✓</span>
                <span><strong>Fatty acid synthesis</strong> — Supports healthy skin and hair</span>
              </li>
              <li className="flex items-start gap-3 bg-rose-50 rounded-xl p-4">
                <span className="text-[#E6007E] text-xl">✓</span>
                <span><strong>Blood sugar regulation</strong> — Influences glucose levels</span>
              </li>
            </ul>
            <p>
              People often take biotin supplements for <strong>hair loss</strong>, <strong>brittle nails</strong>, 
              and <strong>nerve support</strong>. Injectable biotin offers superior absorption compared to 
              oral supplements.
            </p>
          </div>
        </div>
      </section>

      {/* Why Injections */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Why Biotin Injections?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Maximum Absorption</h3>
              <p className="text-gray-600">
                Injections deliver biotin directly into your system, bypassing the digestive tract's 
                metabolic processes that can reduce the bioavailability of oral supplements.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">⚡ Faster Results</h3>
              <p className="text-gray-600">
                When immediate results are desired — especially for acute deficiency — injections 
                work faster than waiting for pills to absorb.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">💉 Simple Self-Administration</h3>
              <p className="text-gray-600">
                Administered via IV or IM injection. Your kit ships with supplies and instructions, 
                and your provider guides you through your first dose.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">📦 Prescribed & Delivered</h3>
              <p className="text-gray-600">
                Compounded by Olympia Pharmacy, a 503B-compliant facility. Ships direct to your 
                door with everything you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deficiency Signs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Signs of Biotin Deficiency</h2>
          <p className="text-gray-600 mb-8">
            Biotin deficiency is rare but can cause noticeable symptoms. Since there's no reliable 
            lab test for low biotin, it's best identified through symptoms:
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Thinning hair",
              "Brittle nails",
              "Red/scaly rash around nose, eyes, mouth",
              "Depression",
              "Fatigue",
              "Tingling in arms & legs",
            ].map((symptom) => (
              <div key={symptom} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-amber-600">⚠️</span>
                <span className="font-medium text-gray-800">{symptom}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Since biotin is water-soluble, any excess flushes through urine — overdose is highly unlikely.
          </p>
        </div>
      </section>

      {/* Dosage Info */}
      <section className="py-16 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Dosage & Administration</h2>
          <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Concentrations</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>LOW:</strong> 0.5 mg/mL — Standard maintenance</li>
                  <li><strong>HIGH:</strong> 10 mg/mL — Acute deficiency / faster results</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Route</h3>
                <p className="text-gray-600">IV (intravenous) or IM (intramuscular) injection</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Frequency</h3>
                <p className="text-gray-600">Typically weekly or bi-weekly — your provider sets your schedule</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Storage</h3>
                <p className="text-gray-600">Store at controlled room temperature. Protect from light.</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Dosage should be determined by a qualified healthcare provider. 
                If you take carbamazepine, phenobarbital, phenytoin, or primidone, consult your 
                provider as these can lower biotin levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Side Effects */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Possible Side Effects</h2>
          <p className="text-gray-600 mb-6">
            Biotin is generally well-tolerated. Some people may experience:
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["Nausea", "Abdominal cramping", "Diarrhea", "Dizziness", "Headaches"].map((effect) => (
              <div key={effect} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{effect}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            If you develop any unusual rashes, contact your provider — this may indicate dosage adjustment is needed.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get biotin injections prescribed and shipped to your door.
          </p>
          <Link
            href="/rx#vitamin-injections"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E6007E] font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Order Biotin Injections
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Source Attribution */}
      <section className="py-8 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Compounded by{" "}
            <a 
              href="https://www.olympiapharmacy.com/product/biotin-injections/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E6007E] hover:underline"
            >
              Olympia Compounding Pharmacy
            </a>
            {" "}— a 503B- & 503A-compliant facility.
          </p>
        </div>
      </section>
    </main>
  );
}
