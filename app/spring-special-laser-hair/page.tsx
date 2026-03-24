import { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { faqJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Spring Special: Laser Hair Removal — Underarms $79 | Lip & Chin $59 | Bikini $129 | Hello Gorgeous Oswego Aurora IL',
  description: 'Stop wasting money on packages. Laser hair removal in Oswego & Aurora IL: Underarms $79, Lip & Chin $59, Bikini $129. Results in 2–3 sessions. Pay per session. Book now.',
  keywords: [
    'laser hair removal Oswego IL',
    'laser hair removal Aurora IL',
    'laser hair removal near me',
    'underarms laser hair removal',
    'bikini laser hair removal',
    'lip chin laser Oswego',
    'laser hair removal spring special',
    'Hello Gorgeous med spa',
  ],
  alternates: { canonical: `${SITE.url}/spring-special-laser-hair` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/spring-special-laser-hair`,
    title: 'Spring Special — Laser Hair Removal | Underarms $79 | Hello Gorgeous',
    description: 'Stop wasting money on packages. Pay per session. Results in 2–3 sessions. Oswego, Aurora, Naperville, Plainfield.',
    images: [{ url: `${SITE.url}/images/laser/laser-hair-removal-results.png`, width: 1200, height: 630 }],
  },
};

const SPRING_SPECIAL_FAQS = [
  {
    question: 'Why pay per session instead of a package?',
    answer: 'Most med spas sell 6–8 session packages upfront. At Hello Gorgeous, you pay per session. Many clients see smooth results in just 2–3 sessions. Why commit to 8 when you might only need 3?',
  },
  {
    question: 'How many sessions do I really need?',
    answer: 'It depends on hair type and area. Many clients achieve smooth underarms, bikini, or lip/chin in 2–3 sessions. We assess you at your free consultation and recommend only what you need.',
  },
  {
    question: 'What areas are included in the Spring Special?',
    answer: 'Underarms $79/session. Lip & Chin $59/session. Bikini $129/session. All pay-per-session — no package required. Limited-time pricing.',
  },
  {
    question: 'Where is Hello Gorgeous located?',
    answer: '74 W Washington St, Oswego, IL 60543. We serve Oswego, Aurora, Naperville, Plainfield, Yorkville, Montgomery — 10–15 min from most areas.',
  },
];

export default function SpringSpecialLaserHairPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(SPRING_SPECIAL_FAQS)) }}
      />
      <main className="bg-white">
        {/* Hero — Spring Special */}
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#FF2D8E20_0%,_transparent_50%)]" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E] text-white text-sm font-bold mb-6">
              🌸 Spring Special — Limited Time
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stop Wasting Money on <span className="text-[#FF2D8E]">Packages</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Laser hair removal that actually works. Results in <strong className="text-white">2–3 sessions</strong> for most clients. Pay per session — no commitment.
            </p>

            {/* Pricing Cards */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
              {[
                { area: 'Underarms', price: '$79', per: 'per session' },
                { area: 'Lip & Chin', price: '$59', per: 'per session' },
                { area: 'Bikini', price: '$129', per: 'per session' },
              ].map((item) => (
                <div
                  key={item.area}
                  className="p-6 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-[#FF2D8E] transition"
                >
                  <p className="text-gray-300 text-sm mb-1">{item.area}</p>
                  <p className="text-3xl font-bold text-[#FF2D8E]">{item.price}</p>
                  <p className="text-gray-400 text-xs">{item.per}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition text-lg"
              >
                Claim Offer →
              </a>
              <a
                href={`tel:${SITE.phone.replace(/-/g, '')}`}
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition text-lg"
              >
                📞 {SITE.phone}
              </a>
            </div>
            <p className="mt-4 text-gray-400 text-sm">Oswego, IL • Serving Aurora, Naperville, Plainfield</p>
          </div>
        </section>

        {/* Value Prop — No Packages */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Why We Don&apos;t Sell 8-Session Packages
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Other med spas lock you into 6–8 sessions. Many clients at Hello Gorgeous see smooth, lasting results in <strong>2–3 sessions</strong>. Pay only for what you need. No pressure. No waste.
            </p>
            <p className="text-black font-medium">Professional laser. Licensed providers. Free consultation.</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-black text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Book Free Consult', desc: 'Pick your area. We assess your skin & hair type.' },
                { step: '2', title: 'Pay Per Session', desc: 'No packages. $79 underarms, $59 lip/chin, $129 bikini.' },
                { step: '3', title: '2–3 Sessions', desc: 'Most clients see results in 2–3 sessions.' },
                { step: '4', title: 'Smooth & Done', desc: 'No more shaving or waxing. Long-lasting results.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#FF2D8E] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4 border-t">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-black text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {SPRING_SPECIAL_FAQS.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold text-black mb-2">{faq.question}</h3>
                  <p className="text-gray-700 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#FF2D8E] to-[#E91E8C]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Ditch the Razor?</h2>
            <p className="text-white/90 mb-8">Underarms $79 • Lip & Chin $59 • Bikini $129. No packages. Just results.</p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#FF2D8E] font-bold rounded-xl hover:bg-gray-100 transition text-lg"
            >
              Book Now →
            </a>
            <p className="mt-6 text-white/80 text-sm">
              <Link href="/laser-hair-removal-oswego-il" className="underline">Laser hair removal Oswego</Link>
              {' • '}
              <Link href="/laser-hair-removal-aurora-il" className="underline">Laser hair removal Aurora</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
