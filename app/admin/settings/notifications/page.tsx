'use client';

// ============================================================
// ADMIN SETTINGS - NOTIFICATIONS
// Configure automated reminders and communications
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
// Import directly to avoid barrel file issues
interface ReminderConfigLocal {
  enabled: boolean;
  reminders: {
    hours: number;
    channels: ('email' | 'sms')[];
    template: string;
  }[];
  followUp: {
    enabled: boolean;
    hoursAfter: number;
    includeReviewRequest: boolean;
    reviewUrl: string;
  };
}

const DEFAULT_REMINDER_CONFIG: ReminderConfigLocal = {
  enabled: true,
  reminders: [
    { hours: 24, channels: ['email', 'sms'], template: 'reminder_24h' },
    { hours: 2, channels: ['sms'], template: 'reminder_2h' },
  ],
  followUp: {
    enabled: true,
    hoursAfter: 2,
    includeReviewRequest: true,
    reviewUrl: 'https://g.page/r/CYQOWmT_HcwQEBM/review',
  },
};

export default function NotificationSettingsPage() {
  const [config, setConfig] = useState<ReminderConfigLocal>(DEFAULT_REMINDER_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleChannel = (reminderIndex: number, channel: 'email' | 'sms') => {
    const newReminders = [...config.reminders];
    const currentChannels = newReminders[reminderIndex].channels;
    
    if (currentChannels.includes(channel)) {
      newReminders[reminderIndex].channels = currentChannels.filter(c => c !== channel);
    } else {
      newReminders[reminderIndex].channels = [...currentChannels, channel];
    }
    
    setConfig({ ...config, reminders: newReminders });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/settings" className="text-sm text-black hover:text-black mb-1 inline-block">
            ← Back to Settings
          </Link>
          <h1 className="text-2xl font-bold text-black">Notification Settings</h1>
          <p className="text-black">Configure automated appointment reminders and follow-ups</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Master Toggle */}
      <div className="bg-white rounded-xl border border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-black">Automated Reminders</h2>
            <p className="text-sm text-black">Send automatic appointment reminders to clients</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${config.enabled ? 'bg-green-500' : 'bg-white'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${config.enabled ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
            <span className={config.enabled ? 'text-green-600 font-medium' : 'text-black'}>
              {config.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      {/* Reminder Schedule */}
      <div className="bg-white rounded-xl border border-black">
        <div className="px-6 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Reminder Schedule</h2>
          <p className="text-sm text-black">When and how to send appointment reminders</p>
        </div>
        <div className="p-6 space-y-6">
          {config.reminders.map((reminder, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-black last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <p className="font-medium text-black">
                    {reminder.hours} hours before
                  </p>
                  <p className="text-sm text-black">
                    {reminder.hours >= 24 ? 'Day before reminder' : 'Same day reminder'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminder.channels.includes('email')}
                    onChange={() => toggleChannel(index, 'email')}
                    className="rounded text-[#FF2D8E]"
                  />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminder.channels.includes('sms')}
                    onChange={() => toggleChannel(index, 'sms')}
                    className="rounded text-[#FF2D8E]"
                  />
                  <span className="text-sm">SMS</span>
                </label>
              </div>
            </div>
          ))}

          <button className="w-full py-3 border-2 border-dashed border-black rounded-lg text-black hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-colors">
            + Add Another Reminder
          </button>
        </div>
      </div>

      {/* Follow-up Settings */}
      <div className="bg-white rounded-xl border border-black">
        <div className="px-6 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Post-Appointment Follow-up</h2>
          <p className="text-sm text-black">Automatic thank you and review requests</p>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-black">Send follow-up message</p>
              <p className="text-sm text-black">Thank clients after their appointment</p>
            </div>
            <input
              type="checkbox"
              checked={config.followUp.enabled}
              onChange={(e) => setConfig({
                ...config,
                followUp: { ...config.followUp, enabled: e.target.checked },
              })}
              className="rounded text-[#FF2D8E] w-5 h-5"
            />
          </label>

          <div className="flex items-center gap-4">
            <label className="text-sm text-black">Send</label>
            <input
              type="number"
              value={config.followUp.hoursAfter}
              onChange={(e) => setConfig({
                ...config,
                followUp: { ...config.followUp, hoursAfter: parseInt(e.target.value) || 2 },
              })}
              className="w-20 px-3 py-2 border border-black rounded-lg"
            />
            <span className="text-sm text-black">hours after appointment</span>
          </div>

          <label className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-black">Include review request</p>
              <p className="text-sm text-black">Ask clients to leave a Google review</p>
            </div>
            <input
              type="checkbox"
              checked={config.followUp.includeReviewRequest}
              onChange={(e) => setConfig({
                ...config,
                followUp: { ...config.followUp, includeReviewRequest: e.target.checked },
              })}
              className="rounded text-[#FF2D8E] w-5 h-5"
            />
          </label>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Google Review URL
            </label>
            <input
              type="url"
              value={config.followUp.reviewUrl}
              onChange={(e) => setConfig({
                ...config,
                followUp: { ...config.followUp, reviewUrl: e.target.value },
              })}
              className="w-full px-4 py-2 border border-black rounded-lg"
              placeholder="https://g.page/r/..."
            />
          </div>
        </div>
      </div>

      {/* SMS Settings */}
      <div className="bg-white rounded-xl border border-black p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl">📱</span>
          <div>
            <h2 className="font-semibold text-black">SMS Settings</h2>
            <p className="text-sm text-black">Configure text message delivery</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">⚠️ Twilio Setup Required</p>
          <p className="text-sm text-amber-700 mt-1">
            To send SMS reminders, you need to configure Twilio credentials in your environment variables.
          </p>
          <Link href="/admin/settings" className="text-sm text-amber-800 underline mt-2 inline-block">
            Go to Settings →
          </Link>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-xl border border-black p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl">✉️</span>
          <div>
            <h2 className="font-semibold text-black">Email Settings</h2>
            <p className="text-sm text-black">Configure email delivery</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">⚠️ Email Provider Setup Required</p>
          <p className="text-sm text-amber-700 mt-1">
            To send email reminders, configure Brevo, SendGrid, or another email provider in your environment variables.
          </p>
          <Link href="/admin/settings" className="text-sm text-amber-800 underline mt-2 inline-block">
            Go to Settings →
          </Link>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-6">
        <h3 className="font-semibold text-black mb-4">📬 Message Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-black mb-2">24-Hour Reminder (SMS)</p>
            <p className="text-sm text-black">
              Hello Gorgeous Med Spa: Reminder - You have an appointment tomorrow at 10:00 AM for Botox. 
              Reply HELP for assistance or manage at hgms.link/abc123
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-black mb-2">Follow-up (SMS)</p>
            <p className="text-sm text-black">
              Thank you for visiting Hello Gorgeous! 💕 We'd love your feedback: g.page/r/CYQOWmT_HcwQEBM/review
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
