// ============================================================
// POS TERMINAL LAYOUT
// Full-screen point of sale interface
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'POS Terminal | Hello Gorgeous Med Spa',
  description: 'Point of Sale system for Hello Gorgeous Med Spa.',
};

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                <span className="text-slate-400">Today's Sales</span>
                <span className="ml-2 font-bold text-green-400">$2,450</span>
              </div>
              <div>
                <span className="text-slate-400">Transactions</span>
                <span className="ml-2 font-bold">12</span>
              </div>
            </div>

            {/* Time */}
            <div className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
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
