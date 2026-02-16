'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('Invalid or missing token');
      return;
    }

    async function verifyToken() {
      try {
        const res = await fetch('/api/portal/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (data.success) {
          setStatus('success');
          setTimeout(() => router.push('/portal'), 1500);
        } else {
          setStatus('error');
          setError(data.error || 'Verification failed');
        }
      } catch {
        setStatus('error');
        setError('Verification failed');
      }
    }

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin text-5xl mb-4">💗</div>
            <h1 className="text-2xl font-bold text-white">Verifying...</h1>
            <p className="text-white/70 mt-2">Please wait while we sign you in</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-400">Success!</h1>
            <p className="text-white/70 mt-2">Redirecting to your portal...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-white">Link Expired</h1>
            <p className="text-white/70 mt-2">{error}</p>
            <Link href="/portal/login" className="inline-block mt-6 bg-[#FF2D8E] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#FF2D8E]/90 transition-all">
              Request New Link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin text-5xl">💗</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
