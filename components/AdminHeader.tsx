'use client';

// ============================================================
// ADMIN HEADER COMPONENT
// Header bar for admin dashboard with user menu
// ============================================================

import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/lib/hgos/AuthContext';

export function AdminHeader() {
  const { user, isLoading } = useAuth();

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
