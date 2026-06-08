import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Daxxify Near Me in Oswego IL | 6-Month Neurotoxin | Hello Gorgeous Med Spa',
  description:
    'Hello Gorgeous Med Spa is the only provider in the Fox Valley with Daxxify — the 6-month neurotoxin. Peptide-powered. No animal proteins. Serving Oswego, Naperville, Aurora & surrounding areas.',
  keywords: [
    'daxxify near me',
    'daxxify illinois',
    'daxxify oswego il',
    'daxxify naperville',
    '6 month botox',
    'longest lasting neurotoxin',
    'daxxify fox valley',
    'daxibotulinumtoxina illinois',
    'revance daxxify illinois',
    'daxxify vs botox',
    'daxxify aurora il',
    'daxxify joliet il',
  ],
  alternates: { canonical: `${SITE.url}/daxxify` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/daxxify`,
    title: 'Daxxify Near Me in Oswego IL | 6-Month Neurotoxin | Hello Gorgeous Med Spa',
    description:
      'The only neurotoxin that lasts 6 months — now available in Oswego, IL. Hello Gorgeous is the only Fox Valley provider with all 5 FDA-approved neurotoxins.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'What is Daxxify?',
    answer:
      'Daxxify (daxibotulinumtoxinA) is the newest FDA-approved neurotoxin, made by Revance Therapeutics. It uses a proprietary stabilizing peptide technology — instead of human or animal proteins used in other neurotoxins — to deliver results that last up to 6 months.',
  },
  {
    question: 'How long does Daxxify last?',
    answer:
      'Daxxify lasts up to 6 months for most clients — compared to 3–4 months for Botox, Dysport, Jeuveau, and Xeomin. In clinical trials, 80% of patients maintained their results at the 6-month mark. That means roughly 2 treatments per year instead of 3–4.',
  },
  {
    question: 'How does Daxxify compare to Botox?',
    answer:
      'Daxxify lasts twice as long as Botox (up to 6 months vs 3–4 months), works faster (results in 1–2 days vs 3–7 days for Botox), and contains no human or animal proteins. It uses a stabilizing peptide unique in the neurotoxin market.',
  },
  {
    question: 'How fast does Daxxify work?',
    answer:
      'Many clients see initial results within 1–2 days — faster than Botox which typically takes 3–7 days. Full results appear within 1 week of treatment.',
  },
  {
    question: 'Is Daxxify FDA approved?',
    answer:
      'Yes. Daxxify received FDA approval in 2022 for the treatment of moderate-to-severe glabellar lines (the "11s" between the eyebrows). It has one of the largest clinical trial datasets of any neurotoxin.',
  },
  {
    question: 'Who is a good candidate for Daxxify?',
    answer:
      'Daxxify is ideal for clients who want fewer annual treatments, are frustrated with Botox wearing off at 3 months, prefer a formula with no human or animal proteins, or want the latest and longest-lasting FDA-approved option. Your NP will evaluate your goals at a free consultation.',
  },
  {
    question: 'How much does Daxxify cost?',
    answer:
      'Daxxify is priced per unit at consultation based on your treatment area and goals. Because it lasts up to 6 months, the cost-per-month is often comparable or lower than getting Botox every 3–4 months. Book a free consultation at Hello Gorgeous for a personalized quote.',
  },
  {
    question: 'Does Daxxify hurt?',
    answer:
      'Daxxify injections feel similar to other neurotoxins — a brief pinch at the injection site. Most clients tolerate treatment very well. We use the finest needles available and can apply topical numbing if requested. Treatment takes about 15 minutes.',
  },
];

const NEUROTOXINS = [
  {
    name: 'Daxxify',
    duration: '5–6 months',
    formula: 'Peptide',
    onset: '1–2 days',
    fda: '2022',
    highlight: true,
  },
  {
    name: 'Botox',
    duration: '3–4 months',
    formula: 'Human albumin',
    onset: '3–7 days',
    fda: '1989',
    highlight: false,
  },
  {
    name: 'Dysport',
    duration: '3–4 months',
    formula: 'Human albumin',
    onset: '2–3 days',
    fda: '2009',
    highlight: false,
  },
  {
    name: 'Jeuveau',
    duration: '3–4 months',
    formula: 'Human albumin',
    onset: '2–3 days',
    fda: '2019',
    highlight: false,
  },
  {
    name: 'Xeomin',
    duration: '3–4 months',
    formula: 'No additives',
    onset: '3–4 days',
    fda: '2011',
    highlight: false,
  },
];

const AREA_LINKS = [
  { label: 'Daxxify in Oswego', href: '/daxxify-oswego-il' },
  { label: 'Daxxify in Naperville', href: '/daxxify-naperville-il' },
  { label: 'Daxxify in Aurora', href: '/daxxify-aurora-il' },
  { label: 'Daxxify in Joliet', href: '/daxxify-joliet-il' },
  { label: 'Daxxify in Plainfield', href: '/daxxify-plainfield-il' },
  { label: 'Daxxify in Yorkville', href: '/daxxify-yorkville-il' },
];

export default function DaxxifyPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(FAQS, `${SITE.url}/daxxify`)
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', url: SITE.url },
              { name: 'Daxxify', url: `${SITE.url}/daxxify` },
            ])
          ),
        }}
      />

      <main className="bg-gray-950 text-white">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-950/30 via-gray-950 to-gray-950 pt-20 pb-16 px-4">
          {/* Background glow blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF2D8E]/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-[#FF2D8E]/8 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF2D8E]/50 bg-[#FF2D8E]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FF2D8E] mb-6">
              <span className="h-2 w-2 rounded-full bg-[#FF2D8E] animate-pulse" />
              NOW AVAILABLE · ONLY PROVIDER IN THE FOX VALLEY
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4">
              Daxxify Is Here.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The only neurotoxin that lasts&nbsp;
              <span className="text-[#FF2D8E] font-bold">6 months</span> — now available in{' '}
              <span className="font-semibold text-white">Oswego, IL</span>.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <a
                href={BOOKING_URL}
                className="inline-block rounded-full bg-[#FF2D8E] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#FF2D8E]/30 hover:bg-[#e0267e] transition-colors"
              >
                Book Daxxify Now
              </a>
              <a
                href="#compare"
                className="inline-block rounded-full border border-[#FF2D8E]/60 bg-[#FF2D8E]/10 px-8 py-4 text-base font-bold text-[#FF2D8E] hover:bg-[#FF2D8E]/20 transition-colors"
              >
                See How It Compares
              </a>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { stat: '6 months', label: 'Duration' },
                { stat: '80%', label: 'Maintain results at 6 mo' },
                { stat: 'FDA 2022', label: 'Approved' },
                { stat: '0', label: 'Animal proteins' },
              ].map(({ stat, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#FF2D8E]/20 bg-[#FF2D8E]/5 p-4 text-center"
                >
                  <p className="text-2xl font-black text-[#FF2D8E]">{stat}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IS DAXXIFY ── */}
        <section className="py-16 px-4 bg-gray-950">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">
              What Is <span className="text-[#FF2D8E]">Daxxify?</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: explanation */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-4 text-white">The Science</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Daxxify</strong> (daxibotulinumtoxinA) is the newest
                  FDA-approved neurotoxin, developed by{' '}
                  <strong className="text-white">Revance Therapeutics</strong> and approved by the FDA
                  in 2022.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Unlike Botox, Dysport, and Jeuveau — which use human albumin as a stabilizer —
                  Daxxify uses Revance&apos;s proprietary{' '}
                  <strong className="text-[#FF2D8E]">peptide exchange technology</strong>. This
                  innovation is what allows results to last up to 6 months.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  It contains{' '}
                  <strong className="text-white">no human or animal-derived proteins</strong>,
                  making it a preferred choice for clients who want a cleaner formula.
                </p>
              </div>

              {/* Right: how it works */}
              <div className="rounded-2xl border border-[#FF2D8E]/30 bg-pink-950/10 p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 text-white">How It Works</h3>
                <ol className="space-y-5">
                  {[
                    {
                      step: '1',
                      title: 'Free Consultation',
                      desc: 'Your licensed NP reviews your goals, treatment history, and recommends the right neurotoxin for you.',
                    },
                    {
                      step: '2',
                      title: 'Treatment (~15 min)',
                      desc: 'Precise micro-injections into targeted muscles. Quick, comfortable, and no downtime.',
                    },
                    {
                      step: '3',
                      title: 'Results in 1–2 Days',
                      desc: 'Most clients see initial softening within 24–48 hours — faster than Botox.',
                    },
                    {
                      step: '4',
                      title: 'Lasts Up to 6 Months',
                      desc: 'Enjoy full results with no touch-ups needed. Come back in 6 months instead of every 3.',
                    },
                  ].map(({ step, title, desc }) => (
                    <li key={step} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 h-8 w-8 rounded-full bg-[#FF2D8E] flex items-center justify-center text-sm font-black text-white">
                        {step}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{title}</p>
                        <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section id="compare" className="py-16 px-4 bg-gray-900/40">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-3">
              Daxxify vs. <span className="text-[#FF2D8E]">Every Neurotoxin</span>
            </h2>
            <p className="text-center text-gray-400 mb-10 text-sm">
              Hello Gorgeous offers all 5 FDA-approved neurotoxins — so you always get the best one
              for you.
            </p>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-5 py-4 text-gray-500 font-medium w-28" />
                    {NEUROTOXINS.map((n) => (
                      <th
                        key={n.name}
                        className={`px-5 py-4 text-center font-bold ${
                          n.highlight
                            ? 'bg-[#FF2D8E]/15 text-[#FF2D8E] border-x border-[#FF2D8E]/30'
                            : 'text-white'
                        }`}
                      >
                        {n.highlight && (
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#FF2D8E] mb-0.5">
                            ★ Best Value
                          </span>
                        )}
                        {n.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      { label: 'Duration', key: 'duration' },
                      { label: 'Formula', key: 'formula' },
                      { label: 'Onset', key: 'onset' },
                      { label: 'FDA Approved', key: 'fda' },
                    ] as { label: string; key: keyof (typeof NEUROTOXINS)[0] }[]
                  ).map(({ label, key }, ri) => (
                    <tr
                      key={label}
                      className={ri % 2 === 0 ? 'bg-gray-950' : 'bg-gray-900/50'}
                    >
                      <td className="px-5 py-4 text-gray-500 font-medium text-xs uppercase tracking-wide">
                        {label}
                      </td>
                      {NEUROTOXINS.map((n) => (
                        <td
                          key={n.name}
                          className={`px-5 py-4 text-center ${
                            n.highlight
                              ? 'bg-[#FF2D8E]/10 text-white font-semibold border-x border-[#FF2D8E]/20'
                              : 'text-gray-300'
                          }`}
                        >
                          {String(n[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-4">
              {NEUROTOXINS.map((n) => (
                <div
                  key={n.name}
                  className={`rounded-2xl border p-5 ${
                    n.highlight
                      ? 'border-[#FF2D8E]/50 bg-[#FF2D8E]/10'
                      : 'border-gray-800 bg-gray-900/60'
                  }`}
                >
                  {n.highlight && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#FF2D8E] bg-[#FF2D8E]/20 rounded-full px-2 py-0.5 mb-2">
                      ★ Best Value
                    </span>
                  )}
                  <h3
                    className={`text-lg font-black mb-3 ${
                      n.highlight ? 'text-[#FF2D8E]' : 'text-white'
                    }`}
                  >
                    {n.name}
                  </h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: 'Duration', val: n.duration },
                      { label: 'Formula', val: n.formula },
                      { label: 'Onset', val: n.onset },
                      { label: 'FDA', val: n.fda },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <dt className="text-gray-500 text-xs">{label}</dt>
                        <dd className="text-white font-medium">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              Hello Gorgeous is the{' '}
              <strong className="text-[#FF2D8E]">ONLY provider in the Fox Valley</strong> offering
              all 5 FDA-approved neurotoxins.
            </p>
          </div>
        </section>

        {/* ── WHY HELLO GORGEOUS ── */}
        <section className="py-16 px-4 bg-gray-950">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-10">
              Why Choose{' '}
              <span className="text-[#FF2D8E]">Hello Gorgeous?</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: '🩺',
                  title: 'Licensed NP Injectors',
                  body: "Treatments performed by licensed Nurse Practitioners — not physicians' assistants or RNs. Higher training, better outcomes.",
                },
                {
                  icon: '💬',
                  title: 'Free Consultations',
                  body: 'No pressure, no cost. Your NP reviews your goals, medical history, and recommends the right neurotoxin for your face.',
                },
                {
                  icon: '✅',
                  title: 'All 5 Neurotoxins',
                  body: 'Botox, Dysport, Jeuveau, Xeomin, and Daxxify — all under one roof. The only Fox Valley provider with every FDA-approved option.',
                },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#FF2D8E]/20 bg-[#FF2D8E]/5 p-6 text-center"
                >
                  <span className="text-3xl mb-4 block" role="img" aria-hidden>
                    {icon}
                  </span>
                  <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AREAS SERVED ── */}
        <section className="py-14 px-4 bg-gray-900/40">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Serving the Fox Valley &amp; Beyond
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Based in Oswego — minutes from Naperville, Aurora, and all of Kane &amp; Kendall County.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {AREA_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full border border-[#FF2D8E]/50 bg-[#FF2D8E]/8 px-5 py-2 text-sm font-semibold text-[#FF2D8E] hover:bg-[#FF2D8E]/20 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-gray-950">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-10">
              Daxxify <span className="text-[#FF2D8E]">FAQ</span>
            </h2>
            <div className="space-y-4">
              {FAQS.map(({ question, answer }) => (
                <details
                  key={question}
                  className="group rounded-2xl border border-gray-800 bg-gray-900/60 open:border-[#FF2D8E]/30 transition-colors"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 font-semibold text-white list-none">
                    {question}
                    <span className="flex-shrink-0 text-[#FF2D8E] group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-gray-300 text-sm leading-relaxed">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 px-4 bg-gradient-to-r from-[#FF2D8E]/90 to-pink-700/90">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready for 6-Month Results?
            </h2>
            <p className="text-pink-100 text-lg mb-8">
              Your free Daxxify consultation is waiting. Meet your licensed NP, get personalized
              recommendations, and start your 6-month journey.
            </p>
            <a
              href={BOOKING_URL}
              className="inline-block rounded-full bg-white px-10 py-4 text-base font-bold text-[#FF2D8E] shadow-xl hover:bg-pink-50 transition-colors"
            >
              Book Your Free Daxxify Consultation
            </a>
            <p className="text-pink-200 text-sm mt-4">
              {SITE.address.streetAddress}, {SITE.address.addressLocality},{' '}
              {SITE.address.addressRegion} · {SITE.phone}
            </p>
          </div>
        </section>

        {/* ── REAL PATIENT REVIEWS ── */}
        <section className="py-14 bg-gray-950">
          <RealPatientReviews category="neurotoxin" />
        </section>
      </main>
    </>
  );
}
