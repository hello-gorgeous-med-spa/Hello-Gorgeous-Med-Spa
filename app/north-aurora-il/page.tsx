import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Med Spa in North Aurora, IL | Hello Gorgeous Med Spa — 5 Min Away',
  description:
    'North Aurora\'s closest premium med spa is Hello Gorgeous in Oswego — just 5 minutes away. Botox $10/unit, Morpheus8, laser hair removal, HydraFacial, medical weight loss & more.',
  keywords: [
    'med spa north aurora il',
    'botox north aurora il',
    'north aurora med spa',
    'medical spa north aurora',
    'botox near north aurora',
    'fillers north aurora il',
    'morpheus8 north aurora',
    'laser hair removal north aurora il',
    'weight loss north aurora il',
    'hydrafacial north aurora',
    'best med spa north aurora illinois',
    'aesthetic clinic north aurora',
  ],
  alternates: { canonical: `${SITE.url}/north-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/north-aurora-il`,
    title: 'Med Spa in North Aurora, IL | Hello Gorgeous — 5 Min Away',
    description: 'Right next door in Oswego — Botox $10/unit, Morpheus8, HydraFacial, weight loss. Licensed NPs, free consultations, open 7 days.',
    siteName: SITE.name,
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Where is the closest med spa to North Aurora, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego is the closest premium med spa to North Aurora — just 5 minutes away via Route 31 South. We\'re at 74 W. Washington Street, Oswego, IL 60543.',
  },
  {
    question: 'Do you serve North Aurora clients?',
    answer: 'Yes! We have many regular clients from North Aurora. With the short drive, you get access to a full-service NP-directed med spa with Botox, fillers, Morpheus8, laser hair removal, medical weight loss, HydraFacial, vitamin shots, and more.',
  },
  {
    question: 'How much is Botox near North Aurora?',
    answer: 'Botox is $10/unit at Hello Gorgeous. The drive from North Aurora takes about 5 minutes — shorter than most med spas located further in Aurora or Naperville.',
  },
  {
    question: 'What makes Hello Gorgeous different from other spas near North Aurora?',
    answer: 'We\'re NP-directed — meaning full nurse practitioners perform all injectable and medical treatments. We also offer advanced devices like Morpheus8, Solaria CO2 laser, and Quantum RF that most local spas don\'t carry.',
  },
  {
    question: 'Do you have a loyalty program for North Aurora clients?',
    answer: 'Yes! Our Bronze, Gold, and Platinum loyalty tier program rewards every visit. Plus our referral program gives you and a friend $25 each when they book their first appointment. Access everything through our client app.',
  },
];

const SERVICES = [
  { name: 'Botox & Dysport', emoji: '💉', desc: '$10/unit. Natural results by licensed NPs.', href: '/botox-aurora-il' },
  { name: 'Dermal Fillers', emoji: '✨', desc: 'Lip, cheek, jawline & under-eye fillers.', href: '/dermal-fillers-aurora-il' },
  { name: 'Morpheus8', emoji: '🔥', desc: 'RF microneedling for tightening & collagen.', href: '/morpheus8-aurora-il' },
  { name: 'HydraFacial', emoji: '💧', desc: 'Deep cleanse, extract, hydrate & glow.', href: '/hydrafacial-aurora-il' },
  { name: 'Laser Hair Removal', emoji: '⚡', desc: 'Permanent hair reduction, all skin types.', href: '/laser-hair-removal-aurora-il' },
  { name: 'Medical Weight Loss', emoji: '💊', desc: 'Semaglutide & tirzepatide programs.', href: '/weight-loss-aurora-il' },
  { name: 'IPL Photofacial', emoji: '🌟', desc: 'Sun spots, redness & tone correction.', href: '/ipl-photofacial-aurora-il' },
  { name: 'Vitamin Bar', emoji: '⚡', desc: 'B12, biotin, glutathione & IV therapy.', href: '/vitamin-bar' },
];

export default function NorthAuroraPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'North Aurora, IL', url: `${SITE.url}/north-aurora-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('North Aurora')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 North Aurora, IL — 5 Minutes Away</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              The <span className="text-[#FF2D8E]">Med Spa Next Door</span> to North Aurora
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Hello Gorgeous Med Spa is literally <strong className="text-white">5 minutes from North Aurora</strong> in neighboring Oswego. Premium aesthetics, medical weight loss, and clinical treatments — no long drive required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars ({SITE.reviewCount}+ Reviews)</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ 5 Min from North Aurora</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs On Site</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Open 7 Days</span>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              📍 <strong>74 W. Washington Street, Oswego, IL 60543</strong> — Take Route 31 South from North Aurora, just 5 minutes
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Everything You Need, Right Next Door</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Full-service medical aesthetics for North Aurora residents — all performed by licensed nurse practitioners.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((s) => (
                <Link key={s.name} href={s.href} className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#FF2D8E] hover:shadow-md transition-all">
                  <span className="text-3xl mb-3 block">{s.emoji}</span>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF2D8E] transition-colors">{s.name}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">North Aurora Med Spa FAQs</h2>
            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RealPatientReviews service="general" serviceLabel="Med Spa Near North Aurora" heading="North Aurora clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Your Neighborhood Med Spa Is Waiting</h2>
            <p className="text-xl text-gray-300 mb-8">5 minutes from North Aurora · Free consultations · Open 7 days · $10/unit Botox</p>
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
