'use client';

// ============================================================
// EMAIL MARKETING PAGE
// Mailchimp / Klaviyo integration
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  opens: number;
  clicks: number;
  sent_at?: string;
  scheduled_for?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
  category: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome New Client',
    subject: 'Welcome to Hello Gorgeous Med Spa! 💕',
    preview: 'Thank you for choosing us for your aesthetic journey...',
    category: 'Onboarding',
  },
  {
    id: 'birthday',
    name: 'Birthday Special',
    subject: 'Happy Birthday! Here\'s a special gift 🎂',
    preview: 'Wishing you a gorgeous birthday! Enjoy 15% off...',
    category: 'Special Occasion',
  },
  {
    id: 'reminder-botox',
    name: 'Botox Reminder (3 months)',
    subject: 'Time for your Botox touch-up? 💉',
    preview: 'It\'s been 3 months since your last treatment...',
    category: 'Reminder',
  },
  {
    id: 'reminder-filler',
    name: 'Filler Reminder (6 months)',
    subject: 'Keep that gorgeous glow! Filler reminder 💋',
    preview: 'Your filler results may be fading...',
    category: 'Reminder',
  },
  {
    id: 'promo-monthly',
    name: 'Monthly Special',
    subject: 'This Month\'s Exclusive Offer Inside! ✨',
    preview: 'Don\'t miss out on our limited-time special...',
    category: 'Promotion',
  },
  {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    subject: 'Hello Gorgeous Newsletter 📰',
    preview: 'What\'s new at Hello Gorgeous this month...',
    category: 'Newsletter',
  },
  {
    id: 'reengagement',
    name: 'We Miss You!',
    subject: 'We miss you at Hello Gorgeous! 💕',
    preview: 'It\'s been a while since your last visit...',
    category: 'Re-engagement',
  },
  {
    id: 'review-request',
    name: 'Review Request',
    subject: 'How was your visit? ⭐',
    preview: 'We\'d love to hear about your experience...',
    category: 'Feedback',
  },
];

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'automation' | 'settings'>('campaigns');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<'mailchimp' | 'klaviyo' | null>(null);

  // Check connection status
  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch('/api/email/status');
        if (res.ok) {
          const data = await res.json();
          setIsConnected(data.connected);
          setProvider(data.provider);
        }
      } catch (err) {
        console.error('Error checking email status:', err);
      } finally {
        setLoading(false);
      }
    }
    checkConnection();
  }, []);

  // Stats
  const stats = {
    totalSubscribers: 2847,
    avgOpenRate: 42.5,
    avgClickRate: 8.3,
    campaignsSent: campaigns.filter(c => c.status === 'sent').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-500">Send campaigns, automations, and newsletters</p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          ✉️ New Campaign
        </button>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2">📧 Connect Email Provider</h3>
          <p className="text-amber-800 text-sm mb-4">
            Connect your email marketing platform to send campaigns directly from this dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => window.open('https://mailchimp.com/integrations/', '_blank')}
              className="p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🐵</span>
                <span className="font-bold text-gray-900">Mailchimp</span>
              </div>
              <p className="text-sm text-gray-600">Popular choice, free up to 500 contacts</p>
            </button>
            <button
              onClick={() => window.open('https://www.klaviyo.com/partners/signup', '_blank')}
              className="p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💜</span>
                <span className="font-bold text-gray-900">Klaviyo</span>
              </div>
              <p className="text-sm text-gray-600">Advanced automation, great for e-commerce</p>
            </button>
          </div>
          <details className="mt-4">
            <summary className="text-sm text-amber-700 cursor-pointer hover:text-amber-800">
              How to connect →
            </summary>
            <div className="mt-2 p-4 bg-white rounded-lg text-sm text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>Sign up for Mailchimp or Klaviyo (free plans available)</li>
                <li>Go to your account settings and find API Keys</li>
                <li>Generate an API key and copy it</li>
                <li>Contact support to add your API key to this system</li>
              </ol>
            </div>
          </details>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{provider === 'mailchimp' ? '🐵' : '💜'}</span>
            <div>
              <p className="font-medium text-green-900">
                Connected to {provider === 'mailchimp' ? 'Mailchimp' : 'Klaviyo'}
              </p>
              <p className="text-sm text-green-700">{stats.totalSubscribers.toLocaleString()} subscribers</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            ✓ Active
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Subscribers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Open Rate</p>
          <p className="text-2xl font-bold text-green-600">{stats.avgOpenRate}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Click Rate</p>
          <p className="text-2xl font-bold text-blue-600">{stats.avgClickRate}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Campaigns Sent</p>
          <p className="text-2xl font-bold text-purple-600">{stats.campaignsSent}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(['campaigns', 'templates', 'automation', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px capitalize ${
              activeTab === tab 
                ? 'border-pink-500 text-pink-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {campaigns.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <span className="text-4xl block mb-4">✉️</span>
              <p className="mb-4">No campaigns yet</p>
              <button
                onClick={() => setShowComposeModal(true)}
                className="text-pink-600 font-medium hover:text-pink-700"
              >
                Create your first campaign
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.subject}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_TEMPLATES.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-pink-300 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedTemplate(template);
                setShowComposeModal(true);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {template.category}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{template.subject}</p>
              <p className="text-xs text-gray-400 line-clamp-2">{template.preview}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">🤖 Email Automations</h3>
            <p className="text-gray-600 mb-4">
              Set up automated emails that send based on triggers like birthdays, treatment anniversaries, or inactivity.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Welcome Series', trigger: 'New client signs up', status: 'active' },
                { name: 'Birthday Email', trigger: '7 days before birthday', status: 'active' },
                { name: 'Botox Reminder', trigger: '90 days after treatment', status: 'paused' },
                { name: 'Re-engagement', trigger: '180 days inactive', status: 'paused' },
              ].map((auto, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-100">
                  <div>
                    <p className="font-medium text-gray-900">{auto.name}</p>
                    <p className="text-sm text-gray-500">{auto.trigger}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    auto.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {auto.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Email Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <input
                type="text"
                defaultValue="Hello Gorgeous Med Spa"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply-To Email</label>
              <input
                type="email"
                defaultValue="hello.gorgeous@hellogorgeousmedspa.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address (required for CAN-SPAM)</label>
              <textarea
                defaultValue="2406 Route 71, Oswego, IL 60543"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTemplate ? `New Campaign: ${selectedTemplate.name}` : 'New Campaign'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  defaultValue={selectedTemplate?.name || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., February Newsletter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  defaultValue={selectedTemplate?.subject || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Your email subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
                <input
                  type="text"
                  defaultValue={selectedTemplate?.preview || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Text shown in email preview..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>All Subscribers ({stats.totalSubscribers})</option>
                  <option>Active Clients (Last 6 months)</option>
                  <option>Inactive Clients (6+ months)</option>
                  <option>Botox Clients</option>
                  <option>Filler Clients</option>
                  <option>Weight Loss Clients</option>
                  <option>VIP Members</option>
                </select>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Email editor would load here when connected to Mailchimp/Klaviyo
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowComposeModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                Save Draft
              </button>
              <button className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
                Send / Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
