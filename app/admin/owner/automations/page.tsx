'use client';

// ============================================================
// AUTOMATIONS & MESSAGING - OWNER CONTROLLED
// SMS/email templates, triggers, timing
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  timing: string;
  is_active: boolean;
  run_count: number;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([
    { id: '1', name: 'Booking Confirmation', trigger: 'appointment_booked', action: 'send_sms', timing: 'immediately', is_active: true, run_count: 1250 },
    { id: '2', name: '24h Reminder', trigger: 'appointment_upcoming', action: 'send_sms', timing: '24 hours before', is_active: true, run_count: 980 },
    { id: '3', name: '2h Reminder', trigger: 'appointment_upcoming', action: 'send_sms', timing: '2 hours before', is_active: true, run_count: 890 },
    { id: '4', name: 'Post-Visit Follow-Up', trigger: 'appointment_completed', action: 'send_sms', timing: '24 hours after', is_active: true, run_count: 456 },
    { id: '5', name: 'Review Request', trigger: 'appointment_completed', action: 'send_sms', timing: '48 hours after', is_active: true, run_count: 345 },
    { id: '6', name: 'Birthday Discount', trigger: 'client_birthday', action: 'send_sms', timing: 'on birthday', is_active: true, run_count: 78 },
    { id: '7', name: 'Rebook Reminder', trigger: 'days_since_visit', action: 'send_sms', timing: '30 days after', is_active: true, run_count: 234 },
    { id: '8', name: 'No-Show Follow-Up', trigger: 'appointment_no_show', action: 'send_sms', timing: '1 hour after', is_active: true, run_count: 23 },
  ]);

  const [optOutSettings, setOptOutSettings] = useState({
    honor_stop_keyword: true,
    stop_keywords: ['STOP', 'UNSUBSCRIBE', 'CANCEL'],
    send_confirmation_on_optout: true,
    allow_resubscribe: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleActive = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));
  };

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Automation settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Automations & Messaging" description="Configure automated communications">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Automations List */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Automations</h2>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600">
              + Create Automation
            </button>
          </div>
          <div className="divide-y">
            {automations.map(auto => (
              <div key={auto.id} className={`p-4 ${!auto.is_active ? 'bg-white opacity-75' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{auto.name}</h3>
                    <p className="text-sm text-black mt-1">
                      Trigger: {auto.trigger.replace(/_/g, ' ')} → {auto.action.replace(/_/g, ' ')} ({auto.timing})
                    </p>
                    <p className="text-xs text-black mt-1">Ran {auto.run_count} times</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm text-black hover:text-black">Edit</button>
                    <button
                      onClick={() => toggleActive(auto.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${auto.is_active ? 'bg-green-500' : 'bg-white'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${auto.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opt-Out Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Opt-Out / TCPA Compliance</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={optOutSettings.honor_stop_keyword} onChange={(e) => setOptOutSettings(prev => ({ ...prev, honor_stop_keyword: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Honor STOP Keywords</span>
                <span className="text-xs text-black">Automatically opt-out clients who text STOP</span>
              </div>
            </label>
            <div>
              <label className="block text-sm font-medium text-black mb-1">STOP Keywords (comma-separated)</label>
              <input
                type="text"
                value={optOutSettings.stop_keywords.join(', ')}
                onChange={(e) => setOptOutSettings(prev => ({ ...prev, stop_keywords: e.target.value.split(',').map(s => s.trim()) }))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={optOutSettings.send_confirmation_on_optout} onChange={(e) => setOptOutSettings(prev => ({ ...prev, send_confirmation_on_optout: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Send Opt-Out Confirmation</span>
                <span className="text-xs text-black">Confirm successful opt-out to client</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={optOutSettings.allow_resubscribe} onChange={(e) => setOptOutSettings(prev => ({ ...prev, allow_resubscribe: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Allow Re-Subscribe</span>
                <span className="text-xs text-black">Clients can text START to opt back in</span>
              </div>
            </label>
          </div>
        </div>

        {/* Message Templates Link */}
        <div className="bg-purple-50 border border-pink-200 rounded-xl p-4">
          <h3 className="font-medium text-purple-800">Message Templates</h3>
          <p className="text-sm text-pink-600 mt-1">
            Edit the actual text content of all SMS and email messages in the Message Templates section.
          </p>
          <a href="/admin/settings/templates" className="inline-block mt-2 text-sm text-pink-700 hover:text-purple-800 font-medium">
            Go to Message Templates →
          </a>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium">
            Save Automation Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
