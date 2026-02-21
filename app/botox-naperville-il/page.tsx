import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

// ============================================================
// BOTOX NAPERVILLE IL - Location SEO Landing Page
// Target keywords: "botox naperville", "botox naperville il"
// ============================================================

export const metadata: Metadata = {
  title: 'Botox Naperville IL | $10/Unit Near You | Hello Gorgeous Med Spa',
  description: 'Looking for Botox in Naperville, IL? Hello Gorgeous Med Spa offers Botox at $10/unit just 15 minutes from downtown Naperville. Licensed nurse practitioners. Book your free consultation!',
  keywords: [
    'botox naperville',
    'botox naperville il',
    'botox near naperville',
    'naperville botox',
    'botox injections naperville',
    'best botox naperville',
    'cheap botox naperville',
    'dysport naperville',
    'med spa naperville',
    'medical spa naperville il',
  ],
  alternates: {
    canonical: `${SITE.url}/botox-naperville-il`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-naperville-il`,
    title: 'Botox Naperville IL | $10/Unit | Hello Gorgeous Med Spa',
    description: 'Looking for Botox in Naperville, IL? $10/unit, 15 minutes from downtown. Free consultations.',
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/images/services/hg-botox-syringes.png`, width: 1200, height: 630, alt: 'Botox treatment near Naperville IL' }],
  },
};

const NAPERVILLE_FAQS = [
  {
    question: 'Is there Botox available near Naperville, IL?',
    answer: 'Yes! Hello Gorgeous Med Spa in Oswego is just 15 minutes from downtown Naperville. We offer Botox at $10/unit with licensed nurse practitioners.',
  },
  {
    question: 'How far is Hello Gorgeous Med Spa from Naperville?',
    answer: 'We\'re located at 74 W. Washington Street in Oswego, IL - approximately 15 minutes from downtown Naperville via Route 34 West. Easy parking available.',
  },
  {
    question: 'Do you accept Naperville patients?',
    answer: 'We serve many clients from Naperville and surrounding areas including Aurora, Plainfield, Yorkville, and throughout DuPage and Kendall counties.',
  },
  {
    question: 'What Botox services do you offer for Naperville clients?',
    answer: 'We offer full Botox services including forehead lines, frown lines (11s), crow\'s feet, lip flip, bunny lines, and more. All at $10/unit with free consultations.',
  },
];

export default function BotoxNapervillePage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Services', url: `${SITE.url}/services` },
    { name: 'Botox Naperville IL', url: `${SITE.url}/botox-naperville-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(NAPERVILLE_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville, IL')) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4">15 Minutes from Downtown Naperville</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-[#FF2D8E]">Botox in Naperville</span> — $10/Unit
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Looking for Botox near Naperville, IL? Hello Gorgeous Med Spa is just a short drive from downtown. Licensed nurse practitioners, natural results.
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
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ 15 min from Naperville</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image src="/images/services/hg-botox-syringes.png" alt="Botox injections near Naperville IL" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FF2D8E] text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">$10</p>
                  <p className="text-sm">per unit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Naperville Clients Choose Us */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Why Naperville Clients Choose Us</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Many of our Botox clients drive from Naperville for our competitive pricing, experienced providers, and exceptional results.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Better Pricing</h3>
                <p className="text-gray-600 text-sm">$10/unit is more competitive than many Naperville med spas charging $13-15/unit.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚗</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Easy Drive</h3>
                <p className="text-gray-600 text-sm">Just 15 minutes via Route 34 West. Free parking right outside.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">5-Star Service</h3>
                <p className="text-gray-600 text-sm">4.9 stars on Google. Personal attention from licensed nurse practitioners.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Naperville Botox FAQs</h2>
            <div className="space-y-6">
              {NAPERVILLE_FAQS.map((faq, index) => (
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
            <h2 className="text-3xl font-bold mb-6">Book Your Naperville Botox Appointment</h2>
            <p className="text-xl text-gray-300 mb-8">
              Free consultations • $10/unit • Same-week appointments
            </p>
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
            <h2 className="text-2xl font-bold mb-6">Driving from Naperville</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                <strong>From Downtown Naperville:</strong> Head west on Route 34 for about 8 miles. 
                We're on Washington Street in downtown Oswego, right off Route 34.
              </p>
              <p className="text-gray-600">
                74 W. Washington Street, Oswego, IL 60543<br />
                Approximately 15 minutes | Free parking available
              </p>
              <a 
                href="https://www.google.com/maps/dir/Naperville,+IL/74+W+Washington+St,+Oswego,+IL+60543" 
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
