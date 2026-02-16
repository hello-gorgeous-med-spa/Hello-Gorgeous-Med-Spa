'use client';

// ============================================================
// MOBILE NAVIGATION COMPONENT
// Full navigation accessible on mobile via hamburger menu
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Quick access',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊', description: 'Overview' },
      { href: '/admin/calendar', label: "Today's schedule", icon: '📅', description: 'See appointments' },
      { href: '/admin/appointments/new', label: 'Book appointment', icon: '➕', description: 'Schedule a client' },
      { href: '/pos', label: 'Check out / POS', icon: '💳', description: 'Take payment' },
    ],
  },
  {
    title: 'Clients & bookings',
    items: [
      { href: '/admin/clients', label: 'Client list', icon: '👥', description: 'Find or view clients' },
      { href: '/admin/clients/new', label: 'Add new client', icon: '✨', description: 'Register a new client' },
      { href: '/admin/appointments', label: 'All appointments', icon: '🗓️', description: 'View or edit bookings' },
    ],
  },
  {
    title: 'Care & charting',
    items: [
      { href: '/admin/charts', label: 'Charts & notes', icon: '📋' },
      { href: '/admin/charting/injection-map', label: 'Injection mapping', icon: '💉' },
      { href: '/admin/consents', label: 'Consent forms', icon: '📝' },
      { href: '/admin/medications', label: 'Medications', icon: '💊' },
      { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
      { href: '/admin/compliance', label: 'Compliance', icon: '🛡️' },
    ],
  },
  {
    title: 'Sales & payments',
    items: [
      { href: '/admin/sales', label: 'Sales Ledger', icon: '📊' },
      { href: '/admin/sales/wallet', label: 'Business Wallet', icon: '💼' },
      { href: '/admin/gift-cards', label: 'Gift cards', icon: '🎁' },
      { href: '/admin/memberships', label: 'Memberships', icon: '💎' },
    ],
  },
  {
    title: 'Marketing & reports',
    items: [
      { href: '/admin/insights', label: 'AI Insights', icon: '✨' },
      { href: '/admin/marketing/assistant', label: 'Marketing Assistant', icon: '🤖' },
      { href: '/admin/marketing/contacts', label: 'Contact Collection', icon: '📋' },
      { href: '/admin/reports', label: 'Reports', icon: '📈' },
      { href: '/admin/sms', label: 'SMS / text', icon: '💬' },
    ],
  },
  {
    title: 'Team & settings',
    items: [
      { href: '/admin/staff', label: 'Staff & schedules', icon: '👤' },
      { href: '/admin/services', label: 'Services & pricing', icon: '✨' },
      { href: '/admin/users', label: 'Users & access', icon: '🔐' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
      { href: '/admin/settings/pretreatment', label: 'Pre-treatment', icon: '📋' },
      { href: '/admin/settings/aftercare', label: 'Aftercare', icon: '📄' },
      { href: '/admin/system-health', label: 'System Health', icon: '🩺' },
    ],
  },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-black hover:bg-white rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-[9999] transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black">
          <div className="flex items-center gap-2">
            <span className="text-xl">💗</span>
            <span className="font-semibold text-black">Hello Gorgeous</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-black hover:bg-white rounded-lg"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 pb-24">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xs font-semibold text-black uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-pink-50 text-pink-700'
                          : 'text-black hover:bg-white'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black bg-white">
          <p className="text-xs text-black text-center">Hello Gorgeous OS v1.4.0</p>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
