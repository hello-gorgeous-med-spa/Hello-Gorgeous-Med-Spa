import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Botox Yorkville IL | $10/Unit Near You | Hello Gorgeous Med Spa',
  description: 'Looking for Botox in Yorkville, IL? Hello Gorgeous Med Spa offers Botox at $10/unit just 8 minutes away. Licensed nurse practitioners. Book free consultation!',
  keywords: ['botox yorkville', 'botox yorkville il', 'botox near yorkville', 'med spa yorkville'],
  alternates: { canonical: `${SITE.url}/botox-yorkville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-yorkville-il`,
    title: 'Botox Yorkville IL | $10/Unit | Hello Gorgeous Med Spa',
    description: 'Botox in Yorkville, IL. $10/unit, 8 minutes away. Free consultations.',
    images: [{ url: `${SITE.url}/images/services/hg-botox-syringes.png`, width: 1200, height: 630 }],
  },
};

const FAQS = [
  { question: 'Where can I get Botox near Yorkville, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is just 8 minutes from Yorkville. We offer Botox at $10/unit with licensed nurse practitioners.' },
  { question: 'How much does Botox cost near Yorkville?', answer: 'At Hello Gorgeous, Botox is $10/unit. Most forehead treatments need 20-30 units.' },
];

export default function BotoxYorkvillePage() {
  const breadcrumbs = [{ name: 'Home', url: SITE.url }, { name: 'Botox Yorkville IL', url: `${SITE.url}/botox-yorkville-il` }];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Yorkville, IL')) }} />

      <main className="bg-white">
        <section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4">8 Minutes from Yorkville</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-[#FF2D8E]">Botox in Yorkville, IL</span> — $10/Unit</h1>
                <p className="text-xl text-gray-300 mb-8">Looking for Botox near Yorkville? Hello Gorgeous Med Spa is your closest premium med spa option.</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] text-lg">Book Free Consultation</Link>
                  <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black text-lg">📞 {SITE.phone}</a>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-[#FF2D8E]/30">
                  <Image src="/images/services/hg-botox-syringes.png" alt="Botox near Yorkville IL" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#FF2D8E] text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">$10</p><p className="text-sm">per unit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Yorkville Botox FAQs</h2>
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

        <section className="py-16 bg-black text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Book Your Yorkville Botox Appointment</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl">Book Online</Link>
            <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl">Call {SITE.phone}</a>
          </div>
        </section>
      </main>
    </>
  );
}
