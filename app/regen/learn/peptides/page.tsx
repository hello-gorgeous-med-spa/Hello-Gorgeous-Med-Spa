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

const PEPTIDES = [
  {
    name: 'BPC-157',
    category: 'Healing & Recovery',
    description: 'Body Protection Compound-157 is a synthetic peptide derived from a protein found in gastric juice. Research suggests it promotes healing of tendons, ligaments, muscles, and gut tissue.',
    benefits: ['Accelerate injury recovery', 'Support gut health', 'Reduce inflammation', 'Promote tissue repair'],
    dosing: 'Subcutaneous injection, typically 250-500mcg daily',
    research: 'Extensive animal studies; human trials ongoing',
    price: '$300/vial',
  },
  {
    name: 'TB-500 (Thymosin Beta-4)',
    category: 'Healing & Recovery',
    description: 'A naturally occurring peptide that plays a role in tissue repair and regeneration. Used for injury recovery and reducing inflammation.',
    benefits: ['Speed wound healing', 'Reduce scar tissue', 'Improve flexibility', 'Support cardiac function'],
    dosing: 'Subcutaneous injection, loading phase then maintenance',
    research: 'Animal studies and clinical observations',
    price: '$300/vial',
  },
  {
    name: 'Sermorelin',
    category: 'Growth Hormone Support',
    description: 'A growth hormone-releasing hormone (GHRH) analog that stimulates your pituitary gland to produce more natural growth hormone.',
    benefits: ['Improved sleep quality', 'Increased energy', 'Better body composition', 'Enhanced recovery'],
    dosing: 'Subcutaneous injection before bed',
    research: 'Used clinically for GH assessment; compounded for optimization protocols',
    price: '$225/vial',
  },
  {
    name: 'CJC-1295 / Ipamorelin',
    category: 'Growth Hormone Support',
    description: 'A combination peptide stack that works synergistically to boost growth hormone levels. CJC-1295 extends GH release while Ipamorelin triggers it.',
    benefits: ['Lean muscle gain', 'Fat loss', 'Improved recovery', 'Better sleep'],
    dosing: 'Subcutaneous injection, typically before bed',
    research: 'Clinical studies on individual peptides',
    price: '$375/vial',
  },
  {
    name: 'NAD+',
    category: 'Cellular Energy & Longevity',
    description: 'Nicotinamide adenine dinucleotide — a coenzyme essential for cellular energy production. Levels decline with age, and supplementation may support longevity.',
    benefits: ['Increased energy', 'Mental clarity', 'DNA repair support', 'Anti-aging effects'],
    dosing: 'Subcutaneous injection or IV infusion',
    research: 'Growing body of longevity research',
    price: '$225/vial',
  },
  {
    name: 'GHK-Cu',
    category: 'Skin & Tissue Repair',
    description: 'A copper peptide that naturally occurs in plasma, saliva, and urine. Promotes collagen synthesis, wound healing, and has anti-inflammatory properties.',
    benefits: ['Skin rejuvenation', 'Wound healing', 'Hair growth support', 'Anti-inflammatory'],
    dosing: 'Topical cream or subcutaneous injection',
    research: 'Extensive research on skin and tissue repair',
    price: '$300/vial (injection) or $275/tube (cream)',
  },
];

const FAQS = [
  {
    q: 'What are peptides?',
    a: 'Peptides are short chains of amino acids — the building blocks of proteins. They act as signaling molecules in your body, triggering specific biological processes like healing, hormone release, or tissue repair.',
  },
  {
    q: 'Are peptides safe?',
    a: 'When prescribed by a licensed provider and sourced from FDA-registered pharmacies, peptides have a good safety profile. Side effects are generally mild (injection site reactions, temporary water retention). Your provider will review your health history to ensure safety.',
  },
  {
    q: 'How are peptides different from steroids?',
    a: 'Peptides work by stimulating your body\'s natural processes — they signal your glands to produce hormones or trigger healing cascades. Steroids directly introduce synthetic hormones. Peptides are generally considered a gentler, more physiological approach.',
  },
  {
    q: 'How long until I see results?',
    a: 'It varies by peptide. BPC-157 users often notice faster recovery within 1-2 weeks. Growth hormone peptides like Sermorelin may take 4-8 weeks for full effects (better sleep is often noticed sooner). NAD+ can provide energy benefits within days.',
  },
  {
    q: 'Do I need to inject peptides?',
    a: 'Most peptides are administered via subcutaneous injection (tiny needle, like insulin). Some, like GHK-Cu, are available as topical creams. Oral peptides are generally less effective due to digestive breakdown.',
  },
];

export default function PeptidesLearnPage() {
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
            <Link href="/start?goal=peptides" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
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
            <span className="text-5xl">🧬</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.pink }}>Recovery & Performance</p>
              <h1 className="text-4xl font-black" style={{ color: BRAND.cream }}>Peptide Therapy</h1>
            </div>
          </div>
          <p className="text-xl max-w-2xl" style={{ color: BRAND.gray }}>
            Peptides are signaling molecules that can support healing, boost growth hormone, 
            enhance energy, and promote longevity — working with your body&apos;s natural systems.
          </p>
        </div>
      </section>

      {/* What Are Peptides */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.cream }}>What Are Peptides?</h2>
              <p className="mb-4" style={{ color: BRAND.gray }}>
                Peptides are short chains of amino acids — typically 2-50 amino acids linked together. 
                They&apos;re smaller than proteins but act as powerful signaling molecules in your body.
              </p>
              <p className="mb-4" style={{ color: BRAND.gray }}>
                Your body naturally produces many peptides that regulate everything from growth hormone 
                release to wound healing to inflammation control. Therapeutic peptides are designed to 
                mimic or enhance these natural signals.
              </p>
              <p style={{ color: BRAND.gray }}>
                Unlike steroids or synthetic hormones, peptides work <em>with</em> your body — they 
                trigger your own glands and cells to do what they&apos;re designed to do, just more 
                effectively.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Healing', desc: 'BPC-157, TB-500' },
                { label: 'Growth Hormone', desc: 'Sermorelin, CJC/Ipamorelin' },
                { label: 'Longevity', desc: 'NAD+, Epithalon' },
                { label: 'Skin & Hair', desc: 'GHK-Cu, Melanotan' },
              ].map((cat) => (
                <div key={cat.label} className="p-4 rounded-xl text-center" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                  <p className="font-bold" style={{ color: BRAND.cream }}>{cat.label}</p>
                  <p className="text-xs" style={{ color: BRAND.teal }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Peptide Catalog */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.cream }}>Our Peptide Catalog</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PEPTIDES.map((pep) => (
              <div key={pep.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.pink}20` }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND.pink }}>{pep.category}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>{pep.name}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{pep.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.gray }}>Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {pep.benefits.map((b) => (
                      <span key={b} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Dosing</p>
                    <p style={{ color: BRAND.cream }}>{pep.dosing}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Research</p>
                    <p style={{ color: BRAND.cream }}>{pep.research}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${BRAND.teal}20` }}>
                  <span className="text-lg font-bold" style={{ color: BRAND.pink }}>{pep.price}</span>
                  <Link 
                    href="/start?goal=peptides"
                    className="text-xs font-bold px-3 py-2 rounded-full"
                    style={{ backgroundColor: BRAND.teal, color: 'white' }}
                  >
                    Learn More
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
          <h2 className="text-3xl font-bold text-white mb-4">Interested in peptide therapy?</h2>
          <p className="text-white/80 mb-8">
            Our providers will help you understand which peptides are right for your goals — 
            whether it&apos;s recovery, energy, longevity, or body composition.
          </p>
          <Link
            href="/start?goal=peptides"
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
          <p className="text-xs mb-4" style={{ color: BRAND.gray }}>
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only. 
            Peptides are prescription medications that require evaluation by a licensed provider. 
            Individual results may vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
