import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Med Spa Near Geneva, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'Premium med spa near Geneva, IL — Hello Gorgeous in Oswego is 20 min away. Botox $10/unit, Morpheus8, HydraFacial, semaglutide weight loss, lash extensions & more.',
  keywords: ['med spa geneva il','med spa near geneva','botox geneva il','botox near geneva','morpheus8 geneva il','laser hair removal geneva','hydrafacial geneva il','weight loss geneva il','medical spa geneva','semaglutide geneva il'],
  alternates: { canonical: `${SITE.url}/geneva-il` },
  openGraph: { type: 'website', url: `${SITE.url}/geneva-il`, title: 'Med Spa Near Geneva, IL | Hello Gorgeous Med Spa', description: '20 min from Geneva. Botox $10/unit, Morpheus8, HydraFacial, weight loss. NP on site, free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'How far is Hello Gorgeous Med Spa from Geneva, IL?', answer: 'We\'re about 20 minutes from Geneva via Route 38 East to Route 34. Our address is 74 W. Washington Street, Oswego, IL 60543. Geneva clients love us for our NP-level care and competitive pricing.' },
  { question: 'What med spa services are available near Geneva, IL?', answer: 'Botox ($10/unit), fillers, Morpheus8 RF microneedling, Solaria CO2 laser, HydraFacial with dermaplaning, laser hair removal, semaglutide & tirzepatide weight loss, hormone therapy, peptide therapy, vitamin shots, and lash extensions.' },
  { question: 'Do you offer hormone therapy near Geneva?', answer: 'Yes — we offer bioidentical hormone replacement therapy (HRT) for both women and men, including testosterone optimization, estrogen/progesterone balancing, and thyroid support.' },
  { question: 'Is there a loyalty program?', answer: 'Yes — Bronze, Gold, and Platinum tiers reward every visit. Refer a friend and you both get $25 credit. Join the free Hello Gorgeous client app at hellogorgeousmedspa.com/app.' },
];
const SVCS = [
  { n: 'Botox & Dysport', e: '💉', d: '$10/unit. Licensed NPs.', h: '/botox-aurora-il' },
  { n: 'Morpheus8', e: '🔥', d: 'RF microneedling & skin tightening.', h: '/morpheus8-aurora-il' },
  { n: 'HydraFacial', e: '💧', d: 'Deep cleanse + Glow Membership.', h: '/hydrafacial-aurora-il' },
  { n: 'Medical Weight Loss', e: '💊', d: 'Semaglutide & tirzepatide.', h: '/semaglutide-oswego-il' },
  { n: 'Hormone Therapy', e: '🧬', d: 'Bioidentical HRT for women & men.', h: '/hormone-therapy-oswego-il' },
  { n: 'Lash Extensions', e: '👁️', d: 'Classic, hybrid & volume sets.', h: '/lash-extensions-oswego-il' },
];
export default function GenevaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Near Geneva, IL', url: `${SITE.url}/geneva-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Geneva')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 Serving Geneva & Kane County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Med Spa Near Geneva, IL</span> — Premium Aesthetics Worth the Drive</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Hello Gorgeous Med Spa is <strong className="text-white">20 minutes from Geneva</strong> in Oswego, IL. Botox at $10/unit, Morpheus8, HydraFacial, medical weight loss, hormone therapy & lash extensions — all by licensed nurse practitioners.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — 20 min from Geneva via Route 38 E → Route 34</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Services Near Geneva</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SVCS.map((s) => (<Link key={s.n} href={s.h} className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#FF2D8E] hover:shadow-md transition-all"><span className="text-3xl mb-3 block">{s.e}</span><h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF2D8E]">{s.n}</h3><p className="text-sm text-gray-500">{s.d}</p></Link>))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Med Spa Near Geneva — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="general" serviceLabel="Med Spa Near Geneva" heading="Geneva clients love Hello Gorgeous Med Spa" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Geneva — Your Premium Med Spa Is 20 Min Away</h2>
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
