import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

// ============================================================
// BOTOX OSWEGO IL - Primary Local SEO Landing Page
// Target keywords: "botox near me", "botox oswego", "botox naperville"
// ============================================================

export const metadata: Metadata = {
  title: 'Botox Near Me | $10/Unit Botox in Oswego, IL | Hello Gorgeous Med Spa',
  description: 'Looking for Botox near me? Hello Gorgeous Med Spa offers Botox at $10/unit in Oswego, IL. Serving Naperville, Aurora, Plainfield. Licensed nurse practitioners. Book your free consultation today!',
  keywords: [
    'botox near me',
    'botox oswego',
    'botox oswego il',
    'botox naperville',
    'botox naperville il',
    'botox aurora il',
    'botox plainfield il',
    'botox kendall county',
    'cheap botox near me',
    'affordable botox near me',
    'best botox near me',
    'botox injections near me',
    'botox $10 per unit',
    'dysport near me',
    'wrinkle treatment near me',
    'forehead botox near me',
    'crows feet botox near me',
    'frown lines treatment',
    'med spa near me',
    'medical spa oswego',
    'anti aging treatment oswego',
  ],
  alternates: {
    canonical: `${SITE.url}/botox-oswego-il`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-oswego-il`,
    title: 'Botox Near Me | $10/Unit in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'Looking for Botox near you? $10/unit Botox in Oswego, IL. Serving Naperville, Aurora, Plainfield. Free consultations available.',
    siteName: SITE.name,
    locale: 'en_US',
    images: [
      {
        url: `${SITE.url}/images/services/hg-botox-syringes.png`,
        width: 1200,
        height: 630,
        alt: 'Botox treatment at Hello Gorgeous Med Spa in Oswego IL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Botox Near Me | $10/Unit in Oswego, IL',
    description: 'Looking for Botox near you? $10/unit in Oswego, IL. Serving Naperville, Aurora, Plainfield.',
    images: [`${SITE.url}/images/services/hg-botox-syringes.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const BOTOX_FAQS = [
  {
    question: 'Where can I get Botox near me in the Oswego area?',
    answer: 'Hello Gorgeous Med Spa is located at 74 W. Washington Street in Oswego, IL. We serve clients from Naperville, Aurora, Plainfield, Yorkville, Montgomery, and throughout Kendall County. We offer Botox at just $10/unit with licensed nurse practitioners.',
  },
  {
    question: 'How much does Botox cost near Oswego, IL?',
    answer: 'At Hello Gorgeous Med Spa, Botox is priced at $10/unit. Most forehead treatments require 20-30 units, and crow\'s feet typically need 10-15 units per side. We offer free consultations to determine exactly how many units you\'ll need.',
  },
  {
    question: 'Do you offer Botox in Naperville, IL?',
    answer: 'Yes! While our clinic is in Oswego, we serve many clients from Naperville, IL. We\'re just a short 15-minute drive from downtown Naperville. Many of our Naperville clients choose us for our competitive pricing and experienced providers.',
  },
  {
    question: 'How long does Botox last?',
    answer: 'Botox typically lasts 3-4 months, depending on your metabolism, the area treated, and the number of units used. Regular treatments may help results last longer over time.',
  },
  {
    question: 'Is there a Botox provider near Aurora, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego is conveniently located near Aurora, IL - just about 10 minutes away. We offer Botox, Dysport, and Jeuveau with experienced nurse practitioners.',
  },
  {
    question: 'What areas can Botox treat?',
    answer: 'Botox can treat forehead lines, frown lines (11s between eyebrows), crow\'s feet, bunny lines, lip flip, chin dimpling, neck bands, and more. We offer free consultations to discuss your specific concerns.',
  },
  {
    question: 'Do I need a consultation before getting Botox?',
    answer: 'We recommend a consultation for first-time patients to discuss your goals, review your medical history, and create a personalized treatment plan. Consultations are free at Hello Gorgeous Med Spa.',
  },
  {
    question: 'How do I book Botox near me?',
    answer: 'You can book online at hellogorgeousmedspa.com/book or call us at (630) 636-6193. We offer same-week appointments and flexible scheduling.',
  },
];

export default function BotoxOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Services', url: `${SITE.url}/services` },
    { name: 'Botox Oswego IL', url: `${SITE.url}/botox-oswego-il` },
  ];

  // Enhanced Local Business Schema specifically for Botox
  const botoxServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: 'Botox Injections',
    alternateName: ['Botox Near Me', 'Botox Oswego', 'Botox Naperville', 'Botox Aurora'],
    description: 'Professional Botox injections at $10/unit by licensed nurse practitioners in Oswego, IL. Serving Naperville, Aurora, Plainfield, and Kendall County.',
    procedureType: 'Cosmetic',
    bodyLocation: 'Face',
    preparation: 'Free consultation to discuss goals and treatment plan',
    followup: 'Results typically visible in 3-7 days, lasting 3-4 months',
    howPerformed: 'Small injections using fine needles by licensed nurse practitioners',
    status: 'Available',
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
        addressCountry: SITE.address.addressCountry,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: SITE.geo.latitude,
        longitude: SITE.geo.longitude,
      },
      priceRange: '$$$',
      areaServed: [
        { '@type': 'City', name: 'Oswego, IL' },
        { '@type': 'City', name: 'Naperville, IL' },
        { '@type': 'City', name: 'Aurora, IL' },
        { '@type': 'City', name: 'Plainfield, IL' },
        { '@type': 'City', name: 'Yorkville, IL' },
        { '@type': 'City', name: 'Montgomery, IL' },
      ],
    },
    offers: {
      '@type': 'Offer',
      price: '10',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '10',
        priceCurrency: 'USD',
        unitText: 'per unit',
      },
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(botoxServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BOTOX_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }}
      />

      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4 text-lg">
                  Serving Naperville • Aurora • Plainfield • Oswego
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Looking for <span className="text-[#FF2D8E]">Botox Near Me</span>?
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  <strong className="text-white">$10/Unit Botox</strong> in Oswego, IL — Licensed Nurse Practitioners, Natural Results
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
                  >
                    Book Free Consultation
                  </Link>
                  <a
                    href={`tel:${SITE.phone.replace(/-/g, '')}`}
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg"
                  >
                    📞 {SITE.phone}
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    ⭐ 4.9 Stars (47+ Reviews)
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    ✓ Licensed NPs
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    ✓ Free Consultations
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image
                    src="/images/services/hg-botox-syringes.png"
                    alt="Botox injections at Hello Gorgeous Med Spa in Oswego IL near Naperville Aurora Plainfield"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FF2D8E] text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">$10</p>
                  <p className="text-sm">per unit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Botox Near You — We Serve These Areas
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['Oswego, IL', 'Naperville, IL', 'Aurora, IL', 'Plainfield, IL', 'Yorkville, IL', 'Montgomery, IL'].map((city) => (
                <div key={city} className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-100">
                  <span className="text-2xl mb-2 block">📍</span>
                  <p className="font-semibold text-gray-900">{city}</p>
                  <p className="text-sm text-gray-500">Botox Available</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-gray-600">
              Located at <strong>74 W. Washington Street, Oswego, IL</strong> — Easy access from I-88 & Route 34
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Choose Hello Gorgeous for Botox?
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              When you search "Botox near me," you deserve the best. Here's why clients from Naperville, Aurora, and Plainfield choose us.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💉</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">$10/Unit Pricing</h3>
                <p className="text-gray-600 text-sm">Competitive pricing without sacrificing quality. Authentic Botox from Allergan.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👩‍⚕️</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Licensed NPs</h3>
                <p className="text-gray-600 text-sm">Danielle Glazier-Alcala, FNP-C & Ryan Kent, FNP-BC perform all injections.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Natural Results</h3>
                <p className="text-gray-600 text-sm">We specialize in natural-looking results. No frozen faces here.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">5-Star Rated</h3>
                <p className="text-gray-600 text-sm">4.9 stars on Google with 47+ verified reviews from real clients.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Areas */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Botox Treatment Areas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { area: 'Forehead Lines', units: '20-30 units', desc: 'Smooth horizontal forehead wrinkles' },
                { area: 'Frown Lines (11s)', units: '20-25 units', desc: 'Reduce vertical lines between brows' },
                { area: "Crow's Feet", units: '10-15 units/side', desc: 'Soften lines around eyes' },
                { area: 'Bunny Lines', units: '5-10 units', desc: 'Treat lines on nose when smiling' },
                { area: 'Lip Flip', units: '4-8 units', desc: 'Create fuller upper lip appearance' },
                { area: 'Chin Dimpling', units: '5-10 units', desc: 'Smooth "orange peel" chin texture' },
              ].map((treatment) => (
                <div key={treatment.area} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">{treatment.area}</h3>
                  <p className="text-[#FF2D8E] font-medium mb-2">{treatment.units}</p>
                  <p className="text-gray-600 text-sm">{treatment.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Botox Near Me — Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {BOTOX_FAQS.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Book Your Botox Appointment?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Stop searching "Botox near me" — you found us! Free consultations, $10/unit, same-week appointments available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book Online Now
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/-/g, '')}`}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Visit Our Oswego Location</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <span>
                      <strong className="text-gray-900">Hello Gorgeous Med Spa</strong><br />
                      74 W. Washington Street<br />
                      Oswego, IL 60543
                    </span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="text-[#FF2D8E] hover:underline">{SITE.phone}</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">✉️</span>
                    <a href={`mailto:${SITE.email}`} className="text-[#FF2D8E] hover:underline">{SITE.email}</a>
                  </p>
                </div>
                <div className="mt-8">
                  <h3 className="font-semibold mb-2">Driving Directions:</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• <strong>From Naperville:</strong> ~15 minutes via Route 34 West</li>
                    <li>• <strong>From Aurora:</strong> ~10 minutes via Route 30 South</li>
                    <li>• <strong>From Plainfield:</strong> ~12 minutes via Route 126</li>
                    <li>• <strong>From Yorkville:</strong> ~8 minutes via Route 71 North</li>
                  </ul>
                </div>
              </div>
              <div className="aspect-video relative rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2965.9876!2d-88.3515!3d41.6828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880ef9a7d3f0c0c7%3A0x10dc1dff64560e84!2sHello%20Gorgeous%20Med%20Spa!5e0!3m2!1sen!2sus!4v1629900000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hello Gorgeous Med Spa Location - Botox Near Me in Oswego IL"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
