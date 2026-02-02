'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const OWNER_NAV = [
  { href: '/admin/owner', label: 'Dashboard', icon: '📊' },
  { href: '/admin/owner/system-settings', label: 'System Settings', icon: '⚙️' },
  { href: '/admin/owner/services', label: 'Services & Workflows', icon: '💉' },
  { href: '/admin/owner/users', label: 'Providers & Staff', icon: '👥' },
  { href: '/admin/owner/scheduling', label: 'Scheduling Engine', icon: '📅' },
  { href: '/admin/owner/booking-rules', label: 'Booking Rules & Policies', icon: '📋' },
  { href: '/admin/owner/clinical', label: 'Clinical / EHR Rules', icon: '🩺' },
  { href: '/admin/owner/consents', label: 'Consents & Legal', icon: '📝' },
  { href: '/admin/owner/inventory', label: 'Inventory & Injectables', icon: '📦' },
  { href: '/admin/owner/payments', label: 'Payments & Financials', icon: '💳' },
  { href: '/admin/owner/memberships', label: 'Memberships & Packages', icon: '💎' },
  { href: '/admin/owner/automations', label: 'Automations & Messaging', icon: '⚡' },
  { href: '/admin/owner/features', label: 'Feature Flags', icon: '🎚️' },
  { href: '/admin/owner/sandbox', label: 'Sandbox / Preview', icon: '🧪' },
  { href: '/admin/owner/versions', label: 'Version History', icon: '📜' },
  { href: '/admin/owner/exports', label: 'Data Exports', icon: '📤' },
  { href: '/admin/owner/audit', label: 'Audit Logs', icon: '🔍' },
  { href: '/admin/owner/access', label: 'System Access', icon: '🔑' },
];

interface OwnerLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function OwnerLayout({ children, title, description }: OwnerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-100px)]">
      {/* Owner Mode Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex-shrink-0">
        <div className="p-4 border-b border-purple-700">
          <Link href="/admin/owner" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg">OWNER MODE</h1>
              <p className="text-xs text-purple-300">Full System Control</p>
            </div>
          </Link>
        </div>
        
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {OWNER_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-700">
          <p className="text-xs text-purple-300 text-center">Logged in as Owner</p>
          <p className="text-xs text-purple-400 text-center">Non-removable • Non-downgradable</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
