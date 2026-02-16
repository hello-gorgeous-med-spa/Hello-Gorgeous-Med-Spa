'use client';

// ============================================================
// PUBLIC SIGN-UP PAGE
// Contact collection for marketing & loyalty enrollment
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    marketingConsent: true,
    loyaltyEnroll: true,
    smsConsent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/marketing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">You're In!</h1>
          <p className="text-black mb-6">
            Welcome to Hello Gorgeous! You'll receive exclusive offers, tips, and updates.
          </p>
          {formData.loyaltyEnroll && (
            <div className="bg-pink-50 rounded-xl p-4 mb-6">
              <p className="text-pink-700 font-medium">🎉 You've been enrolled in our rewards program!</p>
              <p className="text-sm text-pink-600 mt-1">Earn points on every visit.</p>
            </div>
          )}
          <Link
            href="/book"
            className="inline-block w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
          >
            Book Your First Appointment
          </Link>
          <Link
            href="/"
            className="inline-block mt-3 text-black hover:text-black"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💗</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Join Hello Gorgeous</h1>
          <p className="text-pink-100 text-sm">
            Get exclusive offers, beauty tips, and be the first to know about new treatments
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">First Name *</label>
              <input
                type="text"
                required
                autoComplete="given-name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full min-h-[44px] px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Last Name *</label>
              <input
                type="text"
                required
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full min-h-[44px] px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Email *</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full min-h-[44px] px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Phone (Optional)</label>
            <input
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full min-h-[44px] px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.loyaltyEnroll}
                onChange={(e) => setFormData({ ...formData, loyaltyEnroll: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-black text-pink-500 focus:ring-pink-500"
              />
              <div>
                <span className="font-medium text-black">Join Rewards Program</span>
                <p className="text-sm text-black">Earn points on every visit and redeem for free treatments</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-black text-pink-500 focus:ring-pink-500"
              />
              <div>
                <span className="font-medium text-black">Email Updates</span>
                <p className="text-sm text-black">Receive exclusive offers and beauty tips</p>
              </div>
            </label>

            {formData.phone && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smsConsent}
                  onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-black text-pink-500 focus:ring-pink-500"
                />
                <div>
                  <span className="font-medium text-black">SMS Updates</span>
                  <p className="text-sm text-black">Get appointment reminders and flash deals via text</p>
                </div>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[44px] py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-600 active:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25"
          >
            {submitting ? 'Signing up...' : 'Join Now'}
          </button>

          <p className="text-xs text-black text-center">
            By signing up, you agree to our{' '}
            <Link href="/privacy" className="text-pink-500 hover:underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/terms" className="text-pink-500 hover:underline">Terms of Service</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
