'use client';

// ============================================================
// LOGIN PAGE - SIMPLIFIED FOR DEBUGGING
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      console.log('Login response:', { ok: response.ok, data });

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Show success message
      setError(''); // Clear any error
      
      // Save session
      try {
        localStorage.setItem('hgos_user', JSON.stringify(data.user));
        localStorage.setItem('hgos_session', JSON.stringify({
          user: data.user,
          accessToken: data.session?.access_token,
          expiresAt: (data.session?.expires_at || 0) * 1000,
        }));
        console.log('Session saved to localStorage');
      } catch (storageErr) {
        console.error('localStorage error:', storageErr);
      }

      // Determine redirect URL
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo');
      
      let redirectUrl = '/admin'; // Default
      
      if (returnTo && !returnTo.includes('://')) {
        redirectUrl = returnTo;
      } else {
        const role = data.user?.role || 'client';
        if (role === 'owner') redirectUrl = '/admin/owner';
        else if (role === 'admin' || role === 'staff') redirectUrl = '/admin';
        else if (role === 'provider') redirectUrl = '/provider';
      }
      
      console.log('Redirecting to:', redirectUrl, 'Role:', data.user?.role);
      
      // Show success before redirect
      alert(`Login successful! Role: ${data.user?.role}. Redirecting to ${redirectUrl}`);
      
      // Hard redirect
      window.location.href = redirectUrl;
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">💗</span>
          <h1 className="mt-4 text-3xl font-bold text-white">Hello Gorgeous</h1>
          <p className="mt-2 text-pink-200/70">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-pink-300 hover:text-pink-200 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
