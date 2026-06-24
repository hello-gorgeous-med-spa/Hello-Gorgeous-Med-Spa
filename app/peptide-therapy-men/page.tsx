import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Peptide Therapy for Men in Oswego IL | Recovery, Performance & Longevity | Hello Gorgeous Med Spa',
  description:
    'Peptide therapy for men in Oswego IL — BPC-157, Sermorelin, AOD-9604, TB-500 and more. Recovery, body composition, cognitive performance, longevity. Hello Gorgeous Med Spa.',
  keywords: [
    'peptide therapy oswego il',
    'peptide therapy men near me',
    'BPC-157 oswego',
    'sermorelin near me',
    'mens peptide therapy chicago suburbs',
    'performance peptides illinois',
  ],
  alternates: { canonical: `${SITE.url}/peptide-therapy-men` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/peptide-therapy-men`,
    title: 'Peptide Therapy for Men in Oswego IL | Recovery, Performance & Longevity | Hello Gorgeous Med Spa',
    description:
      'BPC-157, Sermorelin, AOD-9604, TB-500 and more. Recovery, body composition, cognitive performance, longevity. Oswego IL.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const PEPTIDES = [
  {
    name: 'BPC-157',
    benefit: 'Joint & tissue repair, gut healing, injury recovery',
    for: 'Men with injuries, joint pain, or gut issues looking to heal faster',
  },
  {
    name: 'Sermorelin / Ipamorelin',
    benefit: 'Growth hormone support, sleep quality, body composition',
    for: 'Men wanting to improve sleep, lean out, and support GH naturally',
  },
  {
    name: 'AOD-9604',
    benefit: 'Fat metabolism, body composition',
    for: 'Men targeting stubborn fat, especially when combined with exercise',
  },
  {
    name: 'TB-500',
    benefit: 'Tissue repair, flexibility, recovery',
    for: 'Athletes and active men with chronic or acute injuries',
  },
  {
    name: 'NAD+',
    benefit: 'Cellular energy, brain function, anti-aging',
    for: 'Men focused on longevity, mental performance, and sustained energy',
  },
  {
    name: 'CJC-1295',
    benefit: 'Lean muscle, recovery, GH pulse support',
    for: 'Men seeking enhanced muscle recovery and growth hormone optimization',
  },
] as const;

const PERSONAS = [
  {
    title: 'Athletes & Weekend Warriors',
    description:
      'Train harder, recover faster. Peptides like BPC-157 and TB-500 support the tissue repair that keeps you moving.',
  },
  {
    title: 'Men 35+ Looking to Optimize',
    description:
      'After 35, your body becomes less efficient at recovery and hormone production. Peptides give your biology a precise nudge.',
  },
  {
    title: 'Post-Injury Recovery',
    description:
      'Joint damage, tendon injuries, surgical recovery — peptides like BPC-157 are studied specifically for accelerated tissue healing.',
  },
  {
    title: 'Men on Hormone Protocols',
    description:
      'Peptide therapy layers exceptionally well with TRT and hormone optimization — enhancing results without redundancy.',
  },
] as const;

const FAQS = [
  {
    question: 'What are peptides?',
    answer:
      'Peptides are short chains of amino acids — the building blocks of proteins — that act as biological signals in the body. They tell cells to repair, regenerate, produce hormones, or carry out specific functions. They are not steroids, not synthetic hormones, and not stimulants. Think of them as precision tools that support your body&apos;s own processes.',
  },
  {
    question: 'Is peptide therapy safe?',
    answer:
      'When prescribed and monitored by a licensed medical provider, peptide therapy is generally well-tolerated. Many peptides have been studied in clinical settings for decades. Like all medical treatments, they are prescribed based on your individual health picture and monitored over time.',
  },
  {
    question: 'Do I need labs before starting peptide therapy?',
    answer:
      'Often yes — especially if peptide therapy is being combined with or guided by hormone optimization. We review your health history and goals at the consult and determine what baseline work is needed.',
  },
  {
    question: 'How are peptides administered?',
    answer:
      'Most peptides are administered via subcutaneous (just under the skin) injection, which is simple and nearly painless. Some are available in oral or nasal forms depending on the peptide. Your provider will walk you through administration at your first visit.',
  },
  {
    question: 'How long until I notice results from peptide therapy?',
    answer:
      'Results vary by peptide and goal. BPC-157 for injury recovery may show improvement within 2–4 weeks. Growth hormone-supporting peptides like Sermorelin typically take 1–3 months of consistent use to see measurable changes in sleep, body composition, and energy.',
  },
  {
    question: 'Can I combine peptide therapy with TRT or hormone optimization?',
    answer:
      'Yes — and many of our male patients do exactly that. Peptide therapy and TRT complement each other well. Your provider will build a protocol that accounts for both so they work synergistically without overlap.',
  },
] as const;

export default function PeptideTherapyMenPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: "The Gentlemen's Club", url: `${SITE.url}/gentlemens-club` },
    { name: 'Peptide Therapy for Men', url: `${SITE.url}/peptide-therapy-men` },
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
              'radial-gradient(ellipse at 75% 35%, rgba(59,130,246,0.20) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(59,130,246,0.08) 0%, transparent 45%), #030712',
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-4">
              Hello Gorgeous Med Spa · Oswego, IL · Peptide Therapy
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Recovery. Performance.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Longevity.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl">
              Peptide therapy for men who want to feel sharper, stronger, and more energized.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
            >
              Book Peptide Consult
            </a>
          </div>
        </section>

        {/* ── WHAT ARE PEPTIDES ── */}
        <section className="py-20 lg:py-28 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">What Are Peptides?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5 text-gray-300 leading-relaxed">
                <p>
                  Peptides are <strong className="text-white">short chains of amino acids</strong> — the same building blocks that make up proteins. In the body, they act as biological signals: telling cells to repair, regenerate, produce hormones, or perform specific functions.
                </p>
                <p>
                  They are <strong className="text-white">not steroids</strong>, not synthetic hormones, and not stimulants. They are precision tools that work with your body&apos;s existing biochemistry — supporting and enhancing what&apos;s already there.
                </p>
                <p>
                  Many peptides used in clinical practice have been studied for decades. FDA-studied. Clinically used. The frontier of regenerative medicine.
                </p>
              </div>
              <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white text-lg">Peptides vs. Steroids</h3>
                {[
                  ['Work with your body', 'Replace or override it'],
                  ['Targeted biological signals', 'Broad systemic hormones'],
                  ['FDA-studied protocols', 'Often misused/unregulated'],
                  ['Minimal side effects when managed', 'Significant hormonal disruption'],
                ].map(([pro, con], i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2 text-green-400">
                      <span>✓</span>
                      <span>{pro}</span>
                    </div>
                    <div className="flex items-start gap-2 text-red-400/70">
                      <span>✗</span>
                      <span>{con}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PEPTIDE OPTIONS ── */}
        <section className="py-20 lg:py-28 bg-[#030712]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Peptide Options We Offer</h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-12">
                Specific peptides prescribed based on your goals and lab work at consultation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PEPTIDES.map((peptide) => (
                <div
                  key={peptide.name}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all"
                >
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {peptide.name}
                  </h3>
                  <p className="text-white font-semibold mb-2 text-sm">{peptide.benefit}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{peptide.for}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO BENEFITS MOST ── */}
        <section className="py-20 lg:py-28 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Who Benefits Most</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PERSONAS.map((persona, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-sm">{i + 1}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{persona.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{persona.description}</p>
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
            <div
              className="rounded-2xl p-8 md:p-12 text-center border border-[#FF2D8E]/30"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(255,45,142,0.08) 0%, transparent 60%), #111827',
              }}
            >
              <div className="text-3xl mb-4" aria-hidden="true">👑</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                The Gentlemen&apos;s Club Includes Peptide Support
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-xl mx-auto">
                Members of The Distinguished Gentleman tier get peptide protocol support included. Maximize your results with a membership built around optimization.
              </p>
              <Link
                href="/gentlemens-club"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Explore The Gentlemen&apos;s Club
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
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Optimize?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Book your peptide consult at Hello Gorgeous Med Spa in Oswego, IL. We&apos;ll review your goals, labs, and build a protocol that actually works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book Peptide Consult
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
