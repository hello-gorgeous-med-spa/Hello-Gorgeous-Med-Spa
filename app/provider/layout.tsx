// ============================================================
// PROVIDER DASHBOARD LAYOUT
// Clinical EHR Interface for Providers
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ProviderHeader } from '@/components/ProviderHeader';

export const metadata: Metadata = {
  title: 'Provider Dashboard | Hello Gorgeous Med Spa',
  description: 'Clinical dashboard for providers - charting, scheduling, and patient management.',
};

const NAV_ITEMS = [
  { href: '/provider', label: 'Dashboard', icon: '🏠' },
  { href: '/provider/schedule', label: 'Schedule', icon: '📅' },
  { href: '/provider/clients', label: 'Clients', icon: '👥' },
  { href: '/provider/charts', label: 'Charts', icon: '📋' },
  { href: '/provider/messages', label: 'Messages', icon: '💬', badge: 3 },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <ProviderHeader />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-3 py-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
