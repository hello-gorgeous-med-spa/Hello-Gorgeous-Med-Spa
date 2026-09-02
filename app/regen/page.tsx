import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'RE GEN | Prescription Wellness, Delivered',
  description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers. Get started in minutes.',
  openGraph: {
    title: 'RE GEN | Prescription Wellness, Delivered',
    description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers.',
    type: 'website',
  },
};

const BRAND = {
  teal: '#0D5C63',
  tealLight: '#0E7490',
  gold: '#F59E0B',
  goldLight: '#FBBF24',
  cream: '#FFFBF5',
  charcoal: '#1F2937',
};

const HERO_IMAGES = [
  { src: '/images/regen/woman-stretching.png', alt: 'Woman stretching before workout' },
  { src: '/images/regen/man-professional.png', alt: 'Professional man feeling confident' },
  { src: '/images/regen/woman-bedroom.png', alt: 'Woman feeling refreshed and balanced' },
  { src: '/images/regen/couple-couch.png', alt: 'Happy couple enjoying time together' },
  { src: '/images/regen/man-stretching.png', alt: 'Man staying active and healthy' },
  { src: '/images/regen/woman-laptop.png', alt: 'Woman using telehealth from home' },
];

const PROGRAMS = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    subtitle: 'GLP-1 Medications',
    description: 'Semaglutide & Tirzepatide',
    price: '$299',
    href: '/start?goal=weight-loss',
    image: '/images/regen/woman-stretching.png',
  },
  {
    id: 'hormones',
    title: 'Hormone Therapy',
    subtitle: 'HRT for Women & Men',
    description: 'Restore energy & vitality',
    price: '$149',
    href: '/start?goal=hormones',
    image: '/images/regen/couple-couch.png',
  },
  {
    id: 'peptides',
    title: 'Peptide Therapy',
    subtitle: 'Recovery & Performance',
    description: 'BPC-157, Sermorelin, NAD+',
    price: '$199',
    href: '/start?goal=peptides',
    image: '/images/regen/man-stretching.png',
  },
  {
    id: 'sexual-health',
    title: 'Sexual Wellness',
    subtitle: 'Intimacy & Performance',
    description: 'Discreet, effective solutions',
    price: '$49',
    href: '/start?goal=sexual-health',
    image: '/images/regen/man-professional.png',
  },
];

const STEPS = [
  { num: '01', title: 'Complete your visit', desc: 'Answer health questions online. Takes 5 minutes.' },
  { num: '02', title: 'Provider review', desc: 'Licensed Illinois provider reviews within 24-48 hours.' },
  { num: '03', title: 'Medication delivered', desc: 'Ships from FDA-registered pharmacy. Free delivery.' },
];

function SpacedText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`tracking-[0.3em] uppercase text-sm font-medium ${className}`}>
      {children.split('').join(' ')}
    </span>
  );
}

export default function RegenLandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.cream }}>
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
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
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
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-slide-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b" style={{ backgroundColor: 'rgba(255,251,245,0.95)', borderColor: `${BRAND.teal}15` }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight" style={{ color: BRAND.charcoal }}>
            RE<span style={{ color: BRAND.teal }}>GEN</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="#programs" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden md:block">
              Programs
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden md:block">
              How It Works
            </Link>
            <Link
              href="/start"
              className="px-6 py-3 text-white text-sm font-bold rounded-full transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: BRAND.gold }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold & Alive */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <SpacedText className="block mb-6" style={{ color: BRAND.teal }}>
                  Illinois Telehealth
                </SpacedText>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] animate-fade-in-up delay-100" style={{ color: BRAND.charcoal }}>
                Feel like
                <br />
                <span style={{ color: BRAND.teal }}>yourself</span>
                <br />
                again.
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg animate-fade-in-up delay-200">
                Doctor-guided weight loss, hormone optimization, and peptide therapy — 
                delivered to your door. No appointments. No waiting rooms.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                <Link
                  href="/start"
                  className="px-8 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl text-center"
                  style={{ backgroundColor: BRAND.gold, color: BRAND.charcoal }}
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
                  <span className="text-sm font-medium text-gray-600">Licensed Illinois Providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Free Shipping</span>
                </div>
              </div>
            </div>
            
            {/* Right: Photo Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl animate-scale-in delay-200 hover:scale-105 transition-transform duration-500">
                    <Image src="/images/regen/woman-stretching.png" alt="Woman staying active" width={400} height={500} className="w-full h-64 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl animate-scale-in delay-400 hover:scale-105 transition-transform duration-500">
                    <Image src="/images/regen/man-professional.png" alt="Professional man confident" width={400} height={400} className="w-full h-48 object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl animate-scale-in delay-300 hover:scale-105 transition-transform duration-500">
                    <Image src="/images/regen/woman-bedroom.png" alt="Woman feeling balanced" width={400} height={400} className="w-full h-48 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl animate-scale-in delay-500 hover:scale-105 transition-transform duration-500">
                    <Image src="/images/regen/couple-couch.png" alt="Couple enjoying life together" width={400} height={500} className="w-full h-64 object-cover" />
                  </div>
                </div>
              </div>
              {/* Floating accent */}
              <div 
                className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full animate-float" 
                style={{ backgroundColor: `${BRAND.gold}30` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Trust Strip */}
      <section className="py-6 overflow-hidden" style={{ backgroundColor: BRAND.teal }}>
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8">
              <span className="text-white/90 font-medium">Licensed Illinois Providers</span>
              <span className="text-white/40">●</span>
              <span className="text-white/90 font-medium">FDA-Registered Pharmacies</span>
              <span className="text-white/40">●</span>
              <span className="text-white/90 font-medium">Free Shipping</span>
              <span className="text-white/40">●</span>
              <span className="text-white/90 font-medium">HIPAA Compliant</span>
              <span className="text-white/40">●</span>
              <span className="text-white/90 font-medium">No Appointments Needed</span>
              <span className="text-white/40">●</span>
              <span className="text-white/90 font-medium">Ongoing Support</span>
              <span className="text-white/40">●</span>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SpacedText className="block mb-4" style={{ color: BRAND.gold }}>
              Programs
            </SpacedText>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: BRAND.charcoal }}>
              Choose your path.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((program, idx) => (
              <Link
                key={program.id}
                href={program.href}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={program.image} 
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/80 text-sm font-medium">{program.subtitle}</p>
                    <h3 className="text-white text-2xl font-bold">{program.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black" style={{ color: BRAND.gold }}>
                      {program.price}<span className="text-sm font-normal text-gray-500">/mo</span>
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
      <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: `${BRAND.teal}08` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SpacedText className="block mb-4" style={{ color: BRAND.gold }}>
                How It Works
              </SpacedText>
              <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: BRAND.charcoal }}>
                Simple process.
                <br />
                <span style={{ color: BRAND.teal }}>Big results.</span>
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                No video calls. No waiting rooms. Just real care, delivered.
              </p>
              
              <div className="space-y-8">
                {STEPS.map((step, idx) => (
                  <div key={step.num} className="flex gap-6 items-start group">
                    <div 
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: BRAND.teal }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: BRAND.charcoal }}>{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
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
                style={{ backgroundColor: `${BRAND.teal}20`, animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SpacedText className="block mb-4" style={{ color: BRAND.gold }}>
            Real Care
          </SpacedText>
          <h2 className="text-4xl md:text-5xl font-black mb-8" style={{ color: BRAND.charcoal }}>
            Real providers.
            <br />
            <span style={{ color: BRAND.teal }}>Real prescriptions.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            RE GEN is powered by licensed Illinois healthcare providers with Full Practice Authority. 
            Your care is overseen by board-certified physicians with decades of experience.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🏥', label: 'Illinois Licensed', desc: 'Full Practice Authority NP' },
              { icon: '💊', label: 'FDA Pharmacies', desc: '503A compounding partners' },
              { icon: '🔒', label: 'HIPAA Compliant', desc: 'Your data is protected' },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-lg mb-1" style={{ color: BRAND.charcoal }}>{item.label}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to feel your best?
          </h2>
          <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Start your free online visit today. No commitment.
          </p>
          <Link
            href="/start"
            className="inline-block px-12 py-5 text-xl font-black rounded-full transition-all hover:scale-105 shadow-2xl"
            style={{ backgroundColor: BRAND.gold, color: BRAND.charcoal }}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-2xl font-black text-white">
                RE<span style={{ color: BRAND.gold }}>GEN</span>
              </span>
              <p className="text-gray-400 mt-2">Prescription wellness, delivered.</p>
            </div>
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <a href="tel:+16302342473" className="text-gray-400 hover:text-white transition-colors">(630) 234-2473</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-xs text-gray-500">
            <p>
              RE GEN is a telehealth platform operated by Hello Gorgeous Med Spa LLC. 
              Medical services provided by licensed Illinois healthcare providers. 
              Prescription products require a valid prescription. Not all patients will qualify.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
