import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop Wellness | Medical-Grade Supplements & Lab Testing | Hello Gorgeous Med Spa",
  description:
    "Shop medical-grade supplements and functional lab testing panels from Hello Gorgeous Med Spa. Provider-curated wellness products, HSA/FSA eligible. Oswego, IL.",
  alternates: { canonical: `${SITE.url}/shop` },
  openGraph: {
    title: "Shop Wellness | Hello Gorgeous Med Spa",
    description: "Medical-grade supplements and functional lab testing. Provider-curated, HSA/FSA eligible.",
    url: `${SITE.url}/shop`,
    type: "website",
  },
};

const FULLSCRIPT_STORE = "hellogorgeousmedspa";
const JOURNEYS_URL = "https://us.fullscript.com/j/hellogorgeousmedspa";

// Featured supplement product IDs from Fullscript
// Add more product IDs as needed
const FEATURED_PRODUCTS = [
  { id: "98359", category: "Featured" },
  // Add more products here as you identify them
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a0a12] to-[#2d1020] text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E6007E]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF2D8E]/15 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="text-[#FFB8DC] text-sm font-semibold tracking-widest uppercase mb-4">
            Hello Gorgeous Wellness
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Shop{" "}
            <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
              Smarter
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mb-8">
            Medical-grade supplements and functional lab testing — curated by our providers, 
            shipped to your door. HSA/FSA eligible.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#labs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Explore Lab Testing
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#supplements"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Shop Supplements
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gradient-to-r from-rose-50 to-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🩺</div>
              <p className="font-bold text-gray-900">Provider-Curated</p>
              <p className="text-sm text-gray-600">Selected by our NPs</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✓</div>
              <p className="font-bold text-gray-900">HSA/FSA Eligible</p>
              <p className="text-sm text-gray-600">Use pre-tax dollars</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <p className="font-bold text-gray-900">Free Shipping</p>
              <p className="text-sm text-gray-600">Orders $50+</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <p className="font-bold text-gray-900">Medical-Grade</p>
              <p className="text-sm text-gray-600">Professional quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Testing Section */}
      <section id="labs" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#E6007E] text-sm font-semibold tracking-widest uppercase mb-3">
              Fullscript Journeys
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Functional Lab Testing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Go beyond standard labs. Get provider-reviewed results with functional optimal ranges 
              and a personalized wellness plan built around YOUR biology.
            </p>
          </div>

          {/* Journey Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden">
              <div className="md:grid md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <span className="inline-block px-3 py-1 bg-[#E6007E] text-white text-xs font-bold rounded-full mb-4">
                    MOST POPULAR
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Core Health Panel</h3>
                  <p className="text-4xl font-black text-[#E6007E] mb-4">$195</p>
                  <p className="text-gray-600 mb-6">
                    Build on your basic health check with comprehensive testing to reveal how 
                    critical nutrients impact your immune system, blood health, and overall wellness.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-[#E6007E]/10 flex items-center justify-center text-[#E6007E]">✓</span>
                      63 biomarkers analyzed
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-[#E6007E]/10 flex items-center justify-center text-[#E6007E]">✓</span>
                      Provider-reviewed interpretation
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-[#E6007E]/10 flex items-center justify-center text-[#E6007E]">✓</span>
                      2,000+ Quest blood draw locations
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-[#E6007E]/10 flex items-center justify-center text-[#E6007E]">✓</span>
                      Personalized wellness plan
                    </li>
                  </ul>
                  <a
                    href={JOURNEYS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold rounded-full hover:opacity-90 transition-opacity w-full justify-center md:w-auto"
                  >
                    Start Your Journey
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
                <div className="bg-gradient-to-br from-[#E6007E]/5 to-[#FF2D8E]/10 p-8 md:p-10 flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900 mb-4">How It Works</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#E6007E] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-semibold text-gray-900">Book your lab test</p>
                        <p className="text-sm text-gray-600">Choose a panel and complete a brief health intake.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#E6007E] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-semibold text-gray-900">Get results interpreted</p>
                        <p className="text-sm text-gray-600">We analyze using functional optimal ranges.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#E6007E] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-semibold text-gray-900">Follow your wellness plan</p>
                        <p className="text-sm text-gray-600">Personalized steps for nutrition, movement & more.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#E6007E]/20">
                    <p className="text-sm text-gray-600 mb-2">Your Provider</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E6007E] to-[#FF2D8E] flex items-center justify-center text-white font-bold">RK</div>
                      <div>
                        <p className="font-bold text-gray-900">Ryan Kent</p>
                        <p className="text-sm text-gray-600">Licensed Nurse Practitioner, IL</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supplements Section */}
      <section id="supplements" className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#E6007E] text-sm font-semibold tracking-widest uppercase mb-3">
              Fullscript Dispensary
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Medical-Grade Supplements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade supplements curated by our providers. 
              Better absorption, higher purity, real results.
            </p>
          </div>

          {/* Fullscript Product Embeds */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Product embed placeholder - Fullscript will inject here */}
            <div className="fullscript-product-card">
              <Script
                src="https://us.fullscript.com/oembed/embed.js"
                data-fs={JSON.stringify({
                  product_id: "98359",
                  store_slug: FULLSCRIPT_STORE,
                  return: "product_card"
                })}
                data-ot-ignore
                strategy="lazyOnload"
              />
            </div>
            
            {/* Add more product embeds as you identify products */}
            {/* Example:
            <div className="fullscript-product-card">
              <Script
                src="https://us.fullscript.com/oembed/embed.js"
                data-fs={JSON.stringify({
                  product_id: "ANOTHER_ID",
                  store_slug: FULLSCRIPT_STORE,
                  return: "product_card"
                })}
                data-ot-ignore
                strategy="lazyOnload"
              />
            </div>
            */}
          </div>

          {/* Full Catalog CTA */}
          <div className="text-center">
            <div className="inline-block bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Our Full Catalog</h3>
              <p className="text-gray-600 mb-6">
                Access thousands of professional-grade supplements through our Fullscript dispensary.
              </p>
              <a
                href={`https://us.fullscript.com/welcome/${FULLSCRIPT_STORE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
              >
                Open Fullscript Store
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-16 bg-white border-t-4 border-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-12">
            Why Shop With Hello Gorgeous?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Practitioner-Only Brands</h3>
              <p className="text-gray-600">
                Access supplements you can't find at retail stores — only available through licensed providers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Third-Party Tested</h3>
              <p className="text-gray-600">
                Every product is verified for purity, potency, and quality. No fillers, no junk.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Guided by Your Provider</h3>
              <p className="text-gray-600">
                Our team can recommend the right supplements based on your labs and health goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Need Prescriptions Instead?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            For compounded medications, peptides, GLP-1, and hormone therapy — visit RE GEN.
          </p>
          <Link
            href="/rx"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E6007E] font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Visit RE GEN Pharmacy
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
