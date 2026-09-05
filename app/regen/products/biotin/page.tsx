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
  { time: '2-4 Weeks', title: 'Cellular Support', desc: 'Biotin begins supporting keratin infrastructure at the cellular level in hair follicles and nail beds.' },
  { time: '1-2 Months', title: 'Nail Strength', desc: 'Many notice stronger, less brittle nails with reduced splitting and breakage.' },
  { time: '3-4 Months', title: 'Hair Improvements', desc: 'Hair may appear thicker, shinier, and healthier as new growth comes in stronger.' },
  { time: '6+ Months', title: 'Full Results', desc: 'Sustained improvements in hair thickness, nail strength, and overall keratin health.' },
];

const FAQS = [
  {
    q: 'Why choose Biotin injections over gummies or pills?',
    a: 'Oral biotin has limited absorption and can be affected by gut health and other factors. Injections deliver biotin directly to your bloodstream for immediate availability to hair follicles and nail beds.',
  },
  {
    q: 'How much Biotin is in each injection?',
    a: 'Each injection contains a therapeutic dose that far exceeds what oral supplements can reliably deliver.',
  },
  {
    q: 'How often should I inject?',
    a: 'Most people inject once weekly. Some prefer twice weekly for the first month to build levels faster.',
  },
  {
    q: 'Will Biotin help with hair loss?',
    a: 'Biotin supports healthy hair growth and can help with thinning, especially if you have a deficiency. For pattern hair loss, it works best combined with other treatments like finasteride or minoxidil.',
  },
  {
    q: 'Can I take Biotin if I\'m on GLP-1 medications?',
    a: 'Yes — in fact, many patients on weight loss medications like semaglutide experience hair thinning due to rapid weight loss. Biotin injections can help support hair health during this time.',
  },
  {
    q: 'Are there any side effects?',
    a: 'Biotin injections are very well-tolerated. Mild soreness at the injection site is the most common side effect. Note: High biotin levels can interfere with some lab tests — inform your doctor if you have bloodwork scheduled.',
  },
];

const BENEFITS = [
  { icon: '💇', title: 'Hair Growth', desc: 'Supports keratin production for thicker, healthier hair' },
  { icon: '💅', title: 'Nail Strength', desc: 'Reduces brittleness, splitting, and breakage' },
  { icon: '✨', title: 'Skin Health', desc: 'Supports healthy skin cell turnover and radiance' },
  { icon: '⚡', title: 'Metabolism', desc: 'Helps convert food into energy at the cellular level' },
  { icon: '🧬', title: 'Keratin Protein', desc: 'Essential building block for hair, skin, and nails' },
  { icon: '💪', title: 'GLP-1 Support', desc: 'Helps counter hair thinning from rapid weight loss' },
];

export default function BiotinProductPage() {
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
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink }}>
              Vitamin Injectable
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
              Biotin Injection
            </h1>
            <p className="text-xl mb-6" style={{ color: BRAND.gray }}>
              Strengthen hair, nails, and skin from within. Injectable biotin delivers the building blocks for keratin directly to your cells — no digestion, no guesswork.
            </p>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black" style={{ color: BRAND.pink }}>$82.65</span>
              <span style={{ color: BRAND.gray }}> per vial</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Ships to your door</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Self-injectable at home</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Great with GLP-1s</span>
            </div>
            
            <Link
              href="/start?goal=vitamins&program=biotin"
              className="inline-block px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Start Your Free Visit
            </Link>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 60px ${BRAND.pink}30` }}>
              <Image 
                src="/images/regen/marketing/woman-skincare.png" 
                alt="Woman with healthy hair and skin" 
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
            { stat: 'Direct', label: 'To Bloodstream' },
            { stat: 'B7', label: 'Vitamin (Biotin)' },
            { stat: '3-4 mo', label: 'For visible hair results' },
            { stat: 'Weekly', label: 'Typical dosing' },
          ].map((item) => (
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
            The Beauty Vitamin
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

      {/* GLP-1 Connection */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl" style={{ backgroundColor: BRAND.dark, border: `2px solid ${BRAND.teal}` }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.cream }}>
              On Semaglutide or Tirzepatide?
            </h2>
            <p className="mb-4" style={{ color: BRAND.gray }}>
              Hair thinning is a common side effect of rapid weight loss from GLP-1 medications. This happens because your body prioritizes essential functions over hair growth when in a caloric deficit.
            </p>
            <p className="mb-4" style={{ color: BRAND.gray }}>
              <strong style={{ color: BRAND.cream }}>Biotin injections can help.</strong> By delivering keratin-building nutrients directly to your hair follicles, biotin supports healthy hair growth even during weight loss.
            </p>
            <p style={{ color: BRAND.teal }}>
              Many of our weight loss patients add biotin to their protocol specifically to maintain hair health.
            </p>
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready for healthier hair & nails?</h2>
          <p className="text-white/80 mb-8">Start with a free online visit. If approved, your Biotin injections ship directly to you.</p>
          <Link
            href="/start?goal=vitamins&program=biotin"
            className="inline-block px-10 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started — $82.65 per vial
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
