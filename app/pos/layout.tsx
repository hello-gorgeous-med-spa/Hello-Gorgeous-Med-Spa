'use client';

// ============================================================
// POS TERMINAL LAYOUT
// Full-screen point of sale interface
// Auth handled by middleware
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }));
  }, []);
  
  return (
    <div className="min-h-screen bg-white text-black">
      {/* POS Header */}
      <header className="bg-white border-b-2 border-black">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/pos" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-xl">💗</span>
              <span className="font-semibold text-[#FF2D8E]">Hello Gorgeous</span>
              <span className="text-xs bg-[#FF2D8E] text-white px-2 py-0.5 rounded font-bold">
                POS
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div>
                <span className="text-black/70">Today&apos;s Sales</span>
                <span className="ml-2 font-bold text-[#FF2D8E]">$2,450</span>
              </div>
              <div>
                <span className="text-black/70">Transactions</span>
                <span className="ml-2 font-bold text-black">12</span>
              </div>
            </div>

            {/* Time */}
            <div className="text-sm text-black/70">
              {currentDate}
            </div>

            {/* Back to Admin */}
            <Link
              href="/admin"
              className="text-sm text-black hover:text-[#FF2D8E] transition-colors font-medium"
            >
              ← Admin
            </Link>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF2D8E] flex items-center justify-center text-white text-sm font-bold">
                DG
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-56px)] bg-white">
        {children}
      </main>
    </div>
  );
}
