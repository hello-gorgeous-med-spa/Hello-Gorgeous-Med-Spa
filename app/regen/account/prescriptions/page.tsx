'use client';

import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function PrescriptionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Prescriptions</h1>
        <p style={{ color: BRAND.gray }}>View and manage your active prescriptions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: `${BRAND.teal}20` }}>
        {['Active', 'Past'].map((tab, idx) => (
          <button
            key={tab}
            className="px-6 py-3 text-sm font-medium transition-all relative"
            style={{ color: idx === 0 ? BRAND.teal : BRAND.gray }}
          >
            {tab}
            {idx === 0 && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: BRAND.teal }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div 
        className="p-12 rounded-xl text-center"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid ${BRAND.teal}20`,
        }}
      >
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${BRAND.pink}10` }}
        >
          <svg className="w-10 h-10" style={{ color: BRAND.pink }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>No prescriptions yet</h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
          Once your provider reviews and approves your visit, your prescriptions will appear here.
          You&apos;ll be able to see dosing instructions, refill dates, and more.
        </p>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
          style={{ backgroundColor: BRAND.pink, color: 'white' }}
        >
          Start Your Visit
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Programs */}
      <div>
        <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Available Programs</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: 'Weight Loss', desc: 'GLP-1 medications like Semaglutide & Tirzepatide', price: '$299/mo' },
            { name: 'Hormone Therapy', desc: 'Bioidentical hormone optimization', price: '$149/mo' },
            { name: 'Peptide Therapy', desc: 'BPC-157, Sermorelin, NAD+ and more', price: '$199/mo' },
            { name: 'Sexual Wellness', desc: 'Solutions for performance and desire', price: '$49/mo' },
          ].map((program) => (
            <Link
              key={program.name}
              href="/start"
              className="p-5 rounded-xl transition-all hover:scale-[1.02] group"
              style={{ 
                backgroundColor: BRAND.darkCard,
                border: `1px solid ${BRAND.teal}20`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold" style={{ color: BRAND.cream }}>{program.name}</h4>
                <span className="font-bold" style={{ color: BRAND.pink }}>{program.price}</span>
              </div>
              <p className="text-sm" style={{ color: BRAND.gray }}>{program.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: BRAND.teal }}>
                Get started
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
