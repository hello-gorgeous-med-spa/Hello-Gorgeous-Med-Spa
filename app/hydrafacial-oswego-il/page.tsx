import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'HydraFacial in Oswego, IL | Deep Cleanse & Glow | Hello Gorgeous Med Spa',
  description:
    'HydraFacial with dermaplaning in Oswego, IL at Hello Gorgeous Med Spa. Cleanse, extract, hydrate, and glow in one treatment. Glow Facial Membership $99/mo. Free consultations.',
  keywords: [
    'hydrafacial oswego il',
    'hydrafacial near me oswego',
    'hydrafacial oswego illinois',
    'dermaplaning oswego il',
    'facial near me oswego',
    'hydrafacial with dermaplaning oswego',
    'best facial oswego il',
    'glow facial oswego',
    'hydrafacial membership oswego',
    'hydrafacial near naperville',
    'deep cleansing facial oswego',
    'medical grade facial oswego il',
  ],
  alternates: { canonical: `${SITE.url}/hydrafacial-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/hydrafacial-oswego-il`,
    title: 'HydraFacial in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'Medical-grade HydraFacial with dermaplaning in Oswego. Glow Facial Membership $99/mo. Free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Where can I get a HydraFacial in Oswego, IL?',
    answer: 'Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego offers HydraFacial treatments with optional dermaplaning. We also offer our Glow Facial Membership at $99/month for regular clients.',
  },
  {
    question: 'What is a HydraFacial?',
    answer: 'HydraFacial is a medical-grade facial treatment that cleanses, exfoliates, extracts impurities, and infuses hydrating serums in one session. It\'s suitable for all skin types and delivers immediate, visible results with zero downtime.',
  },
  {
    question: 'What is dermaplaning and can it be added to my HydraFacial?',
    answer: 'Dermaplaning is a gentle exfoliation treatment using a surgical blade to remove dead skin cells and peach fuzz, leaving skin silky smooth. When combined with HydraFacial, serums penetrate deeper for enhanced results.',
  },
  {
    question: 'What is the Glow Facial Membership at Hello Gorgeous?',
    answer: 'Our Glow Facial Membership is $99/month and includes 1 HydraFacial with dermaplaning + 1 biotin injection per month. Unused facial credit rolls over so you can apply it toward more advanced treatments anytime.',
  },
  {
    question: 'How often should I get a HydraFacial?',
    answer: 'Monthly treatments are ideal for maintaining results. Our $99/month Glow Facial Membership makes this easy and affordable.',
  },
  {
    question: 'Is there downtime after a HydraFacial?',
    answer: 'No downtime! Your skin may be slightly pink for a few hours but you can return to normal activities immediately. Most clients walk out visibly glowing.',
  },
];

export default function HydrafacialOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'HydraFacial Oswego IL', url: `${SITE.url}/hydrafacial-oswego-il` },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: 'HydraFacial with Dermaplaning in Oswego IL',
    description: 'Medical-grade HydraFacial with dermaplaning at Hello Gorgeous Med Spa in Oswego, IL.',
    procedureType: 'Cosmetic',
    bodyLocation: 'Face',
    provider: {
      '@type': 'MedicalBusiness',
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: { '@type': 'PostalAddress', streetAddress: SITE.address.streetAddress, addressLocality: SITE.address.addressLocality, addressRegion: SITE.address.addressRegion, postalCode: SITE.address.postalCode },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Serving Oswego • Naperville • Aurora • Yorkville</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-[#FF2D8E]">HydraFacial in Oswego, IL</span> — Cleanse. Extract. Hydrate. Glow.
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Medical-grade HydraFacial with optional dermaplaning at Hello Gorgeous Med Spa. Zero downtime, immediate results, and a glow that lasts. <strong className="text-white">Glow Facial Membership from $99/month.</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Glow</Link>
                  <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Zero Downtime</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ All Skin Types</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Membership Available</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#FF2D8E]/20 to-[#FF2D8E]/5 rounded-2xl p-8 border border-[#FF2D8E]/20">
                <p className="text-[#FF2D8E] font-bold text-sm uppercase tracking-widest mb-4">💧 Glow Facial Membership</p>
                <p className="text-4xl font-black text-white mb-2">$99<span className="text-xl font-normal text-gray-400">/mo</span></p>
                <ul className="space-y-3 mt-4">
                  {[
                    '1 HydraFacial + Dermaplaning/month',
                    '1 Biotin injection/month',
                    'Rollover facial credit',
                    'Apply credit to upgrade treatments',
                    'App-exclusive member perks',
                  ].map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#FF2D8E]">✓</span> {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className="mt-6 block w-full text-center px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all">
                  Join in the App →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">What HydraFacial Treats</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">One powerful treatment, dozens of benefits for all skin types.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { concern: 'Dull, Dehydrated Skin', desc: 'Instantly hydrate and brighten for a lit-from-within glow.' },
                { concern: 'Enlarged Pores', desc: 'Deep-cleanse and extract pore congestion, visibly refining skin texture.' },
                { concern: 'Fine Lines', desc: 'Plump and smooth early signs of aging with powerful peptide serums.' },
                { concern: 'Uneven Skin Tone', desc: 'Brighten sun spots, redness, and hyperpigmentation over time.' },
                { concern: 'Oily / Acne-Prone Skin', desc: 'Balance oil production and clear breakouts without irritation.' },
                { concern: 'Rough Texture', desc: 'Exfoliate dead skin cells for silky smooth, radiant skin.' },
                { concern: 'Sensitive Skin', desc: 'Gentle enough for rosacea and reactive skin types.' },
                { concern: 'Peach Fuzz', desc: 'Add dermaplaning to remove vellus hair and amplify serum absorption.' },
              ].map((item) => (
                <div key={item.concern} className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{item.concern}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Oswego — FAQs</h2>
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

        <RealPatientReviews service="facial" serviceLabel="HydraFacial in Oswego" heading="Real HydraFacial results in Oswego" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Glow? Book Your HydraFacial Today</h2>
            <p className="text-xl text-gray-300 mb-8">In Oswego · Free consultations · Glow Facial Membership $99/mo · Open 7 days</p>
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
