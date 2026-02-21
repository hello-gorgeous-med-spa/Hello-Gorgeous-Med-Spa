import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

// ============================================================
// BOTOX AURORA IL - Location SEO Landing Page
// Target keywords: "botox aurora", "botox aurora il"
// ============================================================

export const metadata: Metadata = {
  title: 'Botox Aurora IL | $10/Unit Near You | Hello Gorgeous Med Spa',
  description: 'Looking for Botox in Aurora, IL? Hello Gorgeous Med Spa offers Botox at $10/unit just 10 minutes from Aurora. Licensed nurse practitioners. Book your free consultation!',
  keywords: [
    'botox aurora',
    'botox aurora il',
    'botox near aurora',
    'aurora botox',
    'botox injections aurora',
    'best botox aurora',
    'med spa aurora',
    'medical spa aurora il',
    'dysport aurora',
  ],
  alternates: {
    canonical: `${SITE.url}/botox-aurora-il`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-aurora-il`,
    title: 'Botox Aurora IL | $10/Unit | Hello Gorgeous Med Spa',
    description: 'Looking for Botox in Aurora, IL? $10/unit, 10 minutes away. Free consultations.',
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/images/services/hg-botox-syringes.png`, width: 1200, height: 630, alt: 'Botox treatment near Aurora IL' }],
  },
};

const AURORA_FAQS = [
  {
    question: 'Where can I get Botox near Aurora, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego is just 10 minutes from Aurora. We offer Botox at $10/unit with licensed nurse practitioners Danielle and Ryan.',
  },
  {
    question: 'How far is Hello Gorgeous from Aurora?',
    answer: 'We\'re approximately 10 minutes from Aurora via Route 30 South. Located at 74 W. Washington Street in downtown Oswego with easy parking.',
  },
  {
    question: 'What is the cost of Botox near Aurora?',
    answer: 'At Hello Gorgeous Med Spa, Botox is $10/unit. Most forehead treatments need 20-30 units. We offer free consultations to determine your needs.',
  },
  {
    question: 'Do you offer other services besides Botox?',
    answer: 'Yes! We offer dermal fillers, lip filler, weight loss (Semaglutide/Tirzepatide), hormone therapy, PRP, microneedling, laser treatments, and more.',
  },
];

export default function BotoxAuroraPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Services', url: `${SITE.url}/services` },
    { name: 'Botox Aurora IL', url: `${SITE.url}/botox-aurora-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(AURORA_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Aurora, IL')) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4">10 Minutes from Aurora</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-[#FF2D8E]">Botox in Aurora, IL</span> — $10/Unit
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Looking for Botox near Aurora? Hello Gorgeous Med Spa is just a short drive away. Licensed nurse practitioners, natural results, competitive pricing.
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
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ 10 min from Aurora</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image src="/images/services/hg-botox-syringes.png" alt="Botox injections near Aurora IL" fill className="object-cover" priority />
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
            <h2 className="text-3xl font-bold text-center mb-12">Why Aurora Clients Choose Hello Gorgeous</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl block mb-4">💰</span>
                <h3 className="font-semibold text-lg mb-2">Competitive Pricing</h3>
                <p className="text-gray-600 text-sm">$10/unit Botox - better than most Aurora med spas</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl block mb-4">🚗</span>
                <h3 className="font-semibold text-lg mb-2">Close to Aurora</h3>
                <p className="text-gray-600 text-sm">Just 10 minutes via Route 30 South</p>
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
            <h2 className="text-3xl font-bold text-center mb-12">Aurora Botox FAQs</h2>
            <div className="space-y-6">
              {AURORA_FAQS.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your Aurora Botox Appointment</h2>
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
            <h2 className="text-2xl font-bold mb-6">Driving from Aurora</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                <strong>From Aurora:</strong> Head south on Route 30 toward Oswego. 
                We're on Washington Street in downtown Oswego.
              </p>
              <p className="text-gray-600">
                74 W. Washington Street, Oswego, IL 60543<br />
                Approximately 10 minutes | Free parking
              </p>
              <a 
                href="https://www.google.com/maps/dir/Aurora,+IL/74+W+Washington+St,+Oswego,+IL+60543" 
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
