'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import ModeSwitcher from '@/components/ModeSwitcher';

// Operating System Navigation
const OS_NAV = [
  { href: '/admin/owner', label: 'Overview', icon: '🏠' },
  { href: '/admin/owner/live-state', label: 'Live System State', icon: '📡' },
  { href: '/admin/owner/rules', label: 'Rules & Precedence', icon: '⚖️' },
  { href: '/admin/owner/features', label: 'Modules & Features', icon: '🎚️' },
  { href: '/admin/owner/clinical', label: 'Clinical Governance', icon: '🩺' },
  { href: '/admin/owner/economics', label: 'Revenue & Economics', icon: '💰' },
  { href: '/admin/owner/inventory', label: 'Inventory', icon: '📦' },
  { href: '/admin/owner/gift-cards', label: 'Gift Cards', icon: '🎁' },
];

// Website CMS Navigation
const WEBSITE_NAV = [
  { href: '/admin/owner/website', label: 'Website Control', icon: '🌐' },
  { href: '/admin/owner/website/pages', label: 'Pages', icon: '📄' },
  { href: '/admin/owner/website/navigation', label: 'Navigation', icon: '🧭' },
  { href: '/admin/owner/website/promotions', label: 'Promotions', icon: '🎉' },
  { href: '/admin/owner/website/media', label: 'Media Library', icon: '🖼️' },
];

// Governance Navigation
const GOVERNANCE_NAV = [
  { href: '/admin/owner/data-model', label: 'Data Model Control', icon: '🗃️' },
  { href: '/admin/owner/changes', label: 'Change Management', icon: '📝' },
  { href: '/admin/owner/risk', label: 'Risk & Compliance', icon: '⚠️' },
  { href: '/admin/owner/authority', label: 'Access & Authority', icon: '🔐' },
  { href: '/admin/owner/exports', label: 'Exports & Exit', icon: '📤' },
  { href: '/admin/owner/audit', label: 'Audit & Forensics', icon: '🔍' },
];

interface OwnerLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function OwnerLayout({ children, title, description }: OwnerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Founder Control Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-shrink-0">
        <div className="p-4 border-b border-slate-700">
          <Link href="/admin/owner" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg text-pink-400">FOUNDER CONTROL</h1>
              <p className="text-xs text-pink-300/60">Governance Layer</p>
            </div>
          </Link>
        </div>
        
        <nav className="p-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {/* Operating System */}
          <div className="mb-4">
            <p className="px-3 py-1 text-xs text-pink-300/50 font-semibold uppercase">Operating System</p>
            <div className="space-y-0.5">
              {OS_NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.href
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-slate-300 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Website */}
          <div className="mb-4">
            <p className="px-3 py-1 text-xs text-pink-300/50 font-semibold uppercase">Website</p>
            <div className="space-y-0.5">
              {WEBSITE_NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-slate-300 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Governance */}
          <div className="mb-4">
            <p className="px-3 py-1 text-xs text-pink-300/50 font-semibold uppercase">Governance</p>
            <div className="space-y-0.5">
              {GOVERNANCE_NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.href
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-slate-300 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="p-2 rounded-lg bg-green-500/20 text-green-300 text-center text-xs">
            🟢 NORMAL OPERATION
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Mode Switcher Header */}
        <div className="h-12 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
          <ModeSwitcher variant="minimal" />
          
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <span className="text-lg">👑</span>
            <span className="font-medium">Owner Mode</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-gray-500">{description}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
