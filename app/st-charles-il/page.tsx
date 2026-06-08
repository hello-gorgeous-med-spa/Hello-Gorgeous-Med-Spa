import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Med Spa Near St. Charles, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'Premium med spa near St. Charles, IL — Hello Gorgeous in Oswego is 25 min away. Botox $10/unit, Morpheus8, HydraFacial, semaglutide, hormone therapy & lash extensions. NP on site.',
  keywords: ['med spa st charles il','med spa near st charles','botox st charles il','botox near st charles','morpheus8 st charles il','weight loss st charles il','hydrafacial st charles','medical spa st charles','semaglutide st charles il','hormone therapy st charles il'],
  alternates: { canonical: `${SITE.url}/st-charles-il` },
  openGraph: { type: 'website', url: `${SITE.url}/st-charles-il`, title: 'Med Spa Near St. Charles, IL | Hello Gorgeous Med Spa', description: '25 min from St. Charles. Botox $10/unit, Morpheus8, HydraFacial, weight loss, hormone therapy. NP on site.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'How far is Hello Gorgeous from St. Charles, IL?', answer: 'About 25 minutes from St. Charles via Route 64 East to Route 34 South. Our address is 74 W. Washington Street, Oswego, IL 60543. St. Charles clients consistently tell us the drive is worth it.' },
  { question: 'What services do you offer near St. Charles?', answer: 'Botox ($10/unit), Dysport, dermal fillers, Morpheus8 RF microneedling, Solaria CO2 laser, HydraFacial with dermaplaning, laser hair removal, semaglutide & tirzepatide weight loss, bioidentical hormone therapy, peptide therapy, vitamin bar, and lash extensions.' },
  { question: 'Why do St. Charles clients drive to Hello Gorgeous?', answer: 'Our nurse practitioners have full prescriptive authority — meaning we can both inject and prescribe. $10/unit Botox, advanced devices like Morpheus8 and Solaria CO2, medical weight loss programs, and a 5-star reputation make the drive completely worthwhile.' },
  { question: 'Do you have an app and loyalty program?', answer: 'Yes — the Hello Gorgeous client app (hellogorgeousmedspa.com/app) gives you your loyalty tier, referral link, exclusive deals, and appointment management. Bronze, Gold, and Platinum tiers reward every visit.' },
];
const SVCS = [
  { n: 'Botox & Dysport', e: '💉', d: '$10/unit. Licensed NPs.', h: '/botox-aurora-il' },
  { n: 'Morpheus8', e: '🔥', d: 'RF microneedling & skin tightening.', h: '/morpheus8-aurora-il' },
  { n: 'HydraFacial', e: '💧', d: 'Deep cleanse + Glow Membership.', h: '/hydrafacial-aurora-il' },
  { n: 'Semaglutide', e: '💊', d: 'GLP-1 weight loss program.', h: '/semaglutide-oswego-il' },
  { n: 'Hormone Therapy', e: '🧬', d: 'Bioidentical HRT for women & men.', h: '/hormone-therapy-oswego-il' },
  { n: 'Laser Hair Removal', e: '⚡', d: 'Permanent reduction, all skin types.', h: '/laser-hair-removal-aurora-il' },
];
export default function StCharlesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Near St. Charles, IL', url: `${SITE.url}/st-charles-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('St. Charles')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 Serving St. Charles & Kane County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Med Spa Near St. Charles, IL</span> — Where the Results Justify the Drive</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Hello Gorgeous Med Spa in Oswego is <strong className="text-white">25 minutes from St. Charles</strong>. Botox at $10/unit, Morpheus8, HydraFacial, semaglutide, hormone therapy, and lash extensions — all under one roof, performed by licensed nurse practitioners.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — 25 min from St. Charles via Route 64 E → Route 34 S</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Services Near St. Charles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SVCS.map((s) => (<Link key={s.n} href={s.h} className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#FF2D8E] hover:shadow-md transition-all"><span className="text-3xl mb-3 block">{s.e}</span><h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF2D8E]">{s.n}</h3><p className="text-sm text-gray-500">{s.d}</p></Link>))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Med Spa Near St. Charles — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="general" serviceLabel="Med Spa Near St. Charles" heading="St. Charles clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">St. Charles — 25 Min to the Best Med Spa in the Area</h2>
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
