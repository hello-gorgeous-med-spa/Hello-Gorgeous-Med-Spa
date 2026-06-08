import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'HydraFacial in Yorkville, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'HydraFacial with dermaplaning near Yorkville, IL at Hello Gorgeous Med Spa in Oswego — 10 min away. Glow Facial Membership $99/mo. Zero downtime, instant glow.',
  keywords: ['hydrafacial yorkville il','hydrafacial near yorkville','dermaplaning yorkville il','facial yorkville illinois','best hydrafacial yorkville','glow facial yorkville il'],
  alternates: { canonical: `${SITE.url}/hydrafacial-yorkville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/hydrafacial-yorkville-il`, title: 'HydraFacial in Yorkville, IL | Hello Gorgeous Med Spa', description: 'HydraFacial + dermaplaning 10 min from Yorkville. $99/mo Glow Facial Membership.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get a HydraFacial near Yorkville, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 10 minutes from Yorkville via Route 71 North. We offer HydraFacial with optional dermaplaning and a Glow Facial Membership at $99/month.' },
  { question: 'What is the Glow Facial Membership for Yorkville clients?', answer: 'Our $99/month membership includes 1 HydraFacial + dermaplaning + 1 biotin injection every month. Rollover credit applies toward more advanced treatments anytime.' },
  { question: 'What skin concerns does HydraFacial address?', answer: 'HydraFacial treats dull skin, dehydration, enlarged pores, fine lines, oily/acne-prone skin, uneven tone, and rough texture. It\'s safe and effective for all skin types.' },
  { question: 'Is there downtime after HydraFacial?', answer: 'No downtime at all. You may have mild pinkness for a few hours but can return to normal activities immediately. Most clients walk out glowing.' },
  { question: 'How do I book near Yorkville?', answer: 'Book at hellogorgeousmedspa.com/book or call (630) 636-6193. Open 7 days a week.' },
];
export default function HydrafacialYorkvillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'HydraFacial Yorkville IL', url: `${SITE.url}/hydrafacial-yorkville-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Yorkville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 10 Minutes from Yorkville · Kendall County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">HydraFacial in Yorkville, IL</span> — Instant Glow, Zero Downtime</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Medical-grade HydraFacial with dermaplaning — <strong className="text-white">10 minutes from Yorkville</strong>. Glow Facial Membership $99/month.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Glow</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 10 min from Yorkville via Route 71 North</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Near Yorkville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="facial" serviceLabel="HydraFacial Near Yorkville" heading="Yorkville clients love Hello Gorgeous HydraFacial" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your HydraFacial — 10 Min from Yorkville</h2>
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
