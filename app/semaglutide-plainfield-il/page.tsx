import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Semaglutide Near Plainfield, IL | Ozempic/Wegovy | Hello Gorgeous Med Spa',
  description: 'Clinician-supervised semaglutide weight loss near Plainfield, IL at Hello Gorgeous Med Spa in Oswego — 12 min away. Same as Ozempic/Wegovy. Licensed NPs, free consultations.',
  keywords: ['semaglutide plainfield il','semaglutide near plainfield','ozempic near plainfield il','glp1 weight loss plainfield','weight loss injections plainfield il','semaglutide clinic near plainfield','medical weight loss plainfield il','ozempic prescription plainfield il'],
  alternates: { canonical: `${SITE.url}/semaglutide-plainfield-il` },
  openGraph: { type: 'website', url: `${SITE.url}/semaglutide-plainfield-il`, title: 'Semaglutide Near Plainfield, IL | Hello Gorgeous Med Spa', description: 'Clinician-supervised semaglutide 12 min from Plainfield. Real prescriptions, licensed NPs, free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get semaglutide near Plainfield, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is 12 minutes from Plainfield via Route 126. We offer clinician-supervised semaglutide weight loss programs prescribed by our licensed nurse practitioners.' },
  { question: 'Is semaglutide the same as Ozempic or Wegovy?', answer: 'Semaglutide is the active molecule in Ozempic and Wegovy. Our programs are clinician-supervised with real prescriptions, regular check-ins, and dosage management throughout your program.' },
  { question: 'How much weight can I expect to lose with semaglutide near Plainfield?', answer: 'Clinical trials show 15–20% average body weight loss with semaglutide over 68 weeks. Combined with our clinical oversight and lifestyle guidance, many clients achieve significant, lasting results.' },
  { question: 'How do I start a semaglutide program near Plainfield?', answer: 'Book a free consultation at hellogorgeousmedspa.com/book or call (630) 636-6193. Your provider will review your health history and determine if you\'re a candidate at your first visit.' },
  { question: 'How far is the drive from Plainfield to Oswego for semaglutide?', answer: '12 minutes from Plainfield via Route 126. Many clients tell us this is the best 12-minute drive they\'ve made — the results speak for themselves.' },
];
export default function SemaglutidePlainfieldPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Semaglutide Near Plainfield', url: `${SITE.url}/semaglutide-plainfield-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Plainfield')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 12 Minutes from Plainfield · Serving Will County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Semaglutide Near Plainfield, IL</span> — Real Prescriptions. Real Results.</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Clinician-supervised semaglutide weight loss — <strong className="text-white">12 minutes from Plainfield</strong> in Oswego, IL. The same molecule as Ozempic® and Wegovy®, prescribed and monitored by licensed nurse practitioners. Average 15–20% body weight loss in clinical trials.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs On Site</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Real Prescriptions</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars</span>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — 12 min from Plainfield via Route 126</p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Semaglutide Near Plainfield — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="weight-loss" serviceLabel={"Semaglutide Near Plainfield"} heading={"Real weight loss results near Plainfield"} intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Semaglutide Journey — 12 Min from Plainfield</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Licensed NPs · Open 7 days</p>
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
