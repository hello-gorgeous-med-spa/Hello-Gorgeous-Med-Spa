// ============================================================
// ADMIN DASHBOARD LAYOUT
// Fresha-Level UX - Black/White/Pink Theme
// Command Center for Hello Gorgeous Med Spa
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModeSwitcher, { ModeSwitcherMobile } from '@/components/ModeSwitcher';

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
      themeColor.content = '#0a0a0a';
    }

    return () => {
      if (manifestLink && originalHref) {
        manifestLink.href = originalHref;
      }
    };
  }, []);
}

// Navigation with clear grouping and icons
const NAV_SECTIONS = [
  {
    title: 'Operations',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
      { href: '/admin/calendar', label: 'Calendar', icon: '📅' },
      { href: '/admin/appointments', label: 'Appointments', icon: '🗓️' },
      { href: '/pos', label: 'POS / Checkout', icon: '💳' },
    ],
  },
  {
    title: 'Clients',
    items: [
      { href: '/admin/clients', label: 'Client List', icon: '👥' },
      { href: '/admin/clients/new', label: 'Add Client', icon: '✨' },
      { href: '/admin/memberships', label: 'Memberships', icon: '💎' },
      { href: '/admin/gift-cards', label: 'Gift Cards', icon: '🎁' },
    ],
  },
  {
    title: 'Clinical',
    items: [
      { href: '/admin/charts', label: 'Charts & SOAP', icon: '📋' },
      { href: '/admin/consents', label: 'Consents', icon: '📝' },
      { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
      { href: '/admin/charm', label: 'Charm EHR', icon: '🏥' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { href: '/admin/payments', label: 'Payments', icon: '💰' },
      { href: '/admin/services', label: 'Services', icon: '✨' },
      { href: '/admin/reports', label: 'Reports', icon: '📈' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { href: '/admin/marketing', label: 'Campaigns', icon: '📣' },
      { href: '/admin/sms', label: 'SMS', icon: '💬' },
      { href: '/admin/promotions', label: 'Promotions', icon: '🏷️' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/staff', label: 'Team', icon: '👤' },
      { href: '/admin/users', label: 'Users', icon: '🔐' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useAdminManifest();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar - Black */}
      <header className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
        {/* Main Header Row */}
        <div className="h-14 flex items-center justify-between px-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">H</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-pink-400 font-bold text-sm tracking-tight">Hello Gorgeous</h1>
                <p className="text-pink-300/70 text-[10px]">Med Spa OS</p>
              </div>
            </Link>
          </div>

          {/* Center - Mode Tabs (Desktop) */}
          <div className="hidden md:block">
            <ModeSwitcher variant="tabs" />
          </div>

          {/* Right - Time & Quick Actions */}
          <div className="flex items-center gap-4">
            {/* Time Display */}
            <div className="hidden lg:block text-right">
              <p className="text-pink-400 font-semibold text-sm">{formatTime(currentTime)}</p>
              <p className="text-pink-300/60 text-[10px]">{formatDate(currentTime)}</p>
            </div>

            {/* Quick Actions */}
            <Link
              href="/admin/appointments/new"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span>+</span>
              <span className="hidden lg:inline">New Booking</span>
            </Link>
            
            <Link
              href="/pos"
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span>💳</span>
              <span className="hidden sm:inline">POS</span>
            </Link>
          </div>
        </div>

        {/* Mobile Mode Tabs */}
        <div className="md:hidden">
          <ModeSwitcherMobile />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Jet Black */}
        <aside className={`
          ${sidebarCollapsed ? 'w-16' : 'w-64'} 
          bg-[#0a0a0a] min-h-[calc(100vh-56px)] sticky top-14 
          hidden lg:flex flex-col transition-all duration-300
        `}>
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-full flex items-center justify-center text-xs z-10 border border-gray-700"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>

          <nav className="flex-1 py-4 overflow-y-auto">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-6">
                {!sidebarCollapsed && (
                  <h3 className="px-4 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-0.5 px-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm
                          ${isActive(item.href)
                            ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-500'
                            : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                          }
                        `}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="font-medium truncate">{item.label}</span>
                        )}
                        {isActive(item.href) && !sidebarCollapsed && (
                          <span className="ml-auto w-1.5 h-1.5 bg-pink-500 rounded-full" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-pink-400 text-sm font-medium truncate">Admin</p>
                  <p className="text-pink-300/50 text-xs">Full Access</p>
                </div>
              </div>
              <p className="text-[10px] text-pink-300/40 text-center mt-4">
                Hello Gorgeous OS v1.5
              </p>
            </div>
          )}
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 z-50 safe-area-pb">
          <div className="flex justify-around items-center h-16 px-2">
            {[
              { href: '/admin', icon: '📊', label: 'Home' },
              { href: '/admin/calendar', icon: '📅', label: 'Calendar' },
              { href: '/admin/appointments/new', icon: '➕', label: 'Book', highlight: true },
              { href: '/pos', icon: '💳', label: 'POS' },
              { href: '/admin/clients', icon: '👥', label: 'Clients' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1 min-w-[56px] py-2 rounded-xl transition-all
                  ${item.highlight 
                    ? 'bg-pink-500 text-white -mt-4 shadow-lg shadow-pink-500/30' 
                    : isActive(item.href) 
                      ? 'text-pink-400' 
                      : 'text-gray-500'
                  }
                `}
              >
                <span className={item.highlight ? 'text-2xl' : 'text-xl'}>{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 pb-24 lg:pb-6 min-h-[calc(100vh-56px)]">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
