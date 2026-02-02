'use client';

// ============================================================
// BOOKING RULES & POLICIES - OWNER CONTROLLED
// Rules table with rule builder drawer
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Rule {
  id: string;
  priority: number;
  name: string;
  conditions: { field: string; operator: string; value: string }[];
  action: string;
  actionValue: string;
  enabled: boolean;
}

const CONDITION_FIELDS = [
  { value: 'service', label: 'Service' },
  { value: 'service_category', label: 'Service Category' },
  { value: 'client_type', label: 'Client Type' },
  { value: 'client_visits', label: 'Client Total Visits' },
  { value: 'booking_time', label: 'Booking Notice Time' },
  { value: 'day_of_week', label: 'Day of Week' },
  { value: 'provider', label: 'Provider' },
];

const OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'contains', label: 'contains' },
  { value: 'greater_than', label: 'is greater than' },
  { value: 'less_than', label: 'is less than' },
];

const ACTIONS = [
  { value: 'require_consent', label: 'Require Consent' },
  { value: 'require_deposit', label: 'Require Deposit' },
  { value: 'require_chart', label: 'Require Chart Section' },
  { value: 'block_booking', label: 'Block Booking' },
  { value: 'require_approval', label: 'Require Approval' },
  { value: 'apply_fee', label: 'Apply Fee' },
  { value: 'send_notification', label: 'Send Notification' },
];

export default function BookingRulesPage() {
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', priority: 1, name: 'Injectable Consent Required', conditions: [{ field: 'service_category', operator: 'equals', value: 'Injectables' }], action: 'require_consent', actionValue: 'Neurotoxin Consent v3', enabled: true },
    { id: '2', priority: 2, name: 'Filler Consent Required', conditions: [{ field: 'service_category', operator: 'equals', value: 'Fillers' }], action: 'require_consent', actionValue: 'Filler Consent', enabled: true },
    { id: '3', priority: 3, name: 'New Client Deposit', conditions: [{ field: 'client_visits', operator: 'equals', value: '0' }], action: 'require_deposit', actionValue: '$50', enabled: true },
    { id: '4', priority: 4, name: 'Laser Consent', conditions: [{ field: 'service_category', operator: 'equals', value: 'Laser' }], action: 'require_consent', actionValue: 'Laser Consent', enabled: true },
    { id: '5', priority: 5, name: 'Late Booking Block', conditions: [{ field: 'booking_time', operator: 'less_than', value: '2 hours' }], action: 'block_booking', actionValue: 'Minimum 2 hour notice required', enabled: false },
  ]);

  const [showDrawer, setShowDrawer] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openNewRule = () => {
    setEditingRule({
      id: `new-${Date.now()}`,
      priority: rules.length + 1,
      name: '',
      conditions: [{ field: 'service', operator: 'equals', value: '' }],
      action: 'require_consent',
      actionValue: '',
      enabled: true,
    });
    setShowDrawer(true);
  };

  const editRule = (rule: Rule) => {
    setEditingRule({ ...rule });
    setShowDrawer(true);
  };

  const saveRule = () => {
    if (!editingRule) return;
    const isNew = !rules.find(r => r.id === editingRule.id);
    if (isNew) {
      setRules(prev => [...prev, editingRule]);
    } else {
      setRules(prev => prev.map(r => r.id === editingRule.id ? editingRule : r));
    }
    setShowDrawer(false);
    setEditingRule(null);
    setMessage({ type: 'success', text: `Rule "${editingRule.name}" saved!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const addCondition = () => {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      conditions: [...editingRule.conditions, { field: 'service', operator: 'equals', value: '' }],
    });
  };

  const updateCondition = (index: number, updates: Partial<{ field: string; operator: string; value: string }>) => {
    if (!editingRule) return;
    const newConditions = [...editingRule.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setEditingRule({ ...editingRule, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    if (!editingRule || editingRule.conditions.length <= 1) return;
    setEditingRule({
      ...editingRule,
      conditions: editingRule.conditions.filter((_, i) => i !== index),
    });
  };

  return (
    <OwnerLayout title="Booking Rules & Policies" description="Configure booking rules with IF/THEN logic">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Rules Table</h2>
          <button onClick={openNewRule} className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600">
            + Create Rule
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">PRIORITY</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">RULE NAME</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">CONDITION</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">ACTION</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">ENABLED</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rules.sort((a, b) => a.priority - b.priority).map(rule => (
              <tr key={rule.id} className={`hover:bg-gray-50 ${!rule.enabled ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 text-sm font-mono text-gray-500">#{rule.priority}</td>
                <td className="px-4 py-3 font-medium text-sm">{rule.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {rule.conditions.map((c, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-pink-600"> AND </span>}
                      {c.field} {c.operator} "{c.value}"
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">
                    {rule.action.replace(/_/g, ' ')}
                  </span>
                  <span className="ml-2 text-gray-500">{rule.actionValue}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => editRule(rule)} className="text-pink-600 hover:text-pink-700 text-sm">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Example Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800">Example Rule</h3>
        <p className="text-sm text-blue-600 mt-1 font-mono">
          IF service = Injectable<br />
          THEN require Consent v3
        </p>
      </div>

      {/* Rule Builder Drawer */}
      {showDrawer && editingRule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-[500px] h-full overflow-y-auto shadow-xl">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between sticky top-0">
              <h2 className="font-semibold text-lg">Rule Builder</h2>
              <button onClick={() => { setShowDrawer(false); setEditingRule(null); }} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Rule Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Injectable Consent Required"
                />
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IF (Conditions)</label>
                <div className="space-y-3">
                  {editingRule.conditions.map((condition, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      {idx > 0 && <p className="text-xs text-pink-600 font-medium mb-2">AND</p>}
                      <div className="flex gap-2">
                        <select
                          value={condition.field}
                          onChange={(e) => updateCondition(idx, { field: e.target.value })}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        >
                          {CONDITION_FIELDS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                        <select
                          value={condition.operator}
                          onChange={(e) => updateCondition(idx, { operator: e.target.value })}
                          className="px-3 py-2 border rounded text-sm"
                        >
                          {OPERATORS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => updateCondition(idx, { value: e.target.value })}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                          placeholder="Value..."
                        />
                        {editingRule.conditions.length > 1 && (
                          <button onClick={() => removeCondition(idx)} className="px-3 py-2 text-red-500 hover:text-red-700">
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addCondition} className="mt-2 text-sm text-pink-600 hover:text-pink-700">
                  + Add Condition (AND)
                </button>
              </div>

              {/* Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">THEN (Action)</label>
                <select
                  value={editingRule.action}
                  onChange={(e) => setEditingRule({ ...editingRule, action: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                >
                  {ACTIONS.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editingRule.actionValue}
                  onChange={(e) => setEditingRule({ ...editingRule, actionValue: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Action value (e.g., consent name, fee amount)..."
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1 = highest)</label>
                <input
                  type="number"
                  value={editingRule.priority}
                  onChange={(e) => setEditingRule({ ...editingRule, priority: parseInt(e.target.value) || 1 })}
                  className="w-24 px-4 py-2 border rounded-lg"
                  min="1"
                />
              </div>

              {/* Enable Toggle */}
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingRule.enabled}
                  onChange={(e) => setEditingRule({ ...editingRule, enabled: e.target.checked })}
                  className="w-5 h-5 text-pink-600"
                />
                <span className="font-medium">Enable this rule</span>
              </label>
            </div>

            {/* Save Button */}
            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end sticky bottom-0">
              <button onClick={() => { setShowDrawer(false); setEditingRule(null); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button onClick={saveRule} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium">
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
