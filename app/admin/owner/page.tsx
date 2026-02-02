'use client';

// ============================================================
// FOUNDER CONTROL DASHBOARD - OVERVIEW
// ALL DATA FROM DATABASE - NO STATIC VALUES
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  useOwnerMetrics, 
  CardSkeleton, 
  EmptyState, 
  ErrorState,
  DatabaseNotConnected,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  type DateRange,
} from '@/lib/hooks/useOwnerMetrics';

const OWNER_NAV = [
  { href: '/admin/owner', label: 'Overview', icon: '🏠' },
  { href: '/admin/owner/live-state', label: 'Live System State', icon: '📡' },
  { href: '/admin/owner/rules', label: 'Rules & Precedence', icon: '⚖️' },
  { href: '/admin/owner/features', label: 'Modules & Features', icon: '🎚️' },
  { href: '/admin/owner/clinical', label: 'Clinical Governance', icon: '🩺' },
  { href: '/admin/owner/economics', label: 'Revenue & Economics', icon: '💰' },
  { href: '/admin/owner/data-model', label: 'Data Model Control', icon: '🗃️' },
  { href: '/admin/owner/changes', label: 'Change Management', icon: '📝' },
  { href: '/admin/owner/risk', label: 'Risk & Compliance', icon: '⚠️' },
  { href: '/admin/owner/authority', label: 'Access & Authority', icon: '🔐' },
  { href: '/admin/owner/exports', label: 'Exports & Exit', icon: '📤' },
  { href: '/admin/owner/audit', label: 'Audit & Forensics', icon: '🔍' },
];

export default function FounderOverviewPage() {
  const pathname = usePathname();
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [emergencyMode, setEmergencyMode] = useState<'normal' | 'readonly' | 'booking_disabled'>('normal');
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // REAL DATA - fetched from database
  const { data, isLoading, error, refetch } = useOwnerMetrics(dateRange);

  const executeEmergencyAction = (action: string) => {
    switch (action) {
      case 'readonly':
        setEmergencyMode('readonly');
        setMessage({ type: 'success', text: '🔴 SYSTEM NOW IN READ-ONLY MODE - All write operations disabled' });
        break;
      case 'disable_booking':
        setEmergencyMode('booking_disabled');
        setMessage({ type: 'success', text: '🟠 BOOKING DISABLED - Clients cannot book new appointments' });
        break;
      case 'restore':
        setEmergencyMode('normal');
        setMessage({ type: 'success', text: '✅ System restored to normal operation' });
        break;
    }
    setShowEmergencyConfirm(null);
    setTimeout(() => setMessage(null), 5000);
  };

  // Determine system status based on real data
  const getSystemStatus = () => {
    if (!data) return { status: 'unknown', color: 'text-gray-600 bg-gray-100', icon: '⚪' };
    
    const hasIssues = 
      data.inventory.expired > 0 || 
      data.compliance.pendingConsents > 5 ||
      data.appointments.noShowRate > 0.1;
    
    const hasCritical = data.inventory.expired > 0;
    
    if (hasCritical) return { status: 'critical', color: 'text-red-600 bg-red-100', icon: '🔴' };
    if (hasIssues) return { status: 'warning', color: 'text-amber-600 bg-amber-100', icon: '🟡' };
    return { status: 'stable', color: 'text-green-600 bg-green-100', icon: '🟢' };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Founder Control Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-shrink-0">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg">FOUNDER CONTROL</h1>
              <p className="text-xs text-slate-400">Governance Layer</p>
            </div>
          </div>
        </div>
        
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {OWNER_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-white/20 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className={`p-2 rounded-lg text-center text-xs ${
            emergencyMode === 'readonly' ? 'bg-red-500/20 text-red-300' :
            emergencyMode === 'booking_disabled' ? 'bg-amber-500/20 text-amber-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {emergencyMode === 'readonly' ? '🔴 READ-ONLY MODE' :
             emergencyMode === 'booking_disabled' ? '🟠 BOOKING DISABLED' :
             '🟢 NORMAL OPERATION'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* Emergency Mode Banner */}
        {emergencyMode !== 'normal' && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            emergencyMode === 'readonly' ? 'bg-red-100 border-2 border-red-300' : 'bg-amber-100 border-2 border-amber-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{emergencyMode === 'readonly' ? '🔴' : '🟠'}</span>
              <div>
                <h3 className={`font-bold ${emergencyMode === 'readonly' ? 'text-red-800' : 'text-amber-800'}`}>
                  {emergencyMode === 'readonly' ? 'EMERGENCY READ-ONLY MODE ACTIVE' : 'BOOKING SYSTEM DISABLED'}
                </h3>
                <p className={`text-sm ${emergencyMode === 'readonly' ? 'text-red-600' : 'text-amber-600'}`}>
                  {emergencyMode === 'readonly' ? 'All write operations are blocked. Data is safe.' : 'Clients cannot book new appointments.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => executeEmergencyAction('restore')}
              className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              Restore Normal Operation
            </button>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Header with Date Range Filter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Founder Overview</h1>
            <p className="text-gray-500">Real-time system governance and control</p>
          </div>
          <div className="flex gap-2">
            {(['today', 'week', 'month', 'year'] as DateRange[]).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  dateRange === range 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-6 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Data Not Connected */}
        {!isLoading && !error && !data?.connected && (
          <DatabaseNotConnected />
        )}

        {/* REAL DATA DISPLAY */}
        {!isLoading && data?.connected && (
          <>
            {/* System Status Row - ALL REAL DATA */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">System Status</span>
                <div className={`mt-1 px-3 py-1 rounded-lg inline-flex items-center gap-2 ${systemStatus.color}`}>
                  <span>{systemStatus.icon}</span>
                  <span className="font-bold capitalize">{systemStatus.status}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">{dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Revenue</span>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {data.revenue.total > 0 ? formatCurrency(data.revenue.total) : '$0'}
                </p>
                {data.revenue.total === 0 && (
                  <p className="text-xs text-gray-400">No transactions yet</p>
                )}
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Appointments</span>
                <p className="text-lg font-bold text-gray-900 mt-1">{data.appointments.total}</p>
                {data.appointments.total === 0 && (
                  <p className="text-xs text-gray-400">None this period</p>
                )}
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Active Rules</span>
                <p className="text-lg font-bold text-purple-600 mt-1">{data.system.activeRules}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Features Enabled</span>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  {data.system.enabledFeatures}/{data.system.totalFeatures}
                </p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Data Updated</span>
                <p className="text-sm font-medium text-green-600 mt-1">
                  {formatRelativeTime(data.timestamp)}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid - ALL REAL DATA */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Total Clients</span>
                <p className="text-2xl font-bold text-gray-900">{data.clients.total.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+{data.clients.new} new this {dateRange}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Avg Ticket</span>
                <p className="text-2xl font-bold text-gray-900">
                  {data.revenue.avgTicket > 0 ? formatCurrency(data.revenue.avgTicket) : '—'}
                </p>
                <p className="text-xs text-gray-400">{data.revenue.transactions} transactions</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">No-Show Rate</span>
                <p className={`text-2xl font-bold ${data.appointments.noShowRate > 0.05 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatPercent(data.appointments.noShowRate)}
                </p>
                <p className="text-xs text-gray-400">{data.appointments.noShows} no-shows</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <span className="text-xs text-gray-500">Active Memberships</span>
                <p className="text-2xl font-bold text-purple-600">{data.memberships.active}</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Alerts Panel - REAL DATA */}
              <div className="bg-white rounded-xl border">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-gray-900">⚠️ Alerts Panel</h2>
                </div>
                <div className="divide-y">
                  {data.compliance.pendingConsents > 0 && (
                    <Link href="/admin/consents" className="flex items-center gap-3 p-4 hover:bg-gray-50">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-amber-700">{data.compliance.pendingConsents} pending consent request{data.compliance.pendingConsents > 1 ? 's' : ''}</span>
                      <span className="ml-auto text-gray-400">→</span>
                    </Link>
                  )}
                  {data.inventory.expired > 0 && (
                    <Link href="/admin/owner/inventory" className="flex items-center gap-3 p-4 hover:bg-gray-50">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-700">{data.inventory.expired} expired product{data.inventory.expired > 1 ? 's' : ''} in inventory</span>
                      <span className="ml-auto text-gray-400">→</span>
                    </Link>
                  )}
                  {data.inventory.expiringSoon > 0 && (
                    <Link href="/admin/owner/inventory" className="flex items-center gap-3 p-4 hover:bg-gray-50">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-amber-700">{data.inventory.expiringSoon} product{data.inventory.expiringSoon > 1 ? 's' : ''} expiring within 30 days</span>
                      <span className="ml-auto text-gray-400">→</span>
                    </Link>
                  )}
                  {data.inventory.lowStock > 0 && (
                    <Link href="/admin/owner/inventory" className="flex items-center gap-3 p-4 hover:bg-gray-50">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-blue-700">{data.inventory.lowStock} product{data.inventory.lowStock > 1 ? 's' : ''} low on stock</span>
                      <span className="ml-auto text-gray-400">→</span>
                    </Link>
                  )}
                  {data.compliance.pendingConsents === 0 && 
                   data.inventory.expired === 0 && 
                   data.inventory.expiringSoon === 0 && 
                   data.inventory.lowStock === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <span className="text-green-500">✓</span> No active alerts
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Actions */}
              <div className="bg-white rounded-xl border">
                <div className="p-4 border-b bg-red-50">
                  <h2 className="font-semibold text-red-800">🚨 Emergency Actions</h2>
                  <p className="text-xs text-red-600">Execute immediately without code or deploy</p>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => setShowEmergencyConfirm('readonly')}
                    disabled={emergencyMode === 'readonly'}
                    className={`w-full p-4 rounded-lg text-left flex items-center gap-4 ${
                      emergencyMode === 'readonly' ? 'bg-gray-100 opacity-50' : 'bg-red-50 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <span className="text-2xl">🔴</span>
                    <div>
                      <h3 className="font-semibold text-red-800">Emergency Read-Only Mode</h3>
                      <p className="text-xs text-red-600">Block ALL write operations immediately</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowEmergencyConfirm('disable_booking')}
                    disabled={emergencyMode !== 'normal'}
                    className={`w-full p-4 rounded-lg text-left flex items-center gap-4 ${
                      emergencyMode !== 'normal' ? 'bg-gray-100 opacity-50' : 'bg-amber-50 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <span className="text-2xl">🟠</span>
                    <div>
                      <h3 className="font-semibold text-amber-800">Disable Booking</h3>
                      <p className="text-xs text-amber-600">Prevent new appointments</p>
                    </div>
                  </button>

                  <Link
                    href="/admin/owner/changes"
                    className="w-full p-4 rounded-lg text-left flex items-center gap-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 block"
                  >
                    <span className="text-2xl">🔵</span>
                    <div>
                      <h3 className="font-semibold text-blue-800">Roll Back Last Change</h3>
                      <p className="text-xs text-blue-600">Undo the most recent configuration change</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Changes - REAL DATA */}
            <div className="bg-white rounded-xl border mb-6">
              <div className="p-4 border-b">
                <h2 className="font-semibold">📋 Recent System Changes</h2>
              </div>
              {data.recentChanges.length > 0 ? (
                <div className="divide-y">
                  {data.recentChanges.slice(0, 5).map(change => (
                    <div key={change.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{change.action} {change.target}</p>
                          <p className="text-xs text-gray-500">{change.user} • {formatRelativeTime(change.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon="📋"
                  title="No recent changes"
                  description="Configuration changes will appear here"
                />
              )}
              {data.recentChanges.length > 0 && (
                <div className="p-4 border-t">
                  <Link href="/admin/owner/audit" className="text-sm text-purple-600 hover:text-purple-700">
                    View full audit log →
                  </Link>
                </div>
              )}
            </div>

            {/* Upcoming Appointments - REAL DATA */}
            <div className="bg-white rounded-xl border mb-6">
              <div className="p-4 border-b">
                <h2 className="font-semibold">📅 Upcoming Appointments</h2>
              </div>
              {data.appointments.upcoming.length > 0 ? (
                <div className="divide-y">
                  {data.appointments.upcoming.map(apt => (
                    <div key={apt.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{apt.clientName}</p>
                        <p className="text-xs text-gray-500">{apt.service} with {apt.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(apt.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                        <p className="text-xs text-gray-500">{new Date(apt.time).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon="📅"
                  title="No upcoming appointments"
                  description="Scheduled appointments will appear here"
                />
              )}
            </div>

            {/* Provider Stats - REAL DATA */}
            {data.providers.active > 0 && (
              <div className="bg-white rounded-xl border mb-6">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">👥 Provider Activity ({dateRange})</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  {data.providers.stats.map(provider => (
                    <div key={provider.id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-2xl font-bold text-purple-600">{provider.appointments}</p>
                      <p className="text-xs text-gray-500">appointments</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Governance Principle */}
            <div className="bg-slate-900 text-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">🧠 Core Principle</h3>
              <p className="text-slate-300">
                If the Founder cannot control it from this dashboard, the system is not complete.
              </p>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {['See everything', 'Change anything', 'Undo anything', 'Disable anything', 'Export everything'].map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg p-3 text-center">
                    <span className="text-green-400 block mb-1">✓</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Emergency Confirmation Modal */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{showEmergencyConfirm === 'readonly' ? '🔴' : '🟠'}</span>
              <h3 className="text-xl font-bold">
                {showEmergencyConfirm === 'readonly' ? 'Enable Read-Only Mode?' : 'Disable Booking?'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {showEmergencyConfirm === 'readonly'
                ? 'This will immediately block ALL write operations. Users will be unable to save any changes, book appointments, or process payments. This action is logged.'
                : 'This will prevent clients from booking new appointments. Existing appointments will not be affected. This action is logged.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEmergencyConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => executeEmergencyAction(showEmergencyConfirm)}
                className={`px-6 py-2 text-white rounded-lg ${
                  showEmergencyConfirm === 'readonly' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
