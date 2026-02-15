'use client';

// ============================================================
// CLIENT PORTAL DASHBOARD
// Secure, HIPAA-Compliant Patient Portal
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePortalAuth } from '@/lib/portal/useAuth';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#111111]/10 rounded ${className}`} />;
}

const QUICK_ACTIONS = [
  { title: 'Book Appointment', description: 'Schedule your next visit', href: '/portal/book', icon: '📅', color: 'from-[#E6007E] to-pink-600' },
  { title: 'My Documents', description: 'Access your records', href: '/portal/documents', icon: '📁', color: 'from-blue-500 to-blue-600' },
  { title: 'Consent Forms', description: 'Sign required forms', href: '/portal/consents', icon: '📝', color: 'from-amber-500 to-orange-500' },
  { title: 'My Progress', description: 'View your transformation', href: '/portal/timeline', icon: '📸', color: 'from-purple-500 to-purple-600' },
  { title: 'Aftercare', description: 'Treatment instructions', href: '/portal/aftercare', icon: '📋', color: 'from-emerald-500 to-green-600' },
  { title: 'Payment History', description: 'Receipts & invoices', href: '/portal/receipts', icon: '🧾', color: 'from-gray-600 to-gray-700' },
];

export default function PortalDashboard() {
  const { user, loading: authLoading, authenticated, logout } = usePortalAuth();
  const [notifications, setNotifications] = useState<{ unreadCount: number }>({ unreadCount: 0 });
  const [wallet, setWallet] = useState<{ creditBalance: number; rewardPoints: number } | null>(null);
  const [pendingConsents, setPendingConsents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authenticated) return;

    async function fetchDashboardData() {
      try {
        const [notifRes, walletRes] = await Promise.all([
          fetch('/api/portal/notifications'),
          fetch('/api/portal/wallet'),
        ]);

        const notifData = await notifRes.json();
        const walletData = await walletRes.json();

        setNotifications({ unreadCount: notifData.unreadCount || 0 });
        setWallet(walletData.wallet);
        setPendingConsents(4); // Placeholder - would come from consents API
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [authenticated]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin text-4xl">💗</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E6007E]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-3xl font-bold mb-2">
              Hello, {user?.firstName || 'Gorgeous'}! 💗
            </h1>
            <p className="text-white/70">Your secure patient portal</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Notifications */}
        <Link href="/portal/notifications" className="bg-white rounded-2xl border border-[#111]/10 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <div>
                <p className="font-medium text-[#111]">Notifications</p>
                <p className="text-sm text-[#111]/50">
                  {notifications.unreadCount > 0 ? `${notifications.unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>
            {notifications.unreadCount > 0 && (
              <span className="w-6 h-6 bg-[#E6007E] text-white rounded-full text-xs flex items-center justify-center font-medium">
                {notifications.unreadCount}
              </span>
            )}
          </div>
        </Link>

        {/* Wallet */}
        <Link href="/portal/wallet" className="bg-white rounded-2xl border border-[#111]/10 p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E6007E]/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <p className="font-medium text-[#111]">Wallet Balance</p>
              <p className="text-lg font-bold text-[#E6007E]">
                ${wallet?.creditBalance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </Link>

        {/* Pending Forms */}
        <Link href="/portal/consents" className="bg-white rounded-2xl border border-[#111]/10 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <p className="font-medium text-[#111]">Consent Forms</p>
                <p className="text-sm text-[#111]/50">
                  {pendingConsents > 0 ? `${pendingConsents} pending` : 'All signed'}
                </p>
              </div>
            </div>
            {pendingConsents > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Action Needed
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-[#111] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.title} href={action.href} className="group">
              <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white h-full hover:shadow-lg transition-all hover:scale-[1.02]`}>
                <span className="text-3xl mb-3 block">{action.icon}</span>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#111]">Upcoming Appointments</h2>
          <Link href="/portal/appointments" className="text-[#E6007E] hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#111]/10 p-8 text-center">
          <span className="text-4xl mb-4 block">📅</span>
          <h3 className="font-semibold text-[#111] mb-2">No upcoming appointments</h3>
          <p className="text-[#111]/70 mb-4">Book your next treatment today!</p>
          <Link
            href="/portal/book"
            className="inline-flex items-center gap-2 bg-[#E6007E] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#E6007E]/90 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Portal Features */}
      <section className="bg-gradient-to-br from-[#E6007E]/5 to-white rounded-3xl p-8 border border-[#E6007E]/10">
        <h2 className="text-xl font-bold text-[#111] mb-6">Your Portal Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📁</span>
            </div>
            <p className="font-medium text-[#111] text-sm">Documents</p>
            <p className="text-xs text-[#111]/50">Download anytime</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🧾</span>
            </div>
            <p className="font-medium text-[#111] text-sm">Receipts</p>
            <p className="text-xs text-[#111]/50">Payment history</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📸</span>
            </div>
            <p className="font-medium text-[#111] text-sm">Progress</p>
            <p className="text-xs text-[#111]/50">Before & After</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="font-medium text-[#111] text-sm">Secure</p>
            <p className="text-xs text-[#111]/50">HIPAA Compliant</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Ready for Your Next Glow-Up?</h2>
        <p className="text-white/70 mb-6">Book online 24/7 and choose your preferred time</p>
        <Link
          href="/portal/book"
          className="inline-flex items-center gap-2 bg-[#E6007E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E6007E]/90 transition-colors"
        >
          Book Your Appointment →
        </Link>
      </section>
    </div>
  );
}
