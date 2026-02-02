'use client';

// ============================================================
// LOGIN PAGE
// Branded authentication for Hello Gorgeous Med Spa
// ============================================================

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  // Check if we're in production (hide demo buttons)
  const isProduction = typeof window !== 'undefined' && 
    window.location.hostname === 'hellogorgeousmedspa.com';

  const doLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save to localStorage for session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('hgos_user', JSON.stringify(data.user));
        localStorage.setItem('hgos_session', JSON.stringify({
          user: data.user,
          accessToken: data.session?.access_token,
          expiresAt: (data.session?.expires_at || 0) * 1000,
        }));
      }

      // If there's a returnTo URL, redirect there (if allowed)
      if (returnTo && !returnTo.includes('://')) {
        router.push(returnTo);
        return;
      }

      // Redirect based on role
      const role = data.user?.role || 'client';
      switch (role) {
        case 'owner':
          router.push('/admin/owner');
          break;
        case 'admin':
          router.push('/admin');
          break;
        case 'provider':
          router.push('/provider');
          break;
        case 'staff':
          router.push('/admin');
          break;
        default:
          router.push('/portal');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doLogin(formData.email, formData.password);
  };

  const quickLogin = async (email: string, password: string) => {
    setFormData({ ...formData, email, password });
    await doLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-5xl">💗</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">
            Hello Gorgeous
          </h1>
          <p className="mt-2 text-pink-200/70">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-pink-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-pink-100 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-sm text-pink-100">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-pink-300 hover:text-pink-200 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Development Only - Demo Logins */}
          {!isProduction && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/50">Development Only</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => quickLogin('owner@hellogorgeousmedspa.com', 'owner123')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                >
                  Demo: Owner
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('admin@hellogorgeousmedspa.com', 'admin123')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Demo: Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('provider@hellogorgeousmedspa.com', 'provider123')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Demo: Provider
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('staff@hellogorgeousmedspa.com', 'staff123')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Demo: Staff
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            New client?{' '}
            <Link href="/book" className="text-pink-300 hover:text-pink-200 transition-colors">
              Book an appointment
            </Link>
          </p>
          <p className="mt-4 text-white/30 text-xs">
            © {new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">💗</div>
          <p className="text-pink-200/70">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
