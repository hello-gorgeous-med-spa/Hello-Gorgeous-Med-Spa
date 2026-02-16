'use client';

// ============================================================
// MESSAGE TEMPLATE EDITOR - Edit All SMS/Email Text Without Code
// Owner can customize every notification message
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'booking' | 'reminder' | 'follow_up' | 'marketing' | 'system';
  channel: 'sms' | 'email' | 'both';
  subject?: string;
  body: string;
  variables: string[];
  is_active: boolean;
}

const AVAILABLE_VARIABLES = [
  { key: '{{client_name}}', desc: 'Client\'s full name' },
  { key: '{{first_name}}', desc: 'Client\'s first name' },
  { key: '{{service_name}}', desc: 'Service booked' },
  { key: '{{appointment_date}}', desc: 'Date of appointment' },
  { key: '{{appointment_time}}', desc: 'Time of appointment' },
  { key: '{{provider_name}}', desc: 'Provider\'s name' },
  { key: '{{business_name}}', desc: 'Hello Gorgeous Med Spa' },
  { key: '{{business_phone}}', desc: 'Business phone number' },
  { key: '{{booking_link}}', desc: 'Online booking URL' },
  { key: '{{portal_link}}', desc: 'Client portal URL' },
  { key: '{{review_link}}', desc: 'Google review link' },
  { key: '{{amount}}', desc: 'Payment amount' },
  { key: '{{balance}}', desc: 'Remaining balance' },
];

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-booking-confirm-sms',
    name: 'Booking Confirmation (SMS)',
    description: 'Sent immediately after booking',
    category: 'booking',
    channel: 'sms',
    body: `Hi {{first_name}}! Your appointment at Hello Gorgeous Med Spa is confirmed.

📅 {{appointment_date}} at {{appointment_time}}
✨ {{service_name}}
👩‍⚕️ with {{provider_name}}

Need to reschedule? Reply RESCHEDULE or call {{business_phone}}`,
    variables: ['first_name', 'appointment_date', 'appointment_time', 'service_name', 'provider_name', 'business_phone'],
    is_active: true,
  },
  {
    id: 'tpl-booking-confirm-email',
    name: 'Booking Confirmation (Email)',
    description: 'Email sent after booking',
    category: 'booking',
    channel: 'email',
    subject: 'Your Appointment is Confirmed - Hello Gorgeous Med Spa',
    body: `Dear {{client_name}},

Thank you for booking with Hello Gorgeous Med Spa!

APPOINTMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━
Date: {{appointment_date}}
Time: {{appointment_time}}
Service: {{service_name}}
Provider: {{provider_name}}

WHAT TO EXPECT:
• Please arrive 10 minutes early
• Bring a valid ID
• Complete any required consent forms

Need to make changes? Visit your client portal: {{portal_link}}

We look forward to seeing you!

Hello Gorgeous Med Spa
{{business_phone}}`,
    variables: ['client_name', 'appointment_date', 'appointment_time', 'service_name', 'provider_name', 'portal_link', 'business_phone'],
    is_active: true,
  },
  {
    id: 'tpl-reminder-24h',
    name: '24-Hour Reminder',
    description: 'Sent 24 hours before appointment',
    category: 'reminder',
    channel: 'sms',
    body: `Reminder: Hi {{first_name}}, your appointment is TOMORROW!

📅 {{appointment_date}} at {{appointment_time}}
✨ {{service_name}}

Reply C to confirm or call {{business_phone}} to reschedule.`,
    variables: ['first_name', 'appointment_date', 'appointment_time', 'service_name', 'business_phone'],
    is_active: true,
  },
  {
    id: 'tpl-reminder-2h',
    name: '2-Hour Reminder',
    description: 'Sent 2 hours before appointment',
    category: 'reminder',
    channel: 'sms',
    body: `Hi {{first_name}}, see you in 2 hours! 💕

Your {{service_name}} appointment is at {{appointment_time}}.

Address: 123 Main St, Chicago IL`,
    variables: ['first_name', 'service_name', 'appointment_time'],
    is_active: true,
  },
  {
    id: 'tpl-followup-24h',
    name: 'Post-Appointment Follow-Up',
    description: 'Sent 24 hours after appointment',
    category: 'follow_up',
    channel: 'sms',
    body: `Hi {{first_name}}! Thank you for visiting us yesterday. 💕

How are you feeling after your {{service_name}}? If you have any questions or concerns, don't hesitate to reach out!

{{business_phone}}`,
    variables: ['first_name', 'service_name', 'business_phone'],
    is_active: true,
  },
  {
    id: 'tpl-review-request',
    name: 'Review Request',
    description: 'Ask for Google review after visit',
    category: 'follow_up',
    channel: 'sms',
    body: `Hi {{first_name}}! We hope you loved your visit to Hello Gorgeous Med Spa! ✨

Would you mind leaving us a quick review? It helps others find us!

{{review_link}}

Thank you! 💕`,
    variables: ['first_name', 'review_link'],
    is_active: true,
  },
  {
    id: 'tpl-rebook-reminder',
    name: 'Rebook Reminder',
    description: 'Remind client to rebook (sent after X weeks)',
    category: 'marketing',
    channel: 'sms',
    body: `Hi {{first_name}}! It's been a few weeks since your last {{service_name}}. Ready for a refresh? ✨

Book your next appointment: {{booking_link}}

Questions? Call us at {{business_phone}}`,
    variables: ['first_name', 'service_name', 'booking_link', 'business_phone'],
    is_active: true,
  },
  {
    id: 'tpl-payment-receipt',
    name: 'Payment Receipt',
    description: 'Sent after payment',
    category: 'system',
    channel: 'sms',
    body: `Thank you, {{first_name}}! Your payment of {{amount}} has been received.

Hello Gorgeous Med Spa
{{business_phone}}`,
    variables: ['first_name', 'amount', 'business_phone'],
    is_active: true,
  },
  {
    id: 'tpl-cancellation',
    name: 'Cancellation Confirmation',
    description: 'Sent when appointment is cancelled',
    category: 'booking',
    channel: 'sms',
    body: `Hi {{first_name}}, your appointment on {{appointment_date}} has been cancelled.

Need to rebook? Visit {{booking_link}} or call {{business_phone}}

Hope to see you soon! 💕`,
    variables: ['first_name', 'appointment_date', 'booking_link', 'business_phone'],
    is_active: true,
  },
];

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>(DEFAULT_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = ['all', 'booking', 'reminder', 'follow_up', 'marketing', 'system'];
  
  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category === filter);

  const saveTemplate = () => {
    if (!editingTemplate) return;
    
    setTemplates(prev => prev.map(t => 
      t.id === editingTemplate.id ? editingTemplate : t
    ));
    setMessage({ type: 'success', text: 'Template saved!' });
    setEditingTemplate(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleActive = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, is_active: !t.is_active } : t
    ));
  };

  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      body: editingTemplate.body + variable,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Message Templates</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Message Templates</h1>
          <p className="text-black">Customize all SMS and email notifications</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Editor */}
      {editingTemplate ? (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold">{editingTemplate.name}</h2>
              <p className="text-sm text-black">{editingTemplate.description}</p>
            </div>
            <button onClick={() => setEditingTemplate(null)} className="text-black hover:text-black">
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Editor */}
            <div className="col-span-2 space-y-4">
              {editingTemplate.channel === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={editingTemplate.subject || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Message Body 
                  <span className="text-black font-normal ml-2">
                    ({editingTemplate.channel === 'sms' ? `${editingTemplate.body.length} chars` : 'Email'})
                  </span>
                </label>
                <textarea
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg h-64 font-mono text-sm"
                />
                {editingTemplate.channel === 'sms' && editingTemplate.body.length > 160 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Message exceeds 160 chars - will be sent as multiple segments
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 text-black hover:bg-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Save Template
                </button>
              </div>
            </div>

            {/* Variables Panel */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-black mb-3">Available Variables</h3>
              <p className="text-xs text-black mb-3">Click to insert into message</p>
              <div className="space-y-2">
                {AVAILABLE_VARIABLES.map(v => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.key)}
                    className="w-full text-left px-3 py-2 bg-white rounded border text-sm hover:bg-pink-50 hover:border-pink-200"
                  >
                    <span className="font-mono text-pink-600">{v.key}</span>
                    <span className="block text-xs text-black">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white text-black hover:bg-white'
                }`}
              >
                {cat === 'all' ? 'All' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Templates List */}
          <div className="bg-white rounded-xl border divide-y">
            {filteredTemplates.map(template => (
              <div key={template.id} className="p-4 hover:bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {template.channel === 'sms' ? '💬' : template.channel === 'email' ? '📧' : '📨'}
                      </span>
                      <h3 className="font-medium text-black">{template.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${template.is_active ? 'bg-green-100 text-green-700' : 'bg-white text-black'}`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-black mt-1">{template.description}</p>
                    <p className="text-xs text-black mt-2 font-mono bg-white p-2 rounded truncate">
                      {template.body.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(template.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${template.is_active ? 'bg-green-500' : 'bg-white'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${template.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
