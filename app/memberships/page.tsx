import type { Metadata } from 'next';
import Link from 'next/link';
import { BOOKING_URL } from '@/lib/flows';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
import { HG_MEMBERSHIPS, MEMBERSHIP_COMPARISON_ROWS } from '@/lib/hg-memberships';
import { MembershipComparisonTable } from './MembershipComparisonTable';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Med Spa Memberships in Oswego IL | Glow · Luxe · Platinum | Hello Gorgeous',
  description:
    'Hello Gorgeous Med Spa membership tiers starting at $79/mo. Discounted Botox, monthly facials, vitamin shots, HG Rewards points & more. Oswego IL.',
  keywords: [
    'med spa membership oswego il',
    'botox membership near me',
    'monthly facial membership',
    'medspa membership naperville',
    'hello gorgeous membership',
    'med spa membership illinois',
    'botox discount membership',
    'monthly med spa plan oswego',
  ],
  openGraph: {
    title: 'Med Spa Memberships | Glow · Luxe · Platinum | Hello Gorgeous',
    description: 'Discounted Botox, monthly facials, vitamin shots & HG Rewards. Starting at $79/mo. Hello Gorgeous Med Spa, Oswego IL.',
    url: `${SITE.url}/memberships`,
  },
};

const MEMBERSHIP_FAQS = [
  {
    question: 'How does the neurotoxin discount work?',
    answer: 'Your membership discount applies per unit to all neurotoxin treatments including Botox, Dysport, Jeuveau, Xeomin, and Daxxify. Glow saves you $1/unit, Luxe saves $2/unit, and Platinum saves $3/unit — automatically at checkout every visit.',
  },
  {
    question: 'Do credits expire?',
    answer: 'Never. Unused monthly credits roll over to the following month and never expire. Your vitamin shots, facial credits, and any unused benefits stay in your account until you use them.',
  },
  {
    question: 'Can I pause or cancel my membership?',
    answer: 'Yes. You can cancel anytime — there are no long-term contracts. Simply call us at (630) 636-6193 at least 5 days before your next billing date and we\'ll take care of it.',
  },
  {
    question: 'Can I upgrade tiers?',
    answer: 'Absolutely. You can upgrade from Glow to Luxe or Platinum (or from Luxe to Platinum) at any time. Your new pricing takes effect on the next billing cycle.',
  },
  {
    question: 'Does membership work with HG Rewards points?',
    answer: 'Yes — members earn HG Rewards at enhanced rates. Glow earns Gold rate (7 pts per $1). Luxe and Platinum earn Platinum rate (10 pts per $1). Platinum members earn double points during their birthday month.',
  },
  {
    question: 'What neurotoxins are included in the discount?',
    answer: 'All 5: Botox, Dysport, Jeuveau, Xeomin, and Daxxify. Your per-unit discount applies to every treatment regardless of which neurotoxin you choose.',
  },
  {
    question: 'Can I use my membership for Daxxify?',
    answer: 'Yes. Daxxify is included in the neurotoxin discount for all membership tiers. Platinum members save $3/unit on Daxxify, which lasts 6–9 months — making it an exceptional value.',
  },
  {
    question: 'Is there a contract?',
    answer: 'No contracts, ever. Memberships are month-to-month and you can cancel anytime. We believe in earning your loyalty, not locking you in.',
  },
];

const ACCENT_COLORS = {
  glow: '#FF2D8E',
  luxe: '#3b82f6',
  platinum: '#f59e0b',
};

export default function MembershipsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: SITE.url },
    { name: 'Memberships', url: `${SITE.url}/memberships` },
  ]);

  return (
    <div data-site="public" className="bg-[#030712] min-h-screen text-white">
      {/* Structured Data */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(MEMBERSHIP_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 text-center">
        {/* Background glow effects */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,45,142,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(59,130,246,0.10) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D8E]">
            Hello Gorgeous Med Spa · Oswego, IL
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            The Hello Gorgeous
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #FF2D8E 0%, #ff6bb3 50%, #f59e0b 100%)',
              }}
            >
              Membership.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Discounted Botox. Monthly treatments. Rewards that never expire.{' '}
            <span className="font-semibold text-white">Starting at $79/mo.</span>
          </p>

          {/* Tier badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: '🌸', label: 'Glow', color: '#FF2D8E' },
              { icon: '💎', label: 'Luxe', color: '#3b82f6' },
              { icon: '👑', label: 'Platinum', color: '#f59e0b' },
            ].map((t) => (
              <span
                key={t.label}
                className="rounded-full px-4 py-1.5 text-sm font-semibold"
                style={{
                  background: `${t.color}18`,
                  border: `1px solid ${t.color}40`,
                  color: t.color,
                }}
              >
                {t.icon} {t.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#tiers"
              className="rounded-full px-8 py-4 text-base font-bold text-white transition hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #FF2D8E 0%, #d91f7a 100%)' }}
            >
              Choose Your Tier
            </a>
            <a
              href="#compare"
              className="rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Compare All Benefits
            </a>
          </div>
        </div>
      </section>

      {/* ─── STATS ROW ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/8 bg-white/[0.02] px-4 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { stat: 'Up to $3/unit', label: 'Off Botox', color: '#FF2D8E' },
            { stat: 'Never expire', label: 'Credits roll over', color: '#3b82f6' },
            { stat: 'From $79/mo', label: '3 tiers', color: '#f59e0b' },
            { stat: 'HG Rewards', label: 'Points on every $', color: '#FF2D8E' },
          ].map((s) => (
            <div key={s.stat} className="text-center">
              <p className="text-2xl font-black sm:text-3xl" style={{ color: s.color }}>
                {s.stat}
              </p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TIER CARDS ───────────────────────────────────────────────────── */}
      <section id="tiers" className="px-4 py-20 scroll-mt-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D8E]">Membership Tiers</p>
          </div>
          <h2 className="mb-16 text-center text-3xl font-black tracking-tight sm:text-4xl">
            Find Your Perfect Level of Care
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {HG_MEMBERSHIPS.map((tier) => {
              const accent = ACCENT_COLORS[tier.id];
              const isHighlighted = tier.highlight;
              return (
                <div
                  key={tier.id}
                  className="relative flex flex-col rounded-3xl overflow-hidden"
                  style={{
                    background: isHighlighted
                      ? 'linear-gradient(145deg, rgba(59,130,246,0.12) 0%, rgba(9,15,30,0.95) 40%)'
                      : 'rgba(255,255,255,0.03)',
                    border: isHighlighted
                      ? `1px solid ${accent}60`
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isHighlighted
                      ? `0 0 48px ${accent}22, 0 8px 32px rgba(0,0,0,0.5)`
                      : '0 4px 16px rgba(0,0,0,0.3)',
                    transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {/* Most Popular badge */}
                  {tier.badge && (
                    <div
                      className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-xl px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white"
                      style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}cc 100%)` }}
                    >
                      ⭐ {tier.badge}
                    </div>
                  )}

                  <div className={`flex flex-col flex-1 p-7 ${tier.badge ? 'pt-10' : ''}`}>
                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{tier.icon}</span>
                        <h3 className="text-xl font-black text-white">{tier.name}</h3>
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed">{tier.tagline}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-5xl font-black" style={{ color: accent }}>
                        ${tier.pricePerMonth}
                      </span>
                      <span className="text-white/40 text-sm">/mo</span>
                    </div>

                    {/* Neurotoxin badge */}
                    <div
                      className="mb-5 rounded-xl px-4 py-3 text-center"
                      style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
                        Neurotoxin Discount
                      </p>
                      <p className="mt-0.5 text-2xl font-black text-white">
                        ${tier.botoxDiscount}/unit off
                      </p>
                      <p className="text-xs text-white/45 mt-0.5">Botox, Dysport, Jeuveau, Xeomin, Daxxify</p>
                    </div>

                    {/* Monthly credits */}
                    <div className="mb-5">
                      <p
                        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
                        style={{ color: accent }}
                      >
                        Included Every Month
                      </p>
                      <ul className="space-y-2">
                        {tier.monthlyCredits.map((credit) => (
                          <li key={credit} className="flex items-start gap-2">
                            <span
                              className="mt-0.5 shrink-0 text-xs font-bold"
                              style={{ color: accent }}
                            >
                              ✦
                            </span>
                            <span
                              className="text-sm font-semibold"
                              style={{ color: 'rgba(255,255,255,0.9)' }}
                            >
                              {credit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Perks list */}
                    <ul className="mb-6 flex-1 space-y-2">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-sm text-white/65">
                          <span className="mt-0.5 shrink-0" style={{ color: accent }}>✓</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <a
                      href={tier.squarePayUrl ?? BOOKING_URL}
                      target={tier.squarePayUrl ? undefined : '_blank'}
                      rel={tier.squarePayUrl ? undefined : 'noopener noreferrer'}
                      className="block w-full rounded-xl py-4 text-center text-base font-bold text-white transition hover:brightness-110"
                      style={{
                        background: isHighlighted
                          ? `linear-gradient(135deg, ${accent} 0%, ${accent}bb 100%)`
                          : `linear-gradient(135deg, ${accent}cc 0%, ${accent}88 100%)`,
                      }}
                    >
                      Join {tier.name}
                    </a>
                    <p className="mt-3 text-center text-xs text-white/30">
                      No contracts · Cancel anytime
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section id="compare" className="px-4 py-20 scroll-mt-16 bg-white/[0.015]">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D8E]">Full Breakdown</p>
          </div>
          <h2 className="mb-4 text-center text-3xl font-black tracking-tight sm:text-4xl">
            See Everything Side by Side
          </h2>
          <p className="mb-12 text-center text-white/50">
            All memberships include: credits that never expire · HG Rewards points · priority booking · access to all 5 neurotoxins
          </p>
          <MembershipComparisonTable rows={MEMBERSHIP_COMPARISON_ROWS} />
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D8E]">Simple Process</p>
          </div>
          <h2 className="mb-16 text-center text-3xl font-black tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Choose Your Tier & Sign Up',
                body: 'Pick the Glow, Luxe, or Platinum tier that fits your lifestyle. Sign up online in minutes — no paperwork.',
                color: '#FF2D8E',
              },
              {
                step: '02',
                title: 'Credits Load on the 1st',
                body: 'On the 1st of every month your credits — vitamin shots, facials, IV drips — load automatically to your account. They never expire.',
                color: '#3b82f6',
              },
              {
                step: '03',
                title: 'Book, Save & Earn',
                body: 'Use your Botox discount on every visit, redeem monthly credits, and earn HG Rewards points automatically on every dollar you spend.',
                color: '#f59e0b',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl p-7"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span
                  className="text-5xl font-black leading-none"
                  style={{ color: `${s.color}40` }}
                >
                  {s.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTOX MATH SPOTLIGHT ─────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-white/[0.015]">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(255,45,142,0.12) 0%, rgba(9,15,30,0.97) 60%)',
            border: '1px solid rgba(255,45,142,0.25)',
          }}>
            <div className="p-8 sm:p-12">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D8E]">
                The math is simple
              </p>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                "The Botox discount alone pays for the membership."
              </h2>
              <p className="mt-4 text-white/60 leading-relaxed">
                The average client gets ~40 units per treatment, 3 times a year.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {HG_MEMBERSHIPS.map((tier) => {
                  const accent = ACCENT_COLORS[tier.id];
                  const annualBotoxSavings = 40 * tier.botoxDiscount * 3;
                  const annualMembership = tier.pricePerMonth * 12;
                  return (
                    <div
                      key={tier.id}
                      className="rounded-2xl p-5"
                      style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}
                    >
                      <p className="font-bold text-white mb-1">{tier.icon} {tier.name}</p>
                      <p className="text-xs text-white/50 mb-3">${tier.pricePerMonth}/mo · ${annualMembership}/yr</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Botox savings/yr</span>
                          <span className="font-bold" style={{ color: accent }}>
                            ${annualBotoxSavings}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Monthly shots/yr</span>
                          <span className="font-bold" style={{ color: accent }}>
                            ${tier.pricePerMonth * 0.4 * 12 | 0}+
                          </span>
                        </div>
                        <div
                          className="mt-2 border-t pt-2 flex justify-between text-sm font-bold"
                          style={{ borderColor: `${accent}30` }}
                        >
                          <span className="text-white">Net value</span>
                          <span style={{ color: accent }}>
                            Way more than ${annualMembership}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 text-sm text-white/50 italic">
                *Based on 40 units · 3 Botox treatments/yr. Actual savings vary. Monthly credits (shots, facials, IV drips) add significant additional value not shown above.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF2D8E]">Got Questions?</p>
          </div>
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight sm:text-4xl">
            Membership FAQ
          </h2>
          <div className="space-y-4">
            {MEMBERSHIP_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-base font-semibold text-white list-none hover:bg-white/[0.03] transition">
                  {faq.question}
                  <span className="shrink-0 text-[#FF2D8E] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────────────────────── */}
      <RealPatientReviews
        heading="What Our Members Say"
        subheading="Real patients. Real results. Real love."
      />

      {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-3xl p-10 sm:p-16"
            style={{
              background: 'linear-gradient(135deg, rgba(255,45,142,0.15) 0%, rgba(59,130,246,0.08) 50%, rgba(245,158,11,0.10) 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Ready to Join?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Choose your tier and start saving on every visit. No contracts. Cancel anytime. Credits never expire.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {HG_MEMBERSHIPS.map((tier) => {
                const accent = ACCENT_COLORS[tier.id];
                return (
                  <a
                    key={tier.id}
                    href={tier.squarePayUrl ?? BOOKING_URL}
                    target={tier.squarePayUrl ? undefined : '_blank'}
                    rel={tier.squarePayUrl ? undefined : 'noopener noreferrer'}
                    className="rounded-full px-8 py-4 text-sm font-bold text-white transition hover:brightness-110 whitespace-nowrap"
                    style={{
                      background: `linear-gradient(135deg, ${accent} 0%, ${accent}bb 100%)`,
                    }}
                  >
                    {tier.icon} Join {tier.name} — ${tier.pricePerMonth}/mo
                  </a>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-white/30">
              Questions? Call us: (630) 636-6193 · 74 W. Washington St, Oswego IL
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
