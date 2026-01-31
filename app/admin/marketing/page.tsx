'use client';

// ============================================================
// MARKETING & CAMPAIGNS PAGE
// Email/SMS campaigns and automation
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'February Botox Special',
    type: 'email',
    status: 'scheduled',
    scheduledFor: '2026-02-01 9:00 AM',
    audience: 1245,
    subject: '💉 $11/unit Botox - February Only!',
  },
  {
    id: '2',
    name: 'Post-Visit Thank You',
    type: 'email',
    status: 'active',
    scheduledFor: null,
    audience: 'auto',
    subject: 'Thank you for visiting Hello Gorgeous!',
  },
  {
    id: '3',
    name: 'Appointment Reminder (24hr)',
    type: 'sms',
    status: 'active',
    scheduledFor: null,
    audience: 'auto',
    subject: 'Reminder: Appointment tomorrow at {time}',
  },
  {
    id: '4',
    name: 'Review Request',
    type: 'email',
    status: 'active',
    scheduledFor: null,
    audience: 'auto',
    subject: 'How was your visit? Share your experience!',
  },
  {
    id: '5',
    name: 'January Newsletter',
    type: 'email',
    status: 'sent',
    scheduledFor: '2026-01-15',
    audience: 2890,
    subject: 'New Year, New You - January Specials Inside',
    stats: { sent: 2890, opened: 1245, clicked: 342, booked: 28 },
  },
];

const MOCK_SEGMENTS = [
  { id: 's1', name: 'All Clients', count: 3431 },
  { id: 's2', name: 'Botox Clients', count: 1856 },
  { id: 's3', name: 'Filler Clients', count: 945 },
  { id: 's4', name: 'VIP Members', count: 127 },
  { id: 's5', name: 'Haven\'t Visited (90+ days)', count: 534 },
  { id: 's6', name: 'New This Month', count: 47 },
  { id: 's7', name: 'Birthday This Month', count: 89 },
];

const MOCK_TEMPLATES = [
  { id: 't1', name: 'Appointment Reminder', type: 'email', category: 'automated' },
  { id: 't2', name: 'Post-Visit Thank You', type: 'email', category: 'automated' },
  { id: 't3', name: 'Review Request', type: 'email', category: 'automated' },
  { id: 't4', name: 'Reactivation', type: 'email', category: 'automated' },
  { id: 't5', name: 'Birthday Offer', type: 'email', category: 'automated' },
  { id: 't6', name: 'Monthly Newsletter', type: 'email', category: 'campaign' },
  { id: 't7', name: 'Flash Sale', type: 'email', category: 'campaign' },
  { id: 't8', name: 'SMS Reminder', type: 'sms', category: 'automated' },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'automation' | 'templates' | 'segments'>('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing & Campaigns</h1>
          <p className="text-gray-500">Email, SMS, and automated client communications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Subscribers</p>
          <p className="text-2xl font-bold text-gray-900">3,245</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Emails Sent (MTD)</p>
          <p className="text-2xl font-bold text-blue-600">4,892</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Open Rate</p>
          <p className="text-2xl font-bold text-green-600">43%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Click Rate</p>
          <p className="text-2xl font-bold text-purple-600">12%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Bookings from Email</p>
          <p className="text-2xl font-bold text-pink-500">28</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'campaigns', label: 'Campaigns', icon: '📧' },
          { id: 'automation', label: 'Automation', icon: '⚡' },
          { id: 'templates', label: 'Templates', icon: '📝' },
          { id: 'segments', label: 'Segments', icon: '👥' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {MOCK_CAMPAIGNS.filter(c => c.status !== 'active' || c.scheduledFor).map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    campaign.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {campaign.type === 'email' ? '📧' : '💬'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{campaign.subject}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-500">
                        Audience: {typeof campaign.audience === 'number' ? campaign.audience.toLocaleString() : campaign.audience}
                      </span>
                      {campaign.scheduledFor && (
                        <span className="text-gray-500">
                          Scheduled: {campaign.scheduledFor}
                        </span>
                      )}
                    </div>
                    {campaign.stats && (
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-gray-600">Sent: {campaign.stats.sent}</span>
                        <span className="text-green-600">Opened: {campaign.stats.opened} ({((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(0)}%)</span>
                        <span className="text-blue-600">Clicked: {campaign.stats.clicked}</span>
                        <span className="text-pink-600">Booked: {campaign.stats.booked}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'sent' ? 'bg-gray-100 text-gray-600' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {campaign.status}
                  </span>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                    Edit
                  </button>
                  {campaign.status === 'scheduled' && (
                    <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-4">
          {[
            { name: 'Appointment Reminder (24hr)', trigger: '24 hours before appointment', type: 'sms', status: 'active', sent: 245 },
            { name: 'Appointment Reminder (2hr)', trigger: '2 hours before appointment', type: 'sms', status: 'active', sent: 243 },
            { name: 'Post-Visit Thank You', trigger: '2 hours after appointment', type: 'email', status: 'active', sent: 198 },
            { name: 'Review Request', trigger: '48 hours after appointment', type: 'email', status: 'active', sent: 156 },
            { name: 'Reactivation (60 days)', trigger: '60 days since last visit', type: 'email', status: 'active', sent: 89 },
            { name: 'Birthday Offer', trigger: '7 days before birthday', type: 'email', status: 'active', sent: 23 },
            { name: 'Membership Renewal', trigger: '7 days before renewal', type: 'email', status: 'paused', sent: 12 },
          ].map((automation, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  automation.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {automation.type === 'email' ? '📧' : '💬'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{automation.name}</h3>
                  <p className="text-sm text-gray-500">Trigger: {automation.trigger}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{automation.sent} sent (MTD)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={automation.status === 'active'}
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          ))}

          <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-semibold text-amber-900 mb-2">SMS Integration Required</h3>
            <p className="text-sm text-amber-800 mb-4">
              SMS automations require Twilio integration. Contact support to enable SMS messaging.
            </p>
            <button className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700">
              Configure SMS
            </button>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-3 gap-4">
          {MOCK_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  template.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {template.type === 'email' ? '📧' : '💬'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{template.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Preview
                </button>
                <button className="flex-1 px-3 py-1.5 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200">
                  Edit
                </button>
              </div>
            </div>
          ))}
          
          <button className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-pink-300 hover:bg-pink-50 transition-colors flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">+</span>
            <span className="font-medium text-gray-600">Create Template</span>
          </button>
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-4">
          {MOCK_SEGMENTS.map((segment) => (
            <div
              key={segment.id}
              className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  👥
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{segment.name}</h3>
                  <p className="text-sm text-gray-500">{segment.count.toLocaleString()} clients</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  View
                </button>
                <button className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg">
                  Send Campaign
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-colors">
            + Create Custom Segment
          </button>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create Campaign</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g., February Botox Special"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 border-2 border-pink-500 bg-pink-50 rounded-lg text-left">
                    <span className="text-2xl">📧</span>
                    <p className="font-medium mt-1">Email</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg text-left hover:border-gray-300">
                    <span className="text-2xl">💬</span>
                    <p className="font-medium mt-1">SMS</p>
                    <p className="text-xs text-gray-500">Requires setup</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Start from scratch</option>
                  <option>Monthly Newsletter</option>
                  <option>Flash Sale</option>
                  <option>New Service Announcement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  {MOCK_SEGMENTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.count.toLocaleString()})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  alert('Campaign created! (Demo mode)');
                }}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
