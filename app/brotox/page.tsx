import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Brotox in Oswego IL | Botox for Men | Hello Gorgeous Med Spa',
  description:
    'Brotox — Botox for men — at Hello Gorgeous Med Spa in Oswego IL. Soften forehead lines, frown lines & crow\'s feet. Look rested, not frozen. Licensed NPs. Free consultations.',
  keywords: [
    'brotox oswego il',
    'botox for men near me',
    'mens botox naperville',
    'brotox near me',
    'botox for men chicago suburbs',
    'mens neurotoxin oswego',
  ],
  alternates: { canonical: `${SITE.url}/brotox` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/brotox`,
    title: 'Brotox in Oswego IL | Botox for Men | Hello Gorgeous Med Spa',
    description: 'Brotox — Botox for men — in Oswego IL. Natural-looking results. Licensed NP injectors. 15-minute treatment.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const GIFT_CARD_URL = 'https://app.squareup.com/gift/T47CHJDW8177K/order';

const TREATMENT_AREAS = [
  { area: 'Forehead Lines', description: 'Smooth horizontal lines caused by raising your brows.' },
  { area: 'Frown Lines (11s)', description: 'Relax the vertical lines between your brows — the ones that make you look angry.' },
  { area: "Crow's Feet", description: 'Soften the lines at the corners of your eyes.' },
  { area: 'Brow Lift', description: 'Subtle lift for a more alert, open expression.' },
  { area: 'Neck Bands', description: 'Platysmal bands that appear with age and muscle tension.' },
  { area: 'Excessive Sweating', description: 'Hyperhidrosis treatment — Botox stops sweat at the source.' },
];

const GIFT_CARDS = [
  {
    title: 'For Dad',
    subtitle: 'Father\'s Day',
    tagline: 'Dad deserves to look rested too.',
    cta: 'Gift Dad Brotox',
  },
  {
    title: 'For Husband',
    subtitle: 'Anniversaries · Birthdays',
    tagline: 'Give him confidence he\'ll actually use.',
    cta: 'Gift Husband Brotox',
  },
  {
    title: 'For Boyfriend',
    subtitle: 'Any Occasion',
    tagline: "Upgrade his glow without telling him it's a glow.",
    cta: 'Gift Boyfriend Brotox',
  },
];

const FAQS = [
  {
    question: 'What is Brotox?',
    answer: 'Brotox is the nickname for Botox (or any FDA-approved neurotoxin) when administered specifically for men. The same treatment, but dosed and placed with male facial anatomy in mind. Men typically have larger, stronger muscles and require more units for the same effect.',
  },
  {
    question: 'Will I look frozen after Brotox?',
    answer: "No — not when done by an experienced injector. Our licensed NPs use a conservative, natural approach for men. You'll still have full expression and movement. You'll just look noticeably more rested and refreshed.",
  },
  {
    question: 'How long does Brotox last?',
    answer: 'Brotox results typically last 3–4 months for most men. Because men tend to have more muscle mass in the face, some find they metabolize neurotoxin slightly faster than women. With consistent treatments, many patients find results lasting longer over time.',
  },
  {
    question: 'How many units of Botox do men need?',
    answer: 'Men generally need more units than women due to larger, stronger facial muscles. A typical male forehead treatment may use 20–30 units vs. 10–20 for women. Your injector will assess your muscles and recommend a unit count during your consultation.',
  },
  {
    question: 'Does Brotox hurt?',
    answer: "Most men describe Brotox as a quick pinch. The needles used are very fine and treatment takes only 10–15 minutes. There's minimal discomfort and no downtime — you can return to work immediately.",
  },
  {
    question: 'Is Brotox worth it for men?',
    answer: "Consistently one of the highest-satisfaction treatments men get. The result is subtle — most people won't know what's different, just that you look sharper and better rested. Many of our male patients come back every 3–4 months once they see the difference.",
  },
];

export default function BrotoxPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: "Men's Wellness", url: `${SITE.url}/mens-wellness` },
    { name: 'Brotox', url: `${SITE.url}/brotox` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-gray-950 text-white">
        {/* ── HERO ── */}
        <section
          className="relative py-24 lg:py-36 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 30% 60%, rgba(59,130,246,0.15) 0%, transparent 55%), radial-gradient(ellipse at 70% 10%, rgba(255,45,142,0.12) 0%, transparent 50%), #030712',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-4">
              Hello Gorgeous Med Spa · Oswego, IL
            </p>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
              Brotox.
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-300 mb-4">
              Look rested. Own the room.{' '}
              <span className="text-[#FF2D8E]">No one has to know.</span>
            </p>
            <div className="flex flex-wrap gap-3 mb-10 mt-8">
              {[
                'Softens forehead lines',
                'Smooths frown lines',
                "Freshens crow's feet",
                'Natural-looking results',
                '15-minute treatment',
              ].map((benefit) => (
                <span
                  key={benefit}
                  className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-full text-sm font-medium text-gray-300"
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book Brotox
              </a>
              <a
                href={GIFT_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all text-lg"
              >
                🎁 Gift Brotox
              </a>
            </div>
          </div>
        </section>

        {/* ── WHAT IS BROTOX ── */}
        <section className="py-20 lg:py-28 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">What is Brotox?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Brotox = Botox specifically for men.</strong> Same FDA-approved neurotoxin your coworker&apos;s wife gets — different approach, different dosing, different goals.
                </p>
                <p>
                  Men have larger, stronger facial muscles. That means Brotox requires more units and a deeper understanding of male anatomy. An injector who only treats women may under-dose or place product in ways that look too soft.
                </p>
                <p>
                  Our licensed NPs understand the difference. You get results that look sharp and natural — not smoothed-out or overdone.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-5">
                  <h3 className="font-bold text-white mb-3 text-lg">Quick Facts</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-[#FF2D8E] mt-0.5">→</span> Same FDA-approved neurotoxin used worldwide</li>
                    <li className="flex items-start gap-2"><span className="text-[#FF2D8E] mt-0.5">→</span> Men typically need more units due to muscle mass</li>
                    <li className="flex items-start gap-2"><span className="text-[#FF2D8E] mt-0.5">→</span> Results last 3–4 months</li>
                    <li className="flex items-start gap-2"><span className="text-[#FF2D8E] mt-0.5">→</span> 10–15 minute treatment, zero downtime</li>
                    <li className="flex items-start gap-2"><span className="text-[#FF2D8E] mt-0.5">→</span> You look rested, not frozen</li>
                    <li className="flex items-start gap-2"><span className="text-[#FF2D8E] mt-0.5">→</span> Free consultations available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TREATMENT AREAS ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Treatment Areas</h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Brotox can address multiple areas in a single session.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TREATMENT_AREAS.map((item) => (
                <div
                  key={item.area}
                  className="bg-gray-900 border border-gray-800 hover:border-[#FF2D8E] rounded-xl p-6 transition-all duration-200"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{item.area}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GIFT SECTION ── */}
        <section
          className="py-20 lg:py-28"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255,45,142,0.1) 0%, transparent 60%), #111827',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              The Gift He Actually Wants
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Brotox gift cards work for any occasion. He books when he&apos;s ready.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {GIFT_CARDS.map((card) => (
                <a
                  key={card.title}
                  href={GIFT_CARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-gray-900 border border-gray-800 hover:border-[#FF2D8E] rounded-2xl p-6 text-center transition-all duration-200 hover:shadow-lg hover:shadow-pink-900/20"
                >
                  <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">{card.subtitle}</p>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#FF2D8E] transition-colors">{card.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{card.tagline}</p>
                  <span className="inline-flex items-center justify-center px-6 py-3 bg-[#FF2D8E] text-white font-bold rounded-lg text-sm group-hover:bg-[#e0267d] transition-all">
                    🎁 {card.cta}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 lg:py-28 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Brotox FAQ
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="py-20 lg:py-28 text-center"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%), #030712',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Book <span className="text-[#FF2D8E]">Brotox?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Free consultations available. 15-minute treatments. Zero downtime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-5 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-xl"
              >
                Book Brotox Now
              </a>
              <a
                href={GIFT_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all text-lg"
              >
                🎁 Send a Gift Card
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              74 W. Washington St, Oswego IL · (630) 636-6193
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Part of the{' '}
              <Link href="/mens-wellness" className="text-gray-500 hover:text-[#FF2D8E] transition-colors">
                Gorgeous for Him
              </Link>{' '}
              men&apos;s wellness program
            </p>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RealPatientReviews />
          </div>
        </section>
      </main>
    </>
  );
}
