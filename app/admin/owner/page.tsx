'use client';

// ============================================================
// OWNER DASHBOARD - CONTROL CENTER
// Complete system oversight with widgets, alerts, quick actions
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const OWNER_NAV = [
  { href: '/admin/owner', label: 'Dashboard', icon: '📊' },
  { href: '/admin/owner/system-settings', label: 'System Settings', icon: '⚙️' },
  { href: '/admin/owner/services', label: 'Services & Workflows', icon: '💉' },
  { href: '/admin/owner/users', label: 'Providers & Staff', icon: '👥' },
  { href: '/admin/owner/scheduling', label: 'Scheduling Engine', icon: '📅' },
  { href: '/admin/owner/booking-rules', label: 'Booking Rules & Policies', icon: '📋' },
  { href: '/admin/owner/clinical', label: 'Clinical / EHR Rules', icon: '🩺' },
  { href: '/admin/owner/consents', label: 'Consents & Legal', icon: '📝' },
  { href: '/admin/owner/inventory', label: 'Inventory & Injectables', icon: '📦' },
  { href: '/admin/owner/payments', label: 'Payments & Financials', icon: '💳' },
  { href: '/admin/owner/memberships', label: 'Memberships & Packages', icon: '💎' },
  { href: '/admin/owner/automations', label: 'Automations & Messaging', icon: '⚡' },
  { href: '/admin/owner/features', label: 'Feature Flags', icon: '🎚️' },
  { href: '/admin/owner/sandbox', label: 'Sandbox / Preview', icon: '🧪' },
  { href: '/admin/owner/versions', label: 'Version History', icon: '📜' },
  { href: '/admin/owner/exports', label: 'Data Exports', icon: '📤' },
  { href: '/admin/owner/audit', label: 'Audit Logs', icon: '🔍' },
  { href: '/admin/owner/access', label: 'System Access', icon: '🔑' },
];

export default function OwnerDashboardPage() {
  const pathname = usePathname();
  const [sandboxActive] = useState(false);

  // System status data
  const systemStatus = {
    status: 'stable' as 'stable' | 'issues',
    configVersion: 'v2.4',
    sandboxActive: false,
    featuresEnabled: 23,
    featuresTotal: 25,
  };

  // Alerts
  const alerts = [
    { id: 1, type: 'warning', message: 'Missing required consents for 3 clients', link: '/admin/owner/consents' },
    { id: 2, type: 'warning', message: 'Booking rule conflict detected', link: '/admin/owner/booking-rules' },
    { id: 3, type: 'warning', message: '2 products expiring within 30 days', link: '/admin/owner/inventory' },
    { id: 4, type: 'info', message: 'Provider Ryan Kent approaching unit limit (45/50)', link: '/admin/owner/users' },
  ];

  // Quick actions
  const quickActions = [
    { label: 'Create New Service', icon: '➕', href: '/admin/owner/services?action=create', color: 'bg-purple-600' },
    { label: 'Open Sandbox', icon: '🧪', href: '/admin/owner/sandbox', color: 'bg-blue-600' },
    { label: 'Roll Back Last Change', icon: '↩️', href: '/admin/owner/versions', color: 'bg-amber-600' },
    { label: 'Disable Feature', icon: '🔴', href: '/admin/owner/features', color: 'bg-red-600' },
  ];

  // Owner checklist
  const ownerChecklist = [
    { label: 'You can change any rule without dev', checked: true },
    { label: 'You can undo any mistake instantly', checked: true },
    { label: 'You can disable any feature immediately', checked: true },
    { label: 'You control every system behavior', checked: true },
    { label: 'Developers cannot gatekeep', checked: true },
    { label: 'System behaves like Fresha / EHR', checked: true },
  ];

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Owner Mode Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex-shrink-0">
        <div className="p-4 border-b border-purple-700">
          <Link href="/admin/owner" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg">OWNER MODE</h1>
              <p className="text-xs text-purple-300">Full System Control</p>
            </div>
          </Link>
        </div>
        
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {OWNER_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-700">
          <p className="text-xs text-purple-300 text-center">Logged in as Owner</p>
          <p className="text-xs text-purple-400 text-center">Non-removable • Non-downgradable</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-500">Control Center - Complete system oversight</p>
        </div>

        {/* Widgets Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* System Status */}
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">System Status</span>
              <span className={`w-3 h-3 rounded-full ${systemStatus.status === 'stable' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            </div>
            <p className={`text-lg font-bold ${systemStatus.status === 'stable' ? 'text-green-600' : 'text-red-600'}`}>
              {systemStatus.status === 'stable' ? '🟢 Stable' : '🔴 Issues Detected'}
            </p>
          </div>

          {/* Config Version */}
          <div className="bg-white rounded-xl border p-4">
            <span className="text-sm text-gray-500">Live Config Version</span>
            <p className="text-lg font-bold text-gray-900">{systemStatus.configVersion}</p>
          </div>

          {/* Sandbox Status */}
          <div className="bg-white rounded-xl border p-4">
            <span className="text-sm text-gray-500">Sandbox Active?</span>
            <p className={`text-lg font-bold ${systemStatus.sandboxActive ? 'text-amber-600' : 'text-gray-400'}`}>
              {systemStatus.sandboxActive ? 'YES' : 'NO'}
            </p>
          </div>

          {/* Features Enabled */}
          <div className="bg-white rounded-xl border p-4">
            <span className="text-sm text-gray-500">Features Enabled</span>
            <p className="text-lg font-bold text-purple-600">
              {systemStatus.featuresEnabled} / {systemStatus.featuresTotal}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Alerts Panel */}
          <div className="col-span-2 bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">⚠️ Alerts Panel</h2>
            </div>
            <div className="divide-y">
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No active alerts</div>
              ) : (
                alerts.map(alert => (
                  <Link key={alert.id} href={alert.link} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                    <span className={`w-2 h-2 rounded-full ${alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <span className={alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}>{alert.message}</span>
                    <span className="ml-auto text-gray-400">→</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">⚡ Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {quickActions.map(action => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white ${action.color} hover:opacity-90 transition-opacity`}
                >
                  <span>{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Module Quick Access */}
        <div className="bg-white rounded-xl border mb-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">📱 Module Quick Access</h2>
          </div>
          <div className="grid grid-cols-6 gap-3 p-4">
            {OWNER_NAV.slice(1).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-gray-600 text-center group-hover:text-purple-600">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Owner Mode Done Checklist */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <h2 className="font-semibold text-purple-900 mb-4">✅ OWNER MODE DONE = ALL TRUE</h2>
          <div className="grid grid-cols-2 gap-3">
            {ownerChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${item.checked ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {item.checked ? '✓' : '○'}
                </span>
                <span className={item.checked ? 'text-gray-900' : 'text-gray-500'}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>FINAL NOTE:</strong> This UI is not optional polish. This is the operating system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
