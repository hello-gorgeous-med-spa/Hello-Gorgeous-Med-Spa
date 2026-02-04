'use client';

// ============================================================
// POS TERMINAL LAYOUT
// Full-screen point of sale interface
// WITH AUTH PROTECTION
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ============================================================
// AUTH CHECK - Protect POS routes
// ============================================================
function usePOSAuthGuard() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const sessionCookie = cookies['hgos_session'];
    
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
        const validRoles = ['owner', 'admin', 'staff', 'provider'];
        
        if (sessionData.userId && sessionData.role && validRoles.includes(sessionData.role)) {
          setIsAuthorized(true);
          return;
        }
      } catch (e) {
        console.error('Invalid session cookie');
      }
    }

    // Check localStorage fallback
    try {
      const storedUser = localStorage.getItem('hgos_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const validRoles = ['owner', 'admin', 'staff', 'provider'];
        if (user.id && user.role && validRoles.includes(user.role)) {
          const sessionData = { userId: user.id, email: user.email, role: user.role };
          document.cookie = `hgos_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          setIsAuthorized(true);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to check localStorage');
    }

    setIsAuthorized(false);
    window.location.href = `/login?returnTo=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  return isAuthorized;
}

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentDate, setCurrentDate] = useState('');
  
  // CRITICAL: Auth check
  const isAuthorized = usePOSAuthGuard();
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }));
  }, []);
  
  // Show loading/redirect while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white/70">Redirecting to login...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* POS Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/pos" className="flex items-center gap-2">
              <span className="text-xl">💗</span>
              <span className="font-semibold">Hello Gorgeous</span>
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-bold">
                POS
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div>
                <span className="text-slate-400">Today&apos;s Sales</span>
                <span className="ml-2 font-bold text-green-400">$2,450</span>
              </div>
              <div>
                <span className="text-slate-400">Transactions</span>
                <span className="ml-2 font-bold">12</span>
              </div>
            </div>

            {/* Time */}
            <div className="text-sm text-slate-400">
              {currentDate}
            </div>

            {/* Back to Admin */}
            <Link
              href="/admin"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Admin
            </Link>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-sm font-bold">
                DG
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-56px)]">
        {children}
      </main>
    </div>
  );
}
