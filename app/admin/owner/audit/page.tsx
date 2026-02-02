'use client';

// ============================================================
// AUDIT LOGS - OWNER CONTROLLED
// Complete system activity logs for compliance
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address: string;
  user_agent: string;
  details?: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function AuditLogsPage() {
  const [logs] = useState<AuditEntry[]>([
    { id: '1', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), user: 'Danielle (Owner)', action: 'LOGIN', resource: 'Auth', ip_address: '192.168.1.100', user_agent: 'Chrome/120', severity: 'info' },
    { id: '2', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), user: 'Danielle (Owner)', action: 'VIEW', resource: 'Client', resource_id: 'client-123', ip_address: '192.168.1.100', user_agent: 'Chrome/120', severity: 'info' },
    { id: '3', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), user: 'Ryan Kent', action: 'CREATE', resource: 'Chart', resource_id: 'chart-456', ip_address: '192.168.1.101', user_agent: 'Chrome/120', severity: 'info' },
    { id: '4', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), user: 'Ryan Kent', action: 'SIGN', resource: 'Chart', resource_id: 'chart-456', ip_address: '192.168.1.101', user_agent: 'Chrome/120', severity: 'info' },
    { id: '5', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), user: 'Danielle (Owner)', action: 'UPDATE', resource: 'Service', resource_id: 'botox', details: 'Price changed from $12 to $14/unit', ip_address: '192.168.1.100', user_agent: 'Chrome/120', severity: 'warning' },
    { id: '6', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), user: 'System', action: 'PAYMENT_PROCESSED', resource: 'Transaction', resource_id: 'txn-789', details: '$450.00 via Stripe', ip_address: 'Stripe API', user_agent: 'Stripe Webhook', severity: 'info' },
    { id: '7', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), user: 'Danielle (Owner)', action: 'REVOKE_ACCESS', resource: 'User', resource_id: 'user-former', details: 'Emergency access revocation', ip_address: '192.168.1.100', user_agent: 'Chrome/120', severity: 'critical' },
    { id: '8', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), user: 'System', action: 'BACKUP_COMPLETED', resource: 'System', details: 'Daily backup successful', ip_address: 'Supabase', user_agent: 'System', severity: 'info' },
    { id: '9', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), user: 'Danielle (Owner)', action: 'EXPORT', resource: 'Data', details: 'Exported all clients to CSV', ip_address: '192.168.1.100', user_agent: 'Chrome/120', severity: 'warning' },
    { id: '10', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), user: 'Ryan Kent', action: 'FAILED_LOGIN', resource: 'Auth', details: 'Invalid password attempt', ip_address: '192.168.1.101', user_agent: 'Chrome/120', severity: 'warning' },
  ]);

  const [filter, setFilter] = useState({
    severity: 'all',
    user: 'all',
    action: 'all',
  });

  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const users = ['all', ...new Set(logs.map(l => l.user))];
  const actions = ['all', ...new Set(logs.map(l => l.action))];

  const filteredLogs = logs.filter(log => {
    if (filter.severity !== 'all' && log.severity !== filter.severity) return false;
    if (filter.user !== 'all' && log.user !== filter.user) return false;
    if (filter.action !== 'all' && log.action !== filter.action) return false;
    return true;
  });

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <OwnerLayout title="Audit Logs" description="Complete system activity logs for compliance">
      <div className="space-y-6">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800">Compliance Audit Trail</h3>
          <p className="text-sm text-blue-600 mt-1">
            All system actions are logged with user, timestamp, IP address, and details.
            Logs are immutable and retained for {7} years per HIPAA guidelines.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-3">Filters</h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Severity</label>
              <select value={filter.severity} onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="all">All</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">User</label>
              <select value={filter.user} onChange={(e) => setFilter(prev => ({ ...prev, user: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                {users.map(u => <option key={u} value={u}>{u === 'all' ? 'All Users' : u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Action</label>
              <select value={filter.action} onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">From Date</label>
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To Date</label>
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Entries</p>
            <p className="text-2xl font-bold">{logs.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Critical Events</p>
            <p className="text-2xl font-bold text-red-600">{logs.filter(l => l.severity === 'critical').length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Warnings</p>
            <p className="text-2xl font-bold text-amber-600">{logs.filter(l => l.severity === 'warning').length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Today's Activity</p>
            <p className="text-2xl font-bold text-blue-600">{logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}</p>
          </div>
        </div>

        {/* Log Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">TIMESTAMP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">USER</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">ACTION</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">RESOURCE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">DETAILS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">IP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">SEVERITY</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{formatTime(log.timestamp)}</td>
                  <td className="px-4 py-3 text-sm">{log.user}</td>
                  <td className="px-4 py-3 text-sm font-mono">{log.action}</td>
                  <td className="px-4 py-3 text-sm">
                    {log.resource}
                    {log.resource_id && <span className="text-gray-400 text-xs ml-1">({log.resource_id})</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{log.details || '—'}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{log.ip_address}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            📥 Export to CSV
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            📥 Export to JSON
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
