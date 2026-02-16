'use client';

// ============================================================
// LOGIN PAGE — Client-safe
// Primary: Magic link (email only). Secondary: Staff sign-in (password).
// No passwords for clients; HIPAA-aligned.
// ============================================================

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hgos/AuthContext';

function LoginForm() {
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<'magic' | 'staff'>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  // Redirect if already authenticated — client login page must not send clients to admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const returnTo = searchParams.get('returnTo') || searchParams.get('redirect');
      // Client: always send to portal (or returnTo if it's portal)
      if (user.role === 'client') {
        window.location.href = returnTo && returnTo.startsWith('/portal') ? returnTo : '/portal';
        return;
      }
      // Admin/staff/provider/owner: redirect to dashboard only when returnTo indicates admin intent (e.g. came from /admin)
      if (['owner', 'admin', 'staff', 'provider'].includes(user.role)) {
        if (returnTo && !returnTo.includes('://') && (returnTo.startsWith('/admin') || returnTo.startsWith('/provider') || returnTo.startsWith('/pos'))) {
          window.location.href = returnTo;
          return;
        }
        // No admin returnTo: show client login form (do not redirect). Keeps /login client-first; staff can use "Staff sign in".
      }
    }
  }, [authLoading, isAuthenticated, user, searchParams]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send link');
      setMagicSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (!result.success) throw new Error(result.error || 'Invalid email or password');
      await new Promise((r) => setTimeout(r, 100));
      const returnTo = searchParams.get('returnTo') || searchParams.get('redirect') || '/admin';
      window.location.href = returnTo;
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF2D8E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-black to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">💗</span>
          <h1 className="mt-4 text-3xl font-bold text-white">Hello Gorgeous</h1>
          <p className="mt-2 text-pink-200/70">
            {mode === 'magic' ? 'Sign in with a secure link' : 'Staff sign in'}
          </p>
        </div>

        <div className="bg-white backdrop-blur-xl rounded-2xl border border-black p-8">
          {magicSent ? (
            <div className="text-center space-y-4">
              <p className="text-white/90">
                Check your email. We sent a secure, one-time login link to <strong className="text-white">{email}</strong>.
              </p>
              <p className="text-sm text-pink-200/80">
                The link expires in 15 minutes. If you don’t see it, check spam.
              </p>
              <button
                type="button"
                onClick={() => { setMagicSent(false); setError(''); }}
                className="text-pink-300 hover:text-pink-200 text-sm underline"
              >
                Use a different email
              </button>
            </div>
          ) : mode === 'magic' ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-pink-100 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[44px]"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <p className="text-xs text-pink-200/70">
                No password required. We’ll email you a secure, one-time link.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-black disabled:opacity-50 min-h-[44px]"
              >
                {isLoading ? 'Sending…' : 'Send me a secure login link'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStaffSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-pink-100 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[44px]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-100 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[44px]"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-black disabled:opacity-50 min-h-[44px]"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {!magicSent && (
            <div className="mt-6 pt-6 border-t border-black text-center">
              <button
                type="button"
                onClick={() => { setMode(mode === 'magic' ? 'staff' : 'magic'); setError(''); setPassword(''); }}
                className="text-sm text-pink-300 hover:text-pink-200"
              >
                {mode === 'magic' ? 'Staff sign in with password' : 'Back to login link'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-pink-300 hover:text-pink-200 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black">
          <div className="w-12 h-12 border-4 border-[#FF2D8E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
