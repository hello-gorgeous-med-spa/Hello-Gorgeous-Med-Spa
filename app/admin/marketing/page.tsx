'use client';

// ============================================================
// MARKETING HUB — Email & SMS Campaigns
// Just like Fresha: pick channel, write message, hit send
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CampaignRow {
  id: string;
  name: string;
  channel: string;
  status: string;
  total_recipients: number;
  email_sent: number;
  sms_sent: number;
  sms_failed: number;
  created_at: string;
  completed_at: string | null;
}

export default function MarketingHubPage() {
  const [stats, setStats] = useState<{
    smsOptInCount: number;
    totalWithPhone: number;
    totalClients: number;
    optInRate: string;
  } | null>(null);
  const [audience, setAudience] = useState<{ email: number; sms: number; total: number } | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  useEffect(() => {
    // Fetch all stats in parallel
    Promise.allSettled([
      fetch('/api/sms/stats').then(r => r.ok ? r.json() : null),
      fetch('/api/campaigns/audience').then(r => r.ok ? r.json() : null),
      fetch('/api/campaigns').then(r => r.ok ? r.json() : null),
    ]).then(([smsResult, audienceResult, campaignsResult]) => {
      if (smsResult.status === 'fulfilled' && smsResult.value) setStats(smsResult.value);
      if (audienceResult.status === 'fulfilled' && audienceResult.value) setAudience(audienceResult.value);
      if (campaignsResult.status === 'fulfilled' && campaignsResult.value) {
        setCampaigns(campaignsResult.value.campaigns || []);
      }
      setLoadingCampaigns(false);
    });
  }, []);

  const statusColor = (s: string) => {
    switch (s) {
      case 'sent': return 'bg-green-100 text-green-700';
      case 'sending': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const channelIcon = (ch: string) => {
    switch (ch) {
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'multichannel': return '📣';
      default: return '📨';
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h1>
            <p className="text-gray-500 mt-1">Email & SMS campaigns — just like Fresha, but free.</p>
          </div>
          <Link
            href="/admin/marketing/campaigns/new"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25 transition-all"
          >
            + Create Campaign
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Email Reach</p>
            <p className="text-2xl font-bold text-gray-900">{audience?.email?.toLocaleString() || '—'}</p>
            <p className="text-xs text-gray-400">opted-in clients</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">SMS Reach</p>
            <p className="text-2xl font-bold text-gray-900">{audience?.sms?.toLocaleString() || '—'}</p>
            <p className="text-xs text-gray-400">opted-in clients</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalClients?.toLocaleString() || '—'}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">SMS Opt-in Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats ? `${stats.optInRate}%` : '—'}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Campaigns Sent</p>
            <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'sent' || c.status === 'sending').length}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/marketing/campaigns/new"
            className="bg-white rounded-xl p-6 border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50 transition-colors text-center group"
          >
            <span className="text-3xl block mb-2">📣</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-pink-600">Create New Campaign</h3>
            <p className="text-sm text-gray-500 mt-1">Email, SMS, or both</p>
          </Link>
          <Link
            href="/admin/sms"
            className="bg-white rounded-xl p-6 border hover:border-green-400 hover:bg-green-50 transition-colors text-center group"
          >
            <span className="text-3xl block mb-2">💬</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">SMS Inbox</h3>
            <p className="text-sm text-gray-500 mt-1">View conversations & quick send</p>
          </Link>
          <Link
            href="/admin/marketing/contacts"
            className="bg-white rounded-xl p-6 border hover:border-blue-400 hover:bg-blue-50 transition-colors text-center group"
          >
            <span className="text-3xl block mb-2">📋</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Contacts</h3>
            <p className="text-sm text-gray-500 mt-1">Import, export, preferences</p>
          </Link>
        </div>

        {/* Campaign History */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Campaign History</h2>
            <span className="text-sm text-gray-400">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</span>
          </div>

          {loadingCampaigns ? (
            <div className="p-8 text-center text-gray-400">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-5xl block mb-4">📬</span>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Create your first campaign to start reaching your clients.</p>
              <Link
                href="/admin/marketing/campaigns/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600"
              >
                Create Your First Campaign
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {campaigns.map((c) => (
                <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <span className="text-2xl">{channelIcon(c.channel)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(c.status)}`}>
                    {c.status}
                  </span>
                  <div className="text-right text-sm">
                    <p className="text-gray-900 font-medium">{c.total_recipients.toLocaleString()} recipients</p>
                    <p className="text-gray-400">
                      {c.email_sent > 0 && `${c.email_sent} emails`}
                      {c.email_sent > 0 && c.sms_sent > 0 && ' + '}
                      {c.sms_sent > 0 && `${c.sms_sent} SMS`}
                      {c.sms_failed > 0 && ` (${c.sms_failed} failed)`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cost comparison */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Your Savings vs Fresha</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-green-600 font-medium">Email Campaigns</p>
              <p className="text-green-800">Resend: First 3,000/month FREE</p>
              <p className="text-green-500">Then $0.001/email</p>
            </div>
            <div>
              <p className="text-green-600 font-medium">SMS Campaigns</p>
              <p className="text-green-800">Telnyx: $0.004/text</p>
              <p className="text-green-500">~${audience?.sms ? (audience.sms * 0.004).toFixed(2) : '7'} per campaign</p>
            </div>
            <div>
              <p className="text-green-600 font-medium">Fresha Equivalent</p>
              <p className="text-green-800 line-through">$50-100+ per campaign</p>
              <p className="text-green-700 font-bold">You save ~$50-90/campaign</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
