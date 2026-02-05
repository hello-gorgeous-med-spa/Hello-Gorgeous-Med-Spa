// ============================================================
// ADMIN DASHBOARD LAYOUT
// Command Center for Hello Gorgeous Med Spa
// Clean collapsible navigation
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';
import { KeyboardShortcutsProvider } from '@/components/ui/KeyboardShortcuts';
import { MobileNav } from '@/components/ui/MobileNav';

// Collapsible nav section component
function NavSection({ 
  title, 
  icon,
  items, 
  isActive,
  defaultOpen = false 
}: { 
  title: string;
  icon: string;
  items: { href: string; label: string; icon: string }[];
  isActive: (href: string) => boolean;
  defaultOpen?: boolean;
}) {
  const pathname = usePathname();
  const hasActiveItem = items.some(item => isActive(item.href));
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveItem);

  useEffect(() => {
    if (hasActiveItem && !isOpen) {
      setIsOpen(true);
    }
  }, [hasActiveItem, pathname]);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
          hasActiveItem ? 'bg-pink-50/50' : 'hover:bg-gray-50'
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span className={`flex-1 font-medium text-sm ${hasActiveItem ? 'text-pink-700' : 'text-gray-700'}`}>
          {title}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <ul className="pb-2 pl-5 pr-2 space-y-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.href)
                    ? 'bg-pink-100 text-pink-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Switch to admin manifest for PWA install
function useAdminManifest() {
  useEffect(() => {
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    const originalHref = manifestLink?.href;
    
    if (manifestLink) {
      manifestLink.href = '/admin-manifest.json';
    } else {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/admin-manifest.json';
      document.head.appendChild(manifestLink);
    }

    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) {
      themeColor.content = '#0f172a';
    }

    return () => {
      if (manifestLink && originalHref) {
        manifestLink.href = originalHref;
      }
    };
  }, []);
}

// Collapsible navigation sections
const NAV_SECTIONS = [
  {
    title: 'Clients',
    icon: '👥',
    items: [
      { href: '/admin/clients', label: 'All Clients', icon: '👤' },
      { href: '/admin/clients/new', label: 'Add Client', icon: '➕' },
      { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
      { href: '/admin/calendar', label: 'Calendar', icon: '🗓' },
    ],
  },
  {
    title: 'Clinical',
    icon: '💉',
    items: [
      { href: '/admin/charting/injection-map', label: 'Injection Mapping', icon: '💉' },
      { href: '/admin/charts', label: 'Charts & Notes', icon: '📋' },
      { href: '/admin/consents', label: 'Consent Forms', icon: '📝' },
      { href: '/admin/medications', label: 'Medications', icon: '💊' },
      { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
    ],
  },
  {
    title: 'Chart-to-Cart',
    icon: '🛒',
    items: [
      { href: '/admin/chart-to-cart', label: 'Active Sessions', icon: '⚡' },
      { href: '/admin/chart-to-cart/new', label: 'New Session', icon: '➕' },
      { href: '/admin/chart-to-cart/history', label: 'Session History', icon: '📜' },
      { href: '/admin/chart-to-cart/products', label: 'Products & Pricing', icon: '💊' },
    ],
  },
  {
    title: 'Sales',
    icon: '💰',
    items: [
      { href: '/admin/sales', label: 'Sales Ledger', icon: '📊' },
      { href: '/admin/payments', label: 'Payments', icon: '💳' },
      { href: '/admin/gift-cards', label: 'Gift Cards', icon: '🎁' },
      { href: '/admin/memberships', label: 'Memberships', icon: '💎' },
      { href: '/admin/promotions', label: 'Promotions', icon: '🏷' },
    ],
  },
  {
    title: 'Services',
    icon: '✨',
    items: [
      { href: '/admin/services', label: 'Services & Pricing', icon: '💅' },
      { href: '/admin/packages', label: 'Packages', icon: '📦' },
    ],
  },
  {
    title: 'Marketing',
    icon: '📣',
    items: [
      { href: '/admin/insights', label: 'AI Insights', icon: '🤖' },
      { href: '/admin/sms', label: 'SMS Campaigns', icon: '💬' },
      { href: '/admin/marketing', label: 'Marketing Hub', icon: '📈' },
      { href: '/admin/reports', label: 'Reports', icon: '📊' },
    ],
  },
  {
    title: 'Settings',
    icon: '⚙️',
    items: [
      { href: '/admin/staff', label: 'Staff', icon: '👤' },
      { href: '/admin/users', label: 'Users & Access', icon: '🔐' },
      { href: '/admin/vendors', label: 'Vendors', icon: '🏢' },
      { href: '/admin/settings', label: 'Business Settings', icon: '⚙️' },
      { href: '/admin/settings/pretreatment', label: 'Pre-treatment', icon: '📋' },
      { href: '/admin/settings/aftercare', label: 'Aftercare', icon: '📄' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  useAdminManifest();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <ToastProvider>
      <KeyboardShortcutsProvider>
        <div className="min-h-screen bg-gray-50 admin-panel">
          <AdminHeader />

          <div className="flex">
            {/* Sidebar - Collapsible sections */}
            <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] sticky top-14 hidden lg:block overflow-y-auto">
              {/* Dashboard link - always visible */}
              <div className="p-3 border-b border-gray-100">
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    pathname === '/admin'
                      ? 'bg-pink-100 text-pink-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/pos"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors mt-1"
                >
                  <span className="text-lg">💳</span>
                  <span className="font-medium">POS / Checkout</span>
                </Link>
              </div>

              {/* Collapsible sections */}
              <nav className="py-2">
                {NAV_SECTIONS.map((section) => (
                  <NavSection
                    key={section.title}
                    title={section.title}
                    icon={section.icon}
                    items={section.items}
                    isActive={isActive}
                  />
                ))}
              </nav>

              {/* Footer */}
              <div className="sticky bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white/95 backdrop-blur">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-pink-500 text-sm">💗</span>
                  <p className="text-xs text-gray-500 font-medium">Hello Gorgeous OS</p>
                </div>
              </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <div className="flex justify-around items-center h-16 px-2">
                <MobileNav />
                {[
                  { href: '/admin', icon: '📊', label: 'Home' },
                  { href: '/admin/calendar', icon: '📅', label: 'Today' },
                  { href: '/admin/appointments/new', icon: '➕', label: 'Book' },
                  { href: '/pos', icon: '💳', label: 'POS' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-2 rounded-xl transition-colors ${
                      isActive(item.href) ? 'text-pink-600 bg-pink-50' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-6 pb-24 lg:pb-6 min-h-[calc(100vh-56px)]">
              {children}
            </main>
          </div>
        </div>
      </KeyboardShortcutsProvider>
    </ToastProvider>
  );
}
