import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Botox Plainfield IL | $10/Unit Near You | Hello Gorgeous Med Spa',
  description: 'Looking for Botox in Plainfield, IL? Hello Gorgeous Med Spa offers Botox at $10/unit just 12 minutes away. Licensed nurse practitioners. Book free consultation!',
  keywords: ['botox plainfield', 'botox plainfield il', 'botox near plainfield', 'med spa plainfield', 'dysport plainfield'],
  alternates: { canonical: `${SITE.url}/botox-plainfield-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-plainfield-il`,
    title: 'Botox Plainfield IL | $10/Unit | Hello Gorgeous Med Spa',
    description: 'Botox in Plainfield, IL. $10/unit, 12 minutes away. Free consultations.',
    images: [{ url: `${SITE.url}/images/services/hg-botox-syringes.png`, width: 1200, height: 630 }],
  },
};

const FAQS = [
  { question: 'Where can I get Botox near Plainfield, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 12 minutes from Plainfield via Route 126. We offer Botox at $10/unit with licensed nurse practitioners.' },
  { question: 'How much does Botox cost near Plainfield?', answer: 'At Hello Gorgeous, Botox is $10/unit. Most forehead treatments need 20-30 units. We offer free consultations.' },
  { question: 'Do you serve Plainfield clients?', answer: 'Yes! Many of our clients come from Plainfield. We\'re conveniently located in Oswego, just a short drive away.' },
];

export default function BotoxPlainfieldPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Botox Plainfield IL', url: `${SITE.url}/botox-plainfield-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Plainfield, IL')) }} />

      <main className="bg-white">
        <section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4">12 Minutes from Plainfield</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-[#FF2D8E]">Botox in Plainfield, IL</span> — $10/Unit</h1>
                <p className="text-xl text-gray-300 mb-8">Looking for Botox near Plainfield? Hello Gorgeous Med Spa is just a short drive away. Licensed nurse practitioners, natural results.</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
                  <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="bg-white/10 px-4 py-2 rounded-full">⭐ 4.9 Stars</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ 12 min from Plainfield</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image src="/images/services/hg-botox-syringes.png" alt="Botox near Plainfield IL" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FF2D8E] text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">$10</p><p className="text-sm">per unit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Plainfield Botox FAQs</h2>
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

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your Plainfield Botox Appointment</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] text-lg">Book Online</Link>
              <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
