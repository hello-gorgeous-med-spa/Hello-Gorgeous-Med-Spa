'use client';

// ============================================================
// ADMIN HEADER COMPONENT
// Header bar for admin dashboard with user menu
// ============================================================

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/lib/hgos/AuthContext';

// Quick access vendor links - updated with actual portal URLs
const QUICK_VENDORS = [
  { name: 'Charm EHR', url: 'https://www.charmhealth.com/', icon: '🏥', color: 'text-purple-300' },
  { name: 'eFax Portal', url: 'https://myportal.efax.com/login', icon: '📠', color: 'text-slate-300' },
  { name: 'McKesson', url: 'https://connect.mckesson.com/', icon: '📦', color: 'text-blue-300' },
  { name: 'Allergan', url: 'https://www.brilliantconnections.com/', icon: '💉', color: 'text-pink-300' },
  { name: 'Evolus', url: 'https://providers.evolus.com/', icon: '💎', color: 'text-cyan-300' },
  { name: 'AnteAGE', url: 'https://provider.anteage.com/login.php', icon: '✨', color: 'text-amber-300' },
  { name: 'Skin Script', url: 'https://skinscriptrx.com/', icon: '🧴', color: 'text-green-300' },
  { name: 'Olympia', url: 'https://olympiapharmacy.drscriptportal.com/dashboard', icon: '💊', color: 'text-violet-300' },
  { name: 'Formulation', url: 'https://fccrxportal.com/dashboard', icon: '🧪', color: 'text-rose-300' },
  { name: 'Amazon', url: 'https://www.amazon.com/gc/balance', icon: '📦', color: 'text-orange-300' },
  { name: 'Allē Portal', url: 'https://provider.alle.com/', icon: '⭐', color: 'text-yellow-300' },
];

export function AdminHeader() {
  const { user, isLoading } = useAuth();
  const [showVendors, setShowVendors] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVendors(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-800 text-white sticky top-0 z-50 border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 h-14 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-xl" aria-hidden>💗</span>
            <span className="font-semibold">Hello Gorgeous</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-300 bg-slate-700/80 px-2 py-1 rounded-md font-medium">
              Staff
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Vendors Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowVendors(!showVendors)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
              <span aria-hidden>🏢</span>
              Vendors
              <span className="text-xs">▼</span>
            </button>
            
            {showVendors && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-2">
                  <p className="text-xs text-slate-400 px-2 py-1 uppercase tracking-wider">Quick Access</p>
                  {QUICK_VENDORS.map((vendor) => (
                    <a
                      key={vendor.name}
                      href={vendor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowVendors(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <span className={vendor.color}>{vendor.icon}</span>
                      <span className="text-sm">{vendor.name}</span>
                    </a>
                  ))}
                </div>
                <div className="border-t border-slate-700 p-2">
                  <Link
                    href="/admin/vendors"
                    onClick={() => setShowVendors(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-pink-400"
                  >
                    <span>⚙️</span>
                    <span className="text-sm">Manage All Vendors</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <a
            href="https://ehr.charmhealth.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
          >
            <span aria-hidden>🏥</span>
            Charm EHR
          </a>
          <Link
            href="/admin/appointments/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition-colors"
          >
            <span aria-hidden>➕</span>
            Book appointment
          </Link>
          <Link
            href="/pos"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
          >
            <span aria-hidden>💳</span>
            POS
          </Link>
          <button type="button" className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors" aria-label="Notifications">
            <span aria-hidden>🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden />
          </button>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-600 animate-pulse" aria-hidden />
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
}
