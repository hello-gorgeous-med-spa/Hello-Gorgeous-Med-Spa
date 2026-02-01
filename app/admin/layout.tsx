// ============================================================
// ADMIN DASHBOARD LAYOUT
// Command Center for Hello Gorgeous Med Spa
// Clean Blueprint - No Static Data
// ============================================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/AdminHeader';

// Switch to admin manifest for PWA install
function useAdminManifest() {
  useEffect(() => {
    // Find existing manifest link or create one
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

    // Set theme color for admin
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) {
      themeColor.content = '#0f172a';
    }

    // Cleanup: restore original on unmount
    return () => {
      if (manifestLink && originalHref) {
        manifestLink.href = originalHref;
      }
    };
  }, []);
}

// User- and provider-friendly navigation — clear labels, logical grouping
const NAV_SECTIONS = [
  {
    title: 'Quick access',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊', description: 'Today’s overview' },
      { href: '/admin/calendar', label: "Today's schedule", icon: '📅', description: 'See who’s coming in' },
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
      { href: '/admin/charts', label: 'Charts & notes', icon: '📋', description: 'SOAP notes & clinical' },
      { href: '/admin/consents', label: 'Consent forms', icon: '📝', description: 'Sign & track consents' },
      { href: '/admin/charm', label: 'Charm EHR', icon: '🏥', description: 'E-prescribing & records' },
      { href: '/admin/medications', label: 'Medications', icon: '💊', description: 'Drug tracking' },
      { href: '/admin/inventory', label: 'Inventory', icon: '📦', description: 'Products & lots' },
      { href: '/admin/compliance', label: 'Compliance', icon: '🛡️', description: 'Safety & incidents' },
    ],
  },
  {
    title: 'Payments & menu',
    items: [
      { href: '/admin/payments', label: 'Payments', icon: '💰', description: 'Transaction history' },
      { href: '/admin/services', label: 'Services & pricing', icon: '✨', description: 'Menu & prices' },
      { href: '/admin/packages', label: 'Service packages', icon: '📦', description: 'Bundles & deals' },
      { href: '/admin/gift-cards', label: 'Gift cards', icon: '🎁', description: 'Sell or redeem' },
      { href: '/admin/memberships', label: 'Memberships', icon: '💎', description: 'VIP plans' },
      { href: '/admin/promotions', label: 'Promotions', icon: '🏷️', description: 'Coupons & discounts' },
    ],
  },
  {
    title: 'Marketing & reports',
    items: [
      { href: '/admin/marketing', label: 'Marketing', icon: '📣', description: 'Campaigns & email' },
      { href: '/admin/sms', label: 'SMS / text', icon: '💬', description: 'Text campaigns' },
      { href: '/admin/templates', label: 'Message templates', icon: '📝', description: 'Email & SMS text' },
      { href: '/admin/reports', label: 'Reports', icon: '📈', description: 'Revenue & analytics' },
    ],
  },
  {
    title: 'Team & settings',
    items: [
      { href: '/admin/staff', label: 'Staff & schedules', icon: '👤', description: 'Team & shifts' },
      { href: '/admin/users', label: 'Users & access', icon: '🔐', description: 'Logins & roles' },
      { href: '/admin/vendors', label: 'Vendors', icon: '🏢', description: 'Suppliers' },
      { href: '/admin/efax', label: 'eFax', icon: '📠', description: 'Send or receive fax' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️', description: 'Business & hours' },
      { href: '/admin/system-health', label: 'System Health', icon: '🩺', description: 'Go-live readiness' },
    ],
  },
];

const QUICK_LINKS = [
  { href: '/book', label: 'Public booking page', icon: '🌐' },
  { href: '/portal', label: 'Client portal', icon: '👤' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Use admin manifest for PWA installation
  useAdminManifest();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 admin-panel">
      {/* Top Header */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar — user- and provider-friendly */}
        <aside className="w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] sticky top-14 hidden lg:block overflow-y-auto shadow-sm">
          <nav className="p-4 space-y-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group ${
                          isActive(item.href)
                            ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5" aria-hidden>{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="block font-medium">{item.label}</span>
                          <span className={`block text-xs mt-0.5 ${isActive(item.href) ? 'text-pink-600' : 'text-gray-500'}`}>
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">
                Quick links
              </h3>
              <ul className="space-y-0.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                      <span className="ml-auto text-xs text-gray-400">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/95 backdrop-blur">
            <p className="text-xs text-gray-500 text-center font-medium">Hello Gorgeous OS</p>
            <p className="text-[10px] text-gray-400 text-center mt-0.5">v1.4.0 • Production</p>
          </div>
        </aside>

        {/* Mobile Bottom Nav — most-used actions */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-16 px-2">
            {[
              { href: '/admin', icon: '📊', label: 'Dashboard' },
              { href: '/admin/calendar', icon: '📅', label: "Today" },
              { href: '/admin/appointments/new', icon: '➕', label: 'Book' },
              { href: '/pos', icon: '💳', label: 'POS' },
              { href: '/admin/clients', icon: '👥', label: 'Clients' },
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
  );
}
