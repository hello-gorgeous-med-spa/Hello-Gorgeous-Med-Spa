import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Men's Hormone Optimization in Oswego IL | TRT & Hormone Therapy | Hello Gorgeous Med Spa",
  description:
    'Lab-guided testosterone replacement therapy and hormone optimization for men in Oswego IL. Energy, strength, libido, mood & recovery. Hello Gorgeous Med Spa.',
  keywords: [
    'TRT oswego il',
    'testosterone replacement therapy oswego',
    'mens hormone therapy near me',
    'low testosterone oswego il',
    'hormone optimization men chicago suburbs',
    "men's hormone clinic near naperville",
  ],
  alternates: { canonical: `${SITE.url}/mens-hormones` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/mens-hormones`,
    title: "Men's Hormone Optimization in Oswego IL | TRT & Hormone Therapy | Hello Gorgeous Med Spa",
    description:
      'Lab-guided testosterone replacement therapy and hormone optimization for men in Oswego IL. Energy, strength, libido, mood & recovery.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const SYMPTOMS = [
  'Constantly tired no matter how much you sleep',
  'Low motivation or drive you used to have',
  'Harder to build or maintain muscle',
  'Brain fog — slow, unfocused, not sharp',
  'Irritable or short-tempered for no clear reason',
  'Low libido or changes in sexual function',
  'Sleeping more but still waking up exhausted',
  'Gaining weight despite working out regularly',
] as const;

const IMPROVEMENTS = [
  'Energy levels',
  'Muscle development',
  'Mental clarity',
  'Sex drive',
  'Mood stability',
  'Recovery time',
  'Body composition',
  'Sleep quality',
] as const;

const STEPS = [
  {
    step: '01',
    title: 'Comprehensive Lab Panel',
    description:
      'We run a full hormone panel — testosterone, free testosterone, SHBG, thyroid, cortisol, and more — so we have real data, not guesswork.',
  },
  {
    step: '02',
    title: 'Provider Review & Diagnosis',
    description:
      'A licensed NP reviews your labs alongside your symptoms and health history. You get a clear picture of what&apos;s actually happening.',
  },
  {
    step: '03',
    title: 'Personalized Hormone Protocol',
    description:
      'We build a protocol around your specific numbers and goals — TRT, peptide support, lifestyle adjustments, or a combination.',
  },
  {
    step: '04',
    title: 'Ongoing Monitoring & Adjustment',
    description:
      'Your protocol evolves with you. Follow-up labs and check-ins ensure you&apos;re optimized, not just treated.',
  },
] as const;

const FAQS = [
  {
    question: 'What is TRT (testosterone replacement therapy)?',
    answer:
      'TRT is a medically supervised protocol that restores testosterone to optimal physiological levels using injections, creams, or other delivery methods. It&apos;s prescribed based on lab values and symptoms — not age alone.',
  },
  {
    question: 'Am I a candidate for hormone optimization?',
    answer:
      'If you have 3 or more of the symptoms on this page — fatigue, low drive, brain fog, mood changes, muscle loss — you may have suboptimal hormone levels. Lab work tells us for certain. The consult is the first step.',
  },
  {
    question: 'Is hormone therapy safe?',
    answer:
      'When managed by a licensed medical provider with regular lab monitoring, TRT is well-studied and safe for appropriate candidates. We monitor blood counts, liver markers, estrogen, and PSA at regular intervals to keep you in the safe zone.',
  },
  {
    question: 'How long until I feel results?',
    answer:
      'Most men notice improved energy and mood within 3–6 weeks. Full benefits — including muscle composition and libido — typically develop over 3–6 months. This is optimization, not a quick fix.',
  },
  {
    question: 'What does the process look like?',
    answer:
      'Step 1: Book a consult. Step 2: We order labs. Step 3: Provider reviews your results with you. Step 4: If you&apos;re a candidate, your protocol starts. Follow-up visits and labs are scheduled based on your protocol.',
  },
  {
    question: 'Do I need to come in regularly?',
    answer:
      'Yes — ongoing monitoring is how we keep you optimized and safe. Depending on your protocol, follow-up labs are typically every 6–12 weeks initially, then quarterly once stable.',
  },
  {
    question: 'How is this different from what my GP does?',
    answer:
      'Most GPs test total testosterone and use population-based reference ranges, which can miss men who are symptomatic but technically "in range." We look at free testosterone, SHBG, and the full clinical picture. Optimization is the goal — not just being within normal limits.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Pricing depends on your protocol. We discuss costs transparently at your consult. Members of The Gentleman&apos;s Club receive discounted rates on hormone services. Call or book online to get started.',
  },
] as const;

export default function MensHormonesPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: "Men's Wellness", url: `${SITE.url}/mens-wellness` },
    { name: "Men's Hormone Optimization", url: `${SITE.url}/mens-hormones` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />

      <main className="bg-[#030712] text-white">
        {/* ── HERO ── */}
        <section
          className="relative py-28 lg:py-40 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(255,45,142,0.08) 0%, transparent 45%), #030712',
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-4">
              Hello Gorgeous Med Spa · Oswego, IL · Men&apos;s Hormone Optimization
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Feel Like Yourself Again.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl">
              Lab-guided testosterone replacement therapy and hormone optimization for men.
            </p>

            {/* Symptom pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['Fatigue', 'Low Drive', 'Brain Fog', 'Muscle Loss', 'Mood Changes'].map((s) => (
                <span
                  key={s}
                  className="bg-gray-900 border border-gray-700 px-4 py-1.5 rounded-full text-sm font-medium text-gray-300"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="text-[#FF2D8E] font-bold text-lg mb-10">
              These aren&apos;t signs of aging. They&apos;re data.
            </p>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
            >
              Book a Men&apos;s Hormone Consult
            </a>
          </div>
        </section>

        {/* ── IS THIS YOU ── */}
        <section className="py-20 lg:py-28 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Is This You?</h2>
            <p className="text-gray-400 text-lg mb-10">
              If more than 3 of these hit home — your labs may have the answer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {SYMPTOMS.map((symptom) => (
                <div key={symptom} className="flex items-start gap-3 bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <span className="text-[#FF2D8E] mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-300">{symptom}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
              <p className="text-blue-300 font-semibold text-lg">
                Low testosterone is more common than most men realize. And it&apos;s not a personal failure — it&apos;s a clinical finding. Lab work takes the guesswork out.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className="py-20 lg:py-28 bg-[#030712]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step) => (
                <div key={step.step} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div
                    className="text-5xl font-black mb-4 leading-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.2) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IT CAN IMPROVE ── */}
        <section className="py-20 lg:py-28 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              What Hormone Optimization Can Improve
            </h2>
            <p className="text-gray-400 text-center mb-12">
              Real clinical outcomes — not promises.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {IMPROVEMENTS.map((item) => (
                <div
                  key={item}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-xl p-4 text-center transition-all"
                >
                  <p className="font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 lg:py-28 bg-[#030712]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MEMBERSHIP CTA ── */}
        <section className="py-20 lg:py-24 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center">
              <div className="text-3xl mb-4" aria-hidden="true">👑</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Save More with The Gentlemen&apos;s Club
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-xl mx-auto">
                Members get discounted hormone services, priority booking, and monthly wellness shots included. Starting at $99/mo.
              </p>
              <Link
                href="/gentlemens-club"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Learn About Membership
              </Link>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <RealPatientReviews />

        {/* ── FINAL CTA ── */}
        <section
          className="py-24 lg:py-32"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.10) 0%, transparent 60%), #030712',
          }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Get Your Labs. Get Answers.</h2>
            <p className="text-gray-400 text-lg mb-10">
              The consult is the first step. Book online or call — same-day appointments often available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book a Hormone Consult
              </a>
              <a
                href="tel:6306366193"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all text-lg"
              >
                Call (630) 636-6193
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
