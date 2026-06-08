import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Tirzepatide Near Aurora, IL | Mounjaro/Zepbound | Hello Gorgeous Med Spa',
  description: 'Clinician-supervised tirzepatide weight loss near Aurora, IL at Hello Gorgeous Med Spa in Oswego — 10 min away. Same as Mounjaro/Zepbound. 20–25% avg weight loss. Free consultations.',
  keywords: ['tirzepatide aurora il','tirzepatide near aurora','mounjaro near aurora il','zepbound aurora il','tirzepatide weight loss near aurora','glp1 gip weight loss aurora'],
  alternates: { canonical: `${SITE.url}/tirzepatide-aurora-il` },
  openGraph: { type: 'website', url: `${SITE.url}/tirzepatide-aurora-il`, title: 'Tirzepatide Near Aurora, IL | Hello Gorgeous Med Spa', description: 'Clinician-supervised tirzepatide 10 min from Aurora. 20-25% avg weight loss. Free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get tirzepatide near Aurora, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is 10 minutes from Aurora via Route 30. We offer clinician-supervised tirzepatide weight loss programs prescribed and monitored by licensed nurse practitioners.' },
  { question: 'How is tirzepatide different from semaglutide near Aurora?', answer: 'Tirzepatide is a dual GLP-1 + GIP agonist vs. semaglutide\'s single GLP-1 action. Clinical trials show tirzepatide produces 20–25% average weight loss vs. 15–20% for semaglutide.' },
  { question: 'Is tirzepatide the same as Mounjaro or Zepbound?', answer: 'Yes — tirzepatide is the active molecule in Mounjaro (type 2 diabetes) and Zepbound (weight loss). We offer clinician-supervised programs for eligible candidates.' },
  { question: 'How do I start tirzepatide near Aurora?', answer: 'Book a free consultation at hellogorgeousmedspa.com/book or call (630) 636-6193. 10 minutes from Aurora via Route 30.' },
];
export default function TirzepatideAuroraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Tirzepatide Near Aurora', url: `${SITE.url}/tirzepatide-aurora-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Aurora')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 10 Minutes from Aurora · Serving Kane County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Tirzepatide Near Aurora, IL</span> — Dual-Action Weight Loss</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">The dual GLP-1 + GIP agonist — same molecule as Mounjaro® and Zepbound®. <strong className="text-white">10 minutes from Aurora</strong> in Oswego. Clinical trials show <strong className="text-white">20–25% average body weight loss</strong>. Prescribed by licensed NPs.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — 10 min from Aurora via Route 30</p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Tirzepatide Near Aurora — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="weight-loss" serviceLabel={"Tirzepatide Near Aurora"} heading={"Real weight loss near Aurora"} intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Tirzepatide Journey — 10 Min from Aurora</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · 20-25% avg weight loss · Licensed NPs · Open 7 days</p>
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
