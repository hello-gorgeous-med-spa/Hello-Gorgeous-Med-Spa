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
  { time: '1-2 Weeks', title: 'Antioxidant Support', desc: 'Glutathione begins neutralizing free radicals and supporting your body\'s natural cellular processes.' },
  { time: '3-4 Weeks', title: 'Skin Clarity', desc: 'Many notice improved skin clarity, reduced dullness, and a subtle brightening effect.' },
  { time: '2-3 Months', title: 'Visible Glow', desc: 'Skin tone appears more even, hyperpigmentation begins to fade, and overall radiance improves.' },
  { time: '6+ Months', title: 'Sustained Results', desc: 'Continued use supports ongoing cellular health, immune function, and skin health maintenance.' },
];

const FAQS = [
  {
    q: 'What is Glutathione?',
    a: 'Glutathione is your body\'s "master antioxidant" — a molecule made of three amino acids that plays a crucial role in cellular health, immune function, and protecting cells from oxidative damage.',
  },
  {
    q: 'Why do I need injections instead of oral supplements?',
    a: 'Oral glutathione is largely destroyed during digestion. Injections bypass the GI tract entirely, delivering active glutathione directly to your cells for maximum effectiveness.',
  },
  {
    q: 'How does Glutathione brighten skin?',
    a: 'Glutathione inhibits tyrosinase, the enzyme responsible for melanin production. Over time, this can lead to lighter, more even skin tone and reduced hyperpigmentation.',
  },
  {
    q: 'How often should I inject?',
    a: 'Most people start with 1-2 injections per week for the first 4-8 weeks (loading phase), then transition to weekly or bi-weekly maintenance.',
  },
  {
    q: 'Is skin brightening permanent?',
    a: 'Results are maintained with ongoing use. If you stop treatment, melanin production gradually returns to baseline over several months.',
  },
  {
    q: 'Are there any side effects?',
    a: 'Glutathione injections are generally well-tolerated. Some people experience temporary flushing or mild stomach discomfort. Injection site soreness is common.',
  },
];

const BENEFITS = [
  { icon: '✨', title: 'Skin Brightening', desc: 'Inhibits melanin production for a more even, radiant complexion' },
  { icon: '🛡️', title: 'Master Antioxidant', desc: 'Neutralizes free radicals and protects cells from oxidative stress' },
  { icon: '🧹', title: 'Liver Support', desc: 'Supports healthy liver function and cellular antioxidant processes' },
  { icon: '🦠', title: 'Immune Support', desc: 'Enhances immune cell function and overall immune response' },
  { icon: '⚡', title: 'Energy & Recovery', desc: 'Supports mitochondrial function and cellular energy production' },
  { icon: '🧬', title: 'Anti-Aging', desc: 'Protects DNA from damage and supports healthy cellular aging' },
];

export default function GlutathioneProductPage() {
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
              Glutathione Injection
            </h1>
            <p className="text-xl mb-6" style={{ color: BRAND.gray }}>
              The "master antioxidant" for radiant skin, cellular health, and immune support. Brighten your complexion and support your body's natural defense systems.
            </p>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black" style={{ color: BRAND.pink }}>$75</span>
              <span style={{ color: BRAND.gray }}>/month</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Skin brightening</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Antioxidant support</span>
              <span className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.darkAlt, color: BRAND.cream }}>✓ Immune boost</span>
            </div>
            
            <Link
              href="/start?goal=vitamins&program=glutathione"
              className="inline-block px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Start Your Free Visit
            </Link>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 60px ${BRAND.teal}30` }}>
              <Image 
                src="/images/regen/marketing/woman-wellness.png" 
                alt="Woman with glowing skin" 
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
            { stat: '#1', label: 'Antioxidant in body' },
            { stat: 'Direct', label: 'To Bloodstream' },
            { stat: '2-3 mo', label: 'For skin brightening' },
            { stat: '1-2x', label: 'Weekly dosing' },
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
            The Master Antioxidant
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

      {/* How It Works */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>
            How Glutathione Brightens Skin
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Inhibits Tyrosinase', desc: 'Glutathione blocks the enzyme responsible for melanin production in skin cells.' },
              { step: '02', title: 'Neutralizes Free Radicals', desc: 'Protects skin cells from oxidative damage that causes dullness and aging.' },
              { step: '03', title: 'Supports Cell Turnover', desc: 'Promotes healthy skin cell regeneration for a brighter, more even complexion.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl"
                  style={{ backgroundColor: BRAND.teal }}
                >
                  {item.step}
                </div>
                <h3 className="font-bold mb-2" style={{ color: BRAND.cream }}>{item.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
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

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for radiant skin?</h2>
          <p className="text-white/80 mb-8">Start with a free online visit. If approved, your Glutathione injections ship directly to you.</p>
          <Link
            href="/start?goal=vitamins&program=glutathione"
            className="inline-block px-10 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started — $75/month
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
