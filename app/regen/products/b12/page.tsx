'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  tealDark: '#0D5C63',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

const TIMELINE = [
  { time: '1-2 Weeks', title: 'Initial Boost', desc: 'B12 enters your bloodstream directly, beginning to support cellular energy production and metabolism.' },
  { time: '1 Month', title: 'Energy Stabilizes', desc: 'Many users report improved energy levels, less afternoon fatigue, and better mental clarity.' },
  { time: '2-3 Months', title: 'Full Benefits', desc: 'Nerve function support, improved mood, and sustained energy throughout the day become noticeable.' },
  { time: '6+ Months', title: 'Long-Term Wellness', desc: 'Continued use supports cognitive health, healthy red blood cell production, and overall vitality.' },
];

const FAQS = [
  {
    q: 'Why choose B12 injections over oral supplements?',
    a: 'Injections bypass the digestive system entirely, delivering 100% of the B12 directly to your bloodstream. Oral supplements lose 50-90% of their potency during digestion, especially as we age and absorption decreases.',
  },
  {
    q: 'How much B12 is in each injection?',
    a: 'Each injection contains 1000mcg of Methylcobalamin (the most bioavailable form of B12).',
  },
  {
    q: 'How often should I inject?',
    a: 'Most people start with once weekly injections. Your provider may adjust based on your energy levels and lab results.',
  },
  {
    q: 'Where do I inject?',
    a: 'B12 is injected subcutaneously (into fatty tissue) — typically the outer thigh, abdomen, or back of the upper arm. We provide easy instructions and supplies.',
  },
  {
    q: 'Are there any side effects?',
    a: 'B12 injections are very well-tolerated. The most common side effect is mild soreness at the injection site. B12 is water-soluble, so excess is naturally eliminated.',
  },
  {
    q: 'Who benefits most from B12 injections?',
    a: 'People with fatigue, brain fog, vegetarians/vegans, those over 50 (absorption decreases with age), patients on metformin or acid blockers, and post-bariatric surgery patients.',
  },
];

const BENEFITS = [
  { icon: '⚡', title: 'Energy Production', desc: 'B12 is essential for converting food into cellular energy (ATP)' },
  { icon: '🧠', title: 'Brain Function', desc: 'Supports nerve health, memory, focus, and mental clarity' },
  { icon: '❤️', title: 'Heart Health', desc: 'Helps regulate homocysteine levels linked to cardiovascular health' },
  { icon: '🩸', title: 'Red Blood Cells', desc: 'Essential for healthy red blood cell production and oxygen delivery' },
  { icon: '😊', title: 'Mood Support', desc: 'B12 plays a role in serotonin production and mood regulation' },
  { icon: '💤', title: 'Better Sleep', desc: 'Supports healthy sleep patterns and circadian rhythm' },
];

export default function B12ProductPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Navigation */}
      <nav className="border-b px-6 py-4" style={{ borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={50} className="h-12 w-auto brightness-110" />
          </Link>
          <Link href="/products" className="text-sm hover:underline" style={{ color: BRAND.gray }}>
            ← All Products
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-6" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.tealDark} 100%)` }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}>
              Vitamin Injectable
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
              Vitamin B12 Injection
            </h1>
            <p className="text-xl mb-6" style={{ color: BRAND.gray }}>
              Boost energy, improve focus, and fight fatigue with the most efficient way to restore B12 levels — delivering 100% absorption vs. 10-50% from oral supplements.
            </p>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black" style={{ color: BRAND.pink }}>$35</span>
              <span style={{ color: BRAND.gray }}>/month</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Ships to your door</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Self-injectable at home</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ 100% online</span>
            </div>
            
            <Link
              href="/start?goal=vitamins&program=b12"
              className="inline-block px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Start Your Free Visit
            </Link>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 60px ${BRAND.teal}30` }}>
              <Image 
                src="/images/regen/marketing/man-morning-energy.png" 
                alt="Man with energy from B12" 
                width={600} 
                height={500}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-8 px-6 border-y" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: '100%', label: 'Bioavailability' },
            { stat: '3-10x', label: 'Better absorption than pills' },
            { stat: '1000mcg', label: 'Per injection' },
            { stat: 'Weekly', label: 'Typical dosing' },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-black" style={{ color: BRAND.teal }}>{item.stat}</div>
              <div className="text-sm" style={{ color: BRAND.gray }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            Why Your Body Needs B12
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((item) => (
              <div key={item.title} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-lg mb-2" style={{ color: BRAND.cream }}>{item.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Injection vs Oral */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            Injections vs. Oral Supplements
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl" style={{ backgroundColor: BRAND.dark, border: `2px solid ${BRAND.teal}` }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.teal }}>
                <span>💉</span> B12 Injection
              </h3>
              <ul className="space-y-3">
                {[
                  '100% absorption — bypasses digestion',
                  'Feel results within days',
                  'Once weekly, takes 30 seconds',
                  'No stomach issues or interference',
                  'Best for deficiency correction',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: BRAND.cream }}>
                    <span style={{ color: BRAND.teal }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.gray}40` }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.gray }}>
                <span>💊</span> Oral Supplement
              </h3>
              <ul className="space-y-3">
                {[
                  '10-50% absorption (varies widely)',
                  'Results take weeks to months',
                  'Daily pills, easy to forget',
                  'Absorption decreases with age',
                  'May cause stomach upset',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: BRAND.gray }}>
                    <span>—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: BRAND.cream }}>
            What to Expect
          </h2>
          <div className="space-y-6">
            {TIMELINE.map((item, idx) => (
              <div key={item.time} className="flex gap-6 items-start">
                <div 
                  className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-sm text-center"
                  style={{ backgroundColor: idx === TIMELINE.length - 1 ? BRAND.pink : BRAND.teal }}
                >
                  {item.time}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-lg mb-1" style={{ color: BRAND.cream }}>{item.title}</h3>
                  <p style={{ color: BRAND.gray }}>{item.desc}</p>
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

      {/* Safety */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-3xl mx-auto p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.gray}30` }}>
          <h3 className="font-bold mb-3" style={{ color: BRAND.cream }}>Important Safety Information</h3>
          <p className="text-sm mb-4" style={{ color: BRAND.gray }}>
            B12 injections are generally very safe. The most common side effect is mild irritation at the injection site. 
            B12 is water-soluble — excess amounts are naturally eliminated by the body.
          </p>
          <p className="text-sm" style={{ color: BRAND.gray }}>
            Do not use if you are allergic to cobalt or cobalamin. Consult your provider if you are pregnant, breastfeeding, 
            or have kidney disease. A licensed provider will review your health history before prescribing.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to boost your energy?</h2>
          <p className="text-white/80 mb-8">Start with a free online visit. If approved, your B12 injections ship directly to you.</p>
          <Link
            href="/start?goal=vitamins&program=b12"
            className="inline-block px-10 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started — $35/month
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm" style={{ backgroundColor: BRAND.dark, color: BRAND.gray }}>
        <p>REGEN RX • Illinois Telehealth • <a href="tel:+16306366193" className="underline">(630) 636-6193</a></p>
        <p className="mt-2 text-xs">Prescription products require evaluation by a licensed provider. Not all patients will qualify.</p>
      </footer>
    </div>
  );
}
