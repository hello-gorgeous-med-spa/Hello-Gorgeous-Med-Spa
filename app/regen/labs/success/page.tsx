'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

function LabSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<{
    panelName?: string;
    patientEmail?: string;
  } | null>(null);

  useEffect(() => {
    // Could fetch order details from session_id if needed
    // For now, just show success message
  }, [sessionId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <header style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={45} className="h-10 w-auto brightness-110" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: `${BRAND.teal}20`, border: `3px solid ${BRAND.teal}` }}
          >
            <svg className="w-12 h-12" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>
          Lab Order Confirmed! 🧪
        </h1>
        
        <p className="text-lg mb-8" style={{ color: BRAND.gray }}>
          Your lab requisition is being prepared and will be emailed to you shortly.
        </p>

        {/* Next Steps */}
        <div className="rounded-2xl p-6 mb-8 text-left" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}40` }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: BRAND.teal }}>
            📋 What Happens Next
          </h2>
          <ol className="space-y-4" style={{ color: BRAND.gray }}>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal, color: 'white' }}>1</span>
              <div>
                <p className="font-semibold" style={{ color: BRAND.cream }}>Check Your Email</p>
                <p className="text-sm">You&apos;ll receive your lab requisition form within the next few minutes.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal, color: 'white' }}>2</span>
              <div>
                <p className="font-semibold" style={{ color: BRAND.cream }}>Visit a Draw Site</p>
                <p className="text-sm">Bring your requisition to any Quest Diagnostics or Labcorp location. No appointment needed.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal, color: 'white' }}>3</span>
              <div>
                <p className="font-semibold" style={{ color: BRAND.cream }}>Results in 2-5 Days</p>
                <p className="text-sm">We&apos;ll notify you when results are ready for provider review.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal, color: 'white' }}>4</span>
              <div>
                <p className="font-semibold" style={{ color: BRAND.cream }}>Provider Review</p>
                <p className="text-sm">Our provider will review your results and approve your treatment if appropriate.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Find a Draw Site */}
        <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: `${BRAND.pink}10`, border: `1px solid ${BRAND.pink}40` }}>
          <h3 className="font-bold mb-2" style={{ color: BRAND.pink }}>🗺️ Find a Draw Site Near You</h3>
          <p className="text-sm mb-4" style={{ color: BRAND.gray }}>
            Quest and Labcorp have thousands of locations. Find one near you:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.labcorp.com/labs-and-appointments-702702702702700"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: '#003366', color: 'white' }}
            >
              Labcorp Locations
            </a>
            <a
              href="https://appointment.questdiagnostics.com/patient/confirmation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: '#00A4E4', color: 'white' }}
            >
              Quest Diagnostics
            </a>
          </div>
        </div>

        {/* Fasting Reminder */}
        <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: '#7f1d1d20', border: '1px solid #EF4444' }}>
          <p className="text-sm" style={{ color: '#EF4444' }}>
            <strong>⚠️ Fasting Required:</strong> Most panels require 8-12 hours of fasting (water is OK). 
            Schedule your blood draw in the morning for best results.
          </p>
        </div>

        {/* Continue to Intake */}
        <div className="space-y-4">
          <Link
            href="/start"
            className="inline-block px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Continue Your Intake →
          </Link>
          <p className="text-sm" style={{ color: BRAND.gray }}>
            You can complete your health questionnaire now. We&apos;ll match it with your lab results when ready.
          </p>
        </div>

        {/* Help */}
        <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${BRAND.gray}30` }}>
          <p style={{ color: BRAND.gray }}>
            Questions? Call us at{' '}
            <a href="tel:+16306366193" style={{ color: BRAND.teal }}>
              (630) 636-6193
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LabSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.dark }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${BRAND.teal} transparent transparent transparent` }} />
      </div>
    }>
      <LabSuccessContent />
    </Suspense>
  );
}
