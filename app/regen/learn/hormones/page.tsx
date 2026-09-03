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

const SYMPTOMS = {
  women: [
    'Fatigue & low energy',
    'Weight gain (especially midsection)',
    'Mood swings & irritability',
    'Hot flashes & night sweats',
    'Low libido',
    'Brain fog & memory issues',
    'Sleep disturbances',
    'Vaginal dryness',
  ],
  men: [
    'Fatigue & low motivation',
    'Loss of muscle mass',
    'Increased body fat',
    'Low libido & ED',
    'Brain fog',
    'Mood changes & depression',
    'Poor sleep quality',
    'Decreased strength',
  ],
};

const TREATMENTS = [
  {
    name: 'Women\'s HRT',
    category: 'Bioidentical Hormones',
    description: 'Restore balance with bioidentical estrogen, progesterone, and/or testosterone. Compounded creams, capsules, or pellets tailored to your needs.',
    options: ['BIEST (estrogen)', 'Progesterone', 'Testosterone cream', 'Custom combinations'],
    benefits: ['Relieves menopause symptoms', 'Improves energy & mood', 'Supports bone health', 'Restores libido'],
    price: '$149/month',
  },
  {
    name: 'Men\'s TRT',
    category: 'Testosterone Replacement',
    description: 'Restore testosterone levels to optimize energy, strength, body composition, and mental clarity. Injection or topical options available.',
    options: ['Testosterone Cypionate', 'Testosterone cream', 'hCG (fertility preservation)', 'Anastrozole (estrogen control)'],
    benefits: ['Increased energy & drive', 'Improved muscle mass', 'Better mood & focus', 'Enhanced libido'],
    price: '$179/month',
  },
  {
    name: 'Thyroid Support',
    category: 'Metabolic Optimization',
    description: 'Optimize thyroid function for energy, metabolism, and mood. Options include T3, T4, or combination therapy.',
    options: ['Liothyronine (T3)', 'Levothyroxine (T4)', 'Combination T3/T4', 'Armour Thyroid'],
    benefits: ['Improved metabolism', 'More energy', 'Better temperature regulation', 'Clearer thinking'],
    price: 'Starting at $30/month',
  },
];

const FAQS = [
  {
    q: 'What are bioidentical hormones?',
    a: 'Bioidentical hormones are molecularly identical to the hormones your body naturally produces. They\'re derived from plant sources (usually yams or soy) and are customized to match your body\'s needs. Many people tolerate them better than synthetic alternatives.',
  },
  {
    q: 'How do I know if I need HRT?',
    a: 'Common signs include fatigue, weight changes, mood issues, low libido, and poor sleep. Lab testing reveals your actual hormone levels. Our providers evaluate both your symptoms and lab results to determine if HRT is appropriate.',
  },
  {
    q: 'Is hormone therapy safe?',
    a: 'When properly monitored, HRT is considered safe for most people. Bioidentical hormones at physiological doses aim to restore your levels to optimal ranges — not exceed them. Regular lab monitoring ensures safety and effectiveness.',
  },
  {
    q: 'How long until I feel results?',
    a: 'Some improvements (energy, sleep, mood) may be noticed within 2-4 weeks. Full benefits typically take 2-3 months as your body adjusts. We monitor your progress and adjust dosing as needed.',
  },
  {
    q: 'Do I need labs before starting?',
    a: 'Yes. We require baseline labs to assess your current hormone levels, rule out contraindications, and establish a starting point. This allows us to customize your treatment and track progress.',
  },
];

export default function HormonesLearnPage() {
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
            <Link href="/start?goal=hormones" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
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
            <span className="text-5xl">⚡</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.teal }}>HRT & Optimization</p>
              <h1 className="text-4xl font-black" style={{ color: BRAND.cream }}>Hormone Therapy</h1>
            </div>
          </div>
          <p className="text-xl max-w-2xl" style={{ color: BRAND.gray }}>
            Hormones control how you feel, think, and perform. When they decline — due to age, 
            stress, or other factors — bioidentical hormone therapy can help restore balance.
          </p>
        </div>
      </section>

      {/* Symptoms */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Signs of Hormone Imbalance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.pink}30` }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.pink }}>
                <span>♀</span> Women
              </h3>
              <ul className="space-y-2">
                {SYMPTOMS.women.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm" style={{ color: BRAND.gray }}>
                    <span style={{ color: BRAND.pink }}>•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.teal }}>
                <span>♂</span> Men
              </h3>
              <ul className="space-y-2">
                {SYMPTOMS.men.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm" style={{ color: BRAND.gray }}>
                    <span style={{ color: BRAND.teal }}>•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Treatment Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TREATMENTS.map((tx) => (
              <div key={tx.name} className="p-6 rounded-xl flex flex-col" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND.teal }}>{tx.category}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>{tx.name}</h3>
                <p className="text-sm mb-4 flex-grow" style={{ color: BRAND.gray }}>{tx.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.gray }}>Options</p>
                  <div className="flex flex-wrap gap-1">
                    {tx.options.map((opt) => (
                      <span key={opt} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.gray }}>Benefits</p>
                  <ul className="text-xs space-y-1">
                    {tx.benefits.map((b) => (
                      <li key={b} style={{ color: BRAND.cream }}>✓ {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t mt-auto" style={{ borderColor: `${BRAND.teal}20` }}>
                  <span className="text-lg font-bold" style={{ color: BRAND.pink }}>{tx.price}</span>
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
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to feel like yourself again?</h2>
          <p className="text-white/80 mb-8">
            Complete a free visit to discuss your symptoms. Our providers will review your 
            health history and may order labs to assess your hormone levels.
          </p>
          <Link
            href="/start?goal=hormones"
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
            <strong>Note:</strong> Hormone therapy requires evaluation and monitoring by a licensed provider. 
            Not everyone is a candidate. Results vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
