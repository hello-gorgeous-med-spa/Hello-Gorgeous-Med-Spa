'use client';

// ============================================================
// ADMIN HEADER COMPONENT
// Header bar for admin dashboard with user menu
// ============================================================

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from './UserMenu';
import { MobileNav } from '@/components/ui/MobileNav';
import { useAuth } from '@/lib/hgos/AuthContext';

// Dashboard view tabs
const DASHBOARD_VIEWS = [
  { id: 'staff', label: 'Portal', href: '/admin', icon: '🩺', description: 'RX & daily operations' },
  { id: 'owner', label: 'Owner', href: '/admin/owner', icon: '👑', description: 'Business control center' },
  { id: 'pos', label: 'POS', href: '/pos', icon: '💳', description: 'Point of sale' },
  { id: 'portal', label: 'Client', href: '/portal', icon: '🌐', description: 'Client-facing portal' },
];

// Quick access vendor links — full list (Manage All → /admin/vendors)
const QUICK_VENDORS = [
  { name: 'BoomRx', url: 'https://portal.boomrx.com/en-US/boomrx/prescriptions', icon: '💊', color: 'text-indigo-300' },
  { name: 'Charm EHR', url: 'https://accounts.charmtracker.com/signin', icon: '🏥', color: 'text-purple-300' },
  { name: 'Formulation', url: 'https://fccrxportal.com/dashboard', icon: '🧪', color: 'text-rose-300' },
  { name: 'Olympia', url: 'https://olympiapharmacy.drscriptportal.com/dashboard', icon: '💊', color: 'text-violet-300' },
  { name: 'Square', url: 'https://squareup.com/dashboard', icon: '💳', color: 'text-emerald-300' },
  { name: 'McKesson', url: 'https://connect.mckesson.com/', icon: '📦', color: 'text-blue-300' },
  { name: 'Allergan', url: 'https://www.brilliantconnections.com/', icon: '💉', color: 'text-pink-300' },
  { name: 'Allē Portal', url: 'https://provider.alle.com/', icon: '⭐', color: 'text-yellow-300' },
  { name: 'Evolus', url: 'https://providers.evolus.com/', icon: '💎', color: 'text-cyan-300' },
  { name: 'AnteAGE', url: 'https://provider.anteage.com/login.php', icon: '✨', color: 'text-amber-300' },
  { name: 'Skin Script', url: 'https://skinscriptrx.com/', icon: '🧴', color: 'text-green-300' },
  { name: 'eFax Portal', url: 'https://myportal.efax.com/login', icon: '📠', color: 'text-slate-300' },
  { name: 'Amazon', url: 'https://www.amazon.com/gc/balance', icon: '📦', color: 'text-orange-300' },
];

export function AdminHeader() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [showVendors, setShowVendors] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  // Determine current view
  const getCurrentView = () => {
    if (pathname.startsWith('/admin/owner')) return 'owner';
    if (pathname.startsWith('/pos')) return 'pos';
    if (pathname.startsWith('/portal')) return 'portal';
    return 'staff';
  };
  const currentView = getCurrentView();
  const currentViewData = DASHBOARD_VIEWS.find(v => v.id === currentView) || DASHBOARD_VIEWS[0];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVendors(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setShowViewMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-black via-black to-black text-white sticky top-0 z-50 border-b border-black/30 shadow-lg">
      <div className="flex items-center justify-between px-4 h-14 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile: hamburger menu (full nav drawer) */}
          <div className="lg:hidden flex-shrink-0">
            <MobileNav variant="dark" />
          </div>
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <span className="text-xl group-hover:scale-110 transition-transform" aria-hidden>💗</span>
            <span className="font-bold hidden sm:inline bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">Hello Gorgeous</span>
          </Link>
          
          {/* View Switcher Tabs - Desktop */}
          <div className="hidden md:flex items-center bg-black/40 backdrop-blur-sm rounded-lg p-0.5">
            {DASHBOARD_VIEWS.map((view) => (
              <Link
                key={view.id}
                href={view.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentView === view.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <span aria-hidden>{view.icon}</span>
                <span>{view.label}</span>
              </Link>
            ))}
          </div>

          {/* View Switcher Dropdown - Mobile */}
          <div className="relative md:hidden" ref={viewMenuRef}>
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-black rounded-lg text-sm font-medium transition-colors"
            >
              <span aria-hidden>{currentViewData.icon}</span>
              <span>{currentViewData.label}</span>
              <span className="text-xs">▼</span>
            </button>
            
            {showViewMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-black border border-black rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-1">
                  {DASHBOARD_VIEWS.map((view) => (
                    <Link
                      key={view.id}
                      href={view.href}
                      onClick={() => setShowViewMenu(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                        currentView === view.id
                          ? 'bg-[#FF2D8E]/20 text-pink-300'
                          : 'hover:bg-black text-black'
                      }`}
                    >
                      <span className="text-lg">{view.icon}</span>
                      <div>
                        <div className="font-medium">{view.label}</div>
                        <div className="text-xs text-black">{view.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Vendors Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowVendors(!showVendors)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-black rounded-lg text-sm font-medium transition-colors"
            >
              <span aria-hidden>🏢</span>
              Vendors
              <span className="text-xs">▼</span>
            </button>
            
            {showVendors && (
              <div className="absolute right-0 mt-2 w-56 bg-black border border-black rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-2">
                  <p className="text-xs text-black px-2 py-1 uppercase tracking-wider">Quick Access</p>
                  {QUICK_VENDORS.map((vendor) => (
                    <a
                      key={vendor.name}
                      href={vendor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowVendors(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-black rounded-lg transition-colors"
                    >
                      <span className={vendor.color}>{vendor.icon}</span>
                      <span className="text-sm">{vendor.name}</span>
                    </a>
                  ))}
                </div>
                <div className="border-t border-black p-2">
                  <Link
                    href="/admin/vendors"
                    onClick={() => setShowVendors(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black rounded-lg transition-colors text-[#FF2D8E]"
                  >
                    <span>⚙️</span>
                    <span className="text-sm">Manage All Vendors</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <a
            href="https://accounts.charmtracker.com/signin"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
          >
            <span aria-hidden>🏥</span>
            Charm EHR
          </a>
          <Link
            href="/admin/flowwave"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors border border-white/20"
          >
            FlowWave
          </Link>
          <Link
            href="/admin/rx"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors border border-white/20"
          >
            RX
          </Link>
          <Link
            href="/staff/protocols"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600/90 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors border border-emerald-400/30"
          >
            Protocols
          </Link>
          <Link
            href="/admin/appointments/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF2D8E] hover:bg-[#c90a68] rounded-lg text-sm font-medium transition-colors"
          >
            Book
          </Link>
          <button type="button" className="hidden md:inline-flex p-2.5 hover:bg-white/10 rounded-xl transition-all text-white/60" aria-label="Notifications">
            <span aria-hidden>🔔</span>
          </button>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-black animate-pulse" aria-hidden />
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
}
