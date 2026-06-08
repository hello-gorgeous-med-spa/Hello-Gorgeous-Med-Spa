import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Botox Near Joliet, IL | $10/Unit | Hello Gorgeous Med Spa — Oswego',
  description:
    'Get Botox near Joliet, IL at Hello Gorgeous Med Spa in Oswego — just 20 min away. $10/unit Botox, Dysport & Jeuveau by licensed nurse practitioners. Free consultations.',
  keywords: [
    'botox near joliet il',
    'botox joliet il',
    'botox joliet illinois',
    'cheap botox near joliet',
    'best botox joliet',
    'botox $10 unit near joliet',
    'dysport near joliet il',
    'lip flip joliet il',
    'anti wrinkle injections joliet',
    'botox forehead joliet',
    'botox crows feet joliet il',
    'med spa botox will county',
  ],
  alternates: { canonical: `${SITE.url}/botox-joliet-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-joliet-il`,
    title: 'Botox Near Joliet, IL | $10/Unit | Hello Gorgeous',
    description: '$10/unit Botox just 20 min from Joliet. Licensed NPs, free consultations, natural results.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Where can I get Botox near Joliet, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego is the top-rated option near Joliet — just 20 minutes away via Route 30 or I-80. We offer Botox at $10/unit with licensed nurse practitioners and free consultations.',
  },
  {
    question: 'How much does Botox cost near Joliet?',
    answer: 'At Hello Gorgeous, Botox is $10/unit. Most treatment areas (forehead, frown lines, crow\'s feet) require 20–30 units total. We\'ll give you an exact estimate at your free consultation.',
  },
  {
    question: 'Who performs Botox at Hello Gorgeous?',
    answer: 'All injections are performed by Danielle Glazier-Alcala, FNP-C and Ryan Kent, FNP-BC — licensed family nurse practitioners with full prescriptive authority. Not RNs, not aestheticians.',
  },
  {
    question: 'How long does Botox last?',
    answer: 'Botox typically lasts 3–4 months. Regular treatments may extend longevity over time. We recommend scheduling your follow-up before results fully wear off.',
  },
  {
    question: 'Do you offer Dysport or Jeuveau near Joliet?',
    answer: 'Yes! We offer Botox, Dysport, and Jeuveau — all three neurotoxins. Your provider will help you choose the best option for your anatomy and goals during a free consultation.',
  },
];

const AREAS = ['Joliet', 'Plainfield', 'Crest Hill', 'Lockport', 'Shorewood', 'Bolingbrook'];

export default function BotoxJolietPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Near Joliet, IL', url: `${SITE.url}/joliet-il` },
    { name: 'Botox Near Joliet', url: `${SITE.url}/botox-joliet-il` },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: 'Botox Injections Near Joliet IL',
    description: 'Professional Botox injections at $10/unit by licensed nurse practitioners in Oswego, IL — serving Joliet and Will County.',
    procedureType: 'Cosmetic',
    bodyLocation: 'Face',
    provider: {
      '@type': 'MedicalBusiness',
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
      areaServed: AREAS.map(city => ({ '@type': 'City', name: `${city}, IL` })),
    },
    offers: { '@type': 'Offer', price: '10', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '10', priceCurrency: 'USD', unitText: 'per unit' } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Joliet')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Serving Joliet • Plainfield • Bolingbrook • Shorewood</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-[#FF2D8E]">Botox Near Joliet, IL</span> — $10/Unit by Licensed NPs
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  <strong className="text-white">20 minutes from Joliet</strong> in Oswego — Hello Gorgeous Med Spa offers Botox, Dysport & Jeuveau at $10/unit with natural results and licensed nurse practitioners.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
                  <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ $10/Unit</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consults</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <p className="text-[#FF2D8E] font-bold text-sm uppercase tracking-widest mb-4">Botox Pricing</p>
                {[
                  { area: 'Forehead Lines', units: '20–30 units', price: '$200–$300' },
                  { area: 'Frown Lines (11s)', units: '20–25 units', price: '$200–$250' },
                  { area: "Crow's Feet", units: '10–15 units/side', price: '$200–$300' },
                  { area: 'Lip Flip', units: '4–8 units', price: '$40–$80' },
                  { area: 'Bunny Lines', units: '5–10 units', price: '$50–$100' },
                  { area: 'Brow Lift', units: '5–10 units', price: '$50–$100' },
                ].map((item) => (
                  <div key={item.area} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-medium text-white">{item.area}</p>
                      <p className="text-xs text-gray-400">{item.units}</p>
                    </div>
                    <p className="text-[#FF2D8E] font-bold">{item.price}</p>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-4">Exact units determined at free consultation. $10/unit for all neurotoxins.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — ~20 min from Joliet via I-80 E → Exit Route 34</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Serving Joliet & Surrounding Will County</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {AREAS.map((city) => (
                <div key={city} className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100">
                  <span className="text-xl mb-1 block">📍</span>
                  <p className="font-semibold text-sm">{city}, IL</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Botox Near Joliet — FAQs</h2>
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

        <RealPatientReviews service="botox" serviceLabel="Botox Near Joliet" heading="Real clients near Joliet on Botox at Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Stop Searching "Botox Near Me" — Book Today</h2>
            <p className="text-xl text-gray-300 mb-8">$10/unit · Free consultations · 20 min from Joliet · Same-week appointments</p>
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
