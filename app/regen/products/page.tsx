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

const VITAMIN_INJECTABLES = [
  {
    id: 'b12',
    name: 'Vitamin B12',
    subtitle: 'Energy & Metabolism',
    description: 'Boost energy, improve focus, and fight fatigue with 100% absorption.',
    price: '$35',
    href: '/products/b12',
    benefits: ['Energy boost', 'Mental clarity', 'Mood support'],
  },
  {
    id: 'biotin',
    name: 'Biotin',
    subtitle: 'Hair, Skin & Nails',
    description: 'Strengthen hair, nails, and skin from within. Great with GLP-1s.',
    price: '$45',
    href: '/products/biotin',
    benefits: ['Hair growth', 'Nail strength', 'Skin health'],
  },
  {
    id: 'glutathione',
    name: 'Glutathione',
    subtitle: 'Detox & Glow',
    description: 'Master antioxidant for radiant skin, detox, and immune support.',
    price: '$75',
    href: '/products/glutathione',
    benefits: ['Skin brightening', 'Detoxification', 'Immune boost'],
  },
  {
    id: 'nad',
    name: 'NAD+',
    subtitle: 'Longevity & Brain',
    description: 'Cellular energy, brain clarity, and healthy aging support.',
    price: '$125',
    href: '/products/nad',
    benefits: ['Cellular energy', 'Mental clarity', 'Anti-aging'],
  },
];

const CATEGORIES = [
  { name: 'Weight Loss', href: '/learn/weight-loss', icon: '📉' },
  { name: 'Peptides', href: '/learn/peptides', icon: '🧬' },
  { name: 'Hormones', href: '/learn/hormones', icon: '⚡' },
  { name: 'Skincare', href: '/learn/skincare', icon: '✨' },
  { name: 'Hair', href: '/learn/hair', icon: '💇' },
  { name: 'Sexual Health', href: '/learn/sexual-health', icon: '💗' },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Navigation */}
      <nav className="border-b px-6 py-4" style={{ borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <Link
            href="/start"
            className="px-6 py-2 text-sm font-bold rounded-full"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.tealDark} 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
            Our Products
          </h1>
          <p className="text-xl" style={{ color: BRAND.gray }}>
            Prescription treatments delivered to your door. Explore our full catalog of telehealth medications.
          </p>
        </div>
      </section>

      {/* Vitamin Injectables Section */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">💉</span>
            <h2 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Vitamin Injectables</h2>
          </div>
          <p className="mb-8 max-w-2xl" style={{ color: BRAND.gray }}>
            Fast-acting nutrients delivered directly to your bloodstream for 100% absorption. 
            Self-injectable at home — no office visits required.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VITAMIN_INJECTABLES.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}
              >
                <div className="mb-4">
                  <span className="text-sm font-medium" style={{ color: BRAND.teal }}>{product.subtitle}</span>
                  <h3 className="text-xl font-bold" style={{ color: BRAND.cream }}>{product.name}</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.benefits.map((b) => (
                    <span key={b} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black" style={{ color: BRAND.pink }}>{product.price}<span className="text-sm font-normal" style={{ color: BRAND.gray }}>/mo</span></span>
                  <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform" style={{ color: BRAND.teal }}>
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Protocols */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">✨</span>
            <h2 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Featured Protocols</h2>
          </div>
          
          <Link
            href="/products/fountain-of-youth"
            className="block rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a2e2b 100%)`,
              border: `2px solid ${BRAND.teal}40`,
            }}
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink }}
                  >
                    Anti-Aging Protocol
                  </span>
                  <h3 className="text-3xl font-bold mb-2" style={{ color: BRAND.cream }}>
                    Fountain of Youth
                  </h3>
                  <p className="text-lg mb-4" style={{ color: BRAND.teal }}>
                    Epitalon + GHK-Cu
                  </p>
                  <p className="max-w-xl" style={{ color: BRAND.gray }}>
                    A powerful peptide stack targeting cellular longevity and skin regeneration. 
                    Telomerase activation meets collagen synthesis for comprehensive anti-aging support.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-sm uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Starting at</div>
                  <div className="text-4xl font-black" style={{ color: BRAND.cream }}>$349<span className="text-lg font-normal">/mo</span></div>
                  <div 
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full font-bold"
                    style={{ backgroundColor: BRAND.pink, color: 'white' }}
                  >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.cream }}>Explore All Programs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="p-4 rounded-xl text-center transition-all hover:scale-105"
                style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <span className="text-sm font-medium" style={{ color: BRAND.cream }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why REGEN RX */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ color: BRAND.cream }}>Why REGEN RX?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🏥', title: 'Licensed Providers', desc: 'Illinois FPA Nurse Practitioner with MD oversight' },
              { icon: '💊', title: 'FDA Pharmacies', desc: 'Compounded by 503A registered pharmacies' },
              { icon: '🚚', title: 'Free Shipping', desc: 'Delivered discreetly to your door' },
            ].map((item) => (
              <div key={item.title}>
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold mb-1" style={{ color: BRAND.cream }}>{item.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start?</h2>
          <p className="text-white/80 mb-8">Complete your free online visit in 5 minutes.</p>
          <Link
            href="/start"
            className="inline-block px-10 py-4 font-bold rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ backgroundColor: BRAND.dark, color: BRAND.gray }}>
        <p className="text-sm">REGEN RX • Illinois Telehealth • <a href="tel:+16306366193" className="underline">(630) 636-6193</a></p>
        <p className="text-xs mt-4 max-w-2xl mx-auto" style={{ color: '#555', lineHeight: 1.6 }}>
          <strong>DISCLAIMER:</strong> Information provided is for educational purposes only and is not medical advice. 
          Compounded medications are not FDA-approved but are prepared by FDA-registered pharmacies. 
          Treatments may be prescribed off-label. Results vary. Not all patients qualify.
        </p>
        <p className="text-xs mt-4" style={{ color: '#666' }}>© {new Date().getFullYear()} Hello Gorgeous PC</p>
      </footer>
    </div>
  );
}
