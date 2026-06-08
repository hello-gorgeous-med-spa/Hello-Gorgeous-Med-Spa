import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Gentlemen's Club | Men's Wellness Membership | Hello Gorgeous Med Spa Oswego IL",
  description:
    "The Gentlemen's Club at Hello Gorgeous Med Spa — exclusive wellness, aesthetics & performance support for men. Brotox, hormones, peptide therapy & recovery. $99/mo. Oswego IL.",
  keywords: [
    'mens wellness membership oswego il',
    'gentlemens club med spa',
    'brotox membership',
    'mens hormone therapy membership',
    'peptide therapy membership oswego',
  ],
  alternates: { canonical: `${SITE.url}/gentlemens-club` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/gentlemens-club`,
    title: "The Gentlemen's Club | Men's Wellness Membership | Hello Gorgeous Med Spa Oswego IL",
    description:
      "Exclusive wellness, aesthetics & performance support for men. Brotox, hormones, peptide therapy & recovery. $99/mo. Oswego IL.",
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: "What is The Gentlemen's Club?",
    answer:
      "The Gentlemen's Club is Hello Gorgeous Med Spa's exclusive men's wellness membership. It gives members access to member-only pricing on Brotox, hormone optimization, peptide therapy, and monthly wellness shots — all in a private, judgment-free environment.",
  },
  {
    question: "What's included in the membership?",
    answer:
      "Membership includes monthly wellness shots (B12, Lipo-C, or NAD+), member pricing on all neurotoxin (Brotox) treatments, priority booking, and discounted add-on services. The Distinguished Gentleman tier adds monthly hormone check-ins, peptide protocol support, and access to exclusive member events.",
  },
  {
    question: 'Is there a contract?',
    answer:
      "No contracts. Both tiers are month-to-month and can be cancelled anytime. We want you here because it's working for you — not because you're locked in.",
  },
  {
    question: 'Who are the providers?',
    answer:
      "All services are delivered or supervised by licensed Nurse Practitioners with specialized training in men's aesthetics, hormone optimization, and regenerative medicine. You'll see the same providers at every visit.",
  },
  {
    question: 'What is Brotox?',
    answer:
      "Brotox is the popular term for Botox (or any FDA-approved neurotoxin) administered specifically for men. Men typically require more units due to stronger facial muscles, and the goal is a sharp, natural result — not frozen or softened. It's one of the highest-satisfaction treatments men receive.",
  },
  {
    question: 'How do I get started?',
    answer:
      "Book a complimentary consult using the link on this page or call us at (630) 636-6193. We'll walk you through the membership options, answer your questions, and get you started the same day if you're ready.",
  },
] as const;

const BENEFITS = [
  {
    icon: '💉',
    title: 'Brotox',
    description: 'Member pricing on every neurotoxin treatment. Look sharp, no big deal.',
  },
  {
    icon: '🧬',
    title: 'Hormone Optimization',
    description: 'Lab-guided TRT and hormone care. Energy, strength, libido, mood.',
  },
  {
    icon: '⚡',
    title: 'Peptide Therapy',
    description: 'Recovery, performance, body composition. The cutting edge.',
  },
  {
    icon: '💪',
    title: 'Monthly Wellness Shot',
    description: 'B12, Lipo-C, or NAD+ every month. Your call.',
  },
] as const;

const PILLARS = [
  {
    title: 'Private & judgment-free environment',
    description:
      "Men's wellness shouldn't feel awkward. Our space is designed for comfort and discretion.",
  },
  {
    title: 'Licensed NP providers',
    description:
      'All care is delivered by licensed Nurse Practitioners — medical expertise, not just aesthetics.',
  },
  {
    title: 'Science-backed protocols',
    description:
      'Lab work, evidence-based treatments, ongoing monitoring. No guesswork, no fads.',
  },
] as const;

const SERVICE_PILLS = ['BROTOX', 'HORMONES', 'PEPTIDE THERAPY', 'RECOVERY'];

export default function GentlemensClubPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: "Men's Wellness", url: `${SITE.url}/mens-wellness` },
    { name: "The Gentlemen's Club", url: `${SITE.url}/gentlemens-club` },
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
              'radial-gradient(ellipse at 85% 50%, rgba(59,130,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(59,130,246,0.08) 0%, transparent 45%), #030712',
          }}
        >
          {/* Diagonal light ray */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, transparent 30%, rgba(59,130,246,0.04) 50%, transparent 70%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Pink crown */}
            <div className="mb-6 text-4xl" aria-hidden="true">
              👑
            </div>

            {/* Silver metallic heading */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #e8e8e8 0%, #ffffff 30%, #b0b8c8 60%, #d4d4d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              THE GENTLEMEN&apos;S CLUB
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
              Exclusive wellness, aesthetics &amp; performance support for men.
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {SERVICE_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="border border-blue-500/40 bg-blue-500/10 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Pink heart divider */}
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px bg-gradient-to-r from-transparent via-[#FF2D8E]/50 to-transparent flex-1 max-w-xs" />
              <span className="text-[#FF2D8E] text-lg" aria-hidden="true">♥</span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#FF2D8E]/50 to-transparent flex-1 max-w-xs" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book Your Consult
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-blue-400 hover:text-blue-300 transition-all text-lg"
              >
                Learn About Membership
              </a>
            </div>

            {/* HG watermark treatment */}
            <div className="mt-16 opacity-20 select-none">
              <p
                className="text-6xl font-black tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                HG
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="py-20 lg:py-28 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What&apos;s Included</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Membership benefits built around how men actually want to feel — not how they&apos;re told they should look.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all"
                >
                  <div className="text-3xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MEMBERSHIP TIERS ── */}
        <section id="pricing" className="py-20 lg:py-28 bg-[#030712]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Tier</h2>
              <p className="text-gray-400 text-lg">No contracts. Cancel anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* The Gentleman */}
              <div className="relative bg-gray-900 border border-blue-500/40 rounded-2xl p-8">
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#FF2D8E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1 mt-2">The Gentleman</h3>
                <p
                  className="text-5xl font-black mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #e8e8e8 0%, #ffffff 50%, #b0b8c8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  $99<span className="text-2xl text-gray-400">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Monthly wellness shot (B12, Lipo-C, or NAD+)',
                    'Member pricing on all services',
                    'Priority booking',
                    'Discounted Brotox treatments',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300">
                      <span className="text-[#FF2D8E] mt-0.5">♥</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mb-6">No contracts. Cancel anytime.</p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all"
                >
                  Join The Gentleman
                </a>
              </div>

              {/* The Distinguished Gentleman */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-1">The Distinguished Gentleman</h3>
                <p
                  className="text-5xl font-black mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  $149<span className="text-2xl text-gray-400">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in The Gentleman',
                    'Monthly hormone check-in',
                    'Peptide protocol support',
                    'Exclusive member events',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300">
                      <span className="text-blue-400 mt-0.5">★</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mb-6">For the man serious about optimization.</p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3 border-2 border-blue-500 text-blue-300 font-bold rounded-xl hover:bg-blue-500/10 transition-all"
                >
                  Join The Distinguished Gentleman
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY MEN CHOOSE THIS ── */}
        <section className="py-20 lg:py-28 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Men Choose This</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PILLARS.map((pillar, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
                    <span className="text-blue-400 font-bold text-lg">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">{pillar.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 lg:py-28 bg-[#030712]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Questions</h2>
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

        {/* ── FINAL CTA ── */}
        <section
          className="py-24 lg:py-32"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), #030712',
          }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 text-3xl" aria-hidden="true">👑</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Join?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Book your complimentary consult. We&apos;ll walk you through the membership options and find the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book Your Consult
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

        {/* ── REVIEWS ── */}
        <RealPatientReviews />
      </main>
    </>
  );
}
