'use client';

// ============================================================
// CHANGE MANAGEMENT & VERSIONING
// Track, schedule, batch, and rollback changes
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Change {
  id: string;
  timestamp: string;
  user: string;
  category: string;
  action: string;
  target: string;
  before: any;
  after: any;
  riskScore: 'low' | 'medium' | 'high';
  canRollback: boolean;
  isRolledBack: boolean;
}

interface ScheduledChange {
  id: string;
  scheduledFor: string;
  description: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdBy: string;
}

export default function ChangeManagementPage() {
  const [changes, setChanges] = useState<Change[]>([
    { id: 'c1', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), user: 'Danielle', category: 'Pricing', action: 'Updated', target: 'Botox pricing', before: { price: 12 }, after: { price: 14 }, riskScore: 'medium', canRollback: true, isRolledBack: false },
    { id: 'c2', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), user: 'Danielle', category: 'Consent', action: 'Created', target: 'Weight Loss Consent v1', before: null, after: { version: 1 }, riskScore: 'low', canRollback: true, isRolledBack: false },
    { id: 'c3', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), user: 'Danielle', category: 'Rule', action: 'Modified', target: 'Cancellation Policy', before: { fee: 25 }, after: { fee: 50 }, riskScore: 'high', canRollback: true, isRolledBack: false },
    { id: 'c4', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), user: 'Ryan', category: 'Schedule', action: 'Updated', target: 'Provider Hours', before: { monday: '9-5' }, after: { monday: '10-6' }, riskScore: 'low', canRollback: true, isRolledBack: true },
    { id: 'c5', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), user: 'System', category: 'Backup', action: 'Completed', target: 'Daily Backup', before: null, after: { success: true }, riskScore: 'low', canRollback: false, isRolledBack: false },
  ]);

  const [scheduledChanges, setScheduledChanges] = useState<ScheduledChange[]>([
    { id: 's1', scheduledFor: '2025-03-15T00:00:00Z', description: 'Spring pricing update (all services +5%)', status: 'approved', createdBy: 'Danielle' },
    { id: 's2', scheduledFor: '2025-04-01T00:00:00Z', description: 'New consent form v2 goes live', status: 'pending', createdBy: 'Danielle' },
  ]);

  const [frozenSections, setFrozenSections] = useState<string[]>(['clinical_rules']);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const rollback = (id: string) => {
    const change = changes.find(c => c.id === id);
    if (!change || !change.canRollback || change.isRolledBack) return;
    
    if (!confirm(`Rollback this change?\n\n${change.action} ${change.target}\n\nThis will restore the previous value.`)) return;

    setChanges(prev => prev.map(c => c.id === id ? { ...c, isRolledBack: true } : c));
    setMessage({ type: 'success', text: `Rolled back: ${change.target}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleFreeze = (section: string) => {
    setFrozenSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-white text-black';
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sections = [
    { id: 'pricing', label: 'Pricing' },
    { id: 'booking_rules', label: 'Booking Rules' },
    { id: 'clinical_rules', label: 'Clinical Rules' },
    { id: 'consents', label: 'Consents' },
    { id: 'schedules', label: 'Schedules' },
    { id: 'automations', label: 'Automations' },
  ];

  return (
    <OwnerLayout title="Change Management" description="Track, schedule, and rollback all changes">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Change Log */}
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Total Changes (7d)</p>
              <p className="text-2xl font-bold">{changes.length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">High Risk</p>
              <p className="text-2xl font-bold text-red-600">{changes.filter(c => c.riskScore === 'high').length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Can Rollback</p>
              <p className="text-2xl font-bold text-green-600">{changes.filter(c => c.canRollback && !c.isRolledBack).length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-black">Rolled Back</p>
              <p className="text-2xl font-bold text-amber-600">{changes.filter(c => c.isRolledBack).length}</p>
            </div>
          </div>

          {/* Change List */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">📝 Change Log</h2>
              <p className="text-xs text-black">Who changed what, when, before/after, risk score</p>
            </div>
            <div className="divide-y">
              {changes.map(change => (
                <div key={change.id} className={`p-4 ${change.isRolledBack ? 'bg-white opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          change.action === 'Created' ? 'bg-green-100 text-green-700' :
                          change.action === 'Updated' || change.action === 'Modified' ? 'bg-blue-100 text-blue-700' :
                          'bg-white text-black'
                        }`}>{change.action}</span>
                        <h3 className="font-medium">{change.target}</h3>
                        {change.isRolledBack && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Rolled Back</span>}
                      </div>
                      <p className="text-xs text-black">{change.user} • {formatTime(change.timestamp)} • {change.category}</p>
                      
                      {/* Before/After Diff */}
                      {(change.before || change.after) && (
                        <div className="mt-2 flex gap-3 text-xs">
                          {change.before && (
                            <div className="bg-red-50 p-2 rounded flex-1">
                              <span className="text-red-600 font-medium">Before: </span>
                              <code>{JSON.stringify(change.before)}</code>
                            </div>
                          )}
                          {change.after && (
                            <div className="bg-green-50 p-2 rounded flex-1">
                              <span className="text-green-600 font-medium">After: </span>
                              <code>{JSON.stringify(change.after)}</code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${getRiskBadge(change.riskScore)}`}>
                        {change.riskScore} risk
                      </span>
                      {change.canRollback && !change.isRolledBack && (
                        <button
                          onClick={() => rollback(change.id)}
                          className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs hover:bg-amber-200"
                        >
                          ↩️ Rollback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Changes */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">📅 Scheduled Changes</h2>
                <p className="text-xs text-black">Future changes queued for deployment</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg text-sm hover:bg-black"
              >
                + Schedule Change
              </button>
            </div>
            <div className="divide-y">
              {scheduledChanges.map(sc => (
                <div key={sc.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{sc.description}</h3>
                    <p className="text-xs text-black">
                      Scheduled: {new Date(sc.scheduledFor).toLocaleDateString()} • Created by {sc.createdBy}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    sc.status === 'approved' ? 'bg-green-100 text-green-700' :
                    sc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-white text-black'
                  }`}>
                    {sc.status}
                  </span>
                </div>
              ))}
              {scheduledChanges.length === 0 && (
                <div className="p-4 text-center text-black">No scheduled changes</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Freeze Sections */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-blue-50">
              <h2 className="font-semibold text-blue-800">🔒 Freeze Sections</h2>
              <p className="text-xs text-blue-600">Prevent changes to specific areas</p>
            </div>
            <div className="p-4 space-y-2">
              {sections.map(section => (
                <label key={section.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-white">
                  <span className="text-sm">{section.label}</span>
                  <button
                    onClick={() => toggleFreeze(section.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      frozenSections.includes(section.id) ? 'bg-blue-500' : 'bg-white'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      frozenSections.includes(section.id) ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Rollback */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2">⚡ Quick Rollback</h3>
            <p className="text-xs text-amber-600 mb-3">Instantly undo the most recent change</p>
            {changes.filter(c => c.canRollback && !c.isRolledBack)[0] && (
              <button
                onClick={() => rollback(changes.filter(c => c.canRollback && !c.isRolledBack)[0].id)}
                className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
              >
                Rollback: {changes.filter(c => c.canRollback && !c.isRolledBack)[0].target}
              </button>
            )}
          </div>

          {/* Immutable Log Note */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-medium text-black mb-2">📋 Immutable Log</h3>
            <ul className="text-xs text-black space-y-1">
              <li>• One-click rollback available</li>
              <li>• No silent changes</li>
              <li>• All changes audited</li>
              <li>• Exportable history</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Schedule a Change</h3>
            <p className="text-sm text-black mb-4">
              Schedule configuration changes to take effect at a future date.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="What will change?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Effective Date</label>
                <input type="date" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 text-black hover:text-black">
                Cancel
              </button>
              <button onClick={() => setShowScheduleModal(false)} className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
