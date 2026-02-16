'use client';

// ============================================================
// MAGIC LINK CALLBACK
// Handles redirect from Supabase after user clicks magic link.
// Exchanges token for session, sets cookie, redirects to /portal.
// No PHI in URL (tokens in hash are not sent to server).
// ============================================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/hgos/supabase';
import { saveSession } from '@/lib/hgos/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;
      if (!hash) {
        setStatus('error');
        setMessage('Invalid link. Please request a new login link.');
        return;
      }

      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken) {
        setStatus('error');
        setMessage('Invalid link. Please request a new login link.');
        return;
      }

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setStatus('error');
        setMessage('Unable to sign in. Please try again.');
        return;
      }

      try {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken || '' });
        if (cancelled) return;

        const res = await fetch('/api/auth/client-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        });
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Could not complete sign-in.');
          return;
        }

        if (data.user && data.session) {
          saveSession(data.user, data.session);
          if (data.user.clientId && typeof window !== 'undefined') {
            window.sessionStorage.setItem('client_id', data.user.clientId);
            window.sessionStorage.setItem('client_email', data.user.email || '');
          }
        }
        setStatus('success');
        window.location.href = data.redirect || '/portal';
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setMessage('Something went wrong. Please try again.');
        }
      }
    }

    handleCallback();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-black to-black">
      <div className="w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/80">Signing you in...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-300 mb-4">{message}</p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600"
            >
              Back to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
