import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { InjectablesBlogPromo } from '@/components/InjectablesBlogPromo';

// ============================================================
// BOTOX MONTGOMERY IL - Location SEO Landing Page
// Target keywords: "botox montgomery", "botox montgomery il"
// ============================================================

export const metadata: Metadata = {
  title: 'Botox Near Me | Montgomery IL | $10/Unit — Next Door | Hello Gorgeous Med Spa',
  description: 'Botox near me in Montgomery, IL? Hello Gorgeous is right next door (under 10 min) — $10/unit, free consultation. Botox, Dysport, Jeuveau. Serving Montgomery, Oswego, Aurora. Book now!',
  keywords: [
    'botox near me',
    'botox montgomery il',
    'botox montgomery',
    'botox near montgomery',
    'montgomery botox',
    'botox injections montgomery',
    'best botox montgomery',
    'med spa montgomery',
    'medical spa montgomery il',
    'dysport montgomery',
  ],
  alternates: {
    canonical: `${SITE.url}/botox-montgomery-il`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-montgomery-il`,
    title: 'Botox Montgomery IL | $10/Unit | Hello Gorgeous Med Spa',
    description: 'Looking for Botox in Montgomery, IL? $10/unit, minutes away. Free consultations.',
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/images/services/hg-botox-syringes.png`, width: 1200, height: 630, alt: 'Botox treatment near Montgomery IL' }],
  },
};

const MONTGOMERY_FAQS = [
  {
    question: 'Where can I get Botox near Montgomery, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego is right next door to Montgomery — under 10 minutes away. We offer Botox at $10/unit with licensed nurse practitioners Danielle and Ryan.',
  },
  {
    question: 'How far is Hello Gorgeous from Montgomery?',
    answer: 'We\'re less than 10 minutes from Montgomery via Route 30. Located at 74 W. Washington Street in downtown Oswego with easy, free parking.',
  },
  {
    question: 'What is the cost of Botox near Montgomery?',
    answer: 'At Hello Gorgeous Med Spa, Botox is $10/unit. Most forehead treatments need 20-30 units. We offer free consultations to determine your needs.',
  },
  {
    question: 'Do you offer other services besides Botox?',
    answer: 'Yes! We offer dermal fillers, lip filler, weight loss (Semaglutide/Tirzepatide), hormone therapy, PRP, microneedling, Morpheus8, laser treatments, and more.',
  },
];

export default function BotoxMontgomeryPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Services', url: `${SITE.url}/services` },
    { name: 'Botox Montgomery IL', url: `${SITE.url}/botox-montgomery-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(MONTGOMERY_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Montgomery, IL')) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4">Right Next Door to Montgomery</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-[#FF2D8E]">Botox in Montgomery, IL</span> — $10/Unit
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Looking for Botox near Montgomery? Hello Gorgeous Med Spa is minutes away in downtown Oswego. Licensed nurse practitioners, natural results, competitive pricing.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">
                    Book Free Consultation
                  </Link>
                  <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">
                    📞 {SITE.phone}
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">⭐ 4.9 Stars</span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs</span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Minutes from Montgomery</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image src="/images/services/hg-botox-syringes.png" alt="Botox injections near Montgomery IL" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FF2D8E] text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">$10</p>
                  <p className="text-sm">per unit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Montgomery Clients Choose Hello Gorgeous</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl block mb-4">💰</span>
                <h3 className="font-semibold text-lg mb-2">Competitive Pricing</h3>
                <p className="text-gray-600 text-sm">$10/unit Botox — better than most area med spas</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl block mb-4">🚗</span>
                <h3 className="font-semibold text-lg mb-2">Next Door to Montgomery</h3>
                <p className="text-gray-600 text-sm">Under 10 minutes via Route 30</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl block mb-4">⭐</span>
                <h3 className="font-semibold text-lg mb-2">5-Star Reviews</h3>
                <p className="text-gray-600 text-sm">4.9 stars on Google with 47+ reviews</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Montgomery Botox FAQs</h2>
            <div className="space-y-6">
              {MONTGOMERY_FAQS.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <InjectablesBlogPromo
          title="Botox vs Dysport vs Jeuveau — Which One Is Right for You?"
          subtitle="We offer all three. Read our FAQ to compare onset, longevity, spread & cost. Your provider helps you decide."
        />

        {/* CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your Montgomery Botox Appointment</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations • $10/unit • Same-week appointments</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">
                Book Online Now
              </Link>
              <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Directions */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Driving from Montgomery</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                <strong>From Montgomery:</strong> Head south on Route 30 toward Oswego.
                We're on Washington Street in downtown Oswego.
              </p>
              <p className="text-gray-600">
                74 W. Washington Street, Oswego, IL 60543<br />
                Under 10 minutes | Free parking
              </p>
              <a
                href="https://www.google.com/maps/dir/Montgomery,+IL/74+W+Washington+St,+Oswego,+IL+60543"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[#FF2D8E] font-medium hover:underline"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
