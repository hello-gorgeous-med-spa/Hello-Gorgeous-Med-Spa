'use client';

// ============================================================
// SYSTEM HEALTH DASHBOARD
// Go-live readiness verification
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HealthData {
  timestamp: string;
  overallScore: number;
  status: 'READY' | 'ALMOST_READY' | 'NEEDS_WORK';
  database: {
    tablesExisting: number;
    tablesTotal: number;
    tablesWithData: number;
    tables: Array<{
      name: string;
      exists: boolean;
      count: number | null;
      error?: string;
    }>;
  };
  integrations: Array<{
    name: string;
    configured: boolean;
    details?: string;
  }>;
  metrics: {
    totalClients: number;
    totalUsers: number;
    totalServices: number;
    totalAppointments: number;
    smsOptInCount: number;
  };
  checklist: Array<{
    item: string;
    ready: boolean;
    critical: boolean;
  }>;
  checklistSummary: {
    criticalReady: number;
    criticalTotal: number;
    allReady: number;
    allTotal: number;
    canGoLive: boolean;
  };
}

export default function SystemHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/health');
      if (!res.ok) throw new Error('Failed to fetch health data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-300';
    if (score >= 70) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getStatusEmoji = (status: string) => {
    if (status === 'READY') return '🚀';
    if (status === 'ALMOST_READY') return '⚠️';
    return '🔧';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Running system health check...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-bold">Health Check Failed</h3>
          <p>{error || 'Could not load health data'}</p>
          <button 
            onClick={fetchHealth}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-500">Go-live readiness verification</p>
        </div>
        <button
          onClick={fetchHealth}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          🔄 Refresh Check
        </button>
      </div>

      {/* Overall Score */}
      <div className={`rounded-xl border-2 p-8 text-center ${getScoreBg(data.overallScore)}`}>
        <div className="text-6xl mb-2">{getStatusEmoji(data.status)}</div>
        <div className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>
          {data.overallScore}/100
        </div>
        <div className="text-xl font-semibold mt-2">
          {data.status === 'READY' ? 'Ready for Go-Live!' : 
           data.status === 'ALMOST_READY' ? 'Almost Ready' : 'Needs Work'}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Last checked: {new Date(data.timestamp).toLocaleString()}
        </p>
        {data.checklistSummary.canGoLive && (
          <div className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-full font-semibold">
            ✅ All Critical Items Ready
          </div>
        )}
      </div>

      {/* Go-Live Checklist */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            📋 Go-Live Checklist
            <span className="text-sm font-normal text-gray-500">
              ({data.checklistSummary.allReady}/{data.checklistSummary.allTotal} ready)
            </span>
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data.checklist.map((item, idx) => (
            <div key={idx} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-xl ${item.ready ? 'text-green-500' : 'text-gray-300'}`}>
                  {item.ready ? '✅' : '⬜'}
                </span>
                <span className={item.ready ? 'text-gray-900' : 'text-gray-500'}>
                  {item.item}
                </span>
                {item.critical && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                    CRITICAL
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.metrics.totalClients}</p>
          <p className="text-sm text-gray-500">Clients</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.metrics.totalServices}</p>
          <p className="text-sm text-gray-500">Services</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.metrics.totalAppointments}</p>
          <p className="text-sm text-gray-500">Appointments</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{data.metrics.smsOptInCount}</p>
          <p className="text-sm text-gray-500">SMS Opt-In</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.database.tablesExisting}</p>
          <p className="text-sm text-gray-500">DB Tables</p>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">🔌 Integrations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {data.integrations.map((int, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-lg border ${
                int.configured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={int.configured ? 'text-green-600' : 'text-gray-400'}>
                  {int.configured ? '✅' : '❌'}
                </span>
                <span className="font-medium text-gray-900">{int.name}</span>
              </div>
              {int.details && (
                <p className={`text-sm ${
                  int.details === 'LIVE MODE' ? 'text-green-600 font-semibold' :
                  int.details === 'TEST MODE' ? 'text-yellow-600 font-semibold' :
                  'text-gray-500'
                }`}>
                  {int.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database Tables */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            🗄️ Database Tables
            <span className="text-sm font-normal text-gray-500">
              ({data.database.tablesExisting}/{data.database.tablesTotal} exist, 
              {data.database.tablesWithData} with data)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.database.tables.map((table, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border text-sm ${
                  table.exists 
                    ? table.count && table.count > 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium font-mono">{table.name}</span>
                  <span className={
                    table.exists 
                      ? table.count && table.count > 0 ? 'text-green-600' : 'text-yellow-600'
                      : 'text-red-600'
                  }>
                    {table.exists ? (table.count !== null ? table.count.toLocaleString() : '✓') : '✗'}
                  </span>
                </div>
                {table.error && (
                  <p className="text-xs text-red-600 mt-1 truncate" title={table.error}>
                    {table.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/services"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Manage Services
          </Link>
          <Link
            href="/admin/clients"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            View Clients
          </Link>
          <Link
            href="/admin/sms"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            SMS Marketing
          </Link>
          <Link
            href="/pos"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Test POS
          </Link>
          <Link
            href="/book"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Test Booking
          </Link>
        </div>
      </div>

      {/* Disaster Recovery Doc Link */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-2">📚 Documentation</h2>
        <p className="text-gray-600 text-sm mb-4">
          Essential guides for operating Hello Gorgeous OS
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/docs/disaster-recovery"
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            Disaster Recovery Plan
          </a>
          <a
            href="/docs/OWNERS-MANUAL.md"
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            Owner's Manual
          </a>
        </div>
      </div>
    </div>
  );
}
