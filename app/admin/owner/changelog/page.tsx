'use client';

// ============================================================
// CHANGE LOG & ROLLBACK - OWNER CONTROLLED
// Track all changes with one-click rollback
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface ChangeLog {
  id: string;
  timestamp: string;
  user: string;
  category: string;
  action: string;
  target: string;
  before_value?: any;
  after_value?: any;
  can_rollback: boolean;
  is_rolled_back: boolean;
}

export default function ChangeLogPage() {
  const [logs, setLogs] = useState<ChangeLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      user: 'Danielle (Owner)',
      category: 'Service',
      action: 'Updated',
      target: 'Botox Treatment',
      before_value: { price_cents: 1200 },
      after_value: { price_cents: 1400 },
      can_rollback: true,
      is_rolled_back: false,
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      user: 'Danielle (Owner)',
      category: 'Feature',
      action: 'Disabled',
      target: 'Marketing SMS',
      before_value: { is_enabled: true },
      after_value: { is_enabled: false },
      can_rollback: true,
      is_rolled_back: false,
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: 'Danielle (Owner)',
      category: 'Consent',
      action: 'Created',
      target: 'New Treatment Consent Form',
      after_value: { name: 'Weight Loss Consent', fields: 8 },
      can_rollback: true,
      is_rolled_back: false,
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: 'Danielle (Owner)',
      category: 'User',
      action: 'Locked',
      target: 'Former Employee Account',
      before_value: { is_locked: false },
      after_value: { is_locked: true },
      can_rollback: true,
      is_rolled_back: false,
    },
    {
      id: 'log-5',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: 'Danielle (Owner)',
      category: 'Booking Rule',
      action: 'Updated',
      target: 'Cancellation Policy',
      before_value: { hours: 24, fee_percent: 25 },
      after_value: { hours: 24, fee_percent: 50 },
      can_rollback: true,
      is_rolled_back: false,
    },
    {
      id: 'log-6',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'Ryan Kent',
      category: 'Chart',
      action: 'Signed',
      target: 'Patient Chart #1234',
      can_rollback: false,
      is_rolled_back: false,
    },
    {
      id: 'log-7',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'Danielle (Owner)',
      category: 'Schedule',
      action: 'Updated',
      target: 'Ryan Kent Schedule',
      before_value: { monday: '9:00-17:00' },
      after_value: { monday: '10:00-18:00' },
      can_rollback: true,
      is_rolled_back: true,
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = ['all', ...new Set(logs.map(l => l.category))];

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.category === filter);

  const rollback = (logId: string) => {
    const log = logs.find(l => l.id === logId);
    if (!log || !log.can_rollback || log.is_rolled_back) return;

    if (!confirm(`Rollback this change?\n\n${log.action} ${log.target}\n\nThis will restore the previous value.`)) return;

    setLogs(prev => prev.map(l => l.id === logId ? { ...l, is_rolled_back: true } : l));
    setMessage({ type: 'success', text: `Rolled back: ${log.target}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 60 * 1000) {
      const mins = Math.floor(diff / (60 * 1000));
      return `${mins} min ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour(s) ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return 'bg-green-100 text-green-700';
      case 'updated': return 'bg-blue-100 text-blue-700';
      case 'deleted': return 'bg-red-100 text-red-700';
      case 'enabled': return 'bg-green-100 text-green-700';
      case 'disabled': return 'bg-amber-100 text-amber-700';
      case 'locked': return 'bg-red-100 text-red-700';
      case 'signed': return 'bg-pink-100 text-pink-700';
      default: return 'bg-white text-black';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'service': return '💉';
      case 'feature': return '🎚️';
      case 'consent': return '📝';
      case 'user': return '👤';
      case 'booking rule': return '📋';
      case 'chart': return '🩺';
      case 'schedule': return '📅';
      case 'price': return '💰';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Change Log</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Change Log & Rollback</h1>
          <p className="text-black">Track all configuration changes with one-click rollback</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* How Rollback Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">↩️</span>
          <div>
            <p className="font-medium text-blue-800">One-Click Rollback</p>
            <p className="text-sm text-blue-600">
              Every configuration change is logged with before/after values. 
              Click "Rollback" on any entry to instantly restore the previous state.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-black">Total Changes</p>
          <p className="text-2xl font-bold text-black">{logs.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-black">Today</p>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-black">Can Rollback</p>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(l => l.can_rollback && !l.is_rolled_back).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-black">Rolled Back</p>
          <p className="text-2xl font-bold text-amber-600">
            {logs.filter(l => l.is_rolled_back).length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === cat ? 'bg-pink-500 text-white' : 'bg-white text-black hover:bg-white'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Log Entries */}
      <div className="bg-white rounded-xl border divide-y">
        {filteredLogs.map(log => (
          <div key={log.id} className={`p-4 ${log.is_rolled_back ? 'bg-white opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1">{getCategoryIcon(log.category)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <h3 className="font-medium text-black">{log.target}</h3>
                    {log.is_rolled_back && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Rolled Back</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-black mt-1">
                    {log.user} • {formatTimestamp(log.timestamp)}
                  </p>

                  {/* Before/After Values */}
                  {(log.before_value || log.after_value) && (
                    <div className="mt-2 flex gap-4 text-xs">
                      {log.before_value && (
                        <div className="bg-red-50 p-2 rounded">
                          <span className="text-red-600 font-medium">Before: </span>
                          <code className="text-red-700">{JSON.stringify(log.before_value)}</code>
                        </div>
                      )}
                      {log.after_value && (
                        <div className="bg-green-50 p-2 rounded">
                          <span className="text-green-600 font-medium">After: </span>
                          <code className="text-green-700">{JSON.stringify(log.after_value)}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Rollback Button */}
              {log.can_rollback && !log.is_rolled_back && (
                <button
                  onClick={() => rollback(log.id)}
                  className="px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                >
                  ↩️ Rollback
                </button>
              )}
              {!log.can_rollback && (
                <span className="text-xs text-black">Cannot rollback</span>
              )}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-black">
            No changes logged in this category
          </div>
        )}
      </div>

      {/* Export Audit Log */}
      <div className="flex justify-end">
        <button className="px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-white">
          📥 Export Audit Log (CSV)
        </button>
      </div>
    </div>
  );
}
