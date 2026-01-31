// ============================================================
// CLIENT PORTAL LAYOUT
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Portal | Hello Gorgeous Med Spa',
  description: 'Manage your appointments, view treatment history, and book services.',
};

const NAV_ITEMS = [
  { href: '/portal', label: 'Dashboard', icon: '🏠' },
  { href: '/portal/appointments', label: 'Appointments', icon: '📅' },
  { href: '/portal/book', label: 'Book Now', icon: '✨' },
  { href: '/portal/rewards', label: 'Rewards', icon: '🎁' },
  { href: '/portal/referrals', label: 'Refer Friends', icon: '💝' },
  { href: '/portal/journey', label: 'My Journey', icon: '📈' },
  { href: '/portal/history', label: 'History', icon: '📋' },
  { href: '/portal/intake', label: 'Forms', icon: '📝' },
  { href: '/portal/membership', label: 'Membership', icon: '💎' },
  { href: '/portal/profile', label: 'Profile', icon: '👤' },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/portal" className="flex items-center gap-2">
              <span className="text-2xl">💗</span>
              <span className="font-semibold text-gray-900">
                Hello Gorgeous
              </span>
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
                Portal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/portal/book"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <span>✨</span>
                Book Now
              </Link>
              <button className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors">
                <span className="text-lg">👤</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 text-gray-500 hover:text-pink-600 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
