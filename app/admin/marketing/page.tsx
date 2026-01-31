'use client';

// ============================================================
// MARKETING & CAMPAIGNS PAGE
// Email/SMS campaigns and automation - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'automation' | 'sms' | 'segments'>('campaigns');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ subscribers: 0, sentMTD: 0, openRate: 0, clickRate: 0 });

  // Fetch marketing data from database
  useEffect(() => {
    const fetchMarketingData = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        // Fetch campaigns
        const { data: campaignData } = await supabase
          .from('marketing_campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        setCampaigns(campaignData || []);

        // Get client count for segments
        const { count: totalClients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        const { count: vipClients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('is_vip', true);

        setSegments([
          { id: 'all', name: 'All Clients', count: totalClients || 0 },
          { id: 'vip', name: 'VIP Members', count: vipClients || 0 },
        ]);

        setStats({
          subscribers: totalClients || 0,
          sentMTD: 0,
          openRate: 0,
          clickRate: 0,
        });
      } catch (err) {
        console.error('Error fetching marketing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing & Campaigns</h1>
          <p className="text-gray-500">Email, SMS, and automated client communications</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
          + Create Campaign
        </button>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured() && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to manage marketing campaigns
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Clients</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.subscribers.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Emails Sent (MTD)</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-blue-600">{stats.sentMTD.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Open Rate</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">{stats.openRate}%</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Click Rate</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-purple-600">{stats.clickRate}%</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Campaigns</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-pink-500">{campaigns.length}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'campaigns', label: 'Campaigns', icon: '📧' },
          { id: 'automation', label: 'Automation', icon: '⚡' },
          { id: 'sms', label: 'SMS Marketing', icon: '💬' },
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
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))
          ) : campaigns.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <span className="text-4xl mb-4 block">📧</span>
              <h3 className="font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-4">Create your first email campaign to reach clients</p>
              <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
                + Create Campaign
              </button>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl border border-gray-100 p-6">
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
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'sent' ? 'bg-gray-100 text-gray-600' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    campaign.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Automated Workflows</h3>
            <p className="text-gray-500 mb-4">Set up automated email sequences triggered by client actions</p>
            
            <div className="space-y-3">
              {[
                { name: 'Appointment Reminder', trigger: '24 hours before', status: 'active' },
                { name: 'Post-Visit Thank You', trigger: '2 hours after visit', status: 'active' },
                { name: 'Review Request', trigger: '48 hours after visit', status: 'active' },
                { name: 'Reactivation', trigger: '60 days since last visit', status: 'paused' },
                { name: 'Birthday Offer', trigger: '7 days before birthday', status: 'active' },
              ].map((auto, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{auto.name}</p>
                    <p className="text-sm text-gray-500">Trigger: {auto.trigger}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
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

      {/* SMS Marketing Tab */}
      {activeTab === 'sms' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">✓</span>
              <div>
                <h3 className="font-semibold text-green-900">Telnyx SMS Connected</h3>
                <p className="text-sm text-green-800 mt-1">
                  SMS marketing is powered by Telnyx. Send text campaigns to your clients.
                </p>
                <Link
                  href="/admin/sms"
                  className="inline-block mt-3 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                >
                  Open SMS Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))
          ) : (
            <>
              {segments.map((segment) => (
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
