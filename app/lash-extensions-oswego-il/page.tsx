import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lash Extensions in Oswego, IL | Classic, Hybrid & Volume | Hello Gorgeous Med Spa',
  description:
    'Lash extensions in Oswego, IL at Hello Gorgeous Med Spa. Classic, hybrid & volume sets. Lash Fill Membership $150/mo — 2 fills + 2 biotin injections monthly. Book today.',
  keywords: [
    'lash extensions oswego il',
    'lash extensions near me oswego',
    'lash fills oswego il',
    'eyelash extensions oswego',
    'volume lashes oswego il',
    'hybrid lashes oswego',
    'classic lash extensions oswego il',
    'lash membership oswego',
    'best lash extensions oswego',
    'lash salon oswego il',
    'eyelash extensions near naperville',
    'lash extensions kendall county',
  ],
  alternates: { canonical: `${SITE.url}/lash-extensions-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/lash-extensions-oswego-il`,
    title: 'Lash Extensions in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'Classic, hybrid & volume lash extensions in Oswego. Lash Fill Membership $150/mo — 2 fills + 2 biotin injections. Book today.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'Where can I get lash extensions in Oswego, IL?', answer: 'Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego offers classic, hybrid, and volume lash extension sets. We also offer lash fills and our popular Lash Fill Membership at $150/month.' },
  { question: 'What is included in the Lash Fill Membership at Hello Gorgeous?', answer: 'Our Lash Fill Membership is $150/month and includes 2 lash extension fills per month plus 2 biotin injections per month. Biotin supports hair, skin, and nail health — a perfect complement to lash services.' },
  { question: 'What is the difference between classic, hybrid, and volume lashes?', answer: 'Classic lashes: one extension per natural lash for a natural enhancement. Hybrid: mix of classic and volume fans for a textured look. Volume: multiple lightweight extensions per natural lash for maximum fullness and drama.' },
  { question: 'How long do lash extensions last?', answer: 'Lash extensions typically last the full growth cycle of your natural lashes — about 6–8 weeks before a full set is needed. Fills are recommended every 2–3 weeks to maintain fullness.' },
  { question: 'How should I care for my lash extensions?', answer: 'Avoid oil-based products near the eyes, don\'t rub or pull lashes, brush daily with a spoolie, and avoid steam for the first 24 hours. We provide full aftercare instructions with every appointment.' },
  { question: 'Can I combine lash extensions with other treatments at Hello Gorgeous?', answer: 'Absolutely — many clients combine lashes with Botox, vitamin shots, or a HydraFacial in the same visit. Talk to your provider about scheduling to maximize your time.' },
  { question: 'What is biotin and why is it included with the lash membership?', answer: 'Biotin is a B-vitamin that supports the growth and health of hair, nails, and skin. Our monthly biotin injections deliver it directly into the bloodstream for maximum absorption — supporting the health of your natural lashes from the inside out.' },
];

const SETS = [
  { name: 'Classic Set', desc: 'One extension per natural lash. Perfect for a polished, natural-looking enhancement with added length and definition.', look: 'Natural & refined', icon: '✨' },
  { name: 'Hybrid Set', desc: 'A mix of classic and volume fans. The best of both worlds — textured, wispy, and full without being too dramatic.', look: 'Textured & wispy', icon: '🌟' },
  { name: 'Volume Set', desc: 'Multiple lightweight extensions per natural lash for maximum fullness. Glamorous, dramatic, and gorgeous.', look: 'Full & dramatic', icon: '💜' },
  { name: 'Lash Fill', desc: 'Maintain your set with a fill every 2–3 weeks. Members get 2 fills per month included in their $150 membership.', look: 'Maintenance', icon: '🔄' },
];

export default function LashExtensionsOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Lash Extensions Oswego IL', url: `${SITE.url}/lash-extensions-oswego-il` },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Lash Extensions in Oswego IL',
    description: 'Classic, hybrid, and volume lash extension sets at Hello Gorgeous Med Spa in Oswego, IL. Lash Fill Membership $150/month includes 2 fills + 2 biotin injections.',
    provider: {
      '@type': 'MedicalBusiness',
      name: SITE.name, url: SITE.url, telephone: SITE.phone,
      address: { '@type': 'PostalAddress', streetAddress: SITE.address.streetAddress, addressLocality: SITE.address.addressLocality, addressRegion: SITE.address.addressRegion, postalCode: SITE.address.postalCode },
    },
    areaServed: ['Oswego, IL', 'Naperville, IL', 'Aurora, IL', 'Yorkville, IL', 'Plainfield, IL'].map(c => ({ '@type': 'City', name: c })),
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
                <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Serving Oswego · Naperville · Aurora · Yorkville · Plainfield</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-[#FF2D8E]">Lash Extensions in Oswego, IL</span> — Wake Up Beautiful Every Day
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Classic, hybrid, and volume lash extension sets at Hello Gorgeous Med Spa in Oswego. <strong className="text-white">Lash Fill Membership $150/month</strong> — 2 fills + 2 biotin injections every month.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Your Lash Appointment</Link>
                  <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Classic · Hybrid · Volume</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Lash Fill Membership</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Biotin Included</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#FF2D8E]/20 to-purple-900/20 rounded-2xl p-8 border border-[#FF2D8E]/20">
                <p className="text-[#FF2D8E] font-bold text-sm uppercase tracking-widest mb-4">👁️ Lash Fill Membership</p>
                <p className="text-4xl font-black text-white mb-2">$150<span className="text-xl font-normal text-gray-400">/mo</span></p>
                <ul className="space-y-3 mt-4">
                  {['2 lash extension fills per month', '2 biotin injections per month', 'Biotin supports hair & lash growth', 'App-exclusive member perks', 'Loyalty tier benefits apply'].map((p) => (
                    <li key={p} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-[#FF2D8E]">✓</span>{p}</li>
                  ))}
                </ul>
                <Link href="/app" className="mt-6 block w-full text-center px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all">Join in the App →</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Lash Look</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SETS.map((s) => (
                <div key={s.name} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#FF2D8E]/30 transition-all text-center">
                  <span className="text-4xl mb-4 block">{s.icon}</span>
                  <h3 className="font-bold text-lg mb-1">{s.name}</h3>
                  <p className="text-[#FF2D8E] text-xs font-medium mb-3">{s.look}</p>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Lash Extensions Oswego — FAQs</h2>
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

        <RealPatientReviews service="lash" serviceLabel="Lash Extensions in Oswego" heading="Lash clients love Hello Gorgeous in Oswego" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your Lash Appointment in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">Classic, hybrid & volume · Lash Fill Membership $150/mo · Open 7 days · Oswego, IL</p>
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
