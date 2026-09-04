"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Brand colors - REGEN RX
const BRAND = {
  teal: '#0D9488',
  tealDark: '#0D5C63',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

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
    id: 'vitamins',
    title: 'Vitamin Injectables',
    description: 'Energy, immunity & wellness shots',
    icon: '💉',
    programs: [
      { id: 'b12', name: 'Vitamin B12 Injection', price: 35, description: 'Energy boost, metabolism support & nerve health' },
      { id: 'biotin', name: 'Biotin Injection', price: 45, description: 'Hair, skin & nail strengthening' },
      { id: 'glutathione', name: 'Glutathione Injection', price: 75, description: 'Master antioxidant for skin brightening, cellular health & immunity' },
      { id: 'nad-injection', name: 'NAD+ Injection', price: 125, description: 'Cellular energy, anti-aging & brain clarity' },
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
  {
    id: 'skincare',
    title: 'Prescription Skincare',
    description: 'Medical-grade anti-aging treatments',
    icon: '✨',
    programs: [
      { id: 'tretinoin', name: 'Tretinoin Cream', price: 125, description: 'Prescription retinoid for wrinkles, collagen & acne' },
      { id: 'tretinoin-ha', name: 'Tretinoin + HA Blend', price: 175, description: 'Tretinoin with hyaluronic acid for hydration' },
      { id: 'hydroquinone', name: 'Hydroquinone Brightening', price: 175, description: 'Prescription strength for dark spots & melasma' },
      { id: 'ghk-cu', name: 'GHK-Cu Peptide Cream', price: 275, description: 'Firming, repair & collagen support' },
      { id: 'cleartone', name: 'ClearTone Brightening', price: 275, description: 'Multi-acid blend for hyperpigmentation & tone' },
      { id: 'clarity', name: 'Clarity Acne Cream', price: 275, description: 'Azelaic acid + tretinoin for breakouts & redness' },
      { id: 'refine-pm', name: 'Refine PM Anti-Aging', price: 275, description: 'GHK-Cu + tretinoin for nighttime repair' },
      { id: 'lumineye', name: 'LuminEye Under-Eye', price: 275, description: 'GHK-Cu + tranexamic for dark circles & puffiness' },
    ],
  },
  {
    id: 'hair',
    title: 'Hair Restoration',
    description: 'Prescription treatments for hair loss',
    icon: '💇',
    programs: [
      { id: 'fin-minox-foam', name: 'Finasteride + Minoxidil Foam', price: 175, description: 'Topical DHT blocker + growth stimulator' },
      { id: 'fin-minox-solution', name: 'Finasteride + Minoxidil Solution', price: 175, description: 'Liquid formula for scalp application' },
      { id: 'advanced-hair', name: 'Advanced Hair Formula', price: 325, description: 'Finasteride + minoxidil + latanoprost + tretinoin' },
      { id: 'oral-minox', name: 'Oral Minoxidil', price: 40, description: 'Low-dose pill for systemic hair growth' },
    ],
  },
];

type Step = 'goal' | 'program' | 'info' | 'screening' | 'checkout';

// Medical screening questions by goal
const SCREENING_QUESTIONS: Record<string, Array<{id: string; question: string; type: 'yesno' | 'text'; disqualifyIf?: 'yes' | 'no'}>> = {
  'weight-loss': [
    { id: 'thyroid-cancer', question: 'Do you or any family members have a history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)?', type: 'yesno', disqualifyIf: 'yes' },
    { id: 'pancreatitis', question: 'Have you ever been diagnosed with pancreatitis?', type: 'yesno', disqualifyIf: 'yes' },
    { id: 'pregnant', question: 'Are you currently pregnant, breastfeeding, or planning to become pregnant in the next 6 months?', type: 'yesno', disqualifyIf: 'yes' },
    { id: 'diabetes-meds', question: 'Are you currently taking insulin or other diabetes medications?', type: 'yesno' },
    { id: 'current-meds', question: 'Please list any medications you are currently taking:', type: 'text' },
    { id: 'allergies', question: 'Do you have any known drug allergies?', type: 'text' },
    { id: 'medical-conditions', question: 'Please list any medical conditions you have been diagnosed with:', type: 'text' },
  ],
  'hormones': [
    { id: 'hormone-cancer', question: 'Do you have a history of hormone-sensitive cancer (breast, prostate, uterine)?', type: 'yesno', disqualifyIf: 'yes' },
    { id: 'blood-clots', question: 'Have you ever had blood clots, stroke, or heart attack?', type: 'yesno' },
    { id: 'pregnant', question: 'Are you currently pregnant, breastfeeding, or planning to become pregnant?', type: 'yesno', disqualifyIf: 'yes' },
    { id: 'current-meds', question: 'Please list any medications you are currently taking:', type: 'text' },
    { id: 'symptoms', question: 'What symptoms are you hoping to address with hormone therapy?', type: 'text' },
  ],
  'default': [
    { id: 'pregnant', question: 'Are you currently pregnant or breastfeeding?', type: 'yesno' },
    { id: 'current-meds', question: 'Please list any medications you are currently taking:', type: 'text' },
    { id: 'allergies', question: 'Do you have any known drug allergies?', type: 'text' },
    { id: 'medical-conditions', question: 'Please list any relevant medical conditions:', type: 'text' },
  ],
};

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
    agreeHipaa: false,
  });
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [disqualified, setDisqualified] = useState(false);
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

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy to continue');
      return;
    }
    if (!formData.agreeHipaa) {
      alert('Please acknowledge receipt of the HIPAA Notice of Privacy Practices to continue');
      return;
    }
    // Move to medical screening instead of checkout
    setStep('screening');
  };

  const getScreeningQuestions = () => {
    return SCREENING_QUESTIONS[selectedGoal] || SCREENING_QUESTIONS['default'];
  };

  const handleScreeningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for disqualifying answers
    const questions = getScreeningQuestions();
    for (const q of questions) {
      if (q.disqualifyIf && screeningAnswers[q.id] === q.disqualifyIf) {
        setDisqualified(true);
        return;
      }
    }
    
    setLoading(true);
    
    // Create checkout session
    try {
      const baseUrl = typeof window !== 'undefined' 
        ? `${window.location.protocol}//${window.location.host}` 
        : 'https://tryregenrx.com';
      
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
          mode: 'payment',
          successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/start?goal=${selectedGoal}`,
          metadata: {
            program: selectedProgram,
            goal: selectedGoal,
            dob: formData.dob,
            screening: JSON.stringify(screeningAnswers),
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
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <header style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            REGEN<span style={{ color: BRAND.pink }}>RX</span>
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.gray }}>
            <svg className="w-4 h-4" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure & HIPAA Compliant
          </div>
        </div>
      </header>

      {/* Progress */}
      <div style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {['Goal', 'Program', 'Info', 'Medical', 'Pay'].map((label, idx) => {
              const stepMap: Step[] = ['goal', 'program', 'info', 'screening', 'checkout'];
              const currentStepIdx = stepMap.indexOf(step);
              const isActive = currentStepIdx >= idx;
              const isCurrent = stepMap[idx] === step;
              return (
                <div key={label} className="flex items-center">
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold"
                    style={{
                      backgroundColor: isCurrent ? BRAND.pink : isActive ? `${BRAND.teal}30` : BRAND.dark,
                      color: isCurrent ? 'white' : isActive ? BRAND.teal : BRAND.gray,
                      border: `1px solid ${isCurrent ? BRAND.pink : isActive ? BRAND.teal : BRAND.gray}40`
                    }}
                  >
                    {isActive && !isCurrent ? '✓' : idx + 1}
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:block" style={{ color: isActive ? BRAND.cream : BRAND.gray }}>
                    {label}
                  </span>
                  {idx < 4 && (
                    <div 
                      className="w-4 sm:w-12 h-0.5 mx-1 sm:mx-2"
                      style={{ backgroundColor: currentStepIdx > idx ? BRAND.teal : `${BRAND.gray}30` }}
                    />
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.cream }}>What&apos;s your health goal?</h1>
            <p className="mb-8" style={{ color: BRAND.gray }}>Select the area you&apos;d like to focus on.</p>
            <div className="grid gap-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className="w-full p-6 rounded-xl text-left transition-all hover:scale-[1.02] group"
                  style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{goal.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold transition-colors" style={{ color: BRAND.cream }}>
                        {goal.title}
                      </h3>
                      <p style={{ color: BRAND.gray }}>{goal.description}</p>
                    </div>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-all" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <button onClick={() => setStep('goal')} className="flex items-center gap-2 mb-6 hover:opacity-80" style={{ color: BRAND.gray }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.cream }}>Choose your program</h1>
            <p className="mb-8" style={{ color: BRAND.gray }}>{currentGoal.title} programs available for you.</p>
            <div className="grid gap-4">
              {currentGoal.programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => handleProgramSelect(program.id)}
                  className="w-full p-6 rounded-xl text-left transition-all hover:scale-[1.02] group"
                  style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold transition-colors" style={{ color: BRAND.cream }}>
                      {program.name}
                    </h3>
                    <span className="text-2xl font-bold" style={{ color: BRAND.pink }}>${program.price}<span className="text-sm font-normal" style={{ color: BRAND.gray }}>/mo</span></span>
                  </div>
                  <p style={{ color: BRAND.gray }}>{program.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Patient Info */}
        {step === 'info' && currentProgram && (
          <div>
            <button onClick={() => setStep('program')} className="flex items-center gap-2 mb-6 hover:opacity-80" style={{ color: BRAND.gray }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.cream }}>Your information</h1>
            <p className="mb-8" style={{ color: BRAND.gray }}>We&apos;ll need a few details to get started.</p>
            
            <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}40` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold" style={{ color: BRAND.cream }}>{currentProgram.name}</p>
                  <p className="text-sm" style={{ color: BRAND.teal }}>{currentProgram.description}</p>
                </div>
                <span className="text-2xl font-bold" style={{ color: BRAND.pink }}>${currentProgram.price}</span>
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
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: BRAND.pink }}
                  required
                />
                <label htmlFor="terms" className="text-sm" style={{ color: BRAND.gray }}>
                  I agree to the{' '}
                  <Link href="/terms" className="hover:underline" style={{ color: BRAND.teal }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="hover:underline" style={{ color: BRAND.teal }}>Privacy Policy</Link>
                  , and I consent to receive telehealth services. <span style={{ color: BRAND.pink }}>*</span>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="hipaa"
                  checked={formData.agreeHipaa}
                  onChange={(e) => setFormData({ ...formData, agreeHipaa: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: BRAND.pink }}
                  required
                />
                <label htmlFor="hipaa" className="text-sm" style={{ color: BRAND.gray }}>
                  I acknowledge that I have received and reviewed the{' '}
                  <Link href="/hipaa" className="hover:underline" style={{ color: BRAND.teal }}>Notice of Privacy Practices (HIPAA)</Link>
                  {' '}and understand how my health information may be used and disclosed. <span style={{ color: BRAND.pink }}>*</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-4 text-white font-bold rounded-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: BRAND.pink }}
              >
                Continue to Health Questions
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Medical Screening */}
        {step === 'screening' && currentProgram && !disqualified && (
          <div>
            <button onClick={() => setStep('info')} className="flex items-center gap-2 mb-6 hover:opacity-80" style={{ color: BRAND.gray }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <div className="mb-6">
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}>
                Step 4 of 4
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-2" style={{ color: BRAND.cream }}>Medical Screening</h2>
            <p className="mb-8" style={{ color: BRAND.gray }}>
              Please answer these questions so our provider can evaluate your eligibility.
            </p>

            <form onSubmit={handleScreeningSubmit} className="space-y-6">
              {getScreeningQuestions().map((q) => (
                <div key={q.id} className="p-4 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: '1px solid #333' }}>
                  <label className="block font-medium mb-3" style={{ color: BRAND.cream }}>
                    {q.question}
                    {q.disqualifyIf && <span style={{ color: BRAND.pink }}> *</span>}
                  </label>
                  {q.type === 'yesno' ? (
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value="yes"
                          checked={screeningAnswers[q.id] === 'yes'}
                          onChange={() => setScreeningAnswers({ ...screeningAnswers, [q.id]: 'yes' })}
                          required
                          style={{ accentColor: BRAND.teal }}
                        />
                        <span style={{ color: BRAND.cream }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value="no"
                          checked={screeningAnswers[q.id] === 'no'}
                          onChange={() => setScreeningAnswers({ ...screeningAnswers, [q.id]: 'no' })}
                          required
                          style={{ accentColor: BRAND.teal }}
                        />
                        <span style={{ color: BRAND.cream }}>No</span>
                      </label>
                    </div>
                  ) : (
                    <textarea
                      value={screeningAnswers[q.id] || ''}
                      onChange={(e) => setScreeningAnswers({ ...screeningAnswers, [q.id]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                      style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                      placeholder="Type your answer..."
                    />
                  )}
                </div>
              ))}

              <div className="p-4 rounded-xl" style={{ backgroundColor: `${BRAND.teal}10`, border: `1px solid ${BRAND.teal}30` }}>
                <p className="text-sm" style={{ color: BRAND.teal }}>
                  <strong>Note:</strong> Your answers will be reviewed by a licensed provider who will determine if treatment is appropriate for you. 
                  If you do not qualify, you will receive a full refund.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-white font-bold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: BRAND.pink }}
              >
                {loading ? 'Processing...' : `Complete & Pay — $${currentProgram.price}`}
              </button>
            </form>
          </div>
        )}

        {/* Disqualified Message */}
        {disqualified && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.cream }}>
              We Can&apos;t Proceed Online
            </h2>
            <p className="mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
              Based on your responses, this treatment may not be safe for you without additional evaluation. 
              Please consult with your primary care provider or contact us directly to discuss your options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+16306366193"
                className="px-8 py-4 font-bold rounded-lg transition-all hover:scale-105"
                style={{ backgroundColor: BRAND.teal, color: 'white' }}
              >
                Call Us: (630) 636-6193
              </a>
              <Link
                href="/consult"
                className="px-8 py-4 font-bold rounded-lg border-2 transition-all hover:scale-105"
                style={{ borderColor: BRAND.pink, color: BRAND.pink }}
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: BRAND.darkAlt, borderTop: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-3xl mx-auto px-6 text-center text-xs" style={{ color: BRAND.gray }}>
          <p>Need help? Call <a href="tel:+16306366193" className="hover:underline" style={{ color: BRAND.teal }}>(630) 636-6193</a></p>
          <p className="mt-4" style={{ color: '#555', lineHeight: 1.6 }}>
            <strong>DISCLAIMER:</strong> The information provided is for educational purposes only and is not medical advice. 
            Compounded medications are patient-specific preparations made by 503A-licensed pharmacies. They are not FDA-approved drugs. 
            Treatments may be prescribed off-label. Results vary. Not all patients qualify.
          </p>
          <p className="mt-4" style={{ color: '#666' }}>© {new Date().getFullYear()} Hello Gorgeous PC</p>
        </div>
      </footer>
    </div>
  );
}

export default function RegenStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.dark }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${BRAND.pink} transparent transparent transparent` }} />
          <p style={{ color: BRAND.gray }}>Loading...</p>
        </div>
      </div>
    }>
      <RegenStartContent />
    </Suspense>
  );
}
