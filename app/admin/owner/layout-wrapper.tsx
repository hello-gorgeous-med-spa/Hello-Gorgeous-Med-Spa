'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const OWNER_NAV = [
  { href: '/admin/owner', label: 'Overview', icon: '🏠' },
  { href: '/admin/owner/live-state', label: 'Live System State', icon: '📡' },
  { href: '/admin/owner/rules', label: 'Rules & Precedence', icon: '⚖️' },
  { href: '/admin/owner/features', label: 'Modules & Features', icon: '🎚️' },
  { href: '/admin/owner/clinical', label: 'Clinical Governance', icon: '🩺' },
  { href: '/admin/owner/economics', label: 'Revenue & Economics', icon: '💰' },
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
              <h1 className="font-bold text-lg">FOUNDER CONTROL</h1>
              <p className="text-xs text-slate-400">Governance Layer</p>
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
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="p-2 rounded-lg bg-green-500/20 text-green-300 text-center text-xs">
            🟢 NORMAL OPERATION
          </div>
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
