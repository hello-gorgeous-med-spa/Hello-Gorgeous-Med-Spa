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

const TREATMENTS = {
  men: [
    {
      name: 'Sildenafil (Viagra®)',
      description: 'The original ED medication. Works by increasing blood flow when aroused.',
      duration: '4-6 hours',
      onset: '30-60 minutes',
      price: '$1.75/dose',
    },
    {
      name: 'Tadalafil (Cialis®)',
      description: 'Longer-lasting option. Can be taken daily for spontaneity or as-needed.',
      duration: '24-36 hours',
      onset: '30 minutes',
      price: '$2.25/dose',
    },
    {
      name: 'Combo Troches',
      description: 'Custom sublingual troches combining multiple PDE5 inhibitors for enhanced effect.',
      duration: '6-12 hours',
      onset: '15-20 minutes',
      price: '$7/dose',
    },
    {
      name: 'PT-141 (Bremelanotide)',
      description: 'Works on desire (brain) rather than mechanics. For men who want more than just erections.',
      duration: '24-72 hours',
      onset: '45 minutes',
      price: '$300/vial',
    },
  ],
  women: [
    {
      name: 'PT-141 (Bremelanotide)',
      description: 'The only FDA-approved medication for low desire. Works on brain pathways to increase arousal.',
      duration: '24 hours',
      onset: '45 minutes',
      price: '$300/vial',
    },
    {
      name: 'Oxytocin',
      description: 'The "bonding hormone." Supports intimacy, connection, and arousal.',
      duration: 'Variable',
      onset: '15-30 minutes',
      price: '$5/dose',
    },
    {
      name: 'Arousal Creams',
      description: 'Topical formulas with sildenafil and other ingredients for localized blood flow and sensitivity.',
      duration: '1-2 hours',
      onset: '15-20 minutes',
      price: '$200-250',
    },
  ],
};

const FAQS = [
  {
    q: 'How do ED medications work?',
    a: 'PDE5 inhibitors (sildenafil, tadalafil, vardenafil) relax blood vessels and increase blood flow to the penis when sexually aroused. They don\'t cause spontaneous erections — arousal is still required.',
  },
  {
    q: 'What if ED pills don\'t work for me?',
    a: 'Options include trying a different PDE5 inhibitor, combination troches, adding PT-141 for desire, or injectable solutions (Tri-Mix). Our providers can help identify the right approach.',
  },
  {
    q: 'Is PT-141 safe?',
    a: 'PT-141 (bremelanotide) is FDA-approved for hypoactive sexual desire disorder in women. It works differently than ED pills — on brain chemistry rather than blood flow. Common side effects include nausea and flushing.',
  },
  {
    q: 'Why is desire different from function?',
    a: 'Function (erections, arousal response) is mechanical — blood flow and nerve response. Desire is psychological — the brain\'s motivation for sex. ED pills help function; PT-141 and oxytocin target desire.',
  },
  {
    q: 'Is this discreet?',
    a: 'Completely. Your medication ships in unmarked packaging. Our telehealth platform is HIPAA-compliant. No one will know what\'s in your package.',
  },
];

export default function SexualHealthLearnPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={50} className="h-12 w-auto brightness-110" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm font-medium" style={{ color: BRAND.gray }}>← Back to Learn</Link>
            <Link href="/start?goal=sexual-health" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
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
            <span className="text-5xl">💗</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.pink }}>Intimacy & Performance</p>
              <h1 className="text-4xl font-black" style={{ color: BRAND.cream }}>Sexual Wellness</h1>
            </div>
          </div>
          <p className="text-xl max-w-2xl" style={{ color: BRAND.gray }}>
            Discreet, effective solutions for desire and performance — for both men and women. 
            These are real medical treatments, shipped directly to you.
          </p>
        </div>
      </section>

      {/* Men's Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: BRAND.cream }}>
            <span style={{ color: BRAND.teal }}>♂</span> For Men
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TREATMENTS.men.map((tx) => (
              <div key={tx.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.cream }}>{tx.name}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{tx.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Duration</p>
                    <p style={{ color: BRAND.teal }}>{tx.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Onset</p>
                    <p style={{ color: BRAND.teal }}>{tx.onset}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${BRAND.teal}20` }}>
                  <span className="font-bold" style={{ color: BRAND.pink }}>{tx.price}</span>
                  <Link href="/start?goal=sexual-health" className="text-xs font-bold px-3 py-2 rounded-full" style={{ backgroundColor: BRAND.teal, color: 'white' }}>
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Women's Section */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: BRAND.cream }}>
            <span style={{ color: BRAND.pink }}>♀</span> For Women
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TREATMENTS.women.map((tx) => (
              <div key={tx.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.pink}30` }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.cream }}>{tx.name}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{tx.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Duration</p>
                    <p style={{ color: BRAND.pink }}>{tx.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Onset</p>
                    <p style={{ color: BRAND.pink }}>{tx.onset}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${BRAND.pink}20` }}>
                  <span className="font-bold" style={{ color: BRAND.pink }}>{tx.price}</span>
                  <Link href="/start?goal=sexual-health" className="text-xs font-bold px-3 py-2 rounded-full" style={{ backgroundColor: BRAND.pink, color: 'white' }}>
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <h3 className="font-bold mb-2" style={{ color: BRAND.teal }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.pink }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to improve your intimate life?</h2>
          <p className="text-white/80 mb-8">
            Complete a discreet online visit. Our providers will recommend the right 
            treatment and ship it directly to your door in unmarked packaging.
          </p>
          <Link
            href="/start?goal=sexual-health"
            className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.teal, color: 'white' }}
          >
            Start Your Free Visit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ backgroundColor: BRAND.dark, borderColor: `${BRAND.teal}15` }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs" style={{ color: BRAND.gray }}>
            <strong>100% Discreet:</strong> Plain packaging. No logos. HIPAA-compliant telehealth.
          </p>
        </div>
      </footer>
    </div>
  );
}
