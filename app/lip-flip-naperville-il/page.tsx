import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Lip Flip Near Naperville, IL | Botox Lip Flip | Hello Gorgeous Med Spa — Oswego',
  description: 'Botox lip flip near Naperville, IL at Hello Gorgeous Med Spa in Oswego — 15 min away. Fuller upper lip with just 4–6 units. Starting at $40. Free consultations.',
  keywords: ['lip flip naperville il','botox lip flip near naperville','lip flip near me naperville','lip flip oswego naperville','upper lip botox naperville','natural lip enhancement naperville il'],
  alternates: { canonical: `${SITE.url}/lip-flip-naperville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/lip-flip-naperville-il`, title: 'Lip Flip Near Naperville, IL | Hello Gorgeous Med Spa', description: 'Botox lip flip 15 min from Naperville. Fuller lips, starting at $40, zero downtime.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get a lip flip near Naperville, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is 15 minutes from Naperville via Route 34. We offer Botox lip flips starting at $40 — just 4–6 units that subtly reveal a fuller, more lifted upper lip. Zero downtime.' },
  { question: 'How much does a lip flip cost near Naperville?', answer: 'A lip flip at Hello Gorgeous starts at $40–$80 (4–6 units at $10/unit). It\'s one of the most affordable enhancements we offer. 15 minutes from Naperville via Route 34.' },
  { question: 'Is the lip flip different from lip filler near Naperville?', answer: 'Yes — a lip flip uses Botox to relax the upper lip muscle and reveal more of your natural lip (no volume added). Filler adds actual volume. Many clients near Naperville combine both for a comprehensive result.' },
];
export default function LipFlipNapervillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Lip Flip Near Naperville', url: `${SITE.url}/lip-flip-naperville-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">💋 15 Minutes from Naperville via Route 34</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Lip Flip Near Naperville, IL</span> — Fuller Lips from $40</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">The Botox lip flip is <strong className="text-white">15 minutes from Naperville</strong> at Hello Gorgeous Med Spa in Oswego. Just 4–6 units subtly lifts the upper lip for a naturally fuller look. Zero downtime. Results in 3–5 days.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Lip Flip</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 15 min from Naperville via Route 34</p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Lip Flip Near Naperville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your Lip Flip — 15 Min from Naperville</h2>
            <p className="text-xl text-gray-300 mb-8">Starting at $40 · Zero Downtime · Free Consultations · Open 7 Days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Now</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
