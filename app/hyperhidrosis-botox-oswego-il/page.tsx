import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Hyperhidrosis Botox (Excessive Sweating) in Oswego, IL | Hello Gorgeous Med Spa',
  description: 'Botox for hyperhidrosis (excessive sweating) in Oswego, IL. Stop excessive underarm, hand & forehead sweating for 6–12 months. Licensed NPs. Free consultations.',
  keywords: [
    'hyperhidrosis botox oswego il', 'excessive sweating treatment oswego',
    'botox for sweating near me', 'botox underarms oswego il',
    'hyperhidrosis treatment near naperville', 'stop sweating botox oswego',
    'axillary hyperhidrosis oswego il', 'sweaty armpits treatment oswego',
    'botox excessive sweating near me', 'hyperhidrosis clinic oswego il',
  ],
  alternates: { canonical: `${SITE.url}/hyperhidrosis-botox-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/hyperhidrosis-botox-oswego-il`,
    title: 'Hyperhidrosis Botox (Stop Sweating) in Oswego, IL | Hello Gorgeous',
    description: 'Botox stops excessive sweating for 6–12 months. Underarms, hands & forehead. Licensed NPs in Oswego. Free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'Can Botox stop excessive sweating near Oswego, IL?', answer: 'Yes — Botox is FDA-approved for the treatment of primary axillary hyperhidrosis (excessive underarm sweating). It works by blocking the nerve signals that trigger sweat glands. Hello Gorgeous offers hyperhidrosis Botox in Oswego, IL.' },
  { question: 'How does Botox for hyperhidrosis work?', answer: 'Botulinum toxin blocks the acetylcholine neurotransmitter signal that stimulates sweat glands. The result: sweat glands in the treated area simply stop receiving the signal to produce sweat — for 6–12 months.' },
  { question: 'How long does Botox for sweating last?', answer: 'Botox for hyperhidrosis typically lasts 6–12 months — significantly longer than cosmetic Botox. Many clients need only 1–2 treatments per year to maintain results.' },
  { question: 'Which areas can be treated for excessive sweating?', answer: 'We treat underarms (most common), palms, soles of the feet, and the forehead. Underarm hyperhidrosis treatment is FDA-approved; other areas are considered off-label but well-established in clinical practice.' },
  { question: 'How many units of Botox are needed for hyperhidrosis?', answer: 'Underarm hyperhidrosis typically requires 50 units per side (100 units total). Other areas vary. Your NP will determine the exact protocol at your free consultation.' },
  { question: 'Is Botox for excessive sweating covered by insurance?', answer: 'Some insurance plans cover hyperhidrosis Botox when conservative treatments (antiperspirants) have failed. We recommend contacting your insurer. We also offer self-pay options and will provide documentation if needed.' },
  { question: 'How soon does Botox for sweating start working?', answer: 'Most clients notice a significant reduction in sweating within 2–4 days. Full effects are typically felt within 2 weeks of treatment.' },
];

export default function HyperhidrosisBotoxOswegoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', url: SITE.url },
        { name: 'Hyperhidrosis Botox Oswego IL', url: `${SITE.url}/hyperhidrosis-botox-oswego-il` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">💧 FDA-Approved · Oswego, IL · Licensed NPs</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Botox for Excessive Sweating in Oswego, IL</span> — Stop Hyperhidrosis for 6–12 Months
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              FDA-approved Botox for hyperhidrosis (excessive sweating) stops sweat glands from activating for <strong className="text-white">6–12 months</strong>. Underarms, palms, soles & forehead. Performed by licensed nurse practitioners at Hello Gorgeous in Oswego, IL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ FDA Approved</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Lasts 6–12 Months</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Underarms · Palms · Forehead</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>

        {/* Treatment areas */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Treatable Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { area: 'Underarms', note: 'FDA-approved · Most common', emoji: '💪', units: '~50 units/side' },
                { area: 'Palms', note: 'Off-label · Well established', emoji: '🤲', units: '~50 units/palm' },
                { area: 'Soles', note: 'Off-label · Highly effective', emoji: '👟', units: 'Varies' },
                { area: 'Forehead', note: 'Off-label · Popular option', emoji: '😊', units: '~25–50 units' },
              ].map((t) => (
                <div key={t.area} className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-[#FF2D8E]/30 transition-all">
                  <span className="text-4xl mb-3 block">{t.emoji}</span>
                  <h3 className="font-bold text-lg mb-1">{t.area}</h3>
                  <p className="text-[#FF2D8E] text-xs font-medium mb-2">{t.note}</p>
                  <p className="text-gray-500 text-xs">{t.units}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Hyperhidrosis Botox Oswego — FAQs</h2>
            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RealPatientReviews service="botox" serviceLabel="Hyperhidrosis Botox in Oswego" heading="Clients stop excessive sweating at Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stop Excessive Sweating — Book Today in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">FDA-approved · 6–12 month results · Free consultations · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
