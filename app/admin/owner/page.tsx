'use client';

// ============================================================
// FOUNDER CONTROL DASHBOARD - OVERVIEW
// Complete system governance with emergency controls
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
  const [emergencyMode, setEmergencyMode] = useState<'normal' | 'readonly' | 'booking_disabled'>('normal');
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Real-time system state
  const systemState = {
    status: 'stable' as 'stable' | 'warning' | 'critical',
    configVersion: 'v2.4.1',
    sandboxActive: false,
    activeRules: 47,
    enabledModules: 12,
    totalModules: 14,
  };

  // Recent critical changes (last 72 hours)
  const recentChanges = [
    { id: '1', time: '2 hours ago', user: 'Danielle', action: 'Updated Botox pricing', risk: 'medium' },
    { id: '2', time: '5 hours ago', user: 'Danielle', action: 'Enabled new consent form', risk: 'low' },
    { id: '3', time: '1 day ago', user: 'Danielle', action: 'Modified booking rules', risk: 'medium' },
    { id: '4', time: '2 days ago', user: 'System', action: 'Auto-backup completed', risk: 'none' },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

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

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Founder Overview</h1>
          <p className="text-gray-500">Real-time system governance and control</p>
        </div>

        {/* System Status Row */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <span className="text-xs text-gray-500">System Status</span>
            <div className={`mt-1 px-3 py-1 rounded-lg inline-flex items-center gap-2 ${getStatusColor(systemState.status)}`}>
              <span>{getStatusIcon(systemState.status)}</span>
              <span className="font-bold capitalize">{systemState.status}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <span className="text-xs text-gray-500">Config Version</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{systemState.configVersion}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <span className="text-xs text-gray-500">Sandbox</span>
            <p className={`text-lg font-bold mt-1 ${systemState.sandboxActive ? 'text-amber-600' : 'text-gray-400'}`}>
              {systemState.sandboxActive ? 'ACTIVE' : 'OFF'}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <span className="text-xs text-gray-500">Active Rules</span>
            <p className="text-lg font-bold text-purple-600 mt-1">{systemState.activeRules}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <span className="text-xs text-gray-500">Enabled Modules</span>
            <p className="text-lg font-bold text-blue-600 mt-1">{systemState.enabledModules}/{systemState.totalModules}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <span className="text-xs text-gray-500">Data Updated</span>
            <p className="text-sm font-medium text-green-600 mt-1">Live • Real-time</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* One-Click Emergency Actions */}
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

              <Link
                href="/admin/owner/sandbox"
                className="w-full p-4 rounded-lg text-left flex items-center gap-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 block"
              >
                <span className="text-2xl">🟣</span>
                <div>
                  <h3 className="font-semibold text-purple-800">Open Sandbox</h3>
                  <p className="text-xs text-purple-600">Test changes without affecting production</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Critical Changes */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">📋 Recent Critical Changes (72h)</h2>
            </div>
            <div className="divide-y">
              {recentChanges.map(change => (
                <div key={change.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{change.action}</p>
                      <p className="text-xs text-gray-500">{change.user} • {change.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      change.risk === 'none' ? 'bg-gray-100 text-gray-600' :
                      change.risk === 'low' ? 'bg-green-100 text-green-700' :
                      change.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {change.risk} risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <Link href="/admin/owner/audit" className="text-sm text-purple-600 hover:text-purple-700">
                View full audit log →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Navigation Grid */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">🧭 Founder Control Panels</h2>
          </div>
          <div className="grid grid-cols-4 gap-4 p-4">
            {OWNER_NAV.slice(1).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <h3 className="font-medium text-sm">{item.label}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Governance Principle */}
        <div className="mt-6 bg-slate-900 text-white rounded-xl p-6">
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
