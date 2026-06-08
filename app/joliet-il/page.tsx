import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Med Spa Near Joliet, IL | Hello Gorgeous Med Spa — Oswego',
  description:
    'Joliet-area residents love Hello Gorgeous Med Spa in Oswego, just 20 min away. Botox, fillers, Morpheus8, laser hair removal, medical weight loss & more. Free consultations.',
  keywords: [
    'med spa near joliet il',
    'med spa joliet il',
    'botox near joliet',
    'fillers near joliet il',
    'morpheus8 near joliet',
    'laser hair removal joliet il',
    'weight loss joliet il',
    'medical spa joliet',
    'best med spa joliet',
    'medspa near joliet illinois',
    'aesthetic clinic joliet il',
    'semaglutide joliet il',
  ],
  alternates: { canonical: `${SITE.url}/joliet-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/joliet-il`,
    title: 'Med Spa Near Joliet, IL | Hello Gorgeous Med Spa',
    description: 'Just 20 minutes from Joliet — Botox, Morpheus8, weight loss, laser hair & more. Free consultations, NP on site.',
    siteName: SITE.name,
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Is Hello Gorgeous Med Spa close to Joliet, IL?',
    answer: 'Yes! We\'re located at 74 W. Washington Street in Oswego, IL — about 20 minutes from downtown Joliet via Route 30 or I-80 to Route 34. Many of our clients drive from Joliet for our pricing, expertise, and results.',
  },
  {
    question: 'What services do you offer near Joliet?',
    answer: 'We offer Botox, Dysport, dermal fillers, Morpheus8 RF microneedling, Solaria CO2 laser resurfacing, laser hair removal, medical weight loss (semaglutide & tirzepatide), hormone therapy, HydraFacial, vitamin shots, and more.',
  },
  {
    question: 'How much does Botox cost near Joliet?',
    answer: 'Botox is $10/unit at Hello Gorgeous Med Spa. Most treatment areas require 20–30 units. Free consultations are always available to estimate your specific needs.',
  },
  {
    question: 'Do you offer medical weight loss for Joliet residents?',
    answer: 'Absolutely. We offer clinician-supervised semaglutide and tirzepatide programs for eligible clients. Joliet residents regularly make the short drive for our comprehensive weight loss protocols.',
  },
  {
    question: 'How do I book from Joliet?',
    answer: 'Book online at hellogorgeousmedspa.com/book or call (630) 636-6193. We offer same-week appointments and are open 7 days a week.',
  },
];

const SERVICES = [
  { name: 'Botox & Dysport', emoji: '💉', desc: 'From $10/unit. Natural results by licensed NPs.', href: '/botox-joliet-il' },
  { name: 'Dermal Fillers', emoji: '✨', desc: 'Lip, cheek, jawline & under-eye fillers.', href: '/dermal-fillers-oswego-il' },
  { name: 'Morpheus8', emoji: '🔥', desc: 'RF microneedling for skin tightening & collagen.', href: '/morpheus8-joliet-il' },
  { name: 'Medical Weight Loss', emoji: '💊', desc: 'Semaglutide & tirzepatide programs.', href: '/weight-loss-joliet-il' },
  { name: 'Laser Hair Removal', emoji: '⚡', desc: 'Permanent reduction for face & body.', href: '/laser-hair-removal-oswego-il' },
  { name: 'HydraFacial', emoji: '💧', desc: 'Deep cleanse, extract, hydrate & glow.', href: '/hydrafacial-oswego-il' },
  { name: 'Vitamin Bar', emoji: '⚡', desc: 'B12, biotin, glutathione & IV therapy.', href: '/vitamin-bar' },
  { name: 'Hormone Therapy', emoji: '🧬', desc: 'Bioidentical HRT for women & men.', href: '/peptides' },
];

export default function JolietHubPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Near Joliet, IL', url: `${SITE.url}/joliet-il` },
  ];

  const schemaService = {
    '@context': 'https://schema.org',
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
      addressCountry: SITE.address.addressCountry,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    areaServed: [
      { '@type': 'City', name: 'Joliet, IL' },
      { '@type': 'City', name: 'Oswego, IL' },
      { '@type': 'City', name: 'Plainfield, IL' },
      { '@type': 'City', name: 'Naperville, IL' },
    ],
    priceRange: '$$$',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Joliet')) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 Serving Joliet & Will County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              The <span className="text-[#FF2D8E]">Med Spa Near Joliet</span> That Joliet Residents Are Talking About
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Just <strong className="text-white">20 minutes from Joliet</strong> in Oswego, IL — Hello Gorgeous Med Spa offers premium aesthetics, medical weight loss, and clinical treatments at prices that make the drive completely worth it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">
                Book Free Consultation
              </Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">
                📞 {SITE.phone}
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars ({SITE.reviewCount}+ Reviews)</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NP On Site</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Open 7 Days</span>
            </div>
          </div>
        </section>

        {/* Distance callout */}
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              📍 <strong>74 W. Washington Street, Oswego, IL 60543</strong> — ~20 min from Joliet via I-80 → Route 30 South → Route 34
            </p>
            <p className="mt-2 text-gray-600 text-sm">Worth every minute of the drive. Here's why hundreds of Will County residents choose us.</p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Services Available Near Joliet</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Everything you'd want from a med spa — done right, by licensed nurse practitioners, with results you'll actually love.</p>
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

        {/* Why drive from Joliet */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Joliet Clients Drive to Hello Gorgeous</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '💉', title: '$10/Unit Botox', desc: 'Authentic Allergan Botox at $10/unit. Most Joliet-area spas charge $12–$16/unit for the same product.' },
                { icon: '👩‍⚕️', title: 'Full-Authority NPs', desc: 'Danielle Glazier-Alcala, FNP-C & Ryan Kent, FNP-BC. Not RNs or aestheticians — actual nurse practitioners with full prescriptive authority.' },
                { icon: '⭐', title: '#1 Rated in the Area', desc: `${SITE.reviewRating} stars across ${SITE.reviewCount}+ verified Google reviews. Consistently ranked the best med spa in the western suburbs.` },
                { icon: '🔥', title: 'Advanced Devices', desc: 'Morpheus8, Solaria CO2 laser, Quantum RF — devices you won\'t find at every spa in Will County.' },
                { icon: '💊', title: 'Medical Weight Loss', desc: 'Clinician-supervised semaglutide & tirzepatide. Real prescriptions. Real results. Not a wellness coaching program.' },
                { icon: '💜', title: 'Loyalty Rewards', desc: 'Earn points on every visit. Bronze, Gold & Platinum tiers with real perks. Plus refer a friend and you both get $25 credit.' },
              ].map((item) => (
                <div key={item.title} className="text-center p-6">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Med Spa Near Joliet — FAQs</h2>
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

        <RealPatientReviews service="general" serviceLabel="Med Spa Near Joliet" heading="What clients near Joliet are saying" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        {/* CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make the Drive? You Won't Regret It.</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · $10/unit Botox · Open 7 days · 20 min from Joliet</p>
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
