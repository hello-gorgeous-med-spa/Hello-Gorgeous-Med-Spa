import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'HydraFacial in Plainfield, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'HydraFacial with dermaplaning near Plainfield, IL at Hello Gorgeous Med Spa in Oswego — 12 min away. Glow Facial Membership $99/mo. Medical-grade results, zero downtime.',
  keywords: ['hydrafacial plainfield il','hydrafacial near plainfield','dermaplaning plainfield il','facial plainfield illinois','best hydrafacial plainfield','glow facial plainfield il','medical facial plainfield'],
  alternates: { canonical: `${SITE.url}/hydrafacial-plainfield-il` },
  openGraph: { type: 'website', url: `${SITE.url}/hydrafacial-plainfield-il`, title: 'HydraFacial in Plainfield, IL | Hello Gorgeous Med Spa', description: 'HydraFacial + dermaplaning 12 min from Plainfield. $99/mo Glow Facial Membership. Zero downtime.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get a HydraFacial near Plainfield, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 12 minutes from Plainfield via Route 126. We offer HydraFacial with dermaplaning and a Glow Facial Membership at $99/month.' },
  { question: 'What is included in the HydraFacial?', answer: 'Our HydraFacial includes cleansing, exfoliation, painless extraction, and hydration infusion with customized serums. Add dermaplaning for peach fuzz removal and deeper serum absorption.' },
  { question: 'What is the Glow Facial Membership for Plainfield residents?', answer: 'For $99/month, you get 1 HydraFacial + dermaplaning + 1 biotin injection monthly. Rollover credit applies toward more advanced treatments. Join through the Hello Gorgeous client app.' },
  { question: 'Is HydraFacial safe for sensitive skin?', answer: 'Yes — HydraFacial is safe for all skin types including sensitive, rosacea-prone, oily, and mature skin. No downtime and results are immediately visible.' },
  { question: 'How do I book a HydraFacial near Plainfield?', answer: 'Book at hellogorgeousmedspa.com/book or call (630) 636-6193. Open 7 days a week with same-week appointments available.' },
];
export default function HydrafacialPlainfieldPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'HydraFacial Plainfield IL', url: `${SITE.url}/hydrafacial-plainfield-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Plainfield')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 12 Minutes from Plainfield · Kendall County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">HydraFacial in Plainfield, IL</span> — Glow Without Downtime</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Medical-grade HydraFacial with dermaplaning — <strong className="text-white">12 minutes from Plainfield</strong> in Oswego. Glow Facial Membership $99/month.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Glow</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 12 min from Plainfield via Route 126</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Near Plainfield — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="facial" serviceLabel="HydraFacial Near Plainfield" heading="Plainfield clients glow at Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your HydraFacial — 12 Min from Plainfield</h2>
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
