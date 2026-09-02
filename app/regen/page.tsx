import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RE GEN | Prescription Wellness, Delivered',
  description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers. Get started in minutes.',
  openGraph: {
    title: 'RE GEN | Prescription Wellness, Delivered',
    description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers.',
    type: 'website',
  },
};

// Brand colors
const BRAND = {
  teal: '#0D5C63',      // Deep ocean teal - primary
  tealLight: '#0E7490', // Lighter teal for hover states
  gold: '#F59E0B',      // Golden amber - accent
  goldLight: '#FBBF24', // Lighter gold
  cream: '#FFFBF5',     // Warm white background
  charcoal: '#1F2937',  // Text color
};

const PROGRAMS = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    subtitle: 'GLP-1 Medications',
    description: 'Semaglutide & Tirzepatide — the same active ingredients as Ozempic® and Mounjaro®',
    price: 'From $299/mo',
    href: '/start?goal=weight-loss',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 'hormones',
    title: 'Hormone Therapy',
    subtitle: 'HRT for Women & Men',
    description: 'Restore energy, mood, and vitality with bioidentical hormone optimization',
    price: 'From $149/mo',
    href: '/start?goal=hormones',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'peptides',
    title: 'Peptide Therapy',
    subtitle: 'Recovery & Performance',
    description: 'BPC-157, Sermorelin, NAD+ and more for healing, energy, and longevity',
    price: 'From $199/mo',
    href: '/start?goal=peptides',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'sexual-health',
    title: 'Sexual Wellness',
    subtitle: 'Intimacy & Performance',
    description: 'Discreet, effective solutions for desire, performance, and confidence',
    price: 'From $49/mo',
    href: '/start?goal=sexual-health',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  },
];

const TRUST_POINTS = [
  { label: 'Licensed Illinois Providers', icon: '🏥' },
  { label: 'FDA-Registered Pharmacies', icon: '💊' },
  { label: 'Free Shipping', icon: '📦' },
  { label: 'Ongoing Support', icon: '💬' },
];

export default function RegenLandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.cream }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-gray-100" style={{ backgroundColor: 'rgba(255,251,245,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: BRAND.charcoal }}>
            RE<span style={{ color: BRAND.teal }}>GEN</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/start" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Get Started
            </Link>
            <Link href="/account" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              My Account
            </Link>
            <Link
              href="/start"
              className="px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.teal }}
            >
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: BRAND.gold }} />
            Illinois Telehealth — No appointment needed
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{ color: BRAND.charcoal }}>
            Prescription wellness,
            <br />
            <span style={{ color: BRAND.teal }}>delivered to your door</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Doctor-guided weight loss, hormone therapy, and peptides. 
            Complete an online visit, get prescribed if appropriate, 
            and receive your medication with free shipping.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/start"
              className="w-full sm:w-auto px-8 py-4 text-white text-lg font-semibold rounded-full transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: BRAND.gold }}
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="#programs"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full transition-colors border-2"
              style={{ borderColor: BRAND.teal, color: BRAND.teal }}
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: `${BRAND.teal}20`, backgroundColor: `${BRAND.teal}08` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_POINTS.map((point) => (
              <div key={point.label} className="flex items-center justify-center gap-3">
                <span className="text-2xl">{point.icon}</span>
                <span className="text-sm font-medium" style={{ color: BRAND.charcoal }}>{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.charcoal }}>
              Choose your program
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All programs include provider consultation, prescription (if appropriate), 
              medication, and ongoing support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PROGRAMS.map((program) => (
              <Link
                key={program.id}
                href={program.href}
                className="group p-8 bg-white border-2 border-gray-100 rounded-2xl transition-all hover:shadow-xl"
                style={{ ['--hover-border' as string]: BRAND.teal }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: `${BRAND.teal}10`, color: BRAND.teal }}
                  >
                    {program.icon}
                  </div>
                  <span className="font-bold" style={{ color: BRAND.gold }}>{program.price}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND.charcoal }}>{program.title}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: BRAND.teal }}>{program.subtitle}</p>
                <p className="text-gray-600 mb-6">{program.description}</p>
                <div className="flex items-center gap-2 font-semibold" style={{ color: BRAND.teal }}>
                  Get started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6" style={{ backgroundColor: `${BRAND.teal}08` }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.charcoal }}>
              How it works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in minutes. No video call required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Complete your visit',
                description: 'Answer questions about your health history and goals. Takes about 5 minutes.',
              },
              {
                step: '2',
                title: 'Provider review',
                description: 'A licensed Illinois provider reviews your information and prescribes if appropriate.',
              },
              {
                step: '3',
                title: 'Medication delivered',
                description: 'Your prescription ships from an FDA-registered pharmacy with free delivery.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div 
                  className="w-16 h-16 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: BRAND.teal }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.charcoal }}>{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-3xl p-10 md:p-16 text-center"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND.teal}15 0%, ${BRAND.gold}10 100%)`,
              border: `1px solid ${BRAND.teal}20`
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: BRAND.charcoal }}>
              Real providers. Real prescriptions.
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              RE GEN is powered by licensed Illinois healthcare providers with Full Practice Authority. 
              Your care is overseen by board-certified physicians with decades of experience in 
              regenerative medicine and metabolic health.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Illinois Licensed
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                503A Pharmacy Partners
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: BRAND.teal }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to feel your best?
          </h2>
          <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Start your free online visit today. No commitment required.
          </p>
          <Link
            href="/start"
            className="inline-block px-10 py-5 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl"
            style={{ backgroundColor: BRAND.gold, color: BRAND.charcoal }}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-gray-400" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xl font-bold text-white">
                RE<span style={{ color: BRAND.gold }}>GEN</span>
              </span>
              <p className="text-sm mt-2">Prescription wellness, delivered.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <a href="tel:+16302342473" className="hover:text-white transition-colors">(630) 234-2473</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-xs text-gray-500">
            <p>
              RE GEN is a telehealth platform operated by Hello Gorgeous Med Spa LLC. 
              Medical services provided by licensed Illinois healthcare providers. 
              Prescription products require a valid prescription from a licensed provider.
              Not all patients will qualify for treatment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
