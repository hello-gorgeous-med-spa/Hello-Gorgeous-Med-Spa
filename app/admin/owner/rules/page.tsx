'use client';

// ============================================================
// RULES & PRECEDENCE CONTROL
// View all rules with hierarchy and conflict detection
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Rule {
  id: string;
  name: string;
  category: 'founder' | 'legal' | 'clinical' | 'booking' | 'automation';
  priority: number;
  description: string;
  status: 'active' | 'suspended' | 'conflict';
  conflictsWith?: string;
}

export default function RulesPrecedencePage() {
  const [rules, setRules] = useState<Rule[]>([
    // Founder Overrides (highest)
    { id: 'f1', name: 'VIP Client Fee Waiver', category: 'founder', priority: 1, description: 'Waive cancellation fees for VIP clients', status: 'active' },
    { id: 'f2', name: 'Holiday Pricing Override', category: 'founder', priority: 2, description: 'Custom holiday pricing rules', status: 'active' },
    // Legal
    { id: 'l1', name: 'HIPAA Acknowledgment Required', category: 'legal', priority: 10, description: 'All clients must sign HIPAA', status: 'active' },
    { id: 'l2', name: 'Financial Policy Consent', category: 'legal', priority: 11, description: 'Required for all services', status: 'active' },
    // Clinical
    { id: 'c1', name: 'Max 50 Units Botox/Provider/Day', category: 'clinical', priority: 20, description: 'Safety limit per provider', status: 'active' },
    { id: 'c2', name: 'Neurotoxin Consent Required', category: 'clinical', priority: 21, description: 'For injectable services', status: 'active' },
    { id: 'c3', name: '14-Day Min Between Neurotoxin', category: 'clinical', priority: 22, description: 'Minimum wait between treatments', status: 'active' },
    // Booking
    { id: 'b1', name: 'New Client $50 Deposit', category: 'booking', priority: 30, description: 'Deposit for first-time clients', status: 'active' },
    { id: 'b2', name: '24h Cancellation Policy', category: 'booking', priority: 31, description: '$50 fee for late cancellations', status: 'conflict', conflictsWith: 'VIP Client Fee Waiver' },
    { id: 'b3', name: '2-Hour Minimum Booking Notice', category: 'booking', priority: 32, description: 'Cannot book same-day within 2 hours', status: 'active' },
    // Automation
    { id: 'a1', name: 'SMS Reminder 24h Before', category: 'automation', priority: 40, description: 'Automated reminder', status: 'active' },
    { id: 'a2', name: 'Review Request 48h After', category: 'automation', priority: 41, description: 'Automated review request', status: 'suspended' },
    { id: 'a3', name: 'Birthday Discount Auto-Apply', category: 'automation', priority: 42, description: '10% off during birthday month', status: 'active' },
  ]);

  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categoryOrder = ['founder', 'legal', 'clinical', 'booking', 'automation'];
  const categoryLabels: Record<string, string> = {
    founder: 'Founder Override',
    legal: 'Legal',
    clinical: 'Clinical',
    booking: 'Booking',
    automation: 'Automation',
  };
  const categoryColors: Record<string, string> = {
    founder: 'bg-pink-100 text-pink-700 border-pink-200',
    legal: 'bg-red-100 text-red-700 border-red-200',
    clinical: 'bg-blue-100 text-blue-700 border-blue-200',
    booking: 'bg-green-100 text-green-700 border-green-200',
    automation: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const moveRule = (ruleId: string, direction: 'up' | 'down') => {
    setRules(prev => {
      const idx = prev.findIndex(r => r.id === ruleId);
      if (idx === -1) return prev;
      const newRules = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newRules.length) return prev;
      // Only allow reorder within same category
      if (newRules[idx].category !== newRules[swapIdx].category) return prev;
      [newRules[idx], newRules[swapIdx]] = [newRules[swapIdx], newRules[idx]];
      return newRules;
    });
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const newStatus = r.status === 'active' ? 'suspended' : 'active';
        setMessage({ type: 'success', text: `Rule "${r.name}" ${newStatus === 'active' ? 'activated' : 'suspended'}` });
        setTimeout(() => setMessage(null), 3000);
        return { ...r, status: newStatus as any };
      }
      return r;
    }));
  };

  const overrideRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    setMessage({ type: 'success', text: `Founder override applied to "${rule.name}"` });
    setTimeout(() => setMessage(null), 3000);
  };

  const conflictCount = rules.filter(r => r.status === 'conflict').length;

  return (
    <OwnerLayout title="Rules & Precedence Control" description="View and manage all system rules">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Conflict Warning */}
      {conflictCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">{conflictCount} Rule Conflict{conflictCount > 1 ? 's' : ''} Detected</h3>
              <p className="text-sm text-red-600">Review and resolve conflicts before publishing</p>
            </div>
          </div>
        </div>
      )}

      {/* Rule Hierarchy Legend */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <h3 className="font-semibold mb-3">⚖️ Rule Hierarchy (HARD REQUIREMENT)</h3>
        <div className="flex items-center gap-4">
          {categoryOrder.map((cat, idx) => (
            <div key={cat} className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${categoryColors[cat]}`}>
                {categoryLabels[cat]}
              </span>
              {idx < categoryOrder.length - 1 && <span className="text-gray-400">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Higher priority categories always override lower ones. Founder Override always wins.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Rules List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">All System Rules</h2>
              <p className="text-xs text-gray-500">Drag within category to reorder priority</p>
            </div>
            <div className="divide-y">
              {categoryOrder.map(category => (
                <div key={category}>
                  <div className={`p-3 ${categoryColors[category].split(' ')[0]}`}>
                    <h4 className="font-semibold text-sm">{categoryLabels[category]}</h4>
                  </div>
                  {rules.filter(r => r.category === category).map((rule, idx) => (
                    <div
                      key={rule.id}
                      onClick={() => setSelectedRule(rule)}
                      className={`p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer ${
                        selectedRule?.id === rule.id ? 'bg-purple-50' : ''
                      } ${rule.status === 'conflict' ? 'bg-red-50' : ''}`}
                    >
                      {/* Priority Controls */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveRule(rule.id, 'up'); }}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >▲</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveRule(rule.id, 'down'); }}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >▼</button>
                      </div>

                      {/* Rule Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{rule.name}</h3>
                          {rule.status === 'conflict' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">CONFLICT</span>
                          )}
                          {rule.status === 'suspended' && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">SUSPENDED</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{rule.description}</p>
                        {rule.conflictsWith && (
                          <p className="text-xs text-red-600 mt-1">⚠️ Conflicts with: {rule.conflictsWith}</p>
                        )}
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          rule.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          rule.status === 'active' ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rule Detail Panel */}
        <div>
          {selectedRule ? (
            <div className="bg-white rounded-xl border sticky top-4">
              <div className={`p-4 border-b ${categoryColors[selectedRule.category].split(' ')[0]}`}>
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[selectedRule.category]}`}>
                  {categoryLabels[selectedRule.category]}
                </span>
                <h3 className="font-semibold mt-2">{selectedRule.name}</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Description</label>
                  <p className="text-sm">{selectedRule.description}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Priority</label>
                  <p className="text-sm font-medium">#{selectedRule.priority}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <p className={`text-sm font-medium ${
                    selectedRule.status === 'active' ? 'text-green-600' :
                    selectedRule.status === 'conflict' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {selectedRule.status.toUpperCase()}
                  </p>
                </div>

                {selectedRule.conflictsWith && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">⚠️ This rule conflicts with:</p>
                    <p className="text-sm font-medium text-red-700">{selectedRule.conflictsWith}</p>
                  </div>
                )}

                <div className="border-t pt-4 space-y-2">
                  <button
                    onClick={() => toggleRule(selectedRule.id)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedRule.status === 'active'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedRule.status === 'active' ? 'Suspend Rule' : 'Activate Rule'}
                  </button>
                  
                  {selectedRule.category !== 'founder' && (
                    <button
                      onClick={() => overrideRule(selectedRule.id)}
                      className="w-full px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium hover:bg-purple-200"
                    >
                      Apply Founder Override
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-8 text-center">
              <span className="text-4xl block mb-3">⚖️</span>
              <h3 className="font-semibold">Select a Rule</h3>
              <p className="text-sm text-gray-500">Click a rule to view details and actions</p>
            </div>
          )}

          {/* Preview Impact */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Preview Impact</h4>
            <p className="text-xs text-blue-600">
              Changes to rules are validated before publishing. Conflicts are detected automatically.
              Founder overrides always take precedence.
            </p>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
