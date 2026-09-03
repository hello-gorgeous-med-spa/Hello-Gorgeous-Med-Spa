'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

const TREATMENTS = [
  {
    name: 'Finasteride + Minoxidil Topical',
    type: 'Foam or Solution',
    description: 'The most effective topical combination. Finasteride blocks DHT (the hormone that causes hair loss) while minoxidil stimulates growth.',
    howItWorks: 'Apply once daily to scalp. DHT blocking + growth stimulation in one formula.',
    results: 'Visible improvement in 3-6 months. Best results at 12 months.',
    price: '$175/month',
    sideEffects: ['Scalp irritation (rare)', 'Minimal systemic absorption'],
  },
  {
    name: 'Oral Minoxidil',
    type: 'Low-dose tablet',
    description: 'For those who prefer a pill over topical application. Low-dose oral minoxidil provides systemic hair growth support.',
    howItWorks: 'Take daily. Works from the inside out to improve hair density.',
    results: 'Results in 3-6 months. Often more effective than topical alone.',
    price: '$40/month',
    sideEffects: ['Possible body hair growth', 'Rare: fluid retention', 'Blood pressure monitoring'],
  },
  {
    name: 'Advanced Hair Formula',
    type: 'Topical Solution',
    description: 'Our most comprehensive topical. Combines finasteride, minoxidil, latanoprost (eyelash drug for hair), and tretinoin (enhances absorption).',
    howItWorks: 'Multi-mechanism approach. DHT blocking + growth stimulation + enhanced penetration.',
    results: 'For aggressive hair loss or those who want maximum results.',
    price: '$325/month',
    sideEffects: ['Scalp irritation possible', 'Adjustment period normal'],
  },
  {
    name: 'Oral Finasteride',
    type: 'Daily tablet',
    description: 'The classic oral DHT blocker. 1mg daily to prevent further hair loss and promote regrowth.',
    howItWorks: 'Blocks 5-alpha reductase enzyme that converts testosterone to DHT.',
    results: 'Stops loss in ~90% of men. Regrowth in 65%.',
    price: '$45/month',
    sideEffects: ['Rare sexual side effects (<2%)', 'Reversible if stopped'],
  },
];

const TIMELINE = [
  { month: '0-3', title: 'Shedding Phase', desc: 'Initial shedding is normal as weak hairs make way for stronger ones. Don\'t panic — this is a good sign.' },
  { month: '3-6', title: 'Stabilization', desc: 'Hair loss slows or stops. You may notice less hair in the shower drain. Early regrowth begins.' },
  { month: '6-12', title: 'Visible Improvement', desc: 'Noticeable new growth. Hair appears thicker and denser. Most improvement happens in this window.' },
  { month: '12+', title: 'Maintenance', desc: 'Continue treatment to maintain results. Hair gains are kept as long as treatment continues.' },
];

export default function HairLearnPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm font-medium" style={{ color: BRAND.gray }}>← Back to Learn</Link>
            <Link href="/start?goal=hair" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 px-6" style={{ background: `linear-gradient(180deg, ${BRAND.darkAlt} 0%, ${BRAND.dark} 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/learn" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-80" style={{ color: BRAND.teal }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Education Center
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">💇</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.teal }}>Prescription Hair Growth</p>
              <h1 className="text-4xl font-black" style={{ color: BRAND.cream }}>Hair Restoration</h1>
            </div>
          </div>
          <p className="text-xl max-w-2xl" style={{ color: BRAND.gray }}>
            Hair loss is treatable. Prescription medications like finasteride and minoxidil 
            can stop loss and regrow hair — especially when started early.
          </p>
        </div>
      </section>

      {/* How Hair Loss Works */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>How Hair Loss Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'DHT Attacks Follicles', desc: 'In pattern hair loss, the hormone DHT (dihydrotestosterone) binds to hair follicles and causes them to shrink over time.' },
              { num: '02', title: 'Follicles Miniaturize', desc: 'Affected follicles produce thinner, shorter hairs with each cycle until they eventually stop producing visible hair.' },
              { num: '03', title: 'Treatment Reverses This', desc: 'DHT blockers stop the attack. Growth stimulators wake up dormant follicles. Early intervention = better results.' },
            ].map((step) => (
              <div key={step.num} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-3xl font-black mb-3 block" style={{ color: BRAND.teal }}>{step.num}</span>
                <h3 className="font-bold mb-2" style={{ color: BRAND.cream }}>{step.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Treatment Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TREATMENTS.map((tx) => (
              <div key={tx.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30` }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND.teal }}>{tx.type}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>{tx.name}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{tx.description}</p>
                
                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>How It Works</p>
                    <p style={{ color: BRAND.cream }}>{tx.howItWorks}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Expected Results</p>
                    <p style={{ color: BRAND.teal }}>{tx.results}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Possible Side Effects</p>
                    <div className="flex flex-wrap gap-1">
                      {tx.sideEffects.map((se) => (
                        <span key={se} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${BRAND.pink}15`, color: BRAND.pink }}>
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${BRAND.teal}20` }}>
                  <span className="text-lg font-bold" style={{ color: BRAND.pink }}>{tx.price}</span>
                  <Link 
                    href="/start?goal=hair"
                    className="text-xs font-bold px-3 py-2 rounded-full"
                    style={{ backgroundColor: BRAND.teal, color: 'white' }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>What to Expect: Timeline</h2>
          <div className="space-y-4">
            {TIMELINE.map((phase) => (
              <div key={phase.month} className="flex gap-6 p-4 rounded-xl" style={{ backgroundColor: BRAND.darkAlt }}>
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="text-sm font-bold" style={{ color: BRAND.teal }}>Month {phase.month}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: BRAND.cream }}>{phase.title}</h3>
                  <p className="text-sm" style={{ color: BRAND.gray }}>{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to keep your hair?</h2>
          <p className="text-white/80 mb-8">
            The sooner you start, the better your results. Complete a free visit and 
            our providers will recommend the right treatment for your hair loss pattern.
          </p>
          <Link
            href="/start?goal=hair"
            className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start Your Free Visit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ backgroundColor: BRAND.dark, borderColor: `${BRAND.teal}15` }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs" style={{ color: BRAND.gray }}>
            <strong>Note:</strong> Hair loss treatment requires evaluation by a licensed provider. 
            Results vary. Consistency is key — treatments work while you use them.
          </p>
        </div>
      </footer>
    </div>
  );
}
