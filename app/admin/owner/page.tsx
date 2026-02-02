'use client';

// ============================================================
// OWNER MODE - EHR-GRADE SYSTEM CONTROL CENTER
// Complete administrative control without developer
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

interface SystemMetric {
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
}

export default function OwnerDashboardPage() {
  const pathname = usePathname();

  const systemMetrics: SystemMetric[] = [
    { label: 'Database', value: 'Connected', status: 'good' },
    { label: 'Payments', value: 'Live Mode', status: 'good' },
    { label: 'SMS', value: 'Active', status: 'good' },
    { label: 'Email', value: 'Active', status: 'good' },
    { label: 'Uptime', value: '99.9%', status: 'good' },
    { label: 'Last Backup', value: '2 hrs ago', status: 'good' },
  ];

  const quickStats = [
    { label: 'Total Clients', value: '3,425' },
    { label: 'Active Services', value: '76' },
    { label: 'Providers', value: '2' },
    { label: 'Pending Tasks', value: '0' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-100px)]">
      {/* Owner Mode Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex-shrink-0">
        <div className="p-4 border-b border-purple-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="font-bold text-lg">OWNER MODE</h1>
              <p className="text-xs text-purple-300">Full System Control</p>
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
          <p className="text-gray-500">Complete system overview and control</p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {systemMetrics.map(metric => (
            <div key={metric.label} className="bg-white rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  metric.status === 'good' ? 'bg-green-500' :
                  metric.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-500">{metric.label}</span>
              </div>
              <p className="font-semibold text-gray-900 mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {quickStats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Control Modules Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {OWNER_NAV.slice(1).map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border p-4 hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">{item.label}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Owner Verification Checklist */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Control Verification</h2>
          <p className="text-sm text-gray-500 mb-4">Confirm you can perform these actions WITHOUT developer help:</p>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { task: 'Create a new service', link: '/admin/owner/services' },
              { task: 'Change service buffer', link: '/admin/owner/services' },
              { task: 'Modify consent requirements', link: '/admin/owner/consents' },
              { task: 'Edit provider schedule', link: '/admin/owner/scheduling' },
              { task: 'Adjust cancellation policy', link: '/admin/owner/booking-rules' },
              { task: 'Disable a feature', link: '/admin/owner/features' },
              { task: 'Roll back a change', link: '/admin/owner/versions' },
              { task: 'Test in sandbox', link: '/admin/owner/sandbox' },
              { task: 'Export all data', link: '/admin/owner/exports' },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
                <span className="text-sm text-gray-700">{item.task}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Emergency Controls</h2>
          <p className="text-sm text-red-600 mb-4">Use only when necessary. All actions are logged.</p>
          <div className="flex gap-4">
            <Link href="/admin/owner/users" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
              🚨 Revoke User Access
            </Link>
            <Link href="/admin/owner/features" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">
              ⚠️ Disable Feature
            </Link>
            <Link href="/admin/owner/versions" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              ↩️ Rollback Change
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
