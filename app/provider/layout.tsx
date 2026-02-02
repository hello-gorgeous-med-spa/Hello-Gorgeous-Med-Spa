'use client';

// ============================================================
// PROVIDER PORTAL LAYOUT
// Professional clinical operations hub with full navigation
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { 
    name: 'Dashboard', 
    href: '/provider', 
    icon: '🏠',
    description: 'Overview & today\'s schedule'
  },
  { 
    name: 'Patient Queue', 
    href: '/provider/queue', 
    icon: '👥',
    description: 'Waiting room & check-ins',
    badge: 'live'
  },
  { 
    name: 'My Schedule', 
    href: '/provider/schedule', 
    icon: '📅',
    description: 'View & manage availability'
  },
  { 
    name: 'Charting', 
    href: '/provider/charting', 
    icon: '📝',
    description: 'Clinical notes & documentation'
  },
  { 
    name: 'Patient Lookup', 
    href: '/provider/patients', 
    icon: '🔍',
    description: 'Search patients & history'
  },
  { 
    name: 'Photos', 
    href: '/provider/photos', 
    icon: '📷',
    description: 'Before/after documentation'
  },
  { 
    name: 'Tasks', 
    href: '/provider/tasks', 
    icon: '✅',
    description: 'Follow-ups & reminders'
  },
  { 
    name: 'Products', 
    href: '/provider/inventory', 
    icon: '💉',
    description: 'Inventory & lot tracking'
  },
  { 
    name: 'My Performance', 
    href: '/provider/performance', 
    icon: '📊',
    description: 'Stats & analytics'
  },
  { 
    name: 'Messages', 
    href: '/provider/messages', 
    icon: '💬',
    description: 'Patient communications'
  },
];

const QUICK_ACTIONS = [
  { name: 'New Chart', href: '/provider/charting/new', icon: '📝' },
  { name: 'Quick Sale', href: '/pos/quick-sale', icon: '💳' },
  { name: 'Photo', href: '/provider/photos', icon: '📷' },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState<any[]>([]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch alerts (expiring products, pending consents, etc.)
  useEffect(() => {
    async function fetchAlerts() {
      try {
        // This would fetch real alerts from API
        // For now, we'll show example alerts
        setAlerts([
          // Example alerts - replace with real API calls
        ]);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <Link href="/provider" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">HG</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-white block">Provider Portal</span>
                <span className="text-xs text-slate-400">Hello Gorgeous Med Spa</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/provider' && pathname?.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-pink-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block truncate">
                          {item.description}
                        </span>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Quick Actions */}
          {sidebarOpen && (
            <div className="mt-6 px-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Quick Actions
              </p>
              <div className="flex gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex-1 flex flex-col items-center gap-1 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-xs text-slate-400">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Toggle & Links */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span>{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
          
          {sidebarOpen && (
            <Link
              href="/admin"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
            >
              Full Admin Dashboard →
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-3 flex items-center justify-between">
            {/* Time & Date */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Alerts */}
              {alerts.length > 0 && (
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              )}
              
              {/* Quick POS */}
              <Link
                href="/pos/quick-sale"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                <span>💳</span>
                <span>Quick Sale</span>
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Provider</p>
                  <p className="text-xs text-gray-500">On Duty</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                  RK
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
