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

const QUICK_ACTIONS = [
  { label: 'Start New Visit', href: '/start', icon: 'plus', color: BRAND.pink },
  { label: 'View Orders', href: '/account/orders', icon: 'package', color: BRAND.teal },
  { label: 'Message Provider', href: '/account/messages', icon: 'message', color: BRAND.teal },
];

const STATUS_CARDS = [
  {
    title: 'Active Prescriptions',
    value: '0',
    subtitle: 'No active prescriptions',
    icon: 'pill',
    color: BRAND.teal,
  },
  {
    title: 'Pending Orders',
    value: '0',
    subtitle: 'No pending orders',
    icon: 'clock',
    color: BRAND.pink,
  },
  {
    title: 'Unread Messages',
    value: '0',
    subtitle: 'All caught up',
    icon: 'message',
    color: BRAND.teal,
  },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    plus: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    package: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    message: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    pill: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    clock: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    arrow: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function AccountDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Welcome back</h1>
        <p style={{ color: BRAND.gray }}>Manage your prescriptions, orders, and account settings.</p>
      </div>

      {/* CTA Banner - Not signed in */}
      <div 
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND.pink}20 0%, ${BRAND.teal}20 100%)`,
          border: `1px solid ${BRAND.pink}30`,
        }}
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>
            Create your account
          </h2>
          <p className="mb-4 max-w-md" style={{ color: BRAND.gray }}>
            Sign up to track your orders, manage prescriptions, and message your provider directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
            >
              Sign In
            </Link>
          </div>
        </div>
        {/* Decorative element */}
        <div 
          className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-20"
          style={{ backgroundColor: BRAND.pink }}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.cream }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{ 
                backgroundColor: BRAND.darkCard,
                border: `1px solid ${action.color}30`,
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Icon name={action.icon} className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: BRAND.cream }}>{action.label}</p>
              </div>
              <Icon name="arrow" className="w-5 h-5" style={{ color: BRAND.gray }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Status Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.cream }}>Your Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATUS_CARDS.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-xl"
              style={{ 
                backgroundColor: BRAND.darkCard,
                border: `1px solid ${BRAND.teal}20`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon name={card.icon} className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: BRAND.cream }}>{card.value}</p>
              <p className="text-sm font-medium" style={{ color: BRAND.gray }}>{card.title}</p>
              <p className="text-xs mt-1" style={{ color: BRAND.gray }}>{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity - Empty State */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.cream }}>Recent Activity</h2>
        <div 
          className="p-8 rounded-xl text-center"
          style={{ 
            backgroundColor: BRAND.darkCard,
            border: `1px solid ${BRAND.teal}20`,
          }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${BRAND.teal}10` }}
          >
            <Icon name="clock" className="w-8 h-8" style={{ color: BRAND.teal }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND.cream }}>No activity yet</h3>
          <p className="mb-4" style={{ color: BRAND.gray }}>
            Start your first visit to see your activity here.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start Your Visit
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Help */}
      <div 
        className="p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid ${BRAND.teal}20`,
        }}
      >
        <div>
          <h3 className="font-semibold mb-1" style={{ color: BRAND.cream }}>Need help?</h3>
          <p className="text-sm" style={{ color: BRAND.gray }}>
            Our team is available Monday–Friday, 9am–5pm CT.
          </p>
        </div>
        <a
          href="tel:+16306366193"
          className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap"
          style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
        >
          (630) 636-6193
        </a>
      </div>
    </div>
  );
}
