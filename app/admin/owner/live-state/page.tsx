'use client';

// ============================================================
// LIVE SYSTEM STATE - TRUTH VIEW
// Real-time view of all active rules, modules, and configs
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface SystemComponent {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'warning' | 'conflict' | 'disabled';
  environment: 'live' | 'sandbox' | 'override';
  details: string;
}

export default function LiveStatePage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'warning' | 'conflict'>('all');

  const activeRules: SystemComponent[] = [
    { id: 'r1', name: 'Injectable Consent Required', category: 'Booking Rules', status: 'active', environment: 'live', details: 'Requires Neurotoxin Consent v3' },
    { id: 'r2', name: 'Filler Consent Required', category: 'Booking Rules', status: 'active', environment: 'live', details: 'Requires Filler Consent' },
    { id: 'r3', name: 'New Client Deposit', category: 'Booking Rules', status: 'active', environment: 'live', details: '$50 deposit for new clients' },
    { id: 'r4', name: 'Max 50 Units Botox/Day', category: 'Clinical Rules', status: 'active', environment: 'live', details: 'Per-provider daily limit' },
    { id: 'r5', name: 'Chart Lock After Sign', category: 'Clinical Rules', status: 'active', environment: 'live', details: 'Charts immutable post-signature' },
    { id: 'r6', name: 'SMS Reminder 24h', category: 'Automation', status: 'active', environment: 'live', details: 'Send reminder 24 hours before' },
    { id: 'r7', name: 'Review Request 48h', category: 'Automation', status: 'warning', environment: 'live', details: 'Low response rate detected' },
    { id: 'r8', name: 'Weekend Pricing +10%', category: 'Pricing Rules', status: 'disabled', environment: 'sandbox', details: 'Testing in sandbox' },
    { id: 'r9', name: 'Booking Buffer 15min', category: 'Scheduling', status: 'active', environment: 'override', details: 'Founder override applied' },
    { id: 'r10', name: 'Late Cancel Fee', category: 'Booking Rules', status: 'conflict', environment: 'live', details: 'Conflicts with VIP waiver rule' },
  ];

  const enabledModules: SystemComponent[] = [
    { id: 'm1', name: 'Online Booking', category: 'Core', status: 'active', environment: 'live', details: 'Public booking enabled' },
    { id: 'm2', name: 'Payment Processing', category: 'Core', status: 'active', environment: 'live', details: 'Stripe Live Mode' },
    { id: 'm3', name: 'Clinical Charting', category: 'Core', status: 'active', environment: 'live', details: 'SOAP notes enabled' },
    { id: 'm4', name: 'SMS Notifications', category: 'Communications', status: 'active', environment: 'live', details: 'Telnyx active' },
    { id: 'm5', name: 'Email Notifications', category: 'Communications', status: 'warning', environment: 'live', details: 'High bounce rate' },
    { id: 'm6', name: 'Memberships', category: 'Revenue', status: 'active', environment: 'live', details: '207 active members' },
    { id: 'm7', name: 'Gift Cards', category: 'Revenue', status: 'active', environment: 'live', details: 'Active' },
    { id: 'm8', name: 'Inventory Tracking', category: 'Operations', status: 'active', environment: 'live', details: 'Lot tracking enabled' },
    { id: 'm9', name: 'AI Recommendations', category: 'Advanced', status: 'disabled', environment: 'sandbox', details: 'Testing phase' },
    { id: 'm10', name: 'Telehealth', category: 'Advanced', status: 'disabled', environment: 'sandbox', details: 'Not enabled' },
  ];

  const overriddenConfigs = [
    { name: 'Max Daily Appointments', default: '20', current: '25', by: 'Founder', when: '3 days ago' },
    { name: 'Buffer Time', default: '10 min', current: '15 min', by: 'Founder', when: '1 week ago' },
    { name: 'Cancellation Window', default: '48h', current: '24h', by: 'Founder', when: '2 weeks ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      case 'conflict': return 'bg-red-100 text-red-700';
      case 'disabled': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getEnvBadge = (env: string) => {
    switch (env) {
      case 'live': return 'bg-green-50 text-green-600 border-green-200';
      case 'sandbox': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'override': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredRules = filter === 'all' ? activeRules : activeRules.filter(r => r.status === filter);
  const filteredModules = filter === 'all' ? enabledModules : enabledModules.filter(m => m.status === filter || (filter === 'active' && m.status !== 'disabled'));

  const conflictCount = activeRules.filter(r => r.status === 'conflict').length;
  const warningCount = activeRules.filter(r => r.status === 'warning').length + enabledModules.filter(m => m.status === 'warning').length;

  return (
    <OwnerLayout title="Live System State" description="Truth view - No hidden system behavior">
      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button onClick={() => setFilter('all')} className={`p-4 rounded-xl border text-left ${filter === 'all' ? 'border-purple-500 bg-purple-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">Total Components</p>
          <p className="text-2xl font-bold">{activeRules.length + enabledModules.length}</p>
        </button>
        <button onClick={() => setFilter('active')} className={`p-4 rounded-xl border text-left ${filter === 'active' ? 'border-green-500 bg-green-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">🟢 Active</p>
          <p className="text-2xl font-bold text-green-600">{activeRules.filter(r => r.status === 'active').length + enabledModules.filter(m => m.status === 'active').length}</p>
        </button>
        <button onClick={() => setFilter('warning')} className={`p-4 rounded-xl border text-left ${filter === 'warning' ? 'border-amber-500 bg-amber-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">🟡 Warnings</p>
          <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
        </button>
        <button onClick={() => setFilter('conflict')} className={`p-4 rounded-xl border text-left ${filter === 'conflict' ? 'border-red-500 bg-red-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">🔴 Conflicts</p>
          <p className="text-2xl font-bold text-red-600">{conflictCount}</p>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Rules */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">⚖️ Active Rules</h2>
            <p className="text-xs text-gray-500">Every active rule visible - no magic logic</p>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y">
            {filteredRules.map(rule => (
              <div key={rule.id} className={`p-4 hover:bg-gray-50 ${rule.status === 'conflict' ? 'bg-red-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        rule.status === 'active' ? 'bg-green-500' :
                        rule.status === 'warning' ? 'bg-amber-500' :
                        rule.status === 'conflict' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`} />
                      <h3 className="font-medium text-sm">{rule.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{rule.category} • {rule.details}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${getEnvBadge(rule.environment)}`}>
                      {rule.environment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enabled Modules */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">🎚️ Module Status</h2>
            <p className="text-xs text-gray-500">All modules and their current state</p>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y">
            {filteredModules.map(module => (
              <div key={module.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        module.status === 'active' ? 'bg-green-500' :
                        module.status === 'warning' ? 'bg-amber-500' :
                        'bg-gray-400'
                      }`} />
                      <h3 className="font-medium text-sm">{module.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{module.category} • {module.details}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(module.status)}`}>
                    {module.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overridden Configurations */}
      <div className="mt-6 bg-white rounded-xl border">
        <div className="p-4 border-b bg-blue-50">
          <h2 className="font-semibold text-blue-800">🔷 Founder Overrides Active</h2>
          <p className="text-xs text-blue-600">Configurations that differ from system defaults</p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">SETTING</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">DEFAULT</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">CURRENT</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">CHANGED BY</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">WHEN</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {overriddenConfigs.map((config, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-sm">{config.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500 line-through">{config.default}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">{config.current}</td>
                <td className="px-4 py-3 text-sm">{config.by}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{config.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-700 mb-3">Visual Indicators</h3>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Green = Normal</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /> Yellow = Warning</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Red = High-risk / Conflict</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400" /> Gray = Disabled</div>
        </div>
      </div>
    </OwnerLayout>
  );
}
