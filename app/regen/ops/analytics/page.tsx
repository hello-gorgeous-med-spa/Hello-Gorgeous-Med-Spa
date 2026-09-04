'use client';

import { useState, useEffect, useCallback } from 'react';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

interface Analytics {
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
    growth: number; // % change from last month
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    avgValue: number;
  };
  patients: {
    total: number;
    new: number;
    active: number;
    churnRate: number;
  };
  subscriptions: {
    active: number;
    mrr: number; // Monthly recurring revenue
    growth: number;
  };
  topProducts: Array<{
    name: string;
    revenue: number;
    count: number;
  }>;
  revenueByProgram: Array<{
    program: string;
    revenue: number;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`/api/regen/ops/analytics?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const data = analytics || {
    revenue: { today: 0, week: 0, month: 0, year: 0, growth: 0 },
    orders: { total: 0, pending: 0, completed: 0, avgValue: 0 },
    patients: { total: 0, new: 0, active: 0, churnRate: 0 },
    subscriptions: { active: 0, mrr: 0, growth: 0 },
    topProducts: [],
    revenueByProgram: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-white/50">Real-time business metrics</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                period === p
                  ? 'bg-teal-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          className="p-6 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${BRAND.teal}30 0%, ${BRAND.pink}20 100%)`, border: `1px solid ${BRAND.teal}40` }}
        >
          <p className="text-white/60 text-sm mb-1">Today</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(data.revenue.today)}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <p className="text-white/60 text-sm mb-1">This Week</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(data.revenue.week)}</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <p className="text-white/60 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(data.revenue.month)}</p>
          {data.revenue.growth !== 0 && (
            <p className={`text-sm mt-1 ${data.revenue.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.revenue.growth > 0 ? '↑' : '↓'} {Math.abs(data.revenue.growth).toFixed(1)}% vs last month
            </p>
          )}
        </div>
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <p className="text-white/60 text-sm mb-1">This Year</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(data.revenue.year)}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <h2 className="text-lg font-semibold text-white mb-4">Orders</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/60">Total Orders</span>
              <span className="text-white font-bold">{data.orders.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Pending</span>
              <span className="text-amber-400 font-bold">{data.orders.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Completed</span>
              <span className="text-green-400 font-bold">{data.orders.completed}</span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-white/60">Avg Order Value</span>
                <span className="text-teal-400 font-bold">{formatCurrency(data.orders.avgValue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patients */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <h2 className="text-lg font-semibold text-white mb-4">Patients</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/60">Total Patients</span>
              <span className="text-white font-bold">{data.patients.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">New This Month</span>
              <span className="text-green-400 font-bold">+{data.patients.new}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Active</span>
              <span className="text-teal-400 font-bold">{data.patients.active}</span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-white/60">Churn Rate</span>
                <span className={`font-bold ${data.patients.churnRate < 5 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.patients.churnRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <h2 className="text-lg font-semibold text-white mb-4">Subscriptions</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/60">Active Subscriptions</span>
              <span className="text-white font-bold">{data.subscriptions.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">MRR</span>
              <span className="text-teal-400 font-bold">{formatCurrency(data.subscriptions.mrr)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">ARR</span>
              <span className="text-white font-bold">{formatCurrency(data.subscriptions.mrr * 12)}</span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-white/60">Growth</span>
                <span className={`font-bold ${data.subscriptions.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.subscriptions.growth > 0 ? '+' : ''}{data.subscriptions.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Program */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <h2 className="text-lg font-semibold text-white mb-4">Revenue by Program</h2>
          {data.revenueByProgram.length === 0 ? (
            <p className="text-white/50 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-4">
              {data.revenueByProgram.map((item) => (
                <div key={item.program}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/80">{item.program}</span>
                    <span className="text-white font-medium">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${item.percentage}%`,
                        background: `linear-gradient(90deg, ${BRAND.teal} 0%, ${BRAND.pink} 100%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl" style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}>
          <h2 className="text-lg font-semibold text-white mb-4">Top Products</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-white/50 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.slice(0, 5).map((product, idx) => (
                <div 
                  key={product.name}
                  className="flex items-center gap-4 p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <span 
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: `${BRAND.teal}30`, color: BRAND.teal }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{product.name}</p>
                    <p className="text-white/50 text-sm">{product.count} orders</p>
                  </div>
                  <span className="text-teal-400 font-bold">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
