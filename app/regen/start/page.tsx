"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const GOALS = [
  {
    id: 'weight-loss',
    title: 'Lose Weight',
    description: 'GLP-1 medications like Semaglutide & Tirzepatide',
    icon: '📉',
    programs: [
      { id: 'semaglutide', name: 'Semaglutide Program', price: 299, description: 'Same active ingredient as Ozempic® & Wegovy®' },
      { id: 'tirzepatide', name: 'Tirzepatide Program', price: 399, description: 'Same active ingredient as Mounjaro® & Zepbound®' },
    ],
  },
  {
    id: 'hormones',
    title: 'Optimize Hormones',
    description: 'Bioidentical HRT for energy, mood & vitality',
    icon: '⚡',
    programs: [
      { id: 'hrt-women', name: 'Women\'s HRT', price: 149, description: 'Estrogen, progesterone & testosterone optimization' },
      { id: 'hrt-men', name: 'Men\'s TRT', price: 179, description: 'Testosterone replacement & optimization' },
    ],
  },
  {
    id: 'peptides',
    title: 'Recovery & Performance',
    description: 'Peptides for healing, energy & longevity',
    icon: '🧬',
    programs: [
      { id: 'bpc-tb', name: 'Recovery Stack', price: 249, description: 'BPC-157 + TB-500 for healing & repair' },
      { id: 'growth', name: 'Growth & Energy', price: 299, description: 'Sermorelin or CJC/Ipamorelin' },
      { id: 'nad', name: 'NAD+ Therapy', price: 199, description: 'Cellular energy & longevity' },
    ],
  },
  {
    id: 'sexual-health',
    title: 'Sexual Wellness',
    description: 'Discreet solutions for intimacy',
    icon: '💗',
    programs: [
      { id: 'ed', name: 'Men\'s Performance', price: 49, description: 'Sildenafil, Tadalafil & more' },
      { id: 'libido-women', name: 'Women\'s Desire', price: 79, description: 'PT-141, Oxytocin & arousal support' },
    ],
  },
];

type Step = 'goal' | 'program' | 'info' | 'checkout';

function RegenStartContent() {
  const searchParams = useSearchParams();
  const initialGoal = searchParams.get('goal') || '';
  
  const [step, setStep] = useState<Step>(initialGoal ? 'program' : 'goal');
  const [selectedGoal, setSelectedGoal] = useState(initialGoal);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    state: 'IL',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const currentGoal = GOALS.find(g => g.id === selectedGoal);
  const currentProgram = currentGoal?.programs.find(p => p.id === selectedProgram);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setStep('program');
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    setStep('info');
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the terms to continue');
      return;
    }
    setLoading(true);
    
    // Create checkout session
    try {
      const res = await fetch('/api/regen/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          items: [{
            name: currentProgram?.name || 'RE GEN Program',
            amount: currentProgram?.price || 299,
            quantity: 1,
          }],
          mode: 'payment', // Could be 'subscription' for recurring
          metadata: {
            program: selectedProgram,
            goal: selectedGoal,
            dob: formData.dob,
          },
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            RE<span className="text-emerald-600">GEN</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure & HIPAA Compliant
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {['Goal', 'Program', 'Your Info', 'Checkout'].map((label, idx) => {
              const stepMap: Step[] = ['goal', 'program', 'info', 'checkout'];
              const isActive = stepMap.indexOf(step) >= idx;
              const isCurrent = stepMap[idx] === step;
              return (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCurrent ? 'bg-emerald-600 text-white' :
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:block ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {label}
                  </span>
                  {idx < 3 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-3 ${isActive ? 'bg-emerald-200' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Step 1: Goal Selection */}
        {step === 'goal' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">What&apos;s your health goal?</h1>
            <p className="text-gray-600 mb-8">Select the area you&apos;d like to focus on.</p>
            <div className="grid gap-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className="w-full p-6 bg-white border-2 border-gray-200 hover:border-emerald-300 rounded-xl text-left transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{goal.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {goal.title}
                      </h3>
                      <p className="text-gray-600">{goal.description}</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Program Selection */}
        {step === 'program' && currentGoal && (
          <div>
            <button onClick={() => setStep('goal')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose your program</h1>
            <p className="text-gray-600 mb-8">{currentGoal.title} programs available for you.</p>
            <div className="grid gap-4">
              {currentGoal.programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => handleProgramSelect(program.id)}
                  className="w-full p-6 bg-white border-2 border-gray-200 hover:border-emerald-300 rounded-xl text-left transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {program.name}
                    </h3>
                    <span className="text-2xl font-bold text-emerald-600">${program.price}<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  </div>
                  <p className="text-gray-600">{program.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Patient Info */}
        {step === 'info' && currentProgram && (
          <div>
            <button onClick={() => setStep('program')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your information</h1>
            <p className="text-gray-600 mb-8">We&apos;ll need a few details to get started.</p>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-emerald-900">{currentProgram.name}</p>
                  <p className="text-sm text-emerald-700">{currentProgram.description}</p>
                </div>
                <span className="text-2xl font-bold text-emerald-600">${currentProgram.price}</span>
              </div>
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                >
                  <option value="IL">Illinois</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Currently available in Illinois only</p>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                  , and I consent to receive telehealth services.
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : `Continue to Payment — $${currentProgram.price}`}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>Need help? Call <a href="tel:+16302342473" className="text-emerald-600 hover:underline">(630) 234-2473</a></p>
          <p className="mt-2">RE GEN by Hello Gorgeous Med Spa LLC</p>
        </div>
      </footer>
    </div>
  );
}

export default function RegenStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RegenStartContent />
    </Suspense>
  );
}
