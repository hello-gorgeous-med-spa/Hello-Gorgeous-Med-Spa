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

const PRODUCTS = [
  {
    name: 'Tretinoin',
    aka: 'Retin-A, Retinoid',
    category: 'Anti-Aging & Acne',
    description: 'The gold standard of prescription skincare. Tretinoin is a vitamin A derivative that accelerates cell turnover, boosts collagen, and treats both acne and signs of aging.',
    benefits: ['Reduces fine lines & wrinkles', 'Treats acne', 'Evens skin tone', 'Stimulates collagen'],
    strengths: '0.015% - 0.15%',
    timeline: 'Initial results in 4-6 weeks; full benefits at 3-6 months',
    price: '$125',
    tips: 'Start low and slow. Apply at night. Always use SPF during the day.',
  },
  {
    name: 'Tretinoin + Niacinamide + HA',
    aka: 'Custom Blend',
    category: 'Anti-Aging',
    description: 'Tretinoin combined with hydrating and barrier-supporting ingredients. Niacinamide brightens and calms, while hyaluronic acid maintains hydration.',
    benefits: ['Anti-aging with less irritation', 'Brightening', 'Hydrating', 'Barrier support'],
    strengths: '0.025-0.045% tretinoin',
    timeline: 'Results in 6-8 weeks',
    price: '$175',
    tips: 'Great for retinoid beginners or those with sensitive skin.',
  },
  {
    name: 'Hydroquinone',
    aka: 'HQ',
    category: 'Pigmentation & Brightening',
    description: 'The most effective prescription treatment for hyperpigmentation. Hydroquinone inhibits melanin production to fade dark spots, melasma, and post-inflammatory discoloration.',
    benefits: ['Fades dark spots', 'Treats melasma', 'Evens skin tone', 'Post-acne marks'],
    strengths: '4-8%',
    timeline: 'Visible improvement in 4-8 weeks',
    price: '$175',
    tips: 'Use for 3-4 month cycles with breaks. Sun protection is critical.',
  },
  {
    name: 'ClearTone',
    aka: 'Azelaic + HQ + Kojic + Tranexamic + Niacinamide',
    category: 'Pigmentation & Brightening',
    description: 'A multi-acid brightening powerhouse. Combines five active ingredients to target hyperpigmentation from multiple angles.',
    benefits: ['Maximum brightening', 'Treats stubborn melasma', 'Anti-inflammatory', 'Prevents new spots'],
    strengths: '10/4/2/5/4%',
    timeline: 'Results in 6-12 weeks',
    price: '$275',
    tips: 'Our strongest brightening formula. Good for resistant hyperpigmentation.',
  },
  {
    name: 'GHK-Cu Copper Peptide',
    aka: 'Copper Peptide',
    category: 'Anti-Aging & Repair',
    description: 'A naturally occurring peptide that promotes collagen synthesis, wound healing, and has anti-inflammatory effects. Research shows it can remodel aged skin.',
    benefits: ['Stimulates collagen', 'Firms & tightens', 'Wound healing', 'Reduces inflammation'],
    strengths: '0.5%',
    timeline: 'Gradual improvement over 8-12 weeks',
    price: '$275',
    tips: 'Can be combined with tretinoin (different times of day).',
  },
  {
    name: 'Refine PM',
    aka: 'GHK-Cu + Tretinoin + Vitamin E + HA',
    category: 'Anti-Aging',
    description: 'Our premium nighttime anti-aging formula. Combines copper peptide with tretinoin and antioxidants for comprehensive skin renewal.',
    benefits: ['Collagen boost', 'Fine line reduction', 'Skin renewal', 'Hydration'],
    strengths: '0.5% GHK-Cu + 0.05% tretinoin',
    timeline: 'Results in 8-12 weeks',
    price: '$275',
    tips: 'Ideal as your primary nighttime treatment.',
  },
  {
    name: 'LuminEye',
    aka: 'GHK-Cu + Caffeine + Tranexamic + HA',
    category: 'Eye Area',
    description: 'Specifically formulated for the delicate under-eye area. Targets dark circles, puffiness, and fine lines with peptides and brightening agents.',
    benefits: ['Reduces dark circles', 'Decreases puffiness', 'Firms eye area', 'Brightens'],
    strengths: '0.5% GHK-Cu + 3% tranexamic',
    timeline: 'Improvement in 4-8 weeks',
    price: '$275',
    tips: 'Apply gently with ring finger. Morning and/or night.',
  },
  {
    name: 'Clarity Cream',
    aka: 'Azelaic + Niacinamide + Clindamycin + Tretinoin',
    category: 'Acne & Rosacea',
    description: 'A comprehensive acne and rosacea treatment. Combines antibacterial, anti-inflammatory, and retinoid action in one formula.',
    benefits: ['Treats acne', 'Reduces redness', 'Kills bacteria', 'Prevents breakouts'],
    strengths: '10/4/2/0.1%',
    timeline: 'Improvement in 4-6 weeks',
    price: '$275',
    tips: 'Great for adult acne and combination skin issues.',
  },
];

const ROUTINE = [
  { step: 'Cleanser', time: 'AM & PM', note: 'Gentle, non-stripping' },
  { step: 'Prescription Treatment', time: 'PM', note: 'Tretinoin, hydroquinone, or custom blend' },
  { step: 'Moisturizer', time: 'AM & PM', note: 'Especially important with retinoids' },
  { step: 'SPF 30+', time: 'AM', note: 'Non-negotiable with any prescription actives' },
];

export default function SkincareLearnPage() {
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
            <Link href="/start?goal=skincare" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
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
            <span className="text-5xl">✨</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.pink }}>Medical-Grade Anti-Aging</p>
              <h1 className="text-4xl font-black" style={{ color: BRAND.cream }}>Prescription Skincare</h1>
            </div>
          </div>
          <p className="text-xl max-w-2xl" style={{ color: BRAND.gray }}>
            Over-the-counter products can only do so much. Prescription treatments like tretinoin, 
            hydroquinone, and custom compounds deliver results that cosmetic products can&apos;t match.
          </p>
        </div>
      </section>

      {/* Why Prescription */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Why Prescription Skincare?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Higher Concentrations', desc: 'Prescription formulas use active ingredients at levels not available over-the-counter — where the real results happen.' },
              { title: 'Proven Results', desc: 'Tretinoin has 40+ years of research. These aren\'t trendy ingredients — they\'re the ones dermatologists actually use.' },
              { title: 'Custom Compounds', desc: 'Compounding pharmacies can create personalized blends with multiple actives, tailored to your specific concerns.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <h3 className="font-bold mb-2" style={{ color: BRAND.teal }}>{item.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.cream }}>Our Skincare Catalog</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PRODUCTS.map((prod) => (
              <div key={prod.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.pink}20` }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND.pink }}>{prod.category}</p>
                <h3 className="text-xl font-bold" style={{ color: BRAND.cream }}>{prod.name}</h3>
                <p className="text-xs mb-3" style={{ color: BRAND.teal }}>{prod.aka}</p>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{prod.description}</p>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {prod.benefits.map((b) => (
                      <span key={b} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div>
                    <p className="uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Strengths</p>
                    <p style={{ color: BRAND.cream }}>{prod.strengths}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Timeline</p>
                    <p style={{ color: BRAND.cream }}>{prod.timeline}</p>
                  </div>
                </div>

                <p className="text-xs mb-4 italic" style={{ color: BRAND.gray }}>
                  <strong>Tip:</strong> {prod.tips}
                </p>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${BRAND.teal}20` }}>
                  <span className="text-lg font-bold" style={{ color: BRAND.pink }}>{prod.price}</span>
                  <Link 
                    href="/start?goal=skincare"
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

      {/* Basic Routine */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Basic Prescription Skincare Routine</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {ROUTINE.map((step, idx) => (
              <div key={step.step} className="p-4 rounded-xl text-center" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-2xl font-black block mb-2" style={{ color: BRAND.teal }}>{idx + 1}</span>
                <h3 className="font-bold" style={{ color: BRAND.cream }}>{step.step}</h3>
                <p className="text-xs" style={{ color: BRAND.pink }}>{step.time}</p>
                <p className="text-xs mt-2" style={{ color: BRAND.gray }}>{step.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.pink }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for real skincare results?</h2>
          <p className="text-white/80 mb-8">
            Tell us about your skin concerns. Our providers will recommend the right 
            prescription treatment for your goals.
          </p>
          <Link
            href="/start?goal=skincare"
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
            <strong>Note:</strong> Prescription skincare requires evaluation by a licensed provider. 
            Results vary. Sun protection is essential with any prescription actives.
          </p>
        </div>
      </footer>
    </div>
  );
}
