import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'HydraFacial Near Naperville, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'HydraFacial with dermaplaning near Naperville, IL at Hello Gorgeous Med Spa in Oswego — 15 min away. Glow Facial Membership $99/mo. Medical-grade results, zero downtime.',
  keywords: ['hydrafacial naperville il','hydrafacial near naperville','dermaplaning naperville il','facial near naperville','best hydrafacial naperville','hydrafacial membership naperville','glow facial naperville','medical facial naperville il','hydrafacial near me naperville'],
  alternates: { canonical: `${SITE.url}/hydrafacial-naperville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/hydrafacial-naperville-il`, title: 'HydraFacial Near Naperville, IL | Hello Gorgeous Med Spa', description: 'HydraFacial with dermaplaning 15 min from Naperville. $99/mo Glow Facial Membership. Zero downtime.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get a HydraFacial near Naperville, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 15 minutes from Naperville via Route 34. We offer HydraFacial with optional dermaplaning and a Glow Facial Membership at $99/month.' },
  { question: 'How does HydraFacial compare to other facials near Naperville?', answer: 'HydraFacial is a medical-grade treatment using patented vortex technology to cleanse, extract, and infuse — not just steam and extractions. The results are immediate and consistent every time.' },
  { question: 'What is included in the Glow Facial Membership?', answer: '1 HydraFacial with dermaplaning + 1 biotin injection per month for $99. Unused facial credit rolls over toward more advanced treatments. Join through the Hello Gorgeous client app.' },
  { question: 'Is HydraFacial good for oily or acne-prone skin near Naperville?', answer: 'Absolutely. HydraFacial is highly effective for oily and congested skin. The vortex extraction step removes blackheads and pore congestion without manual squeezing or irritation.' },
  { question: 'How long does a HydraFacial take near Naperville?', answer: 'A standard HydraFacial takes about 30–45 minutes. Adding dermaplaning adds 15–20 minutes. No downtime — you can return to work or events immediately after.' },
];
export default function HydrafacialNapervillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'HydraFacial Near Naperville', url: `${SITE.url}/hydrafacial-naperville-il` }]) ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 15 Minutes from Naperville · Serving DuPage County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">HydraFacial Near Naperville, IL</span> — Glow Without the Downtime</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Medical-grade HydraFacial with dermaplaning at Hello Gorgeous Med Spa — <strong className="text-white">15 minutes from Naperville</strong> in Oswego. Glow Facial Membership available for $99/month.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Glow</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 15 min from Naperville via Route 34</p>
          </div>
        </section>
        <section className="py-16 bg-[#FF2D8E]/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Glow Facial Membership — $99/Month</h2>
            <p className="text-gray-600 mb-8">Monthly HydraFacial + dermaplaning + biotin injection. Rollover credit. Cancel anytime.</p>
            <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Join in the App →</Link>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Near Naperville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="facial" serviceLabel="HydraFacial Near Naperville" heading="Naperville clients love our HydraFacial" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your HydraFacial Near Naperville Today</h2>
            <p className="text-xl text-gray-300 mb-8">15 min from Naperville · $99/mo Glow Membership · Zero downtime · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Online Now</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
