import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'HydraFacial in Aurora, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'HydraFacial with dermaplaning near Aurora, IL at Hello Gorgeous Med Spa in Oswego — 10 min away. Medical-grade glow with zero downtime. Glow Facial Membership $99/mo.',
  keywords: ['hydrafacial aurora il','hydrafacial near aurora','dermaplaning aurora il','best facial aurora illinois','hydrafacial membership aurora','glow facial aurora il','medical facial aurora','hydrafacial near me aurora il'],
  alternates: { canonical: `${SITE.url}/hydrafacial-aurora-il` },
  openGraph: { type: 'website', url: `${SITE.url}/hydrafacial-aurora-il`, title: 'HydraFacial in Aurora, IL | Hello Gorgeous Med Spa', description: 'HydraFacial + dermaplaning 10 min from Aurora. $99/mo Glow Facial Membership. Zero downtime.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get a HydraFacial near Aurora, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 10 minutes from Aurora via Route 30. We offer HydraFacial with dermaplaning and our popular $99/month Glow Facial Membership.' },
  { question: 'Does HydraFacial work for Aurora-area clients with sensitive skin?', answer: 'Yes — HydraFacial is one of the most gentle yet effective treatments available. It\'s safe for sensitive, rosacea-prone, and reactive skin types with zero irritation and no downtime.' },
  { question: 'What is the Glow Facial Membership for Aurora residents?', answer: 'Our $99/month membership includes 1 HydraFacial + dermaplaning + 1 biotin injection monthly. Unused credit rolls over toward premium treatments. Join through our client app at hellogorgeousmedspa.com/app.' },
  { question: 'Can I combine HydraFacial with other treatments near Aurora?', answer: 'Absolutely. Many clients combine HydraFacial with Botox, vitamin shots, or other treatments in the same visit. Ask about our treatment packages at your free consultation.' },
  { question: 'How long do HydraFacial results last?', answer: 'Results are immediately visible and can last 4–6 weeks with proper skincare. Monthly treatments maintain optimal skin health and glow.' },
];
export default function HydrafacialAuroraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'HydraFacial Aurora IL', url: `${SITE.url}/hydrafacial-aurora-il` }]) ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Aurora')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 10 Minutes from Aurora · Serving Kane County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">HydraFacial in Aurora, IL</span> — Instant Glow. Zero Downtime.</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Medical-grade HydraFacial with dermaplaning — <strong className="text-white">10 minutes from Aurora</strong> in Oswego. Glow Facial Membership $99/month includes HydraFacial + dermaplaning + biotin injection.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Glow</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 10 min from Aurora via Route 30 South</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Near Aurora — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="facial" serviceLabel="HydraFacial Near Aurora" heading="Aurora clients glow at Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your HydraFacial — 10 Min from Aurora</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Glow Membership $99/mo · Zero downtime · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Online</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
