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

const CREDENTIALS = [
  {
    icon: '🏥',
    title: 'Illinois Licensed',
    description: 'Our Nurse Practitioner holds Full Practice Authority (FPA) in Illinois, allowing independent practice without physician supervision for most services.',
  },
  {
    icon: '👨‍⚕️',
    title: 'MD Oversight',
    description: 'Board-certified physician oversight for clinical protocols, quality assurance, and complex cases requiring additional expertise.',
  },
  {
    icon: '💊',
    title: 'FDA-Registered Pharmacies',
    description: 'We partner exclusively with 503A compounding pharmacies that are FDA-registered and state-licensed. No gray-market suppliers.',
  },
  {
    icon: '📋',
    title: 'Real Prescriptions',
    description: 'Every medication is a legitimate prescription filled by a licensed pharmacy and shipped directly to you. No "research chemicals."',
  },
  {
    icon: '🔒',
    title: 'HIPAA Compliant',
    description: 'Your health information is protected by HIPAA regulations. We use encrypted, secure telehealth infrastructure.',
  },
  {
    icon: '📍',
    title: 'Local Practice',
    description: 'Based in Oswego, Illinois. Not an anonymous online service — we\'re a real medical practice with a physical location.',
  },
];

const PHARMACIES = [
  {
    name: 'Formulation Rx',
    type: '503A Compounding Pharmacy',
    description: 'Our exclusive pharmacy partner. FDA-registered, state-licensed compounding pharmacy specializing in GLP-1s, peptides, hormones, and custom formulations. Powered by FormuConnect for seamless ordering and real-time tracking.',
    location: 'Lewisville, TX · FDA-Registered',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Online Health Questionnaire',
    description: 'Answer detailed health questions about your medical history, current medications, and treatment goals.',
  },
  {
    step: '02',
    title: 'Provider Review',
    description: 'A licensed Illinois provider reviews your information within 24-48 hours. They may ask follow-up questions.',
  },
  {
    step: '03',
    title: 'Labs (If Needed)',
    description: 'Some treatments require baseline labs. We can order them or review recent results you already have.',
  },
  {
    step: '04',
    title: 'Prescription & Shipment',
    description: 'If appropriate, your provider writes a prescription. The pharmacy compounds and ships directly to you.',
  },
  {
    step: '05',
    title: 'Ongoing Support',
    description: 'Message your provider with questions. Schedule follow-ups as needed. Adjust treatment based on your response.',
  },
];

export default function ProvidersPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={50} className="h-12 w-auto brightness-110" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm font-medium" style={{ color: BRAND.gray }}>Learn</Link>
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
            About REGEN RX
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: BRAND.cream }}>
            Real providers.
            <br />
            <span style={{ color: BRAND.teal }}>Real prescriptions.</span>
          </h1>
          <p className="text-xl" style={{ color: BRAND.gray }}>
            REGEN RX is a telehealth platform operated by Hello Gorgeous Med Spa — 
            a licensed Illinois medical practice. Not an anonymous online pharmacy.
          </p>
        </div>
      </section>

      {/* Our Practice */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.cream }}>Hello Gorgeous Med Spa</h2>
              <p className="mb-4" style={{ color: BRAND.gray }}>
                We&apos;re a medical aesthetics practice in Oswego, Illinois, serving the Fox Valley area 
                since 2019. REGEN RX is our telehealth platform, bringing the same quality care 
                to patients across Illinois who can&apos;t visit in person.
              </p>
              <p className="mb-4" style={{ color: BRAND.gray }}>
                Our clinical team includes a Full Practice Authority Nurse Practitioner — meaning 
                she can diagnose, treat, and prescribe independently under Illinois law — with 
                physician oversight for complex cases.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.teal }}>
                  <span>📍</span> Oswego, Illinois
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.teal }}>
                  <span>📞</span> (630) 636-6193
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}>
              <p className="text-sm uppercase tracking-wider mb-2" style={{ color: BRAND.teal }}>Featured on</p>
              <p className="font-bold text-lg mb-2" style={{ color: BRAND.cream }}>Peptide Provider Hub</p>
              <p className="text-sm mb-4" style={{ color: BRAND.gray }}>
                &quot;Hello Gorgeous Med Spa — Medical provider · Oswego, Illinois · 
                Prescription / clinical · Compounded · Questionnaire and clinician visit · 29+ tracked items&quot;
              </p>
              <p className="text-xs" style={{ color: BRAND.gray }}>
                We&apos;re listed as a legitimate prescription provider on peptideproviderhub.com, 
                the leading directory for peptide therapy providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Provider - Ryan Kent */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span 
              className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
            >
              Meet Your Provider
            </span>
            <h2 className="text-3xl md:text-4xl font-black" style={{ color: BRAND.cream }}>
              Backed by clinical expertise
            </h2>
          </div>

          <div 
            className="rounded-3xl p-8 md:p-12"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #0d1f1d 100%)`,
              border: `2px solid ${BRAND.teal}30`,
            }}
          >
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Photo/Avatar */}
              <div className="text-center">
                <div 
                  className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${BRAND.teal} 0%, ${BRAND.pink} 100%)`,
                    boxShadow: `0 0 40px ${BRAND.teal}40`,
                  }}
                >
                  <span className="text-7xl">👨‍⚕️</span>
                </div>
                <h3 className="text-2xl font-black" style={{ color: BRAND.cream }}>Ryan Kent</h3>
                <p className="font-medium" style={{ color: BRAND.teal }}>FNP-BC, MSN</p>
                <p className="text-sm mt-1" style={{ color: BRAND.gray }}>Lead Provider</p>
              </div>

              {/* Credentials */}
              <div className="md:col-span-2">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Board Certification', value: 'Family Nurse Practitioner (ANCC)' },
                    { label: 'Education', value: 'MSN, Family Practice' },
                    { label: 'License', value: 'Full Practice Authority — Illinois' },
                    { label: 'Experience', value: '10+ Years Clinical Practice' },
                    { label: 'Specializations', value: 'Weight Loss, HRT, Peptides' },
                    { label: 'DEA Licensed', value: 'Schedule II-V Prescribing' },
                  ].map((cred) => (
                    <div key={cred.label} className="p-4 rounded-xl" style={{ backgroundColor: `${BRAND.teal}10` }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND.teal }}>{cred.label}</p>
                      <p className="font-semibold text-sm" style={{ color: BRAND.cream }}>{cred.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-3" style={{ color: BRAND.cream }}>About Ryan</h4>
                  <p className="text-sm mb-3" style={{ color: BRAND.gray }}>
                    Ryan Kent is a board-certified Family Nurse Practitioner with Full Practice Authority in Illinois, 
                    meaning he can independently diagnose, treat, and prescribe without physician supervision. With over 
                    a decade of clinical experience, Ryan specializes in metabolic health, hormone optimization, and 
                    regenerative medicine.
                  </p>
                  <p className="text-sm" style={{ color: BRAND.gray }}>
                    Prior to founding REGEN RX, Ryan worked in primary care, urgent care, and medical aesthetics, 
                    developing expertise in weight management and hormone therapy. He stays current on the latest 
                    clinical evidence for GLP-1 medications, peptide therapy, and bioidentical HRT.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {['GLP-1 Weight Loss', 'Hormone Therapy', 'Peptide Protocols', 'Metabolic Health', 'Anti-Aging Medicine'].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${BRAND.pink}15`, color: BRAND.pink }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Physician Oversight */}
            <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${BRAND.teal}20` }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND.teal}20` }}
                >
                  <span className="text-2xl">🩺</span>
                </div>
                <div>
                  <p className="font-bold" style={{ color: BRAND.cream }}>Physician Oversight</p>
                  <p className="text-sm" style={{ color: BRAND.gray }}>
                    All clinical protocols are developed with board-certified physician oversight for complex cases, 
                    quality assurance, and ongoing medical direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Grid */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>Our Credentials</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREDENTIALS.map((cred) => (
              <div key={cred.title} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}>
                <span className="text-3xl mb-3 block">{cred.icon}</span>
                <h3 className="font-bold mb-2" style={{ color: BRAND.cream }}>{cred.title}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{cred.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacy Partners */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>Pharmacy Partners</h2>
          <p className="mb-8" style={{ color: BRAND.gray }}>
            We only work with FDA-registered 503A compounding pharmacies. These are legitimate 
            pharmacies that operate under state pharmacy board oversight — not gray-market suppliers 
            selling "research chemicals."
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {PHARMACIES.map((pharm) => (
              <div key={pharm.name} className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND.teal }}>{pharm.type}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>{pharm.name}</h3>
                <p className="text-sm mb-3" style={{ color: BRAND.gray }}>{pharm.description}</p>
                <span className="inline-block px-3 py-1 text-xs rounded-full" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                  {pharm.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: BRAND.cream }}>How Our Process Works</h2>
          <div className="space-y-4">
            {PROCESS.map((step) => (
              <div key={step.step} className="flex gap-6 p-4 rounded-xl" style={{ backgroundColor: BRAND.dark }}>
                <div className="flex-shrink-0">
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black" style={{ backgroundColor: BRAND.teal, color: 'white' }}>
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: BRAND.cream }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: BRAND.gray }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-8">
            Complete a free online visit. Our licensed Illinois providers will review 
            your information and determine if treatment is right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/start"
              className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Start Your Free Visit
            </Link>
            <Link
              href="/learn"
              className="inline-block px-8 py-4 text-lg font-bold rounded-full border-2 border-white transition-all hover:scale-105"
              style={{ color: 'white' }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ backgroundColor: BRAND.dark, borderColor: `${BRAND.teal}15` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={45} className="h-10 w-auto brightness-110" />
              <span style={{ color: BRAND.gray }}>A Hello Gorgeous Med Spa telehealth platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm" style={{ color: BRAND.gray }}>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <a href="tel:+16306366193" className="hover:text-white">(630) 636-6193</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
