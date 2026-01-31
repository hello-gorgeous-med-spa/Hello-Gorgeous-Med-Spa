// ============================================================
// ADMIN DASHBOARD LAYOUT
// Command Center for Hello Gorgeous Med Spa
// Clean Blueprint - No Static Data
// ============================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/AdminHeader';

// Complete navigation matching Aesthetics Record parity requirements
const NAV_SECTIONS = [
  {
    title: 'Daily Operations',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊', description: 'Overview & alerts' },
      { href: '/admin/calendar', label: 'Schedule', icon: '📅', description: 'Booking calendar' },
      { href: '/pos', label: 'POS Terminal', icon: '💰', description: 'Checkout & payments' },
    ],
  },
  {
    title: 'Client Management',
    items: [
      { href: '/admin/clients', label: 'All Clients', icon: '👥', description: 'Patient records' },
      { href: '/admin/clients/new', label: 'Add Client', icon: '➕', description: 'New patient' },
      { href: '/admin/appointments', label: 'Appointments', icon: '🗓️', description: 'All bookings' },
    ],
  },
  {
    title: 'Clinical',
    items: [
      { href: '/admin/charts', label: 'Charts & SOAP', icon: '📋', description: 'Clinical notes' },
      { href: '/admin/consents', label: 'Consents', icon: '📝', description: 'Digital signatures' },
      { href: '/admin/medications', label: 'Medications', icon: '💊', description: 'Rx tracking' },
      { href: '/admin/inventory', label: 'Inventory', icon: '📦', description: 'Products & lots' },
    ],
  },
  {
    title: 'Revenue',
    items: [
      { href: '/admin/payments', label: 'Payments', icon: '💳', description: 'Transactions' },
      { href: '/admin/services', label: 'Services', icon: '✨', description: 'Menu & pricing' },
      { href: '/admin/memberships', label: 'Memberships', icon: '💎', description: 'VIP plans' },
      { href: '/admin/gift-cards', label: 'Gift Cards', icon: '🎁', description: 'Sell & redeem' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { href: '/admin/marketing', label: 'Marketing', icon: '📣', description: 'Campaigns' },
      { href: '/admin/reports', label: 'Reports', icon: '📈', description: 'Analytics' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/staff', label: 'Staff', icon: '👤', description: 'Team members' },
      { href: '/admin/users', label: 'Users & Access', icon: '🔐', description: 'Permissions' },
      { href: '/admin/vendors', label: 'Vendors', icon: '🏢', description: 'Suppliers' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️', description: 'Configuration' },
    ],
  },
];

// Public-facing links
const PUBLIC_LINKS = [
  { href: '/book', label: 'Online Booking', icon: '🌐' },
  { href: '/portal', label: 'Client Portal', icon: '👤' },
  { href: '/provider', label: 'Provider View', icon: '👩‍⚕️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] sticky top-14 hidden lg:block overflow-y-auto">
          <nav className="p-3 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-3">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm group ${
                          isActive(item.href)
                            ? 'bg-pink-50 text-pink-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="block">{item.label}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Quick Links */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-3">
                Quick Links
              </h3>
              <ul className="space-y-0.5">
                {PUBLIC_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2 text-gray-500 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all text-sm"
                      target="_blank"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                      <span className="ml-auto text-xs">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Version Footer - Dynamic */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
            <div className="text-xs text-gray-400 text-center">
              <p className="font-medium text-gray-600">Hello Gorgeous OS</p>
              <p>v1.3.0 • Development</p>
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
          <div className="flex justify-around items-center h-16">
            {[
              { href: '/admin', icon: '📊', label: 'Home' },
              { href: '/admin/calendar', icon: '📅', label: 'Schedule' },
              { href: '/pos', icon: '💰', label: 'POS' },
              { href: '/admin/clients', icon: '👥', label: 'Clients' },
              { href: '/admin/reports', icon: '📈', label: 'Reports' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
                  isActive(item.href) ? 'text-pink-600' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
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
