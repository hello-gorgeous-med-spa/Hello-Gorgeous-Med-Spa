'use client';

// ============================================================
// PROVIDER HEADER COMPONENT
// Header bar for provider dashboard with user menu
// ============================================================

import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/lib/hgos/AuthContext';

const NAV_ITEMS = [
  { href: '/provider', label: 'Dashboard', icon: '🏠' },
  { href: '/provider/schedule', label: 'Schedule', icon: '📅' },
  { href: '/provider/clients', label: 'Clients', icon: '👥' },
  { href: '/provider/charts', label: 'Charts', icon: '📋' },
  { href: '/provider/messages', label: 'Messages', icon: '💬', badge: 3 },
];

const QUICK_ACTIONS = [
  { href: '/provider/chart/new', label: 'New Chart', icon: '📝' },
  { href: '/provider/clients', label: 'Find Client', icon: '🔍' },
];

export function ProviderHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/provider" className="flex items-center gap-2">
            <span className="text-2xl">💗</span>
            <span className="font-semibold text-gray-900">
              Hello Gorgeous
            </span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              Provider
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <span>{action.icon}</span>
                {action.label}
              </Link>
            ))}

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <UserMenu />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
