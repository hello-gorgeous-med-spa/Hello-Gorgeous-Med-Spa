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

const MEDICATIONS = [
  {
    name: 'Semaglutide',
    brandNames: 'Same active ingredient as Ozempic® & Wegovy®',
    howItWorks: 'Mimics GLP-1 hormone to reduce appetite, slow gastric emptying, and improve blood sugar regulation.',
    typicalResults: '10-15% body weight loss over 12-16 weeks',
    dosing: 'Weekly injection, starting low and titrating up',
    price: '$299/month',
    sideEffects: ['Nausea (usually temporary)', 'Constipation', 'Fatigue', 'Injection site reactions'],
  },
  {
    name: 'Tirzepatide',
    brandNames: 'Same active ingredient as Mounjaro® & Zepbound®',
    howItWorks: 'Dual-action GLP-1 + GIP receptor agonist for enhanced appetite control and metabolic benefits.',
    typicalResults: '15-22% body weight loss over 12-16 weeks',
    dosing: 'Weekly injection, starting low and titrating up',
    price: '$399/month',
    sideEffects: ['Nausea (usually temporary)', 'Diarrhea', 'Decreased appetite', 'Injection site reactions'],
  },
];

const FAQS = [
  {
    q: 'How do GLP-1 medications work?',
    a: 'GLP-1 (glucagon-like peptide-1) receptor agonists mimic a naturally occurring hormone that regulates appetite and blood sugar. They slow stomach emptying, reduce hunger signals to your brain, and help you feel satisfied with smaller portions.',
  },
  {
    q: 'Who qualifies for GLP-1 treatment?',
    a: 'Generally, candidates have a BMI of 27+ with weight-related health conditions (like high blood pressure or diabetes), or a BMI of 30+. Our providers will review your complete health history to determine if you\'re a good fit.',
  },
  {
    q: 'What results can I expect?',
    a: 'Clinical studies show average weight loss of 10-20% of body weight over 12-16 weeks. Results vary based on starting weight, lifestyle factors, and medication compliance. Most patients notice reduced appetite within the first 2 weeks.',
  },
  {
    q: 'Are compounded GLP-1s the same as brand-name?',
    a: 'Compounded semaglutide and tirzepatide contain the same active ingredients as Ozempic®, Wegovy®, Mounjaro®, and Zepbound®. They\'re prepared by FDA-registered 503A compounding pharmacies when brand-name medications are in shortage or cost-prohibitive.',
  },
  {
    q: 'What are the side effects?',
    a: 'The most common side effects are GI-related: nausea, constipation, and decreased appetite. These typically improve as your body adjusts. Starting with a low dose and titrating slowly helps minimize side effects.',
  },
  {
    q: 'How long do I need to take it?',
    a: 'GLP-1 medications work while you take them. Many patients use them for 6-12 months to reach their goal, then work with their provider on a maintenance plan. Some continue long-term for weight maintenance.',
  },
];

export default function WeightLossLearnPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm font-medium" style={{ color: BRAND.gray }}>← Back to Learn</Link>
            <Link href="/start?goal=weight-loss" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 px-6" style={{ background: `linear-gradient(180deg, ${BRAND.darkAlt} 0%, ${BRAND.dark} 100%)` }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/learn" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-80" style={{ color: BRAND.teal }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Education Center
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">📉</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.teal }}>GLP-1 Medications</p>
              <h1 className="text-4xl font-black" style={{ color: BRAND.cream }}>Weight Loss</h1>
            </div>
          </div>
          <p className="text-xl max-w-2xl" style={{ color: BRAND.gray }}>
            Semaglutide and tirzepatide are prescription medications that help you lose weight 
            by reducing appetite and improving how your body processes food.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>How GLP-1 Medications Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Reduces Appetite', desc: 'Signals your brain that you\'re full, so you naturally eat less without feeling deprived.' },
              { num: '02', title: 'Slows Digestion', desc: 'Food stays in your stomach longer, keeping you satisfied between meals.' },
              { num: '03', title: 'Regulates Blood Sugar', desc: 'Improves insulin response and reduces blood sugar spikes after eating.' },
            ].map((step) => (
              <div key={step.num} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-3xl font-black mb-3 block" style={{ color: BRAND.teal }}>{step.num}</span>
                <h3 className="font-bold mb-2" style={{ color: BRAND.cream }}>{step.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medications Comparison */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Compare Medications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {MEDICATIONS.map((med) => (
              <div key={med.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30` }}>
                <h3 className="text-2xl font-bold mb-1" style={{ color: BRAND.cream }}>{med.name}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.teal }}>{med.brandNames}</p>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>How It Works</p>
                    <p className="text-sm" style={{ color: BRAND.cream }}>{med.howItWorks}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Typical Results</p>
                    <p className="text-sm font-semibold" style={{ color: BRAND.teal }}>{med.typicalResults}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Dosing</p>
                    <p className="text-sm" style={{ color: BRAND.cream }}>{med.dosing}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.gray }}>Common Side Effects</p>
                    <div className="flex flex-wrap gap-2">
                      {med.sideEffects.map((se) => (
                        <span key={se} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${BRAND.pink}15`, color: BRAND.pink }}>
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: `${BRAND.teal}20` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: BRAND.pink }}>{med.price}</span>
                      <Link 
                        href="/start?goal=weight-loss" 
                        className="px-4 py-2 text-sm font-bold rounded-full"
                        style={{ backgroundColor: BRAND.teal, color: 'white' }}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>What to Expect</h2>
          <div className="space-y-4">
            {[
              { week: 'Week 1-2', title: 'Starting Phase', desc: 'Begin with a low dose. You may notice reduced appetite and mild GI symptoms as your body adjusts.' },
              { week: 'Week 3-4', title: 'Dose Increase', desc: 'Gradually increase to therapeutic dose. Appetite suppression becomes more noticeable. Some patients see 3-5 lbs lost.' },
              { week: 'Week 5-8', title: 'Weight Loss Accelerates', desc: 'Full therapeutic effect kicks in. Expect steady weight loss of 1-2 lbs per week. Cravings significantly reduced.' },
              { week: 'Week 9-16', title: 'Continued Progress', desc: 'Most patients reach 10-15% body weight loss. Energy improves. Clothing fits differently. Lab markers may improve.' },
            ].map((phase, idx) => (
              <div key={phase.week} className="flex gap-6 p-4 rounded-xl" style={{ backgroundColor: BRAND.darkAlt }}>
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="text-sm font-bold" style={{ color: BRAND.teal }}>{phase.week}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: BRAND.cream }}>{phase.title}</h3>
                  <p className="text-sm" style={{ color: BRAND.gray }}>{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Frequently Asked Questions</h2>
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
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your weight loss journey?</h2>
          <p className="text-white/80 mb-8">
            Complete a free online visit. Our licensed providers will review your health history 
            and determine if GLP-1 medication is right for you.
          </p>
          <Link
            href="/start?goal=weight-loss"
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
          <p className="text-xs mb-4" style={{ color: BRAND.gray }}>
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and does not constitute medical advice. 
            Always consult with a qualified healthcare provider before starting any medication. Individual results may vary.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm" style={{ color: BRAND.gray }}>
            <Link href="/learn" className="hover:text-white">Education Center</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
