import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
import { LocalSeoConversionStrip } from '@/components/seo/LocalSeoConversionStrip';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Hormone Therapy in Oswego, IL | Bioidentical HRT | Hello Gorgeous Med Spa',
  description:
    'Bioidentical hormone replacement therapy (HRT) in Oswego, IL at Hello Gorgeous Med Spa. Testosterone, estrogen & thyroid optimization for women and men. Licensed NPs. Book today.',
  keywords: [
    'hormone therapy oswego il',
    'hrt near me oswego',
    'bioidentical hormones oswego il',
    'hormone replacement therapy oswego',
    'testosterone therapy oswego il',
    'menopause treatment oswego il',
    'low testosterone oswego',
    'hormone optimization oswego',
    'bhrt oswego il',
    'hormone clinic oswego il',
    'perimenopause treatment oswego',
    'hormone balance oswego il',
  ],
  alternates: { canonical: `${SITE.url}/hormone-therapy-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/hormone-therapy-oswego-il`,
    title: 'Hormone Therapy in Oswego, IL | Bioidentical HRT | Hello Gorgeous',
    description: 'Bioidentical HRT for women & men in Oswego, IL. Testosterone, estrogen, thyroid optimization. Licensed NPs, free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const SYMPTOMS = {
  women: ['Fatigue & low energy', 'Hot flashes & night sweats', 'Mood swings & irritability', 'Weight gain (especially belly)', 'Low libido', 'Brain fog & poor concentration', 'Poor sleep quality', 'Vaginal dryness', 'Thinning hair & dry skin'],
  men: ['Low energy & fatigue', 'Low libido & sexual dysfunction', 'Loss of muscle mass', 'Increased body fat', 'Brain fog', 'Depression or mood changes', 'Poor sleep', 'Decreased motivation', 'Reduced physical performance'],
};

const FAQS = [
  { question: 'Where can I get hormone therapy in Oswego, IL?', answer: 'Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego offers bioidentical hormone replacement therapy for both women and men. Our licensed nurse practitioners evaluate your hormone levels and create personalized treatment plans.' },
  { question: 'What is bioidentical hormone replacement therapy (BHRT)?', answer: 'Bioidentical hormones are chemically identical to the hormones your body produces. Unlike synthetic hormones, they interact with your body\'s receptors in the most natural way possible, often with fewer side effects.' },
  { question: 'What hormones can be optimized at Hello Gorgeous in Oswego?', answer: 'We offer testosterone optimization (for men and women), estrogen/progesterone balancing for women, and thyroid support. Your provider will order labs to determine exactly what your body needs.' },
  { question: 'How do I know if I need hormone therapy?', answer: 'Symptoms like fatigue, weight gain, low libido, mood swings, brain fog, hot flashes (women), or low energy and muscle loss (men) can all indicate hormonal imbalance. Lab testing is the definitive way to assess your levels.' },
  { question: 'Is hormone therapy safe for women in Oswego?', answer: 'Bioidentical HRT can be very safe when properly prescribed and monitored. Our providers review your full health history and risk factors before recommending any hormone protocol. We monitor labs regularly throughout treatment.' },
  { question: 'Do you offer testosterone therapy for men near Oswego?', answer: 'Yes — we offer testosterone optimization for men experiencing symptoms of low T. This is a prescription treatment that includes baseline labs, ongoing monitoring, and regular follow-ups.' },
  { question: 'How long until I feel results from hormone therapy?', answer: 'Many clients begin noticing improvements in energy and mood within 2–4 weeks. Full benefits of hormone optimization typically emerge over 3–6 months as levels stabilize.' },
];

export default function HormoneTherapyOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Hormone Therapy Oswego IL', url: `${SITE.url}/hormone-therapy-oswego-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Oswego, IL · Serving Naperville · Aurora · Plainfield · Yorkville</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Hormone Therapy in Oswego, IL</span> — Feel Like Yourself Again
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Bioidentical hormone replacement therapy for women and men — prescribed and monitored by <strong className="text-white">licensed nurse practitioners</strong> in Oswego. Testosterone, estrogen, progesterone, and thyroid optimization tailored to your labs and your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Women & Men</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Lab-Based Protocols</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Bioidentical</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL 60543</strong> · {SITE.phone} · Open 7 days</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Do These Sound Familiar?</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Hormonal imbalance affects millions of adults. These symptoms don't have to be "just aging."</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#FF2D8E]/5 rounded-2xl p-8 border border-[#FF2D8E]/20">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🌸 For Women</h3>
                <ul className="space-y-3">
                  {SYMPTOMS.women.map((s) => <li key={s} className="flex items-center gap-2 text-gray-700"><span className="text-[#FF2D8E]">→</span>{s}</li>)}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">💪 For Men</h3>
                <ul className="space-y-3">
                  {SYMPTOMS.men.map((s) => <li key={s} className="flex items-center gap-2 text-gray-700"><span className="text-blue-500">→</span>{s}</li>)}
                </ul>
              </div>
            </div>
            <p className="text-center mt-8 text-gray-600">If you recognize yourself in these symptoms, <strong>a simple lab panel can tell us exactly where your hormones stand</strong>. Book a free consultation to get started.</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Hormone Therapy Oswego — FAQs</h2>
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
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Hormone Optimization in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Lab-based protocols · Women & men · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
        <LocalSeoConversionStrip showRxCatalog />
      </main>
    </>
  );
}
