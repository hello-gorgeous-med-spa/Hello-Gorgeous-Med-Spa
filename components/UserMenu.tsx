'use client';

// ============================================================
// USER MENU COMPONENT
// Displays current user with dropdown for logout
// ============================================================

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hgos/AuthContext';

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white text-sm font-medium transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase();

  const roleColors: Record<string, string> = {
    owner: 'bg-amber-500',
    admin: 'bg-pink-500',
    provider: 'bg-purple-500',
    staff: 'bg-blue-500',
    client: 'bg-green-500',
  };

  const roleLabels: Record<string, string> = {
    owner: 'Owner',
    admin: 'Admin',
    provider: 'Provider',
    staff: 'Staff',
    client: 'Client',
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className={`w-8 h-8 rounded-full ${roleColors[user.role] || 'bg-gray-500'} flex items-center justify-center text-white text-sm font-bold`}>
          {initials}
        </div>
        <span className="hidden sm:inline text-sm text-white">
          {user.firstName || user.email.split('@')[0]}
        </span>
        <svg
          className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${roleColors[user.role] || 'bg-gray-500'} flex items-center justify-center text-white font-bold`}>
                {initials}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                  user.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                  user.role === 'admin' ? 'bg-pink-100 text-pink-700' :
                  user.role === 'provider' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {(user.role === 'owner' || user.role === 'admin') && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span>📊</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
            {(user.role === 'owner' || user.role === 'admin' || user.role === 'provider') && (
              <Link
                href="/provider"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span>🩺</span>
                <span>Provider Dashboard</span>
              </Link>
            )}
            <Link
              href="/portal"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>👤</span>
              <span>My Portal</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
