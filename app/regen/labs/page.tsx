'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { LAB_PANELS, type LabPanel } from '@/lib/fullscript/lab-panels';

const BRAND = {
  teal: '#0D9488',
  tealDark: '#0D5C63',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

function LabsContent() {
  const searchParams = useSearchParams();
  const preselectedPanel = searchParams.get('panel');
  const returnTo = searchParams.get('return') || '/start';
  
  const [selectedPanel, setSelectedPanel] = useState<LabPanel | null>(
    preselectedPanel ? LAB_PANELS.find(p => p.id === preselectedPanel) || null : null
  );
  const [step, setStep] = useState<'select' | 'info' | 'checkout'>('select');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    street: '',
    city: '',
    state: 'IL',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [hasExistingLabs, setHasExistingLabs] = useState<boolean | null>(null);

  const handlePanelSelect = (panel: LabPanel) => {
    setSelectedPanel(panel);
    setStep('info');
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Stripe checkout for lab panel
      const res = await fetch('/api/regen/labs/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelId: selectedPanel?.id,
          panelName: selectedPanel?.name,
          price: selectedPanel?.price,
          patient: formData,
          returnUrl: returnTo,
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <header style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={45} className="h-10 w-auto brightness-110" />
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.gray }}>
            <svg className="w-4 h-4" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            HIPAA Compliant
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 text-center" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.tealDark}40 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}>
            🧪 Lab Services
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.cream }}>
            Order Your Labs
          </h1>
          <p style={{ color: BRAND.gray }} className="text-lg">
            Required lab work before starting certain treatments. Results in 2-5 days.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Already have labs? */}
        {hasExistingLabs === null && step === 'select' && (
          <div className="mb-12 p-6 rounded-2xl text-center" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}40` }}>
            <h2 className="text-xl font-bold mb-3" style={{ color: BRAND.cream }}>
              Already have recent lab work?
            </h2>
            <p className="mb-6" style={{ color: BRAND.gray }}>
              If you have labs from the last 6 months, you can upload them instead of ordering new ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/labs/upload"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: BRAND.teal, color: 'white' }}
              >
                📄 Upload Existing Labs
              </Link>
              <button
                onClick={() => setHasExistingLabs(false)}
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: 'transparent', color: BRAND.cream, border: `2px solid ${BRAND.gray}` }}
              >
                I Need New Labs
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Select Panel */}
        {step === 'select' && (hasExistingLabs === false || hasExistingLabs === null) && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>
              Select Your Lab Panel
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {LAB_PANELS.map((panel) => (
                <div
                  key={panel.id}
                  className="rounded-2xl p-6 transition-all cursor-pointer hover:scale-[1.02]"
                  style={{
                    backgroundColor: BRAND.darkAlt,
                    border: selectedPanel?.id === panel.id 
                      ? `2px solid ${BRAND.teal}` 
                      : '2px solid transparent',
                    boxShadow: selectedPanel?.id === panel.id 
                      ? `0 0 20px ${BRAND.teal}30` 
                      : 'none',
                  }}
                  onClick={() => handlePanelSelect(panel)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-3xl">{panel.icon}</span>
                      <h3 className="text-xl font-bold mt-2" style={{ color: BRAND.cream }}>
                        {panel.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: BRAND.pink }}>
                        ${panel.price}
                      </p>
                      <p className="text-xs" style={{ color: BRAND.gray }}>
                        Results in {panel.turnaroundDays} days
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: BRAND.gray }}>
                    {panel.description}
                  </p>
                  
                  <div className="pt-4" style={{ borderTop: `1px solid ${BRAND.gray}30` }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: BRAND.teal }}>
                      INCLUDES:
                    </p>
                    <ul className="text-xs space-y-1" style={{ color: BRAND.gray }}>
                      {panel.tests.slice(0, 4).map((test, i) => (
                        <li key={i}>• {test}</li>
                      ))}
                      {panel.tests.length > 4 && (
                        <li style={{ color: BRAND.teal }}>+ {panel.tests.length - 4} more tests</li>
                      )}
                    </ul>
                  </div>
                  
                  {panel.fastingRequired && (
                    <div className="mt-4 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: `${BRAND.pink}15`, color: BRAND.pink }}>
                      ⚠️ Fasting required (8-12 hours)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Patient Info */}
        {step === 'info' && selectedPanel && (
          <div>
            <button 
              onClick={() => setStep('select')} 
              className="flex items-center gap-2 mb-6 hover:opacity-80" 
              style={{ color: BRAND.gray }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Panels
            </button>

            {/* Selected Panel Summary */}
            <div className="mb-8 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}40` }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedPanel.icon}</span>
                <div>
                  <h3 className="font-bold" style={{ color: BRAND.cream }}>{selectedPanel.name}</h3>
                  <p className="text-sm" style={{ color: BRAND.gray }}>Results in {selectedPanel.turnaroundDays} days</p>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: BRAND.pink }}>${selectedPanel.price}</p>
            </div>

            <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.cream }}>
              Your Information
            </h2>

            <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Sex at Birth *</label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  >
                    <option value="IL">Illinois</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  />
                </div>
              </div>

              {/* What happens next */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${BRAND.teal}10`, border: `1px solid ${BRAND.teal}30` }}>
                <h4 className="font-semibold mb-2" style={{ color: BRAND.teal }}>What happens next?</h4>
                <ol className="text-sm space-y-2" style={{ color: BRAND.gray }}>
                  <li>1. Complete payment for your lab panel</li>
                  <li>2. Receive your lab requisition via email</li>
                  <li>3. Visit any Quest Diagnostics or Labcorp near you</li>
                  <li>4. Results delivered to REGEN RX in {selectedPanel.turnaroundDays} days</li>
                  <li>5. Provider reviews results and approves your treatment</li>
                </ol>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-white font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: BRAND.pink }}
              >
                {loading ? 'Processing...' : `Continue to Payment — $${selectedPanel.price}`}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs" style={{ backgroundColor: BRAND.darkAlt, borderTop: `1px solid ${BRAND.teal}20`, color: BRAND.gray }}>
        <p>Lab services provided in partnership with Quest Diagnostics & Labcorp via Fullscript.</p>
        <p className="mt-2">Questions? Call <a href="tel:+16306366193" style={{ color: BRAND.teal }}>(630) 636-6193</a></p>
        <p className="mt-4">© {new Date().getFullYear()} REGEN RX by Hello Gorgeous PC</p>
      </footer>
    </div>
  );
}

export default function LabsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.dark }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${BRAND.teal} transparent transparent transparent` }} />
          <p style={{ color: BRAND.gray }}>Loading...</p>
        </div>
      </div>
    }>
      <LabsContent />
    </Suspense>
  );
}
