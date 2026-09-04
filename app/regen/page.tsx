'use client';

import { useState } from 'react';
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
    image: '/images/regen/marketing/woman-wellness.png',
  },
  {
    id: 'hormones',
    title: 'Hormone Therapy',
    subtitle: 'HRT for Women & Men',
    description: 'Restore energy, mood, and vitality with bioidentical hormone optimization',
    price: '$149',
    href: '/start?goal=hormones',
    image: '/images/regen/marketing/man-morning-energy.png',
  },
  {
    id: 'peptides',
    title: 'Peptide Therapy',
    subtitle: 'Recovery & Performance',
    description: 'BPC-157, Sermorelin, and more for healing, energy, and longevity',
    price: '$199',
    href: '/start?goal=peptides',
    image: '/images/regen/marketing/man-fitness.png',
  },
  {
    id: 'vitamins',
    title: 'Vitamin Injectables',
    subtitle: 'Energy & Wellness Shots',
    description: 'B12, Biotin, Glutathione & NAD+ — fast-acting nutrients for energy and glow',
    price: '$35',
    href: '/start?goal=vitamins',
    image: '/images/regen/marketing/cell-peptide.png',
  },
  {
    id: 'skincare',
    title: 'Rx Skincare',
    subtitle: 'Prescription Anti-Aging',
    description: 'Tretinoin, GHK-Cu peptides, and custom compounds for medical-grade results',
    price: '$125',
    href: '/start?goal=skincare',
    image: '/images/regen/marketing/woman-skincare.png',
  },
  {
    id: 'hair',
    title: 'Hair Restoration',
    subtitle: 'Prescription Hair Growth',
    description: 'Finasteride, minoxidil & advanced compounds to stop loss and regrow hair',
    price: '$40',
    href: '/start?goal=hair',
    image: '/images/regen/man-stretching.png',
  },
  {
    id: 'sexual-health',
    title: 'Sexual Wellness',
    subtitle: 'Intimacy & Performance',
    description: 'Discreet, effective solutions for desire, performance, and confidence',
    price: '$49',
    href: '/start?goal=sexual-health',
    image: '/images/regen/couple-couch.png',
  },
];

const STEPS = [
  { num: '01', title: 'Start your online visit', desc: 'Answer questions about your health and goals — all online, no appointments needed.', icon: '📋', time: '5 min' },
  { num: '02', title: 'Provider reviews your info', desc: 'A licensed Illinois provider evaluates your history and determines if treatment is right for you.', icon: '👨‍⚕️', time: '24-48 hrs' },
  { num: '03', title: 'Clinical decision', desc: 'If appropriate, your provider may request labs, a video visit, or additional info before prescribing.', icon: '💊', time: 'Varies' },
  { num: '04', title: 'Medication ships to you', desc: 'Once approved, your treatment ships directly to your door — discreet packaging included.', icon: '📦', time: '3-5 days' },
  { num: '05', title: 'Ongoing care', desc: 'Message your care team for support. Your provider may request follow-ups when clinically necessary.', icon: '💬', time: 'As needed' },
];

function WeightLossCalculator() {
  const [weight, setWeight] = useState(220);
  const potentialLoss15 = Math.round(weight * 0.15);
  const potentialLoss20 = Math.round(weight * 0.20);
  const newWeight = weight - potentialLoss20;

  return (
    <section className="py-16 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span 
            className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
          >
            Weight Loss Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: BRAND.cream }}>
            See what you could lose
          </h2>
        </div>

        <div 
          className="rounded-3xl p-8 md:p-10"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #0d1f1d 100%)`,
            border: `2px solid ${BRAND.teal}30`,
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Slider Side */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: BRAND.gray }}>
                Your current weight
              </label>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black" style={{ color: BRAND.cream }}>{weight}</span>
                  <span className="text-2xl font-medium" style={{ color: BRAND.gray }}>lbs</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="400"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${BRAND.teal} 0%, ${BRAND.teal} ${((weight - 150) / 250) * 100}%, #333 ${((weight - 150) / 250) * 100}%, #333 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs mt-2" style={{ color: BRAND.gray }}>
                  <span>150 lbs</span>
                  <span>400 lbs</span>
                </div>
              </div>

              <p className="text-sm" style={{ color: BRAND.gray }}>
                Based on clinical trials of GLP-1 medications like Wegovy® and Zepbound®, 
                patients lose an average of 15-20% of their body weight.*
              </p>
            </div>

            {/* Results Side */}
            <div className="text-center md:text-left">
              <div className="mb-6">
                <div className="text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Weight you could lose:</div>
                <div className="flex items-baseline gap-3 justify-center md:justify-start">
                  <span className="text-6xl font-black" style={{ color: BRAND.pink }}>{potentialLoss15}-{potentialLoss20}</span>
                  <span className="text-2xl font-medium" style={{ color: BRAND.gray }}>lbs</span>
                </div>
              </div>

              <div 
                className="inline-block px-6 py-4 rounded-2xl mb-6"
                style={{ backgroundColor: `${BRAND.teal}15`, border: `1px solid ${BRAND.teal}30` }}
              >
                <div className="text-sm" style={{ color: BRAND.gray }}>Your new weight could be</div>
                <div className="text-3xl font-black" style={{ color: BRAND.teal }}>{newWeight} lbs</div>
              </div>

              <div>
                <Link
                  href="/start?goal=weight-loss"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105"
                  style={{ backgroundColor: BRAND.pink, color: 'white' }}
                >
                  See If You Qualify
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <p className="text-xs text-center mt-8" style={{ color: '#555' }}>
            *Based on clinical trials. Individual results may vary. Not all patients qualify for treatment.
          </p>
        </div>
      </div>
    </section>
  );
}

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
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={180} height={60} className="h-14 w-auto brightness-110" />
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Products
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Pricing
            </Link>
            <Link href="/learn" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Learn
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Our Story
            </Link>
            <Link href="/providers" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Our Team
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Contact
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

      {/* Hero Section - Video Centered */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 px-6 relative overflow-hidden">
        {/* Background molecular pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${BRAND.teal}40 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${BRAND.pink}30 0%, transparent 50%)`,
        }} />
        
        <div className="max-w-5xl mx-auto relative text-center">
          {/* Video - Front and Center */}
          <div className="mb-8 animate-scale-in">
            <div 
              className="relative rounded-2xl overflow-hidden mx-auto max-w-2xl"
              style={{ boxShadow: `0 0 80px ${BRAND.teal}40, 0 0 40px ${BRAND.pink}30` }}
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto"
              >
                <source src="/images/regen/logo-reveal.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 animate-fade-in-up delay-100" style={{ color: BRAND.cream }}>
            <span style={{ color: BRAND.teal }}>Renew.</span>{' '}
            <span style={{ color: BRAND.cream }}>Rebalance.</span>{' '}
            <span style={{ color: BRAND.pink }}>Regenerate.</span>
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200" style={{ color: BRAND.gray }}>
            Doctor-guided weight loss, hormone optimization, and peptide therapy — 
            delivered to your door. No appointments. No waiting rooms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              href="/start"
              className="px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl text-center text-white"
              style={{ backgroundColor: BRAND.pink }}
            >
              Start Your Visit — Free
            </Link>
            <Link
              href="#programs"
              className="px-10 py-4 text-lg font-bold rounded-full border-2 transition-all hover:scale-105 text-center"
              style={{ borderColor: BRAND.teal, color: BRAND.teal }}
            >
              View Programs
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-fade-in-up delay-400">
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
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium" style={{ color: BRAND.gray }}>Illinois Telehealth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Weight Loss Calculator */}
      <WeightLossCalculator />

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
                Most visits begin online. Your provider may request labs, additional information, or a video visit when clinically necessary.
              </p>
              
              <div className="space-y-6">
                {STEPS.map((step, idx) => (
                  <div key={step.num} className="flex gap-5 items-start group relative">
                    {/* Timeline connector */}
                    {idx < STEPS.length - 1 && (
                      <div 
                        className="absolute left-7 top-14 w-0.5 h-full"
                        style={{ backgroundColor: `${BRAND.teal}30` }}
                      />
                    )}
                    <div 
                      className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all group-hover:scale-110 relative z-10"
                      style={{ 
                        backgroundColor: idx === STEPS.length - 1 ? BRAND.pink : BRAND.teal,
                        boxShadow: `0 0 20px ${idx === STEPS.length - 1 ? BRAND.pink : BRAND.teal}30`
                      }}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold" style={{ color: BRAND.cream }}>{step.title}</h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}
                        >
                          {step.time}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: BRAND.gray }}>{step.desc}</p>
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

      {/* Pricing Preview Section */}
      <section className="py-24 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span 
              className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
            >
              Transparent Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
              Simple, honest <span style={{ color: BRAND.pink }}>pricing</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: BRAND.gray }}>
              No hidden fees. No insurance games. Just straightforward monthly plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                name: 'Weight Loss', 
                subtitle: 'Semaglutide',
                price: 299, 
                icon: '⚡',
                features: ['GLP-1 medication', 'Provider oversight', 'Shipped monthly'],
                popular: true,
              },
              { 
                name: 'Peptide Therapy', 
                subtitle: 'BPC-157 + TB-500',
                price: 249, 
                icon: '🧬',
                features: ['Research-backed peptides', 'Recovery support', 'Provider-guided dosing'],
              },
              { 
                name: 'Hormone Balance', 
                subtitle: 'Women\'s HRT',
                price: 179, 
                icon: '✨',
                features: ['Estrogen + Progesterone', 'Lab monitoring', 'Provider consults'],
              },
              { 
                name: 'Vitamin Boost', 
                subtitle: 'B12 + NAD+',
                price: 149, 
                icon: '💉',
                features: ['Energy injectables', 'Monthly supply', 'At-home admin'],
              },
            ].map((tier) => (
              <div 
                key={tier.name}
                className="relative p-6 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: BRAND.dark, 
                  border: tier.popular ? `2px solid ${BRAND.pink}` : `1px solid ${BRAND.teal}30`,
                }}
              >
                {tier.popular && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: BRAND.pink, color: 'white' }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="text-3xl mb-3">{tier.icon}</div>
                <h3 className="font-bold text-lg" style={{ color: BRAND.cream }}>{tier.name}</h3>
                <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{tier.subtitle}</p>
                <div className="mb-4">
                  <span className="text-3xl font-black" style={{ color: BRAND.teal }}>${tier.price}</span>
                  <span className="text-sm" style={{ color: BRAND.gray }}>/mo</span>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: BRAND.gray }}>
                      <span style={{ color: BRAND.teal }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.teal, color: 'white' }}
            >
              View All Plans
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="mt-4 text-sm" style={{ color: BRAND.gray }}>
              Save up to 20% with prepay plans · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span 
              className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
            >
              Real Results
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
              What our <span style={{ color: BRAND.teal }}>patients</span> are saying
            </h2>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 mb-12">
              {[
                { stat: '1,900+', label: 'Five-Star Reviews' },
                { stat: '15-20%', label: 'Avg Weight Loss*' },
                { stat: 'Illinois', label: 'Licensed Providers' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-4xl font-black" style={{ color: BRAND.pink }}>{item.stat}</div>
                  <div className="text-sm" style={{ color: BRAND.gray }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I was skeptical about online weight loss programs, but REGEN RX changed everything. Down 35 lbs in 4 months and I finally feel like myself again.",
                name: "Michelle T.",
                location: "Naperville, IL",
                result: "Lost 35 lbs",
                program: "Weight Loss",
              },
              {
                quote: "The process was so easy. I did my intake on my lunch break, got approved the next day, and had my medication within a week. No annoying doctor visits.",
                name: "David K.",
                location: "Aurora, IL",
                result: "Lost 28 lbs",
                program: "Weight Loss",
              },
              {
                quote: "Finally a provider who actually listens. Ryan adjusted my dosing when I had nausea and it made all the difference. Real support, not just a prescription.",
                name: "Jennifer M.",
                location: "Oswego, IL",
                result: "Lost 42 lbs",
                program: "Weight Loss",
              },
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: BRAND.darkAlt, 
                  border: `1px solid ${BRAND.teal}20`,
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5" style={{ color: '#FCD34D' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-[15px] leading-relaxed" style={{ color: '#ccc' }}>
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold" style={{ color: BRAND.cream }}>{testimonial.name}</div>
                    <div className="text-sm" style={{ color: BRAND.gray }}>{testimonial.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: BRAND.pink }}>{testimonial.result}</div>
                    <div className="text-xs" style={{ color: BRAND.gray }}>{testimonial.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: '#555' }}>
            *Individual results may vary. Testimonials represent typical patient experiences but are not guarantees. 
            Patients compensated for sharing their stories.
          </p>
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
              <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={45} className="h-10 w-auto brightness-110" />
              <p style={{ color: BRAND.gray }}>Renew. Rebalance. Regenerate.</p>
            </div>
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <Link href="/products" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Products</Link>
              <Link href="/pricing" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Pricing</Link>
              <Link href="/learn" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Learn</Link>
              <Link href="/about" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Our Story</Link>
              <Link href="/providers" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Team</Link>
              <Link href="/contact" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Contact</Link>
              <Link href="/safety" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Safety</Link>
              <Link href="/hipaa" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>HIPAA</Link>
              <Link href="/terms" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>Privacy</Link>
              <a href="tel:+16306366193" className="hover:text-white transition-colors" style={{ color: BRAND.gray }}>(630) 636-6193</a>
            </div>
          </div>
          <div className="mt-12 pt-8 text-xs space-y-3" style={{ borderTop: `1px solid ${BRAND.teal}15`, color: BRAND.gray }}>
            <p>
              © {new Date().getFullYear()} REGEN RX · A telehealth platform operated by Hello Gorgeous PC. 
              Medical services provided by licensed Illinois healthcare providers with physician oversight.
            </p>
            <p style={{ color: '#666' }}>
              <strong>IMPORTANT DISCLAIMER:</strong> The information on this website is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or qualified healthcare provider with any questions regarding a medical condition. 
              Never disregard professional medical advice or delay seeking it because of information on this site.
            </p>
            <p style={{ color: '#666' }}>
              Compounded medications are patient-specific preparations made by 503A-licensed pharmacies. They are not FDA-approved drugs. 
              Peptides, GLP-1 medications, hormone therapies, and other treatments may be prescribed off-label based on clinical evidence and provider judgment. 
              Individual results may vary. Not all patients will qualify for treatment. 
              Completing an intake form does not guarantee a prescription will be issued.
            </p>
            <p style={{ color: '#555' }}>
              REGEN RX does not provide emergency medical services. If you are experiencing a medical emergency, call 911 immediately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
