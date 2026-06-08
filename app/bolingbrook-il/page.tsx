import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Med Spa Near Bolingbrook, IL | Hello Gorgeous Med Spa — Oswego',
  description:
    'Bolingbrook clients drive to Hello Gorgeous Med Spa in Oswego — 20 min for the best Botox, Morpheus8, laser hair, HydraFacial & medical weight loss in the area. NP on site.',
  keywords: [
    'med spa bolingbrook il',
    'med spa near bolingbrook',
    'botox bolingbrook il',
    'botox near bolingbrook',
    'morpheus8 bolingbrook il',
    'laser hair removal bolingbrook',
    'hydrafacial bolingbrook il',
    'weight loss bolingbrook il',
    'medical spa bolingbrook',
    'best med spa bolingbrook illinois',
    'semaglutide bolingbrook il',
    'fillers bolingbrook il',
  ],
  alternates: { canonical: `${SITE.url}/bolingbrook-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/bolingbrook-il`,
    title: 'Med Spa Near Bolingbrook, IL | Hello Gorgeous Med Spa',
    description: 'About 20 min from Bolingbrook — Botox $10/unit, Morpheus8, laser hair, HydraFacial, weight loss. NP on site, free consultations.',
    siteName: SITE.name,
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'How far is Hello Gorgeous Med Spa from Bolingbrook?',
    answer: 'We\'re about 20 minutes from Bolingbrook via I-55 South to Route 34. Our address is 74 W. Washington Street, Oswego, IL 60543. Many Bolingbrook clients tell us the drive is absolutely worth it.',
  },
  {
    question: 'What treatments do you offer for Bolingbrook residents?',
    answer: 'We offer Botox, Dysport, dermal fillers, Morpheus8 RF microneedling, Solaria CO2 laser, laser hair removal, medical weight loss (semaglutide & tirzepatide), HydraFacial, vitamin shots, hormone therapy, and more.',
  },
  {
    question: 'How much is Botox near Bolingbrook, IL?',
    answer: 'Botox is $10/unit at Hello Gorgeous. With free consultations and licensed nurse practitioners, many Bolingbrook clients find the 20-minute drive saves them both money and delivers better results.',
  },
  {
    question: 'Is there a loyalty program?',
    answer: 'Yes! Our Bronze, Gold, and Platinum loyalty program rewards every visit with exclusive perks. Our referral program also gives you and a friend $25 credit each when they book their first appointment.',
  },
  {
    question: 'Do you offer medical weight loss near Bolingbrook?',
    answer: 'Yes. We offer clinician-supervised semaglutide and tirzepatide weight loss programs. Book a consultation to see if you\'re a candidate.',
  },
];

const SERVICES = [
  { name: 'Botox & Dysport', emoji: '💉', desc: '$10/unit by licensed NPs.', href: '/botox-oswego-il' },
  { name: 'Dermal Fillers', emoji: '✨', desc: 'Lip, cheek, jawline & more.', href: '/dermal-fillers-oswego-il' },
  { name: 'Morpheus8', emoji: '🔥', desc: 'RF microneedling & skin tightening.', href: '/morpheus8-oswego-il' },
  { name: 'HydraFacial', emoji: '💧', desc: 'Cleanse, extract, hydrate, glow.', href: '/hydrafacial-oswego-il' },
  { name: 'Laser Hair Removal', emoji: '⚡', desc: 'Permanent reduction for face & body.', href: '/laser-hair-removal-oswego-il' },
  { name: 'Medical Weight Loss', emoji: '💊', desc: 'Semaglutide & tirzepatide.', href: '/weight-loss-oswego-il' },
  { name: 'CO2 Laser', emoji: '🌟', desc: 'Solaria CO2 skin resurfacing.', href: '/solaria-co2-laser-oswego-il' },
  { name: 'Vitamin Bar', emoji: '⚡', desc: 'B12, biotin, IV therapy & more.', href: '/vitamin-bar' },
];

export default function BolingbrookPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Near Bolingbrook, IL', url: `${SITE.url}/bolingbrook-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Bolingbrook')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 Serving Bolingbrook & DuPage County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              The <span className="text-[#FF2D8E]">Med Spa Near Bolingbrook</span> Worth the Drive
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              <strong className="text-white">20 minutes from Bolingbrook</strong> — Hello Gorgeous Med Spa offers Botox at $10/unit, Morpheus8, medical weight loss, HydraFacial, and more, all performed by licensed nurse practitioners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars ({SITE.reviewCount}+ Reviews)</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NP On Site</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Open 7 Days</span>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold text-gray-800">📍 <strong>74 W. Washington Street, Oswego, IL 60543</strong> — ~20 min from Bolingbrook via I-55 South → Route 34 West</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Services Near Bolingbrook</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">Bolingbrook Med Spa FAQs</h2>
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

        <RealPatientReviews service="general" serviceLabel="Med Spa Near Bolingbrook" heading="Bolingbrook clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Bolingbrook — Your Premier Med Spa Is 20 Min Away</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · $10/unit Botox · Open 7 days · Worth every mile</p>
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
