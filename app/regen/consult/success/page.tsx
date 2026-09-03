'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 24px',
        borderBottom: '1px solid #222',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
        </div>
      </header>

      <main style={{ 
        padding: '80px 24px', 
        maxWidth: 600, 
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Success Icon */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: `${BRAND.teal}20`,
          border: `3px solid ${BRAND.teal}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={BRAND.teal} strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 800, 
          marginBottom: 16,
          background: `linear-gradient(135deg, #fff 0%, ${BRAND.teal} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Consultation Booked!
        </h1>

        <p style={{ fontSize: 18, color: '#aaa', marginBottom: 32, lineHeight: 1.6 }}>
          Thank you for booking with REGEN RX. Ryan Kent will be in touch shortly with your video call link.
        </p>

        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
          textAlign: 'left',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: BRAND.teal }}>
            What happens next?
          </h3>
          <ol style={{ 
            paddingLeft: 20, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            color: '#ccc',
            fontSize: 14,
          }}>
            <li>
              <strong style={{ color: '#fff' }}>Check your email</strong> — You'll receive a confirmation with your appointment details
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Join your video call</strong> — Use the secure Doxy.me link below at your scheduled time
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Prepare questions</strong> — Write down any health concerns or goals you want to discuss
            </li>
            <li>
              <strong style={{ color: '#fff' }}>$99 credit</strong> — Your consultation fee will be applied to your first prescription order
            </li>
          </ol>
        </div>

        {/* Doxy.me Video Link */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
          textAlign: 'center',
          border: `2px solid ${BRAND.teal}`,
        }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
            Your secure video call link:
          </div>
          <a
            href="https://doxy.me/ryankent"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              backgroundColor: BRAND.teal,
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
              borderRadius: 12,
              textDecoration: 'none',
              marginBottom: 12,
            }}
          >
            doxy.me/ryankent
          </a>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
            Bookmark this link — join at your scheduled appointment time
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/learn"
            style={{
              padding: '14px 28px',
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Learn About Treatments
          </Link>
          <Link
            href="/pricing"
            style={{
              padding: '14px 28px',
              backgroundColor: BRAND.pink,
              color: '#fff',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            View All Programs
          </Link>
        </div>

        <p style={{ fontSize: 13, color: '#666', marginTop: 40 }}>
          Questions? Call us at <a href="tel:6306366193" style={{ color: BRAND.teal }}>630-636-6193</a>
        </p>
      </main>
    </div>
  );
}

export default function ConsultSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        backgroundColor: '#0a0a0a', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
      }}>
        Loading...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
