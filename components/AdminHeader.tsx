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
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl">💗</span>
            <span className="font-semibold">Hello Gorgeous</span>
            <span className="text-xs bg-amber-500 text-slate-900 px-2 py-0.5 rounded font-bold">
              ADMIN
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <Link
            href="/admin/appointments/new"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition-colors"
          >
            + New Appointment
          </Link>
          
          {/* POS Link */}
          <Link
            href="/pos"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
          >
            💳 POS
          </Link>
          
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <span>🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
}
