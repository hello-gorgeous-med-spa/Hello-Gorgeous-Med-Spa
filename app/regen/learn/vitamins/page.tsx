'use client';

import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  tealDark: '#0D5C63',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

const INJECTABLES = [
  {
    id: 'b12',
    name: 'Vitamin B12',
    subtitle: 'Methylcobalamin',
    benefits: ['Energy & metabolism boost', 'Nerve health support', 'Mood enhancement', 'Red blood cell production'],
    bestFor: 'Fatigue, brain fog, vegetarians/vegans, post-bariatric patients',
    frequency: 'Weekly or bi-weekly',
    price: '$35',
    science: 'B12 is essential for energy production at the cellular level. Many people are deficient due to diet, absorption issues, or medications like metformin.',
  },
  {
    id: 'biotin',
    name: 'Biotin',
    subtitle: 'Vitamin B7',
    benefits: ['Hair growth & strength', 'Nail health', 'Skin radiance', 'Metabolism support'],
    bestFor: 'Thinning hair, brittle nails, those on weight loss medications',
    frequency: 'Weekly',
    price: '$45',
    science: 'Biotin is a water-soluble B vitamin crucial for keratin production. Injectable form bypasses digestive absorption issues for faster, more reliable results.',
  },
  {
    id: 'glutathione',
    name: 'Glutathione',
    subtitle: 'Master Antioxidant',
    benefits: ['Skin brightening & glow', 'Liver detoxification', 'Immune system boost', 'Reduced oxidative stress'],
    bestFor: 'Dull skin, hyperpigmentation, detox support, immune health',
    frequency: 'Weekly for 4-8 weeks, then monthly',
    price: '$75',
    science: 'Glutathione is the body\'s most powerful antioxidant. It neutralizes free radicals, supports detox pathways, and inhibits melanin for a brighter complexion.',
  },
  {
    id: 'nad',
    name: 'NAD+',
    subtitle: 'Nicotinamide Adenine Dinucleotide',
    benefits: ['Cellular energy production', 'Brain clarity & focus', 'Anti-aging at cellular level', 'DNA repair support'],
    bestFor: 'Chronic fatigue, brain fog, longevity optimization, recovery',
    frequency: 'Weekly or bi-weekly',
    price: '$125',
    science: 'NAD+ levels decline with age. Supplementing NAD+ supports mitochondrial function, sirtuin activation, and cellular repair mechanisms linked to healthy aging.',
  },
];

const FAQS = [
  {
    q: 'How are vitamin injections different from pills?',
    a: 'Injections deliver nutrients directly into your bloodstream, bypassing the digestive system. This means 100% bioavailability vs. 10-50% absorption with oral supplements. Results are faster and more reliable.',
  },
  {
    q: 'Do I need to come into the office?',
    a: 'No! We prescribe self-injectable vitamins that ship directly to you. They come with supplies and easy instructions. Most people inject into their thigh or upper arm — it\'s quick and nearly painless.',
  },
  {
    q: 'How quickly will I see results?',
    a: 'Many people feel B12 energy within 24-48 hours. Glutathione skin brightening typically shows within 2-4 weeks of consistent use. NAD+ benefits accumulate over several weeks.',
  },
  {
    q: 'Are there any side effects?',
    a: 'Vitamin injections are generally very safe. Some people experience mild soreness at the injection site. Glutathione may cause temporary flushing. We review your health history before prescribing.',
  },
  {
    q: 'Can I combine multiple injectables?',
    a: 'Yes! Many of our patients do a "cocktail" approach — for example, B12 + Biotin for energy and hair health, or Glutathione + NAD+ for comprehensive anti-aging support.',
  },
];

export default function VitaminsLearnPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b px-6 py-4" style={{ borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: BRAND.cream }}>
            REGEN<span style={{ color: BRAND.pink }}>RX</span>
          </Link>
          <Link href="/learn" className="text-sm hover:underline" style={{ color: BRAND.gray }}>
            ← Back to Learn
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.tealDark} 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <span className="text-5xl mb-4 block">💉</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
            Vitamin Injectables
          </h1>
          <p className="text-xl mb-8" style={{ color: BRAND.gray }}>
            Fast-acting nutrients for energy, immunity, and glow — delivered straight to your cells.
          </p>
          <Link
            href="/start?goal=vitamins"
            className="inline-block px-8 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started — From $35
          </Link>
        </div>
      </section>

      {/* Why Injectables */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            Why Injectable Vitamins?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: '100% Absorption', desc: 'Bypass digestion — nutrients go straight to your bloodstream' },
              { icon: '🚀', title: 'Fast Results', desc: 'Feel the difference within days, not weeks' },
              { icon: '🏠', title: 'At-Home Convenience', desc: 'Self-inject at home — no office visits required' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl text-center" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-lg mb-2" style={{ color: BRAND.cream }}>{item.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Injectables Grid */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: BRAND.cream }}>
            Our Vitamin Injectables
          </h2>
          <div className="space-y-8">
            {INJECTABLES.map((item) => (
              <div 
                key={item.id} 
                className="p-8 rounded-2xl"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold" style={{ color: BRAND.cream }}>{item.name}</h3>
                      <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}>
                        {item.subtitle}
                      </span>
                    </div>
                    <p className="mb-4" style={{ color: BRAND.gray }}>{item.science}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: BRAND.teal }}>Benefits</h4>
                        <ul className="space-y-1">
                          {item.benefits.map((b) => (
                            <li key={b} className="text-sm flex items-center gap-2" style={{ color: BRAND.gray }}>
                              <span style={{ color: BRAND.pink }}>✓</span> {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: BRAND.teal }}>Best For</h4>
                        <p className="text-sm" style={{ color: BRAND.gray }}>{item.bestFor}</p>
                        <h4 className="font-semibold mt-4 mb-2" style={{ color: BRAND.teal }}>Frequency</h4>
                        <p className="text-sm" style={{ color: BRAND.gray }}>{item.frequency}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="text-3xl font-black mb-2" style={{ color: BRAND.pink }}>{item.price}</div>
                    <Link
                      href={`/start?goal=vitamins&program=${item.id}`}
                      className="inline-block px-6 py-3 text-sm font-bold rounded-full transition-all hover:scale-105"
                      style={{ backgroundColor: BRAND.teal, color: 'white' }}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}>
                <h3 className="font-bold mb-2" style={{ color: BRAND.teal }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to boost your wellness?</h2>
          <p className="text-white/80 mb-8">Start with a free online visit. We'll help you choose the right injectables for your goals.</p>
          <Link
            href="/start?goal=vitamins"
            className="inline-block px-10 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start Your Free Visit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm" style={{ backgroundColor: BRAND.dark, color: BRAND.gray }}>
        <p>REGEN RX • Illinois Telehealth • <a href="tel:+16306366193" className="underline">(630) 636-6193</a></p>
      </footer>
    </div>
  );
}
