'use client';

// ============================================================
// AUTOMATION BUILDER - Create If/Then Workflow Rules
// No-code automation for business processes
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface AutomationTrigger {
  type: string;
  conditions?: { field: string; operator: string; value: any }[];
}

interface AutomationAction {
  type: string;
  config: Record<string, any>;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  is_active: boolean;
  run_count: number;
  last_run?: string;
}

const TRIGGERS = [
  { type: 'appointment_booked', label: 'Appointment is booked', icon: '📅' },
  { type: 'appointment_completed', label: 'Appointment is completed', icon: '✅' },
  { type: 'appointment_cancelled', label: 'Appointment is cancelled', icon: '❌' },
  { type: 'appointment_no_show', label: 'Client no-shows', icon: '👻' },
  { type: 'payment_received', label: 'Payment is received', icon: '💰' },
  { type: 'new_client', label: 'New client created', icon: '👤' },
  { type: 'client_birthday', label: 'Client birthday', icon: '🎂' },
  { type: 'days_since_visit', label: 'Days since last visit', icon: '⏰' },
  { type: 'membership_expiring', label: 'Membership expiring soon', icon: '💎' },
  { type: 'consent_expired', label: 'Consent form expired', icon: '📋' },
];

const ACTIONS = [
  { type: 'send_sms', label: 'Send SMS', icon: '💬', config: { template: '' } },
  { type: 'send_email', label: 'Send Email', icon: '📧', config: { template: '' } },
  { type: 'create_task', label: 'Create Task', icon: '📝', config: { title: '', assignee: '' } },
  { type: 'add_tag', label: 'Add Client Tag', icon: '🏷️', config: { tag: '' } },
  { type: 'apply_discount', label: 'Apply Discount', icon: '💸', config: { code: '' } },
  { type: 'update_field', label: 'Update Field', icon: '✏️', config: { field: '', value: '' } },
  { type: 'notify_staff', label: 'Notify Staff', icon: '🔔', config: { message: '', channel: 'sms' } },
  { type: 'schedule_followup', label: 'Schedule Follow-Up', icon: '📆', config: { days: 14 } },
];

const DEFAULT_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1',
    name: 'New Client Welcome',
    description: 'Send welcome message when a new client is created',
    trigger: { type: 'new_client' },
    actions: [
      { type: 'send_sms', config: { template: 'Welcome to Hello Gorgeous! We\'re excited to have you. Reply HELP for assistance.' } },
      { type: 'add_tag', config: { tag: 'new-client' } },
    ],
    is_active: true,
    run_count: 156,
    last_run: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto-2',
    name: 'Review Request',
    description: 'Request Google review 24 hours after appointment',
    trigger: { type: 'appointment_completed', conditions: [{ field: 'hours_ago', operator: '>=', value: 24 }] },
    actions: [
      { type: 'send_sms', config: { template: 'We hope you loved your visit! Would you mind leaving us a quick review? {{review_link}}' } },
    ],
    is_active: true,
    run_count: 89,
    last_run: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto-3',
    name: 'No-Show Follow Up',
    description: 'Send message and create task when client no-shows',
    trigger: { type: 'appointment_no_show' },
    actions: [
      { type: 'send_sms', config: { template: 'We missed you today! Would you like to reschedule? Call us at {{business_phone}}' } },
      { type: 'create_task', config: { title: 'Follow up on no-show', assignee: 'front_desk' } },
      { type: 'add_tag', config: { tag: 'no-show' } },
    ],
    is_active: true,
    run_count: 12,
    last_run: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto-4',
    name: 'Rebook Reminder (30 days)',
    description: 'Remind clients to rebook after 30 days',
    trigger: { type: 'days_since_visit', conditions: [{ field: 'days', operator: '=', value: 30 }] },
    actions: [
      { type: 'send_sms', config: { template: 'It\'s been 30 days since your last visit! Ready for a refresh? Book now: {{booking_link}}' } },
    ],
    is_active: true,
    run_count: 234,
    last_run: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto-5',
    name: 'Birthday Discount',
    description: 'Send birthday discount code',
    trigger: { type: 'client_birthday' },
    actions: [
      { type: 'send_sms', config: { template: '🎂 Happy Birthday {{first_name}}! Enjoy 15% off your next visit with code BDAY15. Valid 30 days!' } },
      { type: 'apply_discount', config: { code: 'BDAY15' } },
    ],
    is_active: true,
    run_count: 45,
    last_run: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(DEFAULT_AUTOMATIONS);
  const [editingAuto, setEditingAuto] = useState<Automation | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createNewAutomation = () => {
    const newAuto: Automation = {
      id: `auto-${Date.now()}`,
      name: '',
      description: '',
      trigger: { type: 'appointment_completed' },
      actions: [],
      is_active: true,
      run_count: 0,
    };
    setEditingAuto(newAuto);
    setIsCreating(true);
  };

  const saveAutomation = () => {
    if (!editingAuto?.name) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }
    if (editingAuto.actions.length === 0) {
      setMessage({ type: 'error', text: 'At least one action is required' });
      return;
    }

    if (isCreating) {
      setAutomations(prev => [...prev, editingAuto]);
      setMessage({ type: 'success', text: 'Automation created!' });
    } else {
      setAutomations(prev => prev.map(a => a.id === editingAuto.id ? editingAuto : a));
      setMessage({ type: 'success', text: 'Automation saved!' });
    }

    setEditingAuto(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const addAction = (type: string) => {
    if (!editingAuto) return;
    const actionDef = ACTIONS.find(a => a.type === type);
    const newAction: AutomationAction = {
      type,
      config: { ...(actionDef?.config || {}) },
    };
    setEditingAuto({
      ...editingAuto,
      actions: [...editingAuto.actions, newAction],
    });
  };

  const updateAction = (index: number, updates: Partial<AutomationAction>) => {
    if (!editingAuto) return;
    setEditingAuto({
      ...editingAuto,
      actions: editingAuto.actions.map((a, i) => i === index ? { ...a, ...updates } : a),
    });
  };

  const removeAction = (index: number) => {
    if (!editingAuto) return;
    setEditingAuto({
      ...editingAuto,
      actions: editingAuto.actions.filter((_, i) => i !== index),
    });
  };

  const toggleActive = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));
  };

  const deleteAutomation = (id: string) => {
    if (confirm('Delete this automation?')) {
      setAutomations(prev => prev.filter(a => a.id !== id));
    }
  };

  const formatLastRun = (date?: string) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const hours = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Automations</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Automations</h1>
          <p className="text-black">Create "If this, then that" workflow rules</p>
        </div>
        {!editingAuto && (
          <button onClick={createNewAutomation} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            + Create Automation
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {editingAuto ? (
        /* Automation Editor */
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Create Automation' : 'Edit Automation'}</h2>
            <button onClick={() => { setEditingAuto(null); setIsCreating(false); }} className="text-black">✕</button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Name *</label>
              <input
                type="text"
                value={editingAuto.name}
                onChange={(e) => setEditingAuto({ ...editingAuto, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., New Client Welcome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <input
                type="text"
                value={editingAuto.description}
                onChange={(e) => setEditingAuto({ ...editingAuto, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="What does this automation do?"
              />
            </div>
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">When this happens... (Trigger)</label>
            <div className="grid grid-cols-3 gap-2">
              {TRIGGERS.map(trigger => (
                <button
                  key={trigger.type}
                  onClick={() => setEditingAuto({ ...editingAuto, trigger: { type: trigger.type } })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left ${
                    editingAuto.trigger.type === trigger.type
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-black hover:border-black'
                  }`}
                >
                  <span>{trigger.icon}</span>
                  <span>{trigger.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Do this... (Actions)</label>
            
            {/* Action List */}
            <div className="space-y-3 mb-4">
              {editingAuto.actions.map((action, idx) => {
                const actionDef = ACTIONS.find(a => a.type === action.type);
                return (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <span className="text-xl">{actionDef?.icon}</span>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-black">{actionDef?.label}</p>
                      
                      {action.type === 'send_sms' || action.type === 'send_email' ? (
                        <textarea
                          value={action.config.template || ''}
                          onChange={(e) => updateAction(idx, { config: { ...action.config, template: e.target.value } })}
                          className="w-full px-3 py-2 border rounded text-sm"
                          rows={2}
                          placeholder="Message content..."
                        />
                      ) : action.type === 'create_task' ? (
                        <input
                          type="text"
                          value={action.config.title || ''}
                          onChange={(e) => updateAction(idx, { config: { ...action.config, title: e.target.value } })}
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder="Task title"
                        />
                      ) : action.type === 'add_tag' ? (
                        <input
                          type="text"
                          value={action.config.tag || ''}
                          onChange={(e) => updateAction(idx, { config: { ...action.config, tag: e.target.value } })}
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder="Tag name"
                        />
                      ) : action.type === 'notify_staff' ? (
                        <input
                          type="text"
                          value={action.config.message || ''}
                          onChange={(e) => updateAction(idx, { config: { ...action.config, message: e.target.value } })}
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder="Notification message"
                        />
                      ) : action.type === 'schedule_followup' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">Schedule in</span>
                          <input
                            type="number"
                            value={action.config.days || 14}
                            onChange={(e) => updateAction(idx, { config: { ...action.config, days: parseInt(e.target.value) } })}
                            className="w-20 px-3 py-1 border rounded text-sm"
                          />
                          <span className="text-sm text-black">days</span>
                        </div>
                      ) : action.type === 'apply_discount' ? (
                        <input
                          type="text"
                          value={action.config.code || ''}
                          onChange={(e) => updateAction(idx, { config: { ...action.config, code: e.target.value } })}
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder="Discount code"
                        />
                      ) : null}
                    </div>
                    <button onClick={() => removeAction(idx)} className="text-red-500 hover:text-red-700">🗑</button>
                  </div>
                );
              })}
            </div>

            {/* Add Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map(action => (
                <button
                  key={action.type}
                  onClick={() => addAction(action.type)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white rounded hover:bg-white"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Toggle */}
          <label className="flex items-center gap-2 pt-4 border-t">
            <input
              type="checkbox"
              checked={editingAuto.is_active}
              onChange={(e) => setEditingAuto({ ...editingAuto, is_active: e.target.checked })}
              className="w-4 h-4 text-pink-500 rounded"
            />
            <span className="text-sm">Automation is active</span>
          </label>

          {/* Save */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingAuto(null); setIsCreating(false); }} className="px-4 py-2 text-black hover:bg-white rounded-lg">
              Cancel
            </button>
            <button onClick={saveAutomation} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        /* Automations List */
        <div className="bg-white rounded-xl border divide-y">
          {automations.map(auto => {
            const trigger = TRIGGERS.find(t => t.type === auto.trigger.type);
            return (
              <div key={auto.id} className={`p-4 ${auto.is_active ? '' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-black">{auto.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${auto.is_active ? 'bg-green-100 text-green-700' : 'bg-white text-black'}`}>
                        {auto.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-black mt-1">{auto.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-black">
                        <span>{trigger?.icon}</span>
                        <span>{trigger?.label}</span>
                      </div>
                      <span className="text-black">→</span>
                      <div className="flex items-center gap-1">
                        {auto.actions.map((a, i) => {
                          const actionDef = ACTIONS.find(ad => ad.type === a.type);
                          return <span key={i} title={actionDef?.label}>{actionDef?.icon}</span>;
                        })}
                      </div>
                    </div>

                    <p className="text-xs text-black mt-2">
                      Ran {auto.run_count} times • Last: {formatLastRun(auto.last_run)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingAuto(auto)} className="px-3 py-1.5 text-sm text-black hover:bg-white rounded">
                      Edit
                    </button>
                    <button onClick={() => deleteAutomation(auto.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded">
                      Delete
                    </button>
                    <button
                      onClick={() => toggleActive(auto.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${auto.is_active ? 'bg-green-500' : 'bg-white'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${auto.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
