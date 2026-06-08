import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lip Flip in Oswego, IL | Botox Lip Flip Near Naperville | Hello Gorgeous Med Spa',
  description: 'Botox lip flip in Oswego, IL at Hello Gorgeous Med Spa. Just 4–6 units of Botox relaxes the upper lip orbicularis for a fuller, more lifted look — no filler needed. Starting at $40.',
  keywords: [
    'lip flip oswego il', 'botox lip flip oswego', 'lip flip near me oswego',
    'lip flip near naperville', 'lip flip aurora il', 'lip flip yorkville il',
    'lip flip cost oswego', 'botox lip flip vs lip filler', 'upper lip flip oswego',
    'non surgical lip augmentation oswego il', 'natural lip enhancement oswego',
  ],
  alternates: { canonical: `${SITE.url}/lip-flip-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/lip-flip-oswego-il`,
    title: 'Botox Lip Flip in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'A subtle, natural lip enhancement with just 4–6 units of Botox. No filler. Starts at $40. Book at Hello Gorgeous in Oswego.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'What is a Botox lip flip?', answer: 'A lip flip uses 4–6 units of Botox injected into the orbicularis oris muscle along the upper lip border. This relaxes the muscle and causes the upper lip to subtly "flip" upward and outward, creating the appearance of a fuller, more defined lip — without filler.' },
  { question: 'How much does a lip flip cost in Oswego, IL?', answer: 'A lip flip at Hello Gorgeous starts at $40–$80 depending on the number of units needed (typically 4–6 units at $10/unit). It\'s one of the most affordable cosmetic treatments we offer.' },
  { question: 'What\'s the difference between a lip flip and lip filler?', answer: 'A lip flip relaxes the upper lip muscle to reveal more of your existing lip — it doesn\'t add volume. Lip filler (hyaluronic acid) adds actual volume and definition. Many clients do both for a comprehensive lip enhancement.' },
  { question: 'How long does a Botox lip flip last?', answer: 'A lip flip typically lasts 6–8 weeks — shorter than other Botox areas because the lips move frequently with eating, talking, and expression. Many clients repeat every 2 months to maintain the look.' },
  { question: 'Is a lip flip painful?', answer: 'Most clients describe it as a tiny pinch — the needle is very fine and only 4–6 injection points are made. Numbing cream is available upon request. Downtime is essentially zero.' },
  { question: 'Who is a good candidate for a lip flip in Oswego?', answer: 'Ideal candidates want a subtle upper lip enhancement without filler, have a "gummy smile" they want to minimize, or want to preview lip augmentation before committing to filler. Your NP will evaluate your lip anatomy at your free consultation.' },
  { question: 'Can I combine a lip flip with lip filler?', answer: 'Absolutely — this is a very popular combination at Hello Gorgeous. The lip flip defines the vermillion border while filler adds volume. The result is a naturally full, beautifully defined lip. Your NP will recommend the right combination for your goals.' },
];

export default function LipFlipOswegoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', url: SITE.url },
        { name: 'Lip Flip Oswego IL', url: `${SITE.url}/lip-flip-oswego-il` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">💋 Oswego, IL · Serving Naperville · Aurora · Yorkville · Plainfield</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Botox Lip Flip in Oswego, IL</span> — Fuller Lips, No Filler
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Just <strong className="text-white">4–6 units of Botox</strong> injected along the upper lip border subtly flips the lip outward for a fuller, more defined look. <strong className="text-white">Starting at $40.</strong> No filler required. Zero downtime. Results in 3–5 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Lip Flip</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Starts at $40</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ 4–6 Units Only</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Zero Downtime</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ No Filler Needed</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How the Botox Lip Flip Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { step: '1', title: 'Tiny Injections', desc: '4–6 units of Botox are placed along the upper lip border (orbicularis oris muscle).', emoji: '💉' },
                { step: '2', title: 'Muscle Relaxes', desc: 'The muscle gently relaxes, causing the upper lip to subtly roll outward — revealing more of your lip.', emoji: '✨' },
                { step: '3', title: 'Fuller Look', desc: 'Results appear in 3–5 days. Your upper lip looks fuller and more defined — all your own.', emoji: '💋' },
              ].map((s) => (
                <div key={s.step} className="bg-white border-2 border-gray-100 rounded-2xl p-8">
                  <span className="text-4xl mb-4 block">{s.emoji}</span>
                  <div className="text-[#FF2D8E] font-bold text-sm uppercase tracking-widest mb-2">Step {s.step}</div>
                  <h3 className="font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lip Flip vs Filler */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Lip Flip vs Lip Filler — Which Do You Need?</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left p-4">Feature</th>
                    <th className="text-center p-4 text-[#FF2D8E]">Lip Flip</th>
                    <th className="text-center p-4">Lip Filler</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Product', 'Botox (4–6 units)', 'Hyaluronic acid filler'],
                    ['Adds volume?', 'No — reveals existing lip', 'Yes — adds real volume'],
                    ['Starting cost', '$40–$80', '$600–$800/syringe'],
                    ['Duration', '6–8 weeks', '6–12 months'],
                    ['Downtime', 'None', 'Minimal (1–3 days)'],
                    ['Best for', 'Subtle lift, gummy smile', 'Volume, definition, shape'],
                    ['Can combine?', '✓ Often done together', '✓ Often done together'],
                  ].map(([label, flip, filler], i) => (
                    <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-semibold text-gray-700">{label}</td>
                      <td className="p-4 text-center text-[#FF2D8E] font-medium">{flip}</td>
                      <td className="p-4 text-center text-gray-600">{filler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Lip Flip Oswego — FAQs</h2>
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

        <RealPatientReviews service="botox" serviceLabel="Lip Flip in Oswego" heading="Lip clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Book Your Lip Flip in Oswego — Starting at $40</h2>
            <p className="text-xl text-gray-300 mb-8">Zero downtime · 4–6 units · Results in 3–5 days · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Lip Flip Now</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
