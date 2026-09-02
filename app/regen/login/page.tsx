'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // TODO: Implement actual auth
    setTimeout(() => {
      setError('Sign in coming soon. Contact us at (630) 636-6193.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BRAND.dark }}>
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={55} className="h-12 w-auto" />
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: BRAND.cream }}>
            Welcome back
          </h1>
          <p className="text-center mb-8" style={{ color: BRAND.gray }}>
            Sign in to manage your prescriptions and orders.
          </p>

          {error && (
            <div 
              className="mb-6 p-4 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: BRAND.darkCard,
                  color: BRAND.cream,
                  border: `1px solid ${BRAND.teal}30`,
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: BRAND.cream }}>
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm hover:underline" style={{ color: BRAND.teal }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: BRAND.darkCard,
                  color: BRAND.cream,
                  border: `1px solid ${BRAND.teal}30`,
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: `${BRAND.teal}20` }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ backgroundColor: BRAND.dark, color: BRAND.gray }}>
                  New to REGEN RX?
                </span>
              </div>
            </div>

            <Link
              href="/signup"
              className="mt-6 w-full flex justify-center py-4 rounded-xl font-semibold transition-all hover:scale-[1.02]"
              style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
            >
              Create an Account
            </Link>
          </div>

          <p className="mt-8 text-center text-sm" style={{ color: BRAND.gray }}>
            Need help?{' '}
            <a href="tel:+16306366193" className="hover:underline" style={{ color: BRAND.teal }}>
              (630) 636-6193
            </a>
          </p>
        </div>
      </div>

      {/* Right - Image/Branding */}
      <div 
        className="hidden lg:flex lg:flex-1 items-center justify-center p-12"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND.teal}20 0%, ${BRAND.pink}20 100%)`,
        }}
      >
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: BRAND.cream }}>
            Renew.<br />
            <span style={{ color: BRAND.teal }}>Rebalance.</span><br />
            <span style={{ color: BRAND.pink }}>Regenerate.</span>
          </h2>
          <p className="text-lg" style={{ color: BRAND.gray }}>
            Doctor-guided wellness delivered to your door.
          </p>
        </div>
      </div>
    </div>
  );
}
