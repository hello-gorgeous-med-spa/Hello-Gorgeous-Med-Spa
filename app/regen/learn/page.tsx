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

const CATEGORIES = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    subtitle: 'GLP-1 Medications',
    description: 'Learn how semaglutide and tirzepatide work to suppress appetite, regulate blood sugar, and promote sustainable weight loss.',
    icon: '📉',
    href: '/learn/weight-loss',
    topics: ['How GLP-1s work', 'Semaglutide vs Tirzepatide', 'What to expect', 'Side effects', 'Who qualifies'],
    color: BRAND.teal,
  },
  {
    id: 'peptides',
    title: 'Peptide Therapy',
    subtitle: 'Recovery & Performance',
    description: 'Discover how research peptides like BPC-157, Sermorelin, and NAD+ support healing, energy, and longevity.',
    icon: '🧬',
    href: '/learn/peptides',
    topics: ['What are peptides?', 'BPC-157 for healing', 'Growth hormone support', 'NAD+ & cellular energy', 'Safety & research'],
    color: BRAND.pink,
  },
  {
    id: 'hormones',
    title: 'Hormone Therapy',
    subtitle: 'HRT & Optimization',
    description: 'Understand how bioidentical hormone replacement can restore energy, mood, libido, and overall vitality.',
    icon: '⚡',
    href: '/learn/hormones',
    topics: ['Signs of hormone imbalance', 'Women\'s HRT', 'Men\'s TRT', 'Bioidentical vs synthetic', 'Monitoring & safety'],
    color: BRAND.teal,
  },
  {
    id: 'skincare',
    title: 'Prescription Skincare',
    subtitle: 'Medical-Grade Anti-Aging',
    description: 'Explore prescription-strength treatments like tretinoin, hydroquinone, and GHK-Cu peptides for real results.',
    icon: '✨',
    href: '/learn/skincare',
    topics: ['Tretinoin explained', 'Hydroquinone for pigmentation', 'GHK-Cu peptides', 'Building a routine', 'What to expect'],
    color: BRAND.pink,
  },
  {
    id: 'hair',
    title: 'Hair Restoration',
    subtitle: 'Prescription Hair Growth',
    description: 'Learn about finasteride, minoxidil, and advanced compounds that can stop hair loss and promote regrowth.',
    icon: '💇',
    href: '/learn/hair',
    topics: ['How hair loss works', 'Finasteride (DHT blockers)', 'Minoxidil (growth stimulator)', 'Combination therapy', 'Timeline & expectations'],
    color: BRAND.teal,
  },
  {
    id: 'vitamins',
    title: 'Vitamin Injectables',
    subtitle: 'Energy & Wellness Shots',
    description: 'Fast-acting nutrients like B12, Biotin, Glutathione, and NAD+ — delivered straight to your cells for maximum absorption.',
    icon: '💉',
    href: '/learn/vitamins',
    topics: ['Why injectable vs oral', 'B12 for energy', 'Biotin for hair & nails', 'Glutathione for detox & glow', 'NAD+ for longevity'],
    color: BRAND.teal,
  },
  {
    id: 'sexual-health',
    title: 'Sexual Wellness',
    subtitle: 'Intimacy & Performance',
    description: 'Discreet, effective solutions for desire, performance, and confidence — for both men and women.',
    icon: '💗',
    href: '/learn/sexual-health',
    topics: ['ED medications explained', 'PT-141 for desire', 'Women\'s arousal support', 'How they work', 'Safety considerations'],
    color: BRAND.pink,
  },
];

const TRUST_POINTS = [
  { icon: '🏥', title: 'Licensed Providers', desc: 'Illinois FPA Nurse Practitioner with MD oversight' },
  { icon: '💊', title: 'FDA-Registered Pharmacies', desc: '503A compounding partners like BoomRx' },
  { icon: '📋', title: 'Real Prescriptions', desc: 'Legitimate telehealth — not research chemicals' },
  { icon: '🔒', title: 'HIPAA Compliant', desc: 'Your health information is protected' },
];

export default function LearnHubPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm font-medium" style={{ color: BRAND.teal }}>Learn</Link>
            <Link href="/start" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${BRAND.darkAlt} 0%, ${BRAND.dark} 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <span 
            className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
          >
            Education Center
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: BRAND.cream }}>
            Understand your options.
            <br />
            <span style={{ color: BRAND.teal }}>Make informed decisions.</span>
          </h1>
          <p className="text-xl" style={{ color: BRAND.gray }}>
            We believe in transparency. Learn how each treatment works, who it&apos;s for, 
            and what to expect — before you start.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${cat.color}30` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: cat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: cat.color }}>{cat.subtitle}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>{cat.title}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.topics.slice(0, 3).map((topic) => (
                    <span 
                      key={topic} 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {topic}
                    </span>
                  ))}
                  {cat.topics.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full" style={{ color: BRAND.gray }}>
                      +{cat.topics.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>Why trust REGEN RX?</h2>
            <p style={{ color: BRAND.gray }}>We&apos;re a real medical practice — not a gray-market supplier.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="text-center p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-3xl mb-3 block">{point.icon}</span>
                <h3 className="font-bold mb-1" style={{ color: BRAND.cream }}>{point.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>Ready to get started?</h2>
          <p className="mb-8" style={{ color: BRAND.gray }}>
            Complete a free online visit. A licensed provider will review your information 
            and determine if treatment is right for you.
          </p>
          <Link
            href="/start"
            className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start Your Free Visit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ backgroundColor: BRAND.dark, borderColor: `${BRAND.teal}15` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={100} height={35} className="h-7 w-auto" />
            <span style={{ color: BRAND.gray }}>Renew. Rebalance. Regenerate.</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: BRAND.gray }}>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <a href="tel:+16306366193" className="hover:text-white">(630) 636-6193</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
