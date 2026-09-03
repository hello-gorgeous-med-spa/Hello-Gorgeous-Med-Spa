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
  { time: '1-2 Weeks', title: 'Cellular Activation', desc: 'NAD+ begins replenishing cellular stores, supporting mitochondrial function and energy production pathways.' },
  { time: '3-4 Weeks', title: 'Mental Clarity', desc: 'Many experience improved focus, reduced brain fog, and enhanced cognitive function.' },
  { time: '2-3 Months', title: 'Energy & Recovery', desc: 'Sustained energy improvements, better exercise recovery, and improved sleep quality become noticeable.' },
  { time: '6+ Months', title: 'Longevity Benefits', desc: 'Continued NAD+ optimization supports healthy aging, DNA repair, and long-term cellular health.' },
];

const FAQS = [
  {
    q: 'What is NAD+?',
    a: 'NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in every cell of your body. It\'s essential for energy production, DNA repair, and activating longevity-related proteins called sirtuins.',
  },
  {
    q: 'Why do NAD+ levels matter?',
    a: 'NAD+ levels decline by up to 50% between ages 40-60. This decline is linked to aging, fatigue, cognitive decline, and increased disease risk. Replenishing NAD+ may help counteract these effects.',
  },
  {
    q: 'Why injections instead of oral NAD+?',
    a: 'Oral NAD+ is poorly absorbed and largely broken down during digestion. Injections deliver NAD+ directly to your bloodstream, ensuring it reaches your cells intact.',
  },
  {
    q: 'How often should I inject?',
    a: 'Most people inject once or twice weekly. Some start with a "loading" phase of more frequent injections, then transition to maintenance.',
  },
  {
    q: 'What does NAD+ feel like?',
    a: 'Many people report increased mental clarity, improved focus, better energy throughout the day, and enhanced recovery after workouts. Some notice improved sleep quality.',
  },
  {
    q: 'Are there any side effects?',
    a: 'NAD+ injections are generally well-tolerated. Some people experience mild flushing, nausea, or headache during the first few injections as the body adjusts. Injection site soreness is common.',
  },
];

const BENEFITS = [
  { icon: '⚡', title: 'Cellular Energy', desc: 'Powers mitochondria — the energy factories in every cell' },
  { icon: '🧠', title: 'Brain Function', desc: 'Supports neuronal health, focus, and mental clarity' },
  { icon: '🧬', title: 'DNA Repair', desc: 'Activates PARP enzymes that repair damaged DNA' },
  { icon: '⏳', title: 'Longevity Genes', desc: 'Activates sirtuins — proteins linked to healthy aging' },
  { icon: '💪', title: 'Recovery', desc: 'Supports muscle recovery and reduces exercise fatigue' },
  { icon: '😴', title: 'Sleep Quality', desc: 'Helps regulate circadian rhythm for better rest' },
];

const SCIENCE = [
  { stat: '50%', label: 'NAD+ decline by age 60' },
  { stat: '7', label: 'Sirtuin genes activated by NAD+' },
  { stat: '500+', label: 'Metabolic reactions requiring NAD+' },
];

export default function NADProductPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Navigation */}
      <nav className="border-b px-6 py-4" style={{ borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
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
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink }}>
              Longevity Injectable
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
              NAD+ Injection
            </h1>
            <p className="text-xl mb-6" style={{ color: BRAND.gray }}>
              The "longevity molecule" for cellular energy, brain clarity, and healthy aging. Replenish what time takes away and unlock your body's full potential.
            </p>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black" style={{ color: BRAND.pink }}>$125</span>
              <span style={{ color: BRAND.gray }}>/month</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Cellular energy</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Brain clarity</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Anti-aging</span>
            </div>
            
            <Link
              href="/start?goal=vitamins&program=nad-injection"
              className="inline-block px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Start Your Free Visit
            </Link>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 60px ${BRAND.pink}30` }}>
              <Image 
                src="/images/regen/marketing/cell-peptide.png" 
                alt="Cellular regeneration" 
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
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 text-center">
          {SCIENCE.map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-black" style={{ color: BRAND.pink }}>{item.stat}</div>
              <div className="text-sm" style={{ color: BRAND.gray }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            The Longevity Molecule
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((item) => (
              <div key={item.title} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.pink}20` }}>
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-lg mb-2" style={{ color: BRAND.cream }}>{item.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Science */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            Why NAD+ Declines With Age
          </h2>
          <div className="p-8 rounded-2xl mb-8" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30` }}>
            <p className="mb-4" style={{ color: BRAND.gray }}>
              <strong style={{ color: BRAND.cream }}>NAD+ is essential for life.</strong> It's required for over 500 enzymatic reactions, including energy production, DNA repair, and cellular signaling.
            </p>
            <p className="mb-4" style={{ color: BRAND.gray }}>
              Unfortunately, NAD+ levels naturally decline as we age — by up to 50% between ages 40-60. This decline is linked to many hallmarks of aging: fatigue, cognitive decline, slower recovery, and increased disease risk.
            </p>
            <p style={{ color: BRAND.teal }}>
              By replenishing NAD+ through direct injection, you can support your body's natural repair mechanisms and cellular energy production — essentially giving your cells the fuel they need to function optimally.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30` }}>
              <h3 className="font-bold mb-3" style={{ color: BRAND.teal }}>🧬 Sirtuin Activation</h3>
              <p className="text-sm" style={{ color: BRAND.gray }}>
                NAD+ activates sirtuins — a family of proteins that regulate cellular health, DNA repair, and longevity. Sirtuins are often called "longevity genes" because of their role in healthy aging.
              </p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.pink}30` }}>
              <h3 className="font-bold mb-3" style={{ color: BRAND.pink }}>⚡ Mitochondrial Function</h3>
              <p className="text-sm" style={{ color: BRAND.gray }}>
                NAD+ is essential for mitochondrial energy production. Without adequate NAD+, your cells can't efficiently convert food into ATP — the energy currency that powers everything you do.
              </p>
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
                <h3 className="font-bold mb-2" style={{ color: BRAND.pink }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to optimize your cells?</h2>
          <p className="text-white/80 mb-8">Start with a free online visit. If approved, your NAD+ injections ship directly to you.</p>
          <Link
            href="/start?goal=vitamins&program=nad-injection"
            className="inline-block px-10 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started — $125/month
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
