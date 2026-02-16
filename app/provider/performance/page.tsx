'use client';

// ============================================================
// MY PERFORMANCE - Provider Analytics & Stats
// Track productivity, revenue, and patient metrics
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProviderId } from '@/lib/provider/useProviderId';

interface PerformanceStats {
  // Today
  todayPatients: number;
  todayRevenue: number;
  todayUnits: number;
  
  // This Week
  weekPatients: number;
  weekRevenue: number;
  weekUnits: number;
  
  // This Month
  monthPatients: number;
  monthRevenue: number;
  monthUnits: number;
  
  // All Time
  totalPatients: number;
  totalRevenue: number;
  
  // Rates
  rebookRate: number;
  noShowRate: number;
  avgRating: number;
}

interface ServiceBreakdown {
  service: string;
  count: number;
  revenue: number;
  percentage: number;
}

export default function ProviderPerformancePage() {
  const providerId = useProviderId();
  const [stats, setStats] = useState<PerformanceStats>({
    todayPatients: 0,
    todayRevenue: 0,
    todayUnits: 0,
    weekPatients: 0,
    weekRevenue: 0,
    weekUnits: 0,
    monthPatients: 0,
    monthRevenue: 0,
    monthUnits: 0,
    totalPatients: 0,
    totalRevenue: 0,
    rebookRate: 0,
    noShowRate: 0,
    avgRating: 0,
  });
  const [serviceBreakdown, setServiceBreakdown] = useState<ServiceBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch appointments
        const params = new URLSearchParams({ limit: '500' });
        if (providerId) params.set('provider_id', providerId);
        const res = await fetch(`/api/appointments?${params}`);
        const data = await res.json();
        
        if (data.appointments) {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          
          const completed = data.appointments.filter((a: any) => a.status === 'completed');
          const noShows = data.appointments.filter((a: any) => a.status === 'no_show');
          
          // Calculate today's stats
          const todayAppts = completed.filter((a: any) => a.starts_at?.startsWith(today));
          const todayRevenue = todayAppts.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);
          
          // Calculate week stats
          const weekAppts = completed.filter((a: any) => new Date(a.starts_at) >= weekAgo);
          const weekRevenue = weekAppts.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);
          
          // Calculate month stats
          const monthAppts = completed.filter((a: any) => new Date(a.starts_at) >= monthAgo);
          const monthRevenue = monthAppts.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);
          
          // Calculate rates
          const totalAppts = data.appointments.length;
          const noShowRate = totalAppts > 0 ? (noShows.length / totalAppts) * 100 : 0;
          
          setStats({
            todayPatients: todayAppts.length,
            todayRevenue,
            todayUnits: todayAppts.length * 25, // Estimate
            weekPatients: weekAppts.length,
            weekRevenue,
            weekUnits: weekAppts.length * 25,
            monthPatients: monthAppts.length,
            monthRevenue,
            monthUnits: monthAppts.length * 25,
            totalPatients: completed.length,
            totalRevenue: completed.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0),
            rebookRate: 68, // Would come from actual data
            noShowRate: Math.round(noShowRate * 10) / 10,
            avgRating: 4.9, // Would come from reviews
          });
          
          // Service breakdown
          const serviceMap = new Map<string, { count: number; revenue: number }>();
          monthAppts.forEach((apt: any) => {
            const service = apt.service_name || 'Other';
            const existing = serviceMap.get(service) || { count: 0, revenue: 0 };
            serviceMap.set(service, {
              count: existing.count + 1,
              revenue: existing.revenue + (apt.service_price || 0),
            });
          });
          
          const breakdown: ServiceBreakdown[] = Array.from(serviceMap.entries())
            .map(([service, data]) => ({
              service,
              count: data.count,
              revenue: data.revenue,
              percentage: monthAppts.length > 0 ? (data.count / monthAppts.length) * 100 : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          
          setServiceBreakdown(breakdown);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [period, providerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">My Performance</h1>
          <p className="text-black">Track your productivity and patient metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black hover:text-black'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-medium text-white/80 mb-4">Today's Performance</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-4xl font-bold">{stats.todayPatients}</p>
            <p className="text-white/80">Patients Seen</p>
          </div>
          <div>
            <p className="text-4xl font-bold">${stats.todayRevenue.toLocaleString()}</p>
            <p className="text-white/80">Revenue Generated</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats.todayUnits}</p>
            <p className="text-white/80">Units Administered</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* This Week */}
        <div className="bg-white rounded-xl border border-black p-5">
          <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
            <span className="text-lg">📅</span>
            This Week
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-black">Patients</span>
              <span className="font-bold text-black">{stats.weekPatients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Revenue</span>
              <span className="font-bold text-green-600">${stats.weekRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Units</span>
              <span className="font-bold text-black">{stats.weekUnits}</span>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl border border-black p-5">
          <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
            <span className="text-lg">📆</span>
            This Month
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-black">Patients</span>
              <span className="font-bold text-black">{stats.monthPatients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Revenue</span>
              <span className="font-bold text-green-600">${stats.monthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Units</span>
              <span className="font-bold text-black">{stats.monthUnits}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-xl border border-black p-5">
          <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
            <span className="text-lg">📊</span>
            Key Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-black">Rebook Rate</span>
              <span className={`font-bold ${stats.rebookRate >= 60 ? 'text-green-600' : 'text-amber-600'}`}>
                {stats.rebookRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">No-Show Rate</span>
              <span className={`font-bold ${stats.noShowRate <= 10 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.noShowRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">Avg Rating</span>
              <span className="font-bold text-amber-500">
                ⭐ {stats.avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Service Breakdown (This Month)</h2>
        </div>
        <div className="p-5">
          {serviceBreakdown.length === 0 ? (
            <p className="text-black text-center py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {serviceBreakdown.map((service, idx) => (
                <div key={service.service}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-black">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-black">{service.count}</span>
                      <span className="text-black text-sm ml-2">(${service.revenue.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Goals & Achievements */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Goals */}
        <div className="bg-white rounded-xl border border-black p-5">
          <h3 className="font-semibold text-black mb-4">Monthly Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-black">Revenue Goal</span>
                <span className="text-black font-medium">
                  ${stats.monthRevenue.toLocaleString()} / $50,000
                </span>
              </div>
              <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min((stats.monthRevenue / 50000) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-black">Patient Goal</span>
                <span className="text-black font-medium">
                  {stats.monthPatients} / 150 patients
                </span>
              </div>
              <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min((stats.monthPatients / 150) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-black">Rebook Rate</span>
                <span className="text-black font-medium">
                  {stats.rebookRate}% / 70% target
                </span>
              </div>
              <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    stats.rebookRate >= 70 ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min((stats.rebookRate / 70) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl border border-black p-5">
          <h3 className="font-semibold text-black mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-medium text-black">Top Performer</p>
                <p className="text-sm text-black">Highest revenue this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-medium text-black">5-Star Provider</p>
                <p className="text-sm text-black">Avg rating above 4.8</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-black">Growth Champion</p>
                <p className="text-sm text-black">15% increase from last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
