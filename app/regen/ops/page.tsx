'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type OrderStatus = 'pending' | 'processing' | 'compounding' | 'shipped' | 'delivered';

interface DashboardStats {
  revenue: { today: number; week: number; month: number };
  orders: { pending: number; shipped: number; total: number };
  patients: { new: number; active: number; total: number };
  intakeQueue: number;
  prescriptionQueue: number;
  messages: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  patient: { name: string; email: string } | null;
  items: Array<{ name: string; qty: number }>;
  status: OrderStatus;
  total: number;
  created_at: string;
}

interface IntakeItem {
  id: string;
  name: string;
  email: string;
  goal: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  compounding: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  shipped: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

export default function RegenOpsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: { today: 0, week: 0, month: 0 },
    orders: { pending: 0, shipped: 0, total: 0 },
    patients: { new: 0, active: 0, total: 0 },
    intakeQueue: 0,
    prescriptionQueue: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [intakeQueue, setIntakeQueue] = useState<IntakeItem[]>([]);

  const fetchData = useCallback(async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/regen/ops/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch recent orders
      const ordersRes = await fetch('/api/regen/ops/orders?limit=5');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData.orders || []);
      }

      // Fetch intake queue
      const intakesRes = await fetch('/api/regen/ops/intakes?status=pending&limit=5');
      if (intakesRes.ok) {
        const intakesData = await intakesRes.json();
        setIntakeQueue(intakesData.intakes || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' • '}
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/regen/ops/payments?action=invoice"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all flex items-center gap-2"
          >
            <span>💰</span> Send Invoice
          </Link>
          <Link
            href="/regen/ops/orders/new"
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <span>📦</span> New Order
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/10 rounded-2xl p-5 border border-teal-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">💵</span>
            <span className="text-teal-400 text-xs font-medium px-2 py-1 bg-teal-500/20 rounded-full">+12%</span>
          </div>
          <p className="text-white/50 text-sm">Today&apos;s Revenue</p>
          <p className="text-2xl font-bold text-white">${stats.revenue.today.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-2xl p-5 border border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📦</span>
            <Link href="/regen/ops/orders" className="text-pink-400 text-xs hover:underline">View all</Link>
          </div>
          <p className="text-white/50 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-white">{stats.orders.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl p-5 border border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📋</span>
            <Link href="/regen/ops/intake" className="text-amber-400 text-xs hover:underline">Review</Link>
          </div>
          <p className="text-white/50 text-sm">Intake Queue</p>
          <p className="text-2xl font-bold text-white">{stats.intakeQueue}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">💊</span>
            <Link href="/regen/ops/prescriptions" className="text-purple-400 text-xs hover:underline">Review</Link>
          </div>
          <p className="text-white/50 text-sm">Awaiting Rx</p>
          <p className="text-2xl font-bold text-white">{stats.prescriptionQueue}</p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-white/50 text-sm mb-1">Today</p>
            <p className="text-2xl font-bold text-teal-400">${stats.revenue.today.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-white/50 text-sm mb-1">This Week</p>
            <p className="text-2xl font-bold text-white">${stats.revenue.week.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-white/50 text-sm mb-1">This Month</p>
            <p className="text-2xl font-bold text-white">${stats.revenue.month.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link href="/regen/ops/orders" className="text-teal-400 text-sm hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 && !loading && (
              <p className="text-white/50 text-center py-4">No orders yet</p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {order.patient?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{order.patient?.name || 'Unknown'}</p>
                    <p className="text-white/50 text-sm truncate max-w-[200px]">
                      {order.items?.[0]?.name || order.order_number}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                    {order.status}
                  </span>
                  <p className="text-white/50 text-xs mt-1">${order.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intake Queue */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">🔔 Intake Queue</h2>
            <Link href="/regen/ops/intake" className="text-pink-400 text-sm hover:underline">Review all →</Link>
          </div>
          <div className="space-y-3">
            {intakeQueue.length === 0 && !loading && (
              <p className="text-white/50 text-center py-4">No pending intakes 🎉</p>
            )}
            {intakeQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gradient-to-r from-pink-500/10 to-amber-500/10 rounded-xl border border-pink-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{item.name}</p>
                  <span className="text-white/50 text-xs">{timeAgo(item.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-sm">{item.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded text-xs text-white/70">
                      {item.goal}
                    </span>
                  </div>
                  <Link
                    href={`/regen/ops/intake/${item.id}`}
                    className="px-3 py-1.5 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-400 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/regen/ops/payments?action=invoice"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-teal-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">💰</span>
            <span className="text-white/70 text-sm group-hover:text-white">Send Invoice</span>
          </Link>
          <Link
            href="/regen/ops/payments?action=link"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-teal-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🔗</span>
            <span className="text-white/70 text-sm group-hover:text-white">Payment Link</span>
          </Link>
          <Link
            href="/regen/ops/patients/new"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-pink-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">👤</span>
            <span className="text-white/70 text-sm group-hover:text-white">Add Patient</span>
          </Link>
          <Link
            href="/regen/ops/catalog"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-purple-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🔬</span>
            <span className="text-white/70 text-sm group-hover:text-white">Browse Catalog</span>
          </Link>
          <Link
            href="/regen/ops/messages"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-blue-500/20 transition-all group relative"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">💬</span>
            <span className="text-white/70 text-sm group-hover:text-white">Messages</span>
            {stats.messages > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {stats.messages}
              </span>
            )}
          </Link>
          <Link
            href="/regen/ops/orders/new"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-amber-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">📦</span>
            <span className="text-white/70 text-sm group-hover:text-white">New Order</span>
          </Link>
          <a
            href="https://doxy.me/ryankent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-green-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">📹</span>
            <span className="text-white/70 text-sm group-hover:text-white">Start Video Call</span>
          </a>
          <Link
            href="/regen/ops/reports"
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-slate-500/20 transition-all group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">📈</span>
            <span className="text-white/70 text-sm group-hover:text-white">View Reports</span>
          </Link>
        </div>
      </div>

      {/* Formulation Rx Integration Status */}
      <div className="bg-gradient-to-r from-teal-500/10 to-pink-500/10 rounded-2xl p-6 border border-teal-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Formulation Rx Connected</h3>
              <p className="text-white/50 text-sm">Real-time order sync active • 4,974 products available</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
