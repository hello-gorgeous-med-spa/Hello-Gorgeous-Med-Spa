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
      {/* Founder Control Sidebar - STATIC, always visible */}
      <aside className="w-64 bg-black flex-shrink-0 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/owner" className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg text-[#FF2D8E]">FOUNDER CONTROL</h1>
              <p className="text-xs text-white/50">Governance Layer</p>
            </div>
          </Link>
        </div>
        
        {/* Navigation - Static tabs, not hover */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {/* Operating System */}
          <div className="mb-6">
            <p className="px-3 py-2 text-xs text-[#FF2D8E] font-bold uppercase tracking-wider">
              Operating System
            </p>
            <div className="space-y-1">
              {OS_NAV.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#FF2D8E] text-white'
                        : 'text-white hover:bg-[#FF2D8E]/20 hover:text-[#FF2D8E]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Website */}
          <div className="mb-6">
            <p className="px-3 py-2 text-xs text-[#FF2D8E] font-bold uppercase tracking-wider">
              Website
            </p>
            <div className="space-y-1">
              {WEBSITE_NAV.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#FF2D8E] text-white'
                        : 'text-white hover:bg-[#FF2D8E]/20 hover:text-[#FF2D8E]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Governance */}
          <div className="mb-6">
            <p className="px-3 py-2 text-xs text-[#FF2D8E] font-bold uppercase tracking-wider">
              Governance
            </p>
            <div className="space-y-1">
              {GOVERNANCE_NAV.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#FF2D8E] text-white'
                        : 'text-white hover:bg-[#FF2D8E]/20 hover:text-[#FF2D8E]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="p-3 rounded-lg bg-green-500/20 text-green-400 text-center text-sm font-medium">
            🟢 NORMAL OPERATION
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white overflow-y-auto">
        {/* Mode Switcher Header */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
          <ModeSwitcher variant="minimal" />
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">👑</span>
            <span className="font-bold text-[#FF2D8E]">Owner Mode</span>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">{title}</h1>
            {description && <p className="mt-2 text-gray-600">{description}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
