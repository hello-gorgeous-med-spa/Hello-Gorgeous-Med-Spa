'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Use /ops/... paths for tryregenrx.com (middleware adds /regen prefix)
// This ensures links work correctly on the external domain
const NAV_ITEMS = [
  { href: '/ops', label: 'Dashboard', icon: '📊' },
  { href: '/ops/patients', label: 'Patients', icon: '👥' },
  { href: '/ops/intake', label: 'Intake Queue', icon: '📋' },
  { href: '/ops/prescriptions', label: 'Prescriptions', icon: '💊' },
  { href: '/ops/orders', label: 'Orders', icon: '📦' },
  { href: '/ops/catalog', label: 'Catalog', icon: '🔬' },
  { href: '/ops/calculator', label: 'Dosing Calc', icon: '🧮' },
  { href: '/ops/messages', label: 'Messages', icon: '💬' },
  { href: '/ops/payments', label: 'Payments', icon: '💳' },
  { href: '/ops/reports', label: 'Reports', icon: '📈' },
  { href: '/ops/analytics', label: 'Analytics', icon: '📉' },
];

const STAFF_USERS = [
  { id: 'damara', name: 'Damara', role: 'Operations Manager', color: 'bg-teal-500' },
  { id: 'ryan', name: 'Ryan', role: 'Prescriber', color: 'bg-pink-500' },
  { id: 'danielle', name: 'Danielle', role: 'Owner', color: 'bg-amber-500' },
];

export default function RegenOpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(STAFF_USERS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Simple auth check - in production, use proper auth
  useEffect(() => {
    const authed = sessionStorage.getItem('regen-ops-auth');
    if (authed === 'true') setIsAuthed(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password for now - replace with proper auth
    if (passInput === 'regenrx2026' || passInput === 'gorgeous') {
      sessionStorage.setItem('regen-ops-auth', 'true');
      setIsAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">REGEN RX</h1>
            <p className="text-teal-300/80">Operations Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Staff Password</label>
              <input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-white/40 text-xs mt-6">
            Contact Danielle for access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/ops" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">REGEN RX</h1>
              <p className="text-teal-400/70 text-xs">Operations Hub</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/ops/payments?action=invoice"
              className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-colors"
            >
              + Invoice
            </Link>
            <Link
              href="/ops/intake"
              className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 text-sm font-medium hover:bg-pink-500/30 transition-colors"
            >
              Review Intake
            </Link>
          </div>

          {/* User Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className={`w-8 h-8 rounded-full ${currentUser.color} flex items-center justify-center text-white font-semibold text-sm`}>
                {currentUser.name[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-white text-sm font-medium">{currentUser.name}</p>
                <p className="text-white/50 text-xs">{currentUser.role}</p>
              </div>
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 rounded-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {STAFF_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                    currentUser.id === user.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white font-semibold text-sm`}>
                    {user.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-white/50 text-xs">{user.role}</p>
                  </div>
                  {currentUser.id === user.id && (
                    <svg className="w-4 h-4 text-teal-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
              <div className="border-t border-white/10">
                <button
                  onClick={() => {
                    sessionStorage.removeItem('regen-ops-auth');
                    setIsAuthed(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-400 text-sm hover:bg-white/5 rounded-b-xl"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 transition-transform z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            // Normalize pathname: /regen/ops/... -> /ops/...
            const normalizedPath = pathname.replace('/regen/ops', '/ops').replace('/regen', '');
            const isActive = normalizedPath === item.href || (item.href !== '/ops' && normalizedPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-pink-500/20 text-white border border-teal-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.label === 'Intake Queue' && (
                  <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                )}
                {item.label === 'Messages' && (
                  <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Formulation Rx Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-sm font-medium">Formulation Rx</span>
            </div>
            <p className="text-white/40 text-xs">API Connected • Last sync 2m ago</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 min-h-screen transition-all ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
