import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'HydraFacial in Montgomery, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'HydraFacial with dermaplaning near Montgomery, IL at Hello Gorgeous Med Spa in Oswego — 8 min away. Glow Facial Membership $99/mo. Medical-grade glow, zero downtime.',
  keywords: ['hydrafacial montgomery il','hydrafacial near montgomery','dermaplaning montgomery il','facial montgomery illinois','glow facial montgomery il','medical facial montgomery'],
  alternates: { canonical: `${SITE.url}/hydrafacial-montgomery-il` },
  openGraph: { type: 'website', url: `${SITE.url}/hydrafacial-montgomery-il`, title: 'HydraFacial in Montgomery, IL | Hello Gorgeous Med Spa', description: 'HydraFacial + dermaplaning 8 min from Montgomery. $99/mo Glow Facial Membership.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get a HydraFacial near Montgomery, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 8 minutes from Montgomery via Route 30 East. We offer HydraFacial with optional dermaplaning and a Glow Facial Membership at $99/month.' },
  { question: 'What is the Glow Facial Membership for Montgomery clients?', answer: 'Our $99/month membership includes 1 HydraFacial + dermaplaning + 1 biotin injection monthly. Rollover credit never expires — apply it toward more advanced services anytime.' },
  { question: 'How is HydraFacial different from a regular facial?', answer: 'HydraFacial uses patented vortex technology to deeply cleanse, extract, and infuse all at once — far more effective than a traditional steam facial. Results are visible immediately with zero downtime.' },
  { question: 'Can I get a HydraFacial if I have acne near Montgomery?', answer: 'Absolutely. HydraFacial is one of the most effective treatments for acne-prone skin. The vortex extraction step removes blackheads and impurities without irritation or downtime.' },
  { question: 'How do I book a HydraFacial near Montgomery?', answer: 'Book online at hellogorgeousmedspa.com/book or call (630) 636-6193. Open 7 days a week — same-week appointments often available.' },
];
export default function HydrafacialMontgomeryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'HydraFacial Montgomery IL', url: `${SITE.url}/hydrafacial-montgomery-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Montgomery')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 8 Minutes from Montgomery · Kane County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">HydraFacial in Montgomery, IL</span> — 8 Min from Your Glow</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Medical-grade HydraFacial with dermaplaning — <strong className="text-white">8 minutes from Montgomery</strong>. Glow Facial Membership $99/month includes HydraFacial + dermaplaning + biotin monthly.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Glow</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 8 min from Montgomery via Route 30 East</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Near Montgomery — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="facial" serviceLabel="HydraFacial Near Montgomery" heading="Montgomery clients glow at Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your HydraFacial — 8 Min from Montgomery</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Glow Membership $99/mo · Zero downtime · Open 7 days</p>
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
