import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Med Spa Near Batavia, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'Premium med spa near Batavia, IL — Hello Gorgeous Med Spa in Oswego is 20 min away. Botox $10/unit, Morpheus8, HydraFacial, medical weight loss, laser hair & more. Free consultations.',
  keywords: ['med spa batavia il','med spa near batavia','botox batavia il','botox near batavia','morpheus8 batavia il','laser hair removal batavia','hydrafacial batavia il','weight loss batavia il','medical spa batavia','best med spa batavia illinois'],
  alternates: { canonical: `${SITE.url}/batavia-il` },
  openGraph: { type: 'website', url: `${SITE.url}/batavia-il`, title: 'Med Spa Near Batavia, IL | Hello Gorgeous Med Spa', description: '20 min from Batavia. Botox $10/unit, Morpheus8, HydraFacial, weight loss. Licensed NPs, free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'How far is Hello Gorgeous Med Spa from Batavia, IL?', answer: 'We\'re about 20 minutes from Batavia via Route 31 South to Route 34 East. Our address is 74 W. Washington Street, Oswego, IL 60543. Many Batavia clients drive to us for our pricing, expertise, and results.' },
  { question: 'What services are available near Batavia?', answer: 'Botox ($10/unit), Dysport, dermal fillers, Morpheus8 RF microneedling, Solaria CO2 laser, laser hair removal, HydraFacial with dermaplaning, medical weight loss (semaglutide & tirzepatide), hormone therapy, vitamin shots, and more.' },
  { question: 'Do you have a loyalty program for Batavia clients?', answer: 'Yes! Every client earns Bronze, Gold, or Platinum tier status based on lifetime visits. Our referral program also gives you and a friend $25 each when they book their first visit. Access everything in the free Hello Gorgeous app.' },
  { question: 'How do I book from Batavia?', answer: 'Book at hellogorgeousmedspa.com/book or call (630) 636-6193. Open 7 days, same-week appointments often available.' },
];
const SVCS = [
  { n: 'Botox & Dysport', e: '💉', d: '$10/unit by licensed NPs.', h: '/botox-aurora-il' },
  { n: 'Morpheus8', e: '🔥', d: 'RF microneedling & tightening.', h: '/morpheus8-aurora-il' },
  { n: 'HydraFacial', e: '💧', d: 'Deep cleanse, extract & glow.', h: '/hydrafacial-aurora-il' },
  { n: 'Medical Weight Loss', e: '💊', d: 'Semaglutide & tirzepatide.', h: '/weight-loss-aurora-il' },
  { n: 'Laser Hair Removal', e: '⚡', d: 'Permanent hair reduction.', h: '/laser-hair-removal-aurora-il' },
  { n: 'Dermal Fillers', e: '✨', d: 'Lip, cheek & jawline fillers.', h: '/dermal-fillers-aurora-il' },
];
export default function BataviaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Near Batavia, IL', url: `${SITE.url}/batavia-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Batavia')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 Serving Batavia & Kane County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Med Spa Near Batavia, IL</span> — 20 Min to Premium Aesthetics</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Hello Gorgeous Med Spa in Oswego — <strong className="text-white">20 minutes from Batavia</strong>. Botox at $10/unit, Morpheus8, HydraFacial, medical weight loss & more, all performed by licensed nurse practitioners.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ $10/Unit Botox</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Open 7 Days</span>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — 20 min from Batavia via Route 31 South → Route 34</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Services Near Batavia</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SVCS.map((s) => (<Link key={s.n} href={s.h} className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#FF2D8E] hover:shadow-md transition-all"><span className="text-3xl mb-3 block">{s.e}</span><h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF2D8E]">{s.n}</h3><p className="text-sm text-gray-500">{s.d}</p></Link>))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Med Spa Near Batavia — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="general" serviceLabel="Med Spa Near Batavia" heading="Batavia clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Batavia — Your Premium Med Spa Is 20 Min Away</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · $10/unit Botox · Open 7 days</p>
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
