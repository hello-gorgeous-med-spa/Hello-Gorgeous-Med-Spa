'use client';

import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Settings</h1>
        <p style={{ color: BRAND.gray }}>Manage your account preferences and information.</p>
      </div>

      {/* Not Signed In Notice */}
      <div 
        className="p-6 rounded-xl"
        style={{ 
          backgroundColor: `${BRAND.pink}10`,
          border: `1px solid ${BRAND.pink}30`,
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: BRAND.pink }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: BRAND.cream }}>Sign in to manage settings</h3>
            <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
              Create an account or sign in to update your profile, payment methods, and preferences.
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                href="/signup"
                className="px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: BRAND.pink, color: 'white' }}
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile */}
        <div 
          className="p-6 rounded-xl"
          style={{ 
            backgroundColor: BRAND.darkCard,
            border: `1px solid ${BRAND.teal}20`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Profile</h3>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: '—' },
              { label: 'Email', value: '—' },
              { label: 'Phone', value: '—' },
              { label: 'Date of Birth', value: '—' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: `${BRAND.teal}10` }}>
                <span className="text-sm" style={{ color: BRAND.gray }}>{item.label}</span>
                <span className="font-medium" style={{ color: BRAND.cream }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div 
          className="p-6 rounded-xl"
          style={{ 
            backgroundColor: BRAND.darkCard,
            border: `1px solid ${BRAND.teal}20`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Shipping Address</h3>
          <p className="text-sm" style={{ color: BRAND.gray }}>No shipping address on file.</p>
        </div>

        {/* Payment */}
        <div 
          className="p-6 rounded-xl"
          style={{ 
            backgroundColor: BRAND.darkCard,
            border: `1px solid ${BRAND.teal}20`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Payment Methods</h3>
          <p className="text-sm" style={{ color: BRAND.gray }}>No payment methods on file.</p>
        </div>

        {/* Subscription */}
        <div 
          className="p-6 rounded-xl"
          style={{ 
            backgroundColor: BRAND.darkCard,
            border: `1px solid ${BRAND.teal}20`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Subscription</h3>
          <p className="text-sm mb-4" style={{ color: BRAND.gray }}>No active subscription.</p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start a Program
          </Link>
        </div>

        {/* Notifications */}
        <div 
          className="p-6 rounded-xl"
          style={{ 
            backgroundColor: BRAND.darkCard,
            border: `1px solid ${BRAND.teal}20`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Order updates', desc: 'Get notified when orders ship and deliver' },
              { label: 'Messages', desc: 'Get notified when your care team responds' },
              { label: 'Refill reminders', desc: 'Reminders when prescriptions need refill' },
              { label: 'Promotions', desc: 'News about new programs and offers' },
            ].map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium" style={{ color: BRAND.cream }}>{item.label}</p>
                  <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
                </div>
                <div 
                  className="w-12 h-6 rounded-full relative cursor-not-allowed opacity-50"
                  style={{ backgroundColor: `${BRAND.gray}30` }}
                >
                  <div 
                    className="w-5 h-5 rounded-full absolute top-0.5 left-0.5"
                    style={{ backgroundColor: BRAND.gray }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div 
        className="p-6 rounded-xl"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid #dc262640`,
        }}
      >
        <h3 className="font-semibold mb-2" style={{ color: '#dc2626' }}>Danger Zone</h3>
        <p className="text-sm mb-4" style={{ color: BRAND.gray }}>
          These actions are permanent and cannot be undone.
        </p>
        <button
          disabled
          className="px-5 py-2 rounded-lg font-semibold text-sm border opacity-50 cursor-not-allowed"
          style={{ borderColor: '#dc2626', color: '#dc2626' }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
