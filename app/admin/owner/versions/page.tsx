'use client';

// ============================================================
// VERSION HISTORY - OWNER CONTROLLED
// Track all changes with rollback capability
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface VersionEntry {
  id: string;
  timestamp: string;
  user: string;
  category: string;
  action: string;
  target: string;
  before?: any;
  after?: any;
  can_rollback: boolean;
  is_rolled_back: boolean;
}

export default function VersionHistoryPage() {
  const [versions, setVersions] = useState<VersionEntry[]>([
    { id: '1', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), user: 'Danielle (Owner)', category: 'Service', action: 'Updated', target: 'Botox Treatment', before: { price: 1200 }, after: { price: 1400 }, can_rollback: true, is_rolled_back: false },
    { id: '2', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), user: 'Danielle (Owner)', category: 'Feature', action: 'Disabled', target: 'Marketing SMS', before: { enabled: true }, after: { enabled: false }, can_rollback: true, is_rolled_back: false },
    { id: '3', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), user: 'Danielle (Owner)', category: 'Consent', action: 'Created', target: 'Weight Loss Consent', after: { version: 1 }, can_rollback: true, is_rolled_back: false },
    { id: '4', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), user: 'Danielle (Owner)', category: 'User', action: 'Locked', target: 'Former Employee', before: { locked: false }, after: { locked: true }, can_rollback: true, is_rolled_back: false },
    { id: '5', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), user: 'Danielle (Owner)', category: 'Booking Rule', action: 'Updated', target: 'Cancellation Policy', before: { fee: 25 }, after: { fee: 50 }, can_rollback: true, is_rolled_back: false },
    { id: '6', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), user: 'Ryan Kent', category: 'Chart', action: 'Signed', target: 'Patient Chart #1234', can_rollback: false, is_rolled_back: false },
    { id: '7', timestamp: new Date(Date.now() - 120 * 3600000).toISOString(), user: 'Danielle (Owner)', category: 'Schedule', action: 'Updated', target: 'Provider Hours', before: { monday: '9-5' }, after: { monday: '10-6' }, can_rollback: true, is_rolled_back: true },
  ]);

  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = ['all', ...new Set(versions.map(v => v.category))];

  const filteredVersions = filter === 'all' ? versions : versions.filter(v => v.category === filter);

  const rollback = (id: string) => {
    const entry = versions.find(v => v.id === id);
    if (!entry || !entry.can_rollback || entry.is_rolled_back) return;
    
    if (!confirm(`Rollback this change?\n\n${entry.action} ${entry.target}\n\nThis will restore the previous value.`)) return;

    setVersions(prev => prev.map(v => v.id === id ? { ...v, is_rolled_back: true } : v));
    setMessage({ type: 'success', text: `Rolled back: ${entry.target}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <OwnerLayout title="Version History" description="Track all configuration changes with rollback">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800">One-Click Rollback</h3>
          <p className="text-sm text-blue-600 mt-1">
            Every configuration change is logged with before/after values. Click "Rollback" to restore the previous state.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Changes</p>
            <p className="text-2xl font-bold">{versions.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-blue-600">{versions.filter(v => new Date(v.timestamp).toDateString() === new Date().toDateString()).length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Can Rollback</p>
            <p className="text-2xl font-bold text-green-600">{versions.filter(v => v.can_rollback && !v.is_rolled_back).length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Rolled Back</p>
            <p className="text-2xl font-bold text-amber-600">{versions.filter(v => v.is_rolled_back).length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === cat ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200'}`}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Version List */}
        <div className="bg-white rounded-xl border divide-y">
          {filteredVersions.map(entry => (
            <div key={entry.id} className={`p-4 ${entry.is_rolled_back ? 'bg-gray-50 opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      entry.action === 'Created' ? 'bg-green-100 text-green-700' :
                      entry.action === 'Updated' ? 'bg-blue-100 text-blue-700' :
                      entry.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{entry.action}</span>
                    <h3 className="font-medium">{entry.target}</h3>
                    {entry.is_rolled_back && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Rolled Back</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{entry.user} • {formatTime(entry.timestamp)}</p>
                  {(entry.before || entry.after) && (
                    <div className="mt-2 flex gap-4 text-xs">
                      {entry.before && (
                        <div className="bg-red-50 p-2 rounded">
                          <span className="text-red-600 font-medium">Before: </span>
                          <code>{JSON.stringify(entry.before)}</code>
                        </div>
                      )}
                      {entry.after && (
                        <div className="bg-green-50 p-2 rounded">
                          <span className="text-green-600 font-medium">After: </span>
                          <code>{JSON.stringify(entry.after)}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {entry.can_rollback && !entry.is_rolled_back && (
                  <button onClick={() => rollback(entry.id)} className="px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">
                    ↩️ Rollback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Export */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            📥 Export Version History
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
