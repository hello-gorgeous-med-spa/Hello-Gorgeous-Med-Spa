'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRegenAuth } from '@/components/regen/RegenAuthProvider';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading, signUp } = useRegenAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/account');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.dark }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${BRAND.pink} transparent transparent transparent` }} />
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-md text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${BRAND.teal}20` }}
          >
            <svg className="w-10 h-10" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>Check your email</h1>
          <p className="mb-8" style={{ color: BRAND.gray }}>
            We&apos;ve sent a confirmation link to <strong style={{ color: BRAND.cream }}>{formData.email}</strong>. 
            Click the link to verify your account and sign in.
          </p>
          <Link
            href="/login"
            className="inline-flex px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BRAND.dark }}>
      {/* Left - Branding */}
      <div 
        className="hidden lg:flex lg:flex-1 items-center justify-center p-12"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND.pink}20 0%, ${BRAND.teal}20 100%)`,
        }}
      >
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: BRAND.cream }}>
            Start your<br />
            <span style={{ color: BRAND.pink }}>wellness</span><br />
            <span style={{ color: BRAND.teal }}>journey</span>
          </h2>
          <p className="text-lg mb-8" style={{ color: BRAND.gray }}>
            Join thousands who have transformed their health with REGEN RX.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '1,900+', label: '5-Star Reviews' },
              { value: '24-48h', label: 'Provider Review' },
              { value: 'Free', label: 'Shipping' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold" style={{ color: BRAND.cream }}>{stat.value}</p>
                <p className="text-xs" style={{ color: BRAND.gray }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 overflow-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={55} className="h-12 w-auto" />
          </Link>
          
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: BRAND.cream }}>
            Create your account
          </h1>
          <p className="text-center mb-8" style={{ color: BRAND.gray }}>
            Get started with prescription wellness today.
          </p>

          {error && (
            <div 
              className="mb-6 p-4 rounded-lg text-sm"
              style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: BRAND.darkCard,
                    color: BRAND.cream,
                    border: `1px solid ${BRAND.teal}30`,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: BRAND.darkCard,
                    color: BRAND.cream,
                    border: `1px solid ${BRAND.teal}30`,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: BRAND.darkCard,
                  color: BRAND.cream,
                  border: `1px solid ${BRAND.teal}30`,
                }}
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: BRAND.darkCard,
                  color: BRAND.cream,
                  border: `1px solid ${BRAND.teal}30`,
                }}
                placeholder="At least 8 characters"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                required
                className="mt-1 w-4 h-4 rounded"
                style={{ accentColor: BRAND.pink }}
              />
              <label htmlFor="terms" className="text-sm" style={{ color: BRAND.gray }}>
                I agree to the{' '}
                <Link href="/terms" className="hover:underline" style={{ color: BRAND.teal }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="hover:underline" style={{ color: BRAND.teal }}>Privacy Policy</Link>
                , and I consent to receive telehealth services.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.agreeTerms}
              className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: `${BRAND.teal}20` }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ backgroundColor: BRAND.dark, color: BRAND.gray }}>
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="mt-6 w-full flex justify-center py-4 rounded-xl font-semibold transition-all hover:scale-[1.02]"
              style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
            >
              Sign In
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
    </div>
  );
}
