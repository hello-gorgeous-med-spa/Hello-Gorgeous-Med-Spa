import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Morpheus8 Near Joliet, IL | RF Microneedling | Hello Gorgeous Med Spa',
  description:
    'Morpheus8 RF microneedling near Joliet, IL at Hello Gorgeous Med Spa in Oswego — 20 min away. Skin tightening, collagen induction, acne scars & body contouring. Book a free consult.',
  keywords: [
    'morpheus8 near joliet il',
    'morpheus8 joliet il',
    'rf microneedling joliet',
    'skin tightening joliet il',
    'morpheus8 will county',
    'radiofrequency microneedling near joliet',
    'collagen induction therapy joliet',
    'morpheus8 body joliet il',
    'skin rejuvenation joliet',
    'acne scar treatment joliet il',
    'best morpheus8 near joliet',
    'non surgical facelift joliet il',
  ],
  alternates: { canonical: `${SITE.url}/morpheus8-joliet-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/morpheus8-joliet-il`,
    title: 'Morpheus8 Near Joliet, IL | RF Microneedling | Hello Gorgeous',
    description: 'Morpheus8 RF microneedling 20 min from Joliet in Oswego. Skin tightening, collagen, body contouring. Free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Where can I get Morpheus8 near Joliet, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego offers Morpheus8 RF microneedling — about 20 minutes from Joliet. We have both Morpheus8 (face) and Morpheus8 Burst for body contouring.',
  },
  {
    question: 'What is Morpheus8 and what does it treat?',
    answer: 'Morpheus8 is a fractional radiofrequency microneedling device that delivers RF energy deep into the skin to stimulate collagen and elastin. It treats skin laxity, fine lines, acne scars, stretch marks, uneven texture, and body areas like the abdomen and arms.',
  },
  {
    question: 'How many Morpheus8 treatments do I need?',
    answer: 'Most clients see significant results after 1–3 treatments spaced 4–6 weeks apart. Results continue to improve for 3–6 months as collagen builds.',
  },
  {
    question: 'Is Morpheus8 painful?',
    answer: 'We apply topical numbing cream before treatment for your comfort. Most clients describe the sensation as a mild prickling or warmth. Downtime is typically 2–3 days of redness.',
  },
  {
    question: 'How much does Morpheus8 cost near Joliet?',
    answer: 'Morpheus8 pricing varies by treatment area and number of sessions. We offer transparent pricing and package options at your free consultation. Many Joliet clients find our pricing more competitive than providers in downtown Chicago.',
  },
];

export default function Morpheus8JolietPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Near Joliet, IL', url: `${SITE.url}/joliet-il` },
    { name: 'Morpheus8 Near Joliet', url: `${SITE.url}/morpheus8-joliet-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Joliet')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">Serving Joliet • Plainfield • Bolingbrook • Will County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Morpheus8 Near Joliet, IL</span> — RF Microneedling & Skin Tightening
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              The gold-standard RF microneedling treatment — <strong className="text-white">20 minutes from Joliet</strong> in Oswego. Morpheus8 and Morpheus8 Burst for face and body tightening, collagen induction, and lasting skin transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Morpheus8 Face & Body</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs On Site</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — ~20 min from Joliet via I-80 → Route 34</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">What Morpheus8 Treats</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { condition: 'Skin Laxity & Sagging', desc: 'Tighten loose skin on face, neck, and body without surgery.' },
                { condition: 'Fine Lines & Wrinkles', desc: 'Stimulate collagen to smooth fine lines and deeper wrinkles.' },
                { condition: 'Acne Scars', desc: 'Remodel scar tissue and resurface uneven skin texture.' },
                { condition: 'Body Contouring', desc: 'Morpheus8 Burst tightens abdomen, arms, thighs & more.' },
                { condition: 'Stretch Marks', desc: 'Reduce the appearance of stretch marks and improve skin quality.' },
                { condition: 'Pore Size & Texture', desc: 'Refine skin texture and minimize enlarged pores.' },
              ].map((item) => (
                <div key={item.condition} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">{item.condition}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Morpheus8 Near Joliet — FAQs</h2>
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

        <RealPatientReviews service="morpheus8" serviceLabel="Morpheus8 Near Joliet" heading="Real Morpheus8 results near Joliet" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready for the Morpheus8 Transformation?</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Morpheus8 Face & Burst Body · 20 min from Joliet</p>
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
