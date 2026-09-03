'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',      // Bright teal (molecules)
  tealDark: '#0D5C63',  // Deep teal
  pink: '#E91E8C',      // Hot pink accent (RX)
  pinkLight: '#FF4DA6', // Lighter pink
  dark: '#0A0A0A',      // Near black background
  darkAlt: '#111111',   // Slightly lighter dark
  cream: '#FAF9F6',     // Off-white text
  gray: '#9CA3AF',      // Muted text
};

const PROGRAMS = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    subtitle: 'GLP-1 Medications',
    description: 'Semaglutide & Tirzepatide — same active ingredients as Ozempic® and Mounjaro®',
    price: '$299',
    href: '/start?goal=weight-loss',
    image: '/images/regen/woman-stretching.png',
  },
  {
    id: 'hormones',
    title: 'Hormone Therapy',
    subtitle: 'HRT for Women & Men',
    description: 'Restore energy, mood, and vitality with bioidentical hormone optimization',
    price: '$149',
    href: '/start?goal=hormones',
    image: '/images/regen/couple-couch.png',
  },
  {
    id: 'peptides',
    title: 'Peptide Therapy',
    subtitle: 'Recovery & Performance',
    description: 'BPC-157, Sermorelin, NAD+ and more for healing, energy, and longevity',
    price: '$199',
    href: '/start?goal=peptides',
    image: '/images/regen/man-stretching.png',
  },
  {
    id: 'sexual-health',
    title: 'Sexual Wellness',
    subtitle: 'Intimacy & Performance',
    description: 'Discreet, effective solutions for desire, performance, and confidence',
    price: '$49',
    href: '/start?goal=sexual-health',
    image: '/images/regen/man-professional.png',
  },
  {
    id: 'skincare',
    title: 'Rx Skincare',
    subtitle: 'Prescription Anti-Aging',
    description: 'Tretinoin, GHK-Cu peptides, and custom compounds for medical-grade results',
    price: '$125',
    href: '/start?goal=skincare',
    image: '/images/regen/woman-bedroom.png',
  },
  {
    id: 'hair',
    title: 'Hair Restoration',
    subtitle: 'Prescription Hair Growth',
    description: 'Finasteride, minoxidil & advanced compounds to stop loss and regrow hair',
    price: '$40',
    href: '/start?goal=hair',
    image: '/images/regen/man-professional.png',
  },
];

const STEPS = [
  { num: '01', title: 'Complete your visit', desc: 'Answer health questions online. Takes 5 minutes.' },
  { num: '02', title: 'Provider review', desc: 'Licensed Illinois provider reviews within 24-48 hours.' },
  { num: '03', title: 'Medication delivered', desc: 'Ships from FDA-registered pharmacy. Free delivery.' },
];

export default function RegenLandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${BRAND.teal}40; }
          50% { box-shadow: 0 0 40px ${BRAND.teal}60; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b" style={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: `${BRAND.teal}30` }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={50} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-8">
            <Link href="#programs" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Programs
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              How It Works
            </Link>
            <Link
              href="/start"
              className="px-6 py-3 text-white text-sm font-bold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark & Bold */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-6 relative overflow-hidden">
        {/* Background molecular pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${BRAND.teal}40 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${BRAND.pink}30 0%, transparent 50%)`,
        }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <span 
                  className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
                >
                  Illinois Telehealth
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] animate-fade-in-up delay-100" style={{ color: BRAND.cream }}>
                Renew.
                <br />
                <span style={{ color: BRAND.teal }}>Rebalance.</span>
                <br />
                <span style={{ color: BRAND.pink }}>Regenerate.</span>
              </h1>
              
              <p className="text-xl max-w-lg animate-fade-in-up delay-200" style={{ color: BRAND.gray }}>
                Doctor-guided weight loss, hormone optimization, and peptide therapy — 
                delivered to your door. No appointments. No waiting rooms.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                <Link
                  href="/start"
                  className="px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl text-center text-white"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Start Your Visit — Free
                </Link>
                <Link
                  href="#programs"
                  className="px-8 py-4 text-lg font-bold rounded-full border-2 transition-all hover:scale-105 text-center"
                  style={{ borderColor: BRAND.teal, color: BRAND.teal }}
                >
                  View Programs
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4 animate-fade-in-up delay-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: BRAND.gray }}>Licensed Providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: BRAND.gray }}>Free Shipping</span>
                </div>
              </div>
            </div>
            
            {/* Right: Photo Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden animate-scale-in delay-200 hover:scale-105 transition-transform duration-500" style={{ boxShadow: `0 0 30px ${BRAND.teal}30` }}>
                    <Image src="/images/regen/woman-stretching.png" alt="Woman staying active" width={400} height={500} className="w-full h-64 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden animate-scale-in delay-400 hover:scale-105 transition-transform duration-500" style={{ boxShadow: `0 0 30px ${BRAND.pink}20` }}>
                    <Image src="/images/regen/man-professional.png" alt="Professional man confident" width={400} height={400} className="w-full h-48 object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden animate-scale-in delay-300 hover:scale-105 transition-transform duration-500" style={{ boxShadow: `0 0 30px ${BRAND.teal}30` }}>
                    <Image src="/images/regen/woman-bedroom.png" alt="Woman feeling balanced" width={400} height={400} className="w-full h-48 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden animate-scale-in delay-500 hover:scale-105 transition-transform duration-500" style={{ boxShadow: `0 0 30px ${BRAND.pink}20` }}>
                    <Image src="/images/regen/couple-couch.png" alt="Couple enjoying life together" width={400} height={500} className="w-full h-64 object-cover" />
                  </div>
                </div>
              </div>
              {/* Floating molecular accent */}
              <div 
                className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full animate-pulse-glow" 
                style={{ backgroundColor: `${BRAND.teal}20`, border: `1px solid ${BRAND.teal}40` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Trust Strip */}
      <section className="py-5 overflow-hidden border-y" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span style={{ color: BRAND.teal }} className="font-semibold">Licensed Illinois Providers</span>
              <span style={{ color: BRAND.pink }}>◆</span>
              <span style={{ color: BRAND.teal }} className="font-semibold">FDA-Registered Pharmacies</span>
              <span style={{ color: BRAND.pink }}>◆</span>
              <span style={{ color: BRAND.teal }} className="font-semibold">Free Shipping</span>
              <span style={{ color: BRAND.pink }}>◆</span>
              <span style={{ color: BRAND.teal }} className="font-semibold">HIPAA Compliant</span>
              <span style={{ color: BRAND.pink }}>◆</span>
              <span style={{ color: BRAND.teal }} className="font-semibold">No Appointments Needed</span>
              <span style={{ color: BRAND.pink }}>◆</span>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span 
              className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
            >
              Programs
            </span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: BRAND.cream }}>
              Choose your path.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((program, idx) => (
              <Link
                key={program.id}
                href={program.href}
                className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{ 
                  backgroundColor: BRAND.darkAlt,
                  border: `1px solid ${BRAND.teal}20`,
                }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={program.image} 
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-medium" style={{ color: BRAND.teal }}>{program.subtitle}</p>
                    <h3 className="text-2xl font-bold text-white">{program.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{program.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black" style={{ color: BRAND.pink }}>
                      {program.price}<span className="text-sm font-normal" style={{ color: BRAND.gray }}>/mo</span>
                    </span>
                    <span className="text-sm font-semibold flex items-center gap-1" style={{ color: BRAND.teal }}>
                      Start
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span 
                className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
              >
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: BRAND.cream }}>
                Simple process.
                <br />
                <span style={{ color: BRAND.pink }}>Big results.</span>
              </h2>
              <p className="text-xl mb-12" style={{ color: BRAND.gray }}>
                No video calls. No waiting rooms. Just real care, delivered.
              </p>
              
              <div className="space-y-8">
                {STEPS.map((step, idx) => (
                  <div key={step.num} className="flex gap-6 items-start group">
                    <div 
                      className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-xl transition-all group-hover:scale-110"
                      style={{ 
                        backgroundColor: idx === 2 ? BRAND.pink : BRAND.teal,
                        boxShadow: `0 0 20px ${idx === 2 ? BRAND.pink : BRAND.teal}40`
                      }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: BRAND.cream }}>{step.title}</h3>
                      <p style={{ color: BRAND.gray }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 60px ${BRAND.teal}30` }}>
                <Image 
                  src="/images/regen/woman-laptop.png" 
                  alt="Woman completing telehealth visit from home" 
                  width={600} 
                  height={700}
                  className="w-full"
                />
              </div>
              <div 
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full animate-float" 
                style={{ backgroundColor: `${BRAND.pink}15`, border: `1px solid ${BRAND.pink}30` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-4xl mx-auto text-center">
          <span 
            className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
          >
            Real Care
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-8" style={{ color: BRAND.cream }}>
            Real providers.
            <br />
            <span style={{ color: BRAND.teal }}>Real prescriptions.</span>
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: BRAND.gray }}>
            REGEN RX is powered by licensed Illinois healthcare providers with Full Practice Authority. 
            Your care is overseen by board-certified physicians.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏥', label: 'Illinois Licensed', desc: 'Full Practice Authority NP' },
              { icon: '💊', label: 'FDA Pharmacies', desc: '503A compounding partners' },
              { icon: '🔒', label: 'HIPAA Compliant', desc: 'Your data is protected' },
            ].map((item) => (
              <div 
                key={item.label} 
                className="p-6 rounded-2xl transition-all hover:scale-105"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-lg mb-1" style={{ color: BRAND.cream }}>{item.label}</h3>
                <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: BRAND.teal }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, ${BRAND.pink}50 0%, transparent 50%)`,
        }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to feel your best?
          </h2>
          <p className="text-xl mb-10 text-white/80">
            Start your free online visit today. No commitment.
          </p>
          <Link
            href="/start"
            className="inline-block px-12 py-5 text-xl font-black rounded-full transition-all hover:scale-105 shadow-2xl"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: BRAND.dark, borderTop: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
              <p style={{ color: BRAND.gray }}>Renew. Rebalance. Regenerate.</p>
            </div>
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Contact</Link>
              <a href="tel:+16306366193" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>(630) 636-6193</a>
            </div>
          </div>
          <div className="mt-12 pt-8 text-xs" style={{ borderTop: `1px solid ${BRAND.teal}15`, color: BRAND.gray }}>
            <p>
              REGEN RX is a telehealth platform operated by Hello Gorgeous Med Spa LLC. 
              Medical services provided by licensed Illinois healthcare providers. 
              Prescription products require a valid prescription. Not all patients will qualify.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
