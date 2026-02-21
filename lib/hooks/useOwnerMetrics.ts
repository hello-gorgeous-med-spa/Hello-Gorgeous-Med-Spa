'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// OWNER METRICS HOOK - Real-time data for Founder Dashboard
// ============================================================

export type DateRange = 'today' | 'week' | 'month' | 'year';

export interface OwnerMetrics {
  connected: boolean;
  timestamp: string;
  revenue: {
    total: number;
    avgTicket: number;
    transactions: number;
  };
  appointments: {
    total: number;
    completed: number;
    noShows: number;
    noShowRate: number;
    upcoming: Array<{
      id: string;
      clientName: string;
      service: string;
      provider: string;
      time: string;
    }>;
  };
  clients: {
    total: number;
    new: number;
  };
  memberships: {
    active: number;
    mrr: number;
  };
  inventory: {
    expired: number;
    expiringSoon: number;
    lowStock: number;
  };
  compliance: {
    pendingConsents: number;
  };
  system: {
    activeRules: number;
    enabledFeatures: number;
    totalFeatures: number;
  };
  providers: {
    active: number;
    stats: Array<{
      id: string;
      name: string;
      appointments: number;
    }>;
  };
  recentChanges: Array<{
    id: string;
    action: string;
    target: string;
    user: string;
    timestamp: string;
  }>;
}

export function useOwnerMetrics(dateRange: DateRange) {
  const [data, setData] = useState<OwnerMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch dashboard data
      const dashRes = await fetch('/api/dashboard', {
        signal: AbortSignal.timeout(10000),
      }).catch(() => null);

      if (!dashRes || !dashRes.ok) {
        // Return empty data structure if API fails
        setData({
          connected: false,
          timestamp: new Date().toISOString(),
          revenue: { total: 0, avgTicket: 0, transactions: 0 },
          appointments: { total: 0, completed: 0, noShows: 0, noShowRate: 0, upcoming: [] },
          clients: { total: 0, new: 0 },
          memberships: { active: 0, mrr: 0 },
          inventory: { expired: 0, expiringSoon: 0, lowStock: 0 },
          compliance: { pendingConsents: 0 },
          system: { activeRules: 12, enabledFeatures: 8, totalFeatures: 12 },
          providers: { active: 0, stats: [] },
          recentChanges: [],
        });
        setIsLoading(false);
        return;
      }

      const dashData = await dashRes.json().catch(() => ({}));

      // Fetch appointments
      const today = new Date().toISOString().split('T')[0];
      const aptsRes = await fetch(`/api/appointments?date=${today}`, {
        signal: AbortSignal.timeout(10000),
      }).catch(() => null);
      const aptsData = aptsRes ? await aptsRes.json().catch(() => ({})) : {};
      const appointments = aptsData.appointments || [];

      // Fetch providers
      const provRes = await fetch('/api/providers', {
        signal: AbortSignal.timeout(10000),
      }).catch(() => null);
      const provData = provRes ? await provRes.json().catch(() => ({})) : {};
      const providers = provData.providers || [];

      // Calculate metrics based on date range
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      // Process appointments
      const completedAppts = appointments.filter((a: any) => a.status === 'completed');
      const noShowAppts = appointments.filter((a: any) => a.status === 'no_show');
      const upcomingAppts = appointments
        .filter((a: any) => !['completed', 'cancelled', 'no_show'].includes(a.status))
        .slice(0, 5)
        .map((a: any) => ({
          id: a.id,
          clientName: a.client_name || 'Client',
          service: a.service_name || 'Service',
          provider: a.provider_name || 'Provider',
          time: a.starts_at,
        }));

      // Calculate revenue
      const totalRevenue = completedAppts.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);

      // Process provider stats
      const providerStatsMap = new Map<string, { id: string; name: string; appointments: number }>();
      appointments.forEach((apt: any) => {
        if (apt.provider_id) {
          const existing = providerStatsMap.get(apt.provider_id);
          if (existing) {
            existing.appointments++;
          } else {
            providerStatsMap.set(apt.provider_id, {
              id: apt.provider_id,
              name: apt.provider_name || 'Provider',
              appointments: 1,
            });
          }
        }
      });

      setData({
        connected: true,
        timestamp: new Date().toISOString(),
        revenue: {
          total: dashData.stats?.todayRevenue || totalRevenue,
          avgTicket: completedAppts.length > 0 ? Math.round(totalRevenue / completedAppts.length) : 0,
          transactions: completedAppts.length,
        },
        appointments: {
          total: appointments.length,
          completed: completedAppts.length,
          noShows: noShowAppts.length,
          noShowRate: appointments.length > 0 ? noShowAppts.length / appointments.length : 0,
          upcoming: upcomingAppts,
        },
        clients: {
          total: dashData.stats?.totalClients || 0,
          new: dashData.stats?.newClientsMonth || 0,
        },
        memberships: {
          active: dashData.stats?.activeMembers || 0,
          mrr: dashData.stats?.membershipMRR || 0,
        },
        inventory: {
          expired: 0,
          expiringSoon: 0,
          lowStock: 0,
        },
        compliance: {
          pendingConsents: 0,
        },
        system: {
          activeRules: 12,
          enabledFeatures: 8,
          totalFeatures: 12,
        },
        providers: {
          active: providers.length,
          stats: Array.from(providerStatsMap.values()),
        },
        recentChanges: [],
      });
    } catch (err) {
      console.error('Owner metrics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchMetrics();
    // Refresh every 60 seconds
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { data, isLoading, error, refetch: fetchMetrics };
}

// ============================================================
// UI COMPONENTS
// ============================================================

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-4 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-24" />
    </div>
  );
}

export function EmptyState({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="p-8 text-center">
      <span className="text-4xl block mb-3">{icon}</span>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function ErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <span className="text-4xl block mb-3">⚠️</span>
      <h3 className="font-medium text-red-800 mb-2">Error Loading Data</h3>
      <p className="text-sm text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

export function DatabaseNotConnected() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <span className="text-3xl">🔌</span>
        <div>
          <h3 className="font-bold text-amber-800 mb-2">Database Not Connected</h3>
          <p className="text-amber-700 mb-4">
            The system is running but cannot connect to the database. This may be because:
          </p>
          <ul className="list-disc pl-5 text-amber-700 space-y-1 mb-4">
            <li>Environment variables are not set (SUPABASE_URL, SUPABASE_ANON_KEY)</li>
            <li>The database is temporarily unavailable</li>
            <li>Network connectivity issues</li>
          </ul>
          <p className="text-sm text-amber-600">
            Check your Vercel environment variables or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
