'use client';

// ============================================================
// PROVIDER PORTAL LAYOUT
// Fresha-Level UX - Calm, focused, confidence-boosting
// Black/White/Pink theme - Clinical workspace
// Auth handled by middleware
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModeSwitcher from '@/components/ModeSwitcher';
import { useProviderId } from '@/lib/provider/useProviderId';
import { useAuth } from '@/lib/hgos/AuthContext';

const NAV_ITEMS = [
  { 
    name: 'Dashboard', 
    href: '/provider', 
    icon: '🏠',
    shortcut: 'D'
  },
  { 
    name: 'Patient Queue', 
    href: '/provider/queue', 
    icon: '👥',
    badge: 'live',
    shortcut: 'Q'
  },
  { 
    name: 'My Schedule', 
    href: '/provider/schedule', 
    icon: '📅',
    shortcut: 'S'
  },
  { 
    name: 'Charting', 
    href: '/provider/charting', 
    icon: '📝',
    shortcut: 'C'
  },
  { 
    name: 'Patient Lookup', 
    href: '/provider/patients', 
    icon: '🔍',
    shortcut: 'P'
  },
  { 
    name: 'Photos', 
    href: '/provider/photos', 
    icon: '📷',
  },
  { 
    name: 'Tasks', 
    href: '/provider/tasks', 
    icon: '✅',
  },
  { 
    name: 'Products', 
    href: '/provider/inventory', 
    icon: '💉',
  },
  { 
    name: 'Performance', 
    href: '/provider/performance', 
    icon: '📊',
  },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queueCount, setQueueCount] = useState(0);
  const providerId = useProviderId();
  const { user } = useAuth();

  // Update time every second for a live feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [providerId]);

  // SECURITY: Add noindex meta tag to prevent search engine indexing
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = 'noindex, nofollow';
  }, []);

  // Fetch queue count
  const fetchQueueCount = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = new URLSearchParams({ date: today });
      if (providerId) params.set('provider_id', providerId);
      const res = await fetch(`/api/appointments?${params}`);
      if (res.ok) {
        const data = await res.json();
        const checkedIn = (data.appointments || []).filter(
          (a: any) => a.status === 'checked_in'
        ).length;
        setQueueCount(checkedIn);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  }, [providerId]);

  useEffect(() => {
    fetchQueueCount();
    const interval = setInterval(fetchQueueCount, 30000);
    return () => clearInterval(interval);
  }, [fetchQueueCount]);

  const isActive = (href: string) => {
    if (href === '/provider') return pathname === '/provider';
    return pathname?.startsWith(href);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Jet Black */}
      <aside className={`
        ${sidebarCollapsed ? 'w-20' : 'w-64'} 
        bg-[#0a0a0a] text-white flex flex-col transition-all duration-300 
        fixed top-0 left-0 h-screen z-40
      `}>
        {/* Logo & Brand */}
        <div className="p-4 border-b border-black">
          <Link href="/provider" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/20">
              <span className="text-white font-bold text-sm">HG</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-bold text-pink-400 block tracking-tight">Provider Portal</span>
                <span className="text-xs text-pink-300/60">Clinical Workspace</span>
              </div>
            )}
          </Link>
        </div>

        {/* Live Clock */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-black bg-black/50">
            <p className="text-2xl font-bold text-pink-400 tracking-tight">
              {formatTime(currentTime)}
            </p>
            <p className="text-xs text-pink-300/60">{formatDate(currentTime)}</p>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 py-4 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                      ${active 
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' 
                        : 'text-black hover:text-pink-400 hover:bg-pink-500/10'
                      }
                    `}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="font-medium flex-1">{item.name}</span>
                        {item.badge === 'live' && queueCount > 0 && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            {queueCount}
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] text-black bg-black rounded">
                            {item.shortcut}
                          </kbd>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && item.badge === 'live' && queueCount > 0 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {queueCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-4">
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/charting"
                className="flex flex-col items-center gap-1 p-2 bg-black/50 hover:bg-black rounded-xl transition-colors"
              >
                <span className="text-lg">📝</span>
                <span className="text-[10px] text-black">Chart</span>
              </Link>
              <Link
                href="/pos/quick-sale"
                className="flex flex-col items-center gap-1 p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors"
              >
                <span className="text-lg">💳</span>
                <span className="text-[10px]">POS</span>
              </Link>
              <Link
                href="/provider/photos"
                className="flex flex-col items-center gap-1 p-2 bg-black/50 hover:bg-black rounded-xl transition-colors"
              >
                <span className="text-lg">📷</span>
                <span className="text-[10px] text-black">Photo</span>
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-black">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-black hover:text-pink-400 hover:bg-pink-500/10 rounded-xl transition-colors"
          >
            <span className="text-lg">{sidebarCollapsed ? '→' : '←'}</span>
            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header Bar */}
        <header className="bg-white border-b border-black sticky top-0 z-30 shadow-sm">
          {/* Mode Tabs Row */}
          <div className="h-12 px-6 flex items-center justify-between border-b border-black bg-white">
            <ModeSwitcher variant="minimal" />
            
            <div className="flex items-center gap-2 text-sm text-black">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Provider Mode</span>
            </div>
          </div>

          {/* Actions Row */}
          <div className="h-14 px-6 flex items-center justify-between">
            {/* Left - Queue Alert */}
            <div className="flex items-center gap-4">
              {queueCount > 0 && (
                <Link
                  href="/provider/queue"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-semibold">{queueCount} Waiting</span>
                </Link>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* New Chart Button */}
              <Link
                href="/charting"
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-pink-500/20"
              >
                <span>📝</span>
                <span className="hidden sm:inline">New Chart</span>
              </Link>

              {/* Quick POS */}
              <Link
                href="/pos/quick-sale"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
              >
                <span>💳</span>
                <span className="hidden sm:inline">POS</span>
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-4 ml-2 border-l border-black">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-black">
                    {user ? `${user.firstName} ${user.lastName}`.trim() || 'Provider' : 'Provider'}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">On Duty</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.firstName?.[0] || 'P'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-black z-50 safe-area-pb">
        <div className="flex justify-around items-center h-16 px-2">
          {[
            { href: '/provider', icon: '🏠', label: 'Home' },
            { href: '/provider/queue', icon: '👥', label: 'Queue', badge: queueCount },
            { href: '/provider/charting', icon: '📝', label: 'Chart', highlight: true },
            { href: '/provider/schedule', icon: '📅', label: 'Schedule' },
            { href: '/pos/quick-sale', icon: '💳', label: 'POS' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center gap-1 min-w-[56px] py-2 rounded-xl transition-all
                ${item.highlight 
                  ? 'bg-pink-500 text-white -mt-4 shadow-lg shadow-pink-500/30' 
                  : isActive(item.href) 
                    ? 'text-pink-400' 
                    : 'text-black'
                }
              `}
            >
              <span className={item.highlight ? 'text-2xl' : 'text-xl'}>{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
