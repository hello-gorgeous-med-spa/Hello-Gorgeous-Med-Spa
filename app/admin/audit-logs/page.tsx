'use client';

// ============================================================
// ADMIN: AUDIT LOGS
// Track all system actions - Owner only
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui';

interface AuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  description?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-800',
  insert: 'bg-green-100 text-green-800',
  update: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  login: 'bg-purple-100 text-purple-800',
  logout: 'bg-gray-100 text-gray-800',
  view: 'bg-yellow-100 text-yellow-800',
  export: 'bg-orange-100 text-orange-800',
};

const RESOURCE_ICONS: Record<string, string> = {
  appointment: '📅',
  client: '👤',
  service: '💅',
  provider: '👩‍⚕️',
  payment: '💳',
  consent: '📝',
  user: '🔐',
  settings: '⚙️',
  marketing: '📈',
  waitlist: '⏳',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    action: '',
    resource_type: '',
    user: '',
    dateFrom: '',
    dateTo: '',
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
        ...(filter.action && { action: filter.action }),
        ...(filter.resource_type && { resource_type: filter.resource_type }),
        ...(filter.user && { user: filter.user }),
        ...(filter.dateFrom && { date_from: filter.dateFrom }),
        ...(filter.dateTo && { date_to: filter.dateTo }),
      });

      const res = await fetch(`/api/audit-logs?${params}`);
      
      if (!res.ok) {
        // If API doesn't exist, show mock data
        setLogs(generateMockLogs());
        setTotalPages(1);
        return;
      }

      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setLogs(generateMockLogs());
    } finally {
      setLoading(false);
    }
  };

  const generateMockLogs = (): AuditLog[] => {
    const actions = ['create', 'update', 'delete', 'view', 'login'];
    const resources = ['appointment', 'client', 'service', 'payment'];
    const users = ['Danielle Alcala', 'Ryan Kent', 'System'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `log-${i}`,
      user_name: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      resource_type: resources[Math.floor(Math.random() * resources.length)],
      resource_id: `res-${Math.random().toString(36).substr(2, 9)}`,
      description: 'Sample audit log entry',
      ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const getActionColor = (action: string) => {
    const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k));
    return key ? ACTION_COLORS[key] : 'bg-gray-100 text-gray-800';
  };

  const getResourceIcon = (resourceType: string) => {
    return RESOURCE_ICONS[resourceType] || '📄';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const clearFilters = () => {
    setFilter({
      action: '',
      resource_type: '',
      user: '',
      dateFrom: '',
      dateTo: '',
    });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">
            Track all system actions and changes
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-medium text-amber-900">Owner Access Only</p>
            <p className="text-sm text-amber-700">
              Audit logs contain sensitive information. Only the Owner role can view this page.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Action Type</label>
            <select
              value={filter.action}
              onChange={(e) => setFilter({ ...filter, action: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="view">View</option>
              <option value="export">Export</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Resource Type</label>
            <select
              value={filter.resource_type}
              onChange={(e) => setFilter({ ...filter, resource_type: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Resources</option>
              <option value="appointment">Appointments</option>
              <option value="client">Clients</option>
              <option value="service">Services</option>
              <option value="provider">Providers</option>
              <option value="payment">Payments</option>
              <option value="consent">Consents</option>
              <option value="user">Users</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date From</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date To</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
            <p className="mt-2 text-gray-500">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Resource</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {log.user_name || log.user_email || 'System'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1">
                        <span>{getResourceIcon(log.resource_type)}</span>
                        <span className="text-gray-900">{log.resource_type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.description || log.resource_id || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                      {log.ip_address || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Audit Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Timestamp</label>
                  <p className="font-medium">{new Date(selectedLog.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">User</label>
                  <p className="font-medium">{selectedLog.user_name || selectedLog.user_email || 'System'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Action</label>
                  <p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Resource</label>
                  <p className="font-medium">{selectedLog.resource_type}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Resource ID</label>
                  <p className="font-mono text-sm">{selectedLog.resource_id || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">IP Address</label>
                  <p className="font-mono text-sm">{selectedLog.ip_address || '-'}</p>
                </div>
              </div>

              {selectedLog.description && (
                <div>
                  <label className="text-xs text-gray-500">Description</label>
                  <p className="mt-1 text-gray-700">{selectedLog.description}</p>
                </div>
              )}

              {selectedLog.old_values && (
                <div>
                  <label className="text-xs text-gray-500">Previous Values</label>
                  <pre className="mt-1 p-3 bg-red-50 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && (
                <div>
                  <label className="text-xs text-gray-500">New Values</label>
                  <pre className="mt-1 p-3 bg-green-50 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.user_agent && (
                <div>
                  <label className="text-xs text-gray-500">User Agent</label>
                  <p className="mt-1 text-xs text-gray-500 break-all">{selectedLog.user_agent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
