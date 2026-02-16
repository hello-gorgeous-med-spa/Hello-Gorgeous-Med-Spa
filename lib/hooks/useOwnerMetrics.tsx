// ============================================================
// HOOK: useOwnerMetrics - Fetch real data for Founder Dashboard
// NO STATIC VALUES - ALL DATA FROM DATABASE
// ============================================================

import { useState, useEffect, useCallback } from 'react';

export type DateRange = 'today' | 'week' | 'month' | 'year';

export interface OwnerMetrics {
  connected: boolean;
  timestamp: string;
  range: string;
  startDate: string;
  endDate: string;
  
  revenue: {
    total: number;
    transactions: number;
    avgTicket: number;
  };
  
  appointments: {
    total: number;
    completed: number;
    noShows: number;
    cancelled: number;
    noShowRate: number;
    upcoming: Array<{
      id: string;
      time: string;
      status: string;
      clientName: string;
      service: string;
      provider: string;
    }>;
  };
  
  clients: {
    total: number;
    new: number;
    rebookRate: number;
  };
  
  providers: {
    active: number;
    stats: Array<{
      id: string;
      name: string;
      appointments: number;
    }>;
  };
  
  services: {
    total: number;
  };
  
  memberships: {
    active: number;
  };
  
  inventory: {
    total: number;
    lowStock: number;
    expiringSoon: number;
    expired: number;
  };
  
  compliance: {
    pendingConsents: number;
  };
  
  system: {
    status: string;
    enabledFeatures: number;
    totalFeatures: number;
    activeRules: number;
  };
  
  recentChanges: Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    target: string;
    details: any;
  }>;
}

interface UseOwnerMetricsResult {
  data: OwnerMetrics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOwnerMetrics(range: DateRange = 'month'): UseOwnerMetricsResult {
  const [data, setData] = useState<OwnerMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/owner/metrics?range=${range}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch metrics');
      }
      
      if (!result.connected) {
        setError(result.message || 'Database not connected');
        setData(null);
      } else if (result.error) {
        setError(result.message || 'Error fetching metrics');
        setData(null);
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { data, isLoading, error, refetch: fetchMetrics };
}

// ============================================================
// Loading Skeleton Components
// ============================================================

export function MetricSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-white rounded w-20 mb-2"></div>
      <div className="h-8 bg-white rounded w-24"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-4 animate-pulse">
      <div className="h-4 bg-white rounded w-24 mb-3"></div>
      <div className="h-8 bg-white rounded w-32 mb-2"></div>
      <div className="h-3 bg-white rounded w-20"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          <div className="h-4 bg-white rounded flex-1"></div>
          <div className="h-4 bg-white rounded w-20"></div>
          <div className="h-4 bg-white rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Empty State Components
// ============================================================

export function EmptyState({ 
  icon = '📊', 
  title = 'No data yet', 
  description = 'Data will appear once there is activity',
  action,
  actionLabel,
}: {
  icon?: string;
  title?: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="text-center py-8">
      <span className="text-4xl block mb-3">{icon}</span>
      <h3 className="font-medium text-black mb-1">{title}</h3>
      <p className="text-sm text-black mb-4">{description}</p>
      {action && actionLabel && (
        <button 
          onClick={action}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function DatabaseNotConnected() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
      <span className="text-4xl block mb-3">⚠️</span>
      <h3 className="font-semibold text-amber-800 mb-2">Database Not Connected</h3>
      <p className="text-sm text-amber-600">
        Unable to fetch live data. Please check your database configuration.
      </p>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <span className="text-4xl block mb-3">❌</span>
      <h3 className="font-semibold text-red-800 mb-2">Error Loading Data</h3>
      <p className="text-sm text-red-600 mb-4">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ============================================================
// Formatting Utilities
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
  return `${Math.round(value * 100)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  
  return formatDate(dateString);
}
