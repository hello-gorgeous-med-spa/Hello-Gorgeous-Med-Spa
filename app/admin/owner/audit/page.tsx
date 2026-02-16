'use client';

// ============================================================
// AUDIT & FORENSICS
// ALL DATA FROM DATABASE - NO STATIC VALUES
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';
import {
  TableSkeleton,
  EmptyState,
  ErrorState,
  formatRelativeTime,
} from '@/lib/hooks/useOwnerMetrics';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address: string;
  details?: any;
  severity: 'info' | 'warning' | 'critical';
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filter, setFilter] = useState({
    severity: 'all',
    user: 'all',
    action: 'all',
  });
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    async function fetchAuditLogs() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/config/audit');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch audit logs');
        }
        
        // Transform audit log data
        const transformedLogs: AuditEntry[] = (data.logs || []).map((log: any) => ({
          id: log.id,
          timestamp: log.created_at,
          user: log.changed_by || 'System',
          action: log.change_type || 'UPDATE',
          resource: log.table_name || 'config',
          resource_id: log.record_id,
          ip_address: log.ip_address || 'System',
          details: log.new_value,
          severity: log.change_type === 'DELETE' ? 'warning' : 'info',
        }));
        
        setLogs(transformedLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAuditLogs();
  }, []);

  const users = ['all', ...new Set(logs.map(l => l.user))];
  const actions = ['all', ...new Set(logs.map(l => l.action))];

  const filteredLogs = logs.filter(log => {
    if (filter.severity !== 'all' && log.severity !== filter.severity) return false;
    if (filter.user !== 'all' && log.user !== filter.user) return false;
    if (filter.action !== 'all' && log.action !== filter.action) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      default: return 'bg-white text-black';
    }
  };

  const criticalCount = logs.filter(l => l.severity === 'critical').length;
  const warningCount = logs.filter(l => l.severity === 'warning').length;

  return (
    <OwnerLayout title="Audit & Forensics" description="Complete system activity logs for compliance">
      {/* Error State */}
      {error && !isLoading && (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
                <div className="h-4 bg-white rounded w-20 mb-2"></div>
                <div className="h-8 bg-white rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4">
            <TableSkeleton rows={10} />
          </div>
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && (
        <>
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800">📋 Compliance Audit Trail</h3>
            <p className="text-sm text-blue-600 mt-1">
              All system actions are logged with user, timestamp, and details.
              Logs are immutable and retained per compliance guidelines.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border p-4 mb-6">
            <h3 className="font-medium mb-3">Filters</h3>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-black mb-1">Severity</label>
                <select 
                  value={filter.severity} 
                  onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-black mb-1">User</label>
                <select 
                  value={filter.user} 
                  onChange={(e) => setFilter(prev => ({ ...prev, user: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {users.map(u => <option key={u} value={u}>{u === 'all' ? 'All Users' : u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-black mb-1">Action</label>
                <select 
                  value={filter.action} 
                  onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-black mb-1">From Date</label>
                <input 
                  type="date" 
                  value={dateRange.from} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs text-black mb-1">To Date</label>
                <input 
                  type="date" 
                  value={dateRange.to} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Stats - REAL DATA */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Total Entries</p>
              <p className="text-2xl font-bold">{logs.length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Critical Events</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Warnings</p>
              <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Showing</p>
              <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
            </div>
          </div>

          {/* Log Table - REAL DATA */}
          <div className="bg-white rounded-xl border overflow-hidden">
            {filteredLogs.length > 0 ? (
              <table className="w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black">TIMESTAMP</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black">USER</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black">ACTION</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black">RESOURCE</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black">DETAILS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black">SEVERITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white">
                      <td className="px-4 py-3 text-xs text-black font-mono">
                        {log.timestamp ? formatRelativeTime(log.timestamp) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">{log.user}</td>
                      <td className="px-4 py-3 text-sm font-mono">{log.action}</td>
                      <td className="px-4 py-3 text-sm">
                        {log.resource}
                        {log.resource_id && <span className="text-black text-xs ml-1">({log.resource_id})</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-black max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details).substring(0, 50) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState 
                icon="📋"
                title={logs.length === 0 ? "No audit logs yet" : "No logs match your filter"}
                description={logs.length === 0 ? "System activity will be recorded here" : "Try adjusting your filter criteria"}
              />
            )}
          </div>

          {/* Export */}
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white text-sm">
              📥 Export to CSV
            </button>
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white text-sm">
              📥 Export to JSON
            </button>
          </div>
        </>
      )}
    </OwnerLayout>
  );
}
