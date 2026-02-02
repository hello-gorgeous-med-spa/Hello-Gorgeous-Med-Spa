'use client';

// ============================================================
// BOOKING RULES ENGINE - OWNER CONTROLLED
// Cancellation, no-show, deposits, prerequisites
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface BookingRule {
  id: string;
  name: string;
  type: 'cancellation' | 'no_show' | 'deposit' | 'prerequisite' | 'eligibility' | 'rebook';
  conditions: { field: string; operator: string; value: any }[];
  action: string;
  value: any;
  is_active: boolean;
  applies_to: 'all' | string[];
}

export default function BookingRulesPage() {
  const [rules, setRules] = useState<BookingRule[]>([
    {
      id: 'rule-1',
      name: '24-Hour Cancellation Policy',
      type: 'cancellation',
      conditions: [{ field: 'hours_before', operator: '<', value: 24 }],
      action: 'charge_fee',
      value: { type: 'percentage', amount: 50 },
      is_active: true,
      applies_to: 'all',
    },
    {
      id: 'rule-2',
      name: 'No-Show Fee',
      type: 'no_show',
      conditions: [],
      action: 'charge_fee',
      value: { type: 'percentage', amount: 100 },
      is_active: true,
      applies_to: 'all',
    },
    {
      id: 'rule-3',
      name: 'Deposit Required for New Clients',
      type: 'deposit',
      conditions: [{ field: 'client_type', operator: '=', value: 'new' }],
      action: 'require_deposit',
      value: { type: 'fixed', amount: 50 },
      is_active: true,
      applies_to: 'all',
    },
    {
      id: 'rule-4',
      name: 'Injectable Consultation Required',
      type: 'prerequisite',
      conditions: [{ field: 'service_category', operator: '=', value: 'Injectables' }],
      action: 'require_service',
      value: { service: 'Consultation', within_days: 365 },
      is_active: false,
      applies_to: ['Injectables'],
    },
    {
      id: 'rule-5',
      name: 'No Same-Day Rebooking After No-Show',
      type: 'rebook',
      conditions: [{ field: 'last_status', operator: '=', value: 'no_show' }],
      action: 'block_booking',
      value: { days: 1 },
      is_active: true,
      applies_to: 'all',
    },
  ]);

  const [editingRule, setEditingRule] = useState<BookingRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const RULE_TYPES = [
    { value: 'cancellation', label: 'Cancellation Policy', icon: '❌', description: 'Fees for late cancellations' },
    { value: 'no_show', label: 'No-Show Policy', icon: '👻', description: 'Fees for missed appointments' },
    { value: 'deposit', label: 'Deposit Requirement', icon: '💰', description: 'Upfront payment rules' },
    { value: 'prerequisite', label: 'Service Prerequisite', icon: '📋', description: 'Required services before booking' },
    { value: 'eligibility', label: 'Booking Eligibility', icon: '✅', description: 'Who can book what' },
    { value: 'rebook', label: 'Rebooking Restriction', icon: '🔄', description: 'Restrictions on rebooking' },
  ];

  const createNewRule = () => {
    const newRule: BookingRule = {
      id: `rule-${Date.now()}`,
      name: '',
      type: 'cancellation',
      conditions: [],
      action: '',
      value: {},
      is_active: true,
      applies_to: 'all',
    };
    setEditingRule(newRule);
    setIsCreating(true);
  };

  const saveRule = () => {
    if (!editingRule?.name) {
      setMessage({ type: 'error', text: 'Rule name is required' });
      return;
    }

    if (isCreating) {
      setRules(prev => [...prev, editingRule]);
      setMessage({ type: 'success', text: 'Booking rule created!' });
    } else {
      setRules(prev => prev.map(r => r.id === editingRule.id ? editingRule : r));
      setMessage({ type: 'success', text: 'Booking rule updated!' });
    }

    setEditingRule(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleActive = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));
  };

  const deleteRule = (id: string) => {
    if (confirm('Delete this rule?')) {
      setRules(prev => prev.filter(r => r.id !== id));
    }
  };

  const getRuleIcon = (type: string) => RULE_TYPES.find(t => t.value === type)?.icon || '📋';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Booking Rules</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Rules Engine</h1>
          <p className="text-gray-500">Configure cancellation, deposits, prerequisites</p>
        </div>
        {!editingRule && (
          <button onClick={createNewRule} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            + Create Rule
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Policy Summary */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Active Policy Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Cancellation</p>
            <p className="text-lg font-bold text-red-800">50% fee if &lt; 24h</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-600 font-medium">No-Show</p>
            <p className="text-lg font-bold text-amber-800">100% fee charged</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Deposits</p>
            <p className="text-lg font-bold text-blue-800">$50 for new clients</p>
          </div>
        </div>
      </div>

      {editingRule ? (
        /* Rule Editor */
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Create Rule' : 'Edit Rule'}</h2>
            <button onClick={() => { setEditingRule(null); setIsCreating(false); }} className="text-gray-500">✕</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
            <input
              type="text"
              value={editingRule.name}
              onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., 24-Hour Cancellation Policy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Type</label>
            <div className="grid grid-cols-3 gap-3">
              {RULE_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setEditingRule({ ...editingRule, type: type.value as any })}
                  className={`p-3 rounded-lg border-2 text-left ${
                    editingRule.type === type.value ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <p className="font-medium text-sm mt-1">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Type-specific config */}
          {editingRule.type === 'cancellation' && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-medium">Cancellation Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Window (hours before)</label>
                  <input
                    type="number"
                    value={editingRule.conditions[0]?.value || 24}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      conditions: [{ field: 'hours_before', operator: '<', value: parseInt(e.target.value) }]
                    })}
                    className="w-full px-3 py-2 border rounded"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fee (%)</label>
                  <input
                    type="number"
                    value={editingRule.value?.amount || 50}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      action: 'charge_fee',
                      value: { type: 'percentage', amount: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          {editingRule.type === 'no_show' && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-medium">No-Show Configuration</h3>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fee (%)</label>
                <input
                  type="number"
                  value={editingRule.value?.amount || 100}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    action: 'charge_fee',
                    value: { type: 'percentage', amount: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}

          {editingRule.type === 'deposit' && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-medium">Deposit Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Applies to</label>
                  <select
                    value={editingRule.conditions[0]?.value || 'all'}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      conditions: e.target.value === 'all' ? [] : [{ field: 'client_type', operator: '=', value: e.target.value }]
                    })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="all">All Clients</option>
                    <option value="new">New Clients Only</option>
                    <option value="no_show_history">Clients with No-Show History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={editingRule.value?.amount || 50}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      action: 'require_deposit',
                      value: { type: 'fixed', amount: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editingRule.is_active}
              onChange={(e) => setEditingRule({ ...editingRule, is_active: e.target.checked })}
            />
            <span>Rule is active</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingRule(null); setIsCreating(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button onClick={saveRule} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Create Rule' : 'Save Rule'}
            </button>
          </div>
        </div>
      ) : (
        /* Rules List */
        <div className="bg-white rounded-xl border divide-y">
          {rules.map(rule => (
            <div key={rule.id} className={`p-4 ${!rule.is_active ? 'bg-gray-50 opacity-75' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getRuleIcon(rule.type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{rule.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {rule.type.replace('_', ' ')} • 
                      {rule.applies_to === 'all' ? ' All services' : ` ${(rule.applies_to as string[]).join(', ')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingRule(rule)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
                    Edit
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded">
                    Delete
                  </button>
                  <button
                    onClick={() => toggleActive(rule.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${rule.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.is_active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
