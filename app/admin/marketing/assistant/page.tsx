'use client';

// ============================================================
// AI MARKETING ASSISTANT
// Smart campaign suggestions and automated marketing insights
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

interface CampaignSuggestion {
  id: string;
  type: 'win_back' | 'birthday' | 'rebooking' | 'new_service' | 'seasonal' | 'loyalty';
  title: string;
  description: string;
  audience: string;
  audienceCount: number;
  suggestedMessage: string;
  channel: 'email' | 'sms' | 'both';
  priority: 'high' | 'medium' | 'low';
  potentialRevenue?: number;
}

interface MarketingInsight {
  id: string;
  icon: string;
  title: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function MarketingAssistantPage() {
  const toast = useToast();
  const [suggestions, setSuggestions] = useState<CampaignSuggestion[]>([]);
  const [insights, setInsights] = useState<MarketingInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CampaignSuggestion | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketing/suggestions');
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setInsights(data.insights || []);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (suggestion: CampaignSuggestion) => {
    setSending(true);
    try {
      // In production, this would actually send the campaign
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Campaign "${suggestion.title}" has been queued for sending!`);
      setSelectedSuggestion(null);
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    } catch (err) {
      toast.error('Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-white text-black';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'win_back': return '💔';
      case 'birthday': return '🎂';
      case 'rebooking': return '📅';
      case 'new_service': return '✨';
      case 'seasonal': return '🌸';
      case 'loyalty': return '⭐';
      default: return '📣';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black">Marketing Assistant</h1>
          <p className="text-black">AI-powered campaign suggestions for your business</p>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-black animate-pulse">
              <div className="h-4 bg-white rounded w-20 mb-2" />
              <div className="h-6 bg-white rounded w-16" />
            </div>
          ))
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-xl p-4 border border-black">
              <div className="flex items-center gap-2 mb-1">
                <span>{insight.icon}</span>
                <span className="text-sm text-black">{insight.title}</span>
              </div>
              <p className="text-xl font-bold text-black">{insight.value}</p>
              {insight.trend && (
                <p className={`text-xs mt-1 ${insight.trend === 'up' ? 'text-green-600' : insight.trend === 'down' ? 'text-red-600' : 'text-black'}`}>
                  {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'} {insight.trendValue}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="p-6 border-b border-black flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black">Campaign Suggestions</h2>
            <p className="text-sm text-black">Personalized campaigns based on your customer data</p>
          </div>
          <button
            onClick={fetchSuggestions}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="divide-y divide-black">
          {loading ? (
            <div className="p-12 text-center text-black">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Analyzing your customer data...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-4xl mb-4 block">✨</span>
              <p className="text-black">No campaign suggestions right now</p>
              <p className="text-sm text-black mt-1">Check back later for personalized recommendations</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-6 hover:bg-white transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-black">{suggestion.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-black text-sm mb-3">{suggestion.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-black">
                        <span className="font-medium text-black">{suggestion.audienceCount}</span> {suggestion.audience}
                      </span>
                      <span className="text-black">•</span>
                      <span className="text-black">
                        via {suggestion.channel === 'both' ? 'Email & SMS' : suggestion.channel.toUpperCase()}
                      </span>
                      {suggestion.potentialRevenue && (
                        <>
                          <span className="text-black">•</span>
                          <span className="text-green-600 font-medium">
                            Est. ${suggestion.potentialRevenue.toLocaleString()} revenue
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedSuggestion(suggestion)}
                      className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Review & Send
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/marketing/contacts"
          className="bg-white rounded-xl p-6 border border-black hover:border-pink-200 hover:shadow-md transition-all group"
        >
          <span className="text-2xl mb-3 block">📋</span>
          <h3 className="font-semibold text-black group-hover:text-pink-600">Contact Collection</h3>
          <p className="text-sm text-black mt-1">Get your sign-up link & QR code</p>
        </Link>
        <Link
          href="/admin/marketing/campaigns/new"
          className="bg-white rounded-xl p-6 border border-black hover:border-pink-200 hover:shadow-md transition-all group"
        >
          <span className="text-2xl mb-3 block">✉️</span>
          <h3 className="font-semibold text-black group-hover:text-pink-600">Create Campaign</h3>
          <p className="text-sm text-black mt-1">Build a custom email or SMS campaign</p>
        </Link>
        <Link
          href="/admin/sms"
          className="bg-white rounded-xl p-6 border border-black hover:border-pink-200 hover:shadow-md transition-all group"
        >
          <span className="text-2xl mb-3 block">💬</span>
          <h3 className="font-semibold text-black group-hover:text-pink-600">SMS Center</h3>
          <p className="text-sm text-black mt-1">Send texts and manage conversations</p>
        </Link>
      </div>

      {/* Campaign Preview Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-black">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(selectedSuggestion.type)}</span>
                <div>
                  <h2 className="text-xl font-bold text-black">{selectedSuggestion.title}</h2>
                  <p className="text-sm text-black">{selectedSuggestion.audienceCount} recipients</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Message Preview</label>
                <div className="bg-white rounded-xl p-4 border border-black">
                  <p className="text-black whitespace-pre-wrap">{selectedSuggestion.suggestedMessage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Channel</label>
                  <p className="text-black">{selectedSuggestion.channel === 'both' ? 'Email & SMS' : selectedSuggestion.channel.toUpperCase()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Est. Revenue</label>
                  <p className="text-green-600 font-semibold">${selectedSuggestion.potentialRevenue?.toLocaleString() || '—'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-black flex justify-between">
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white"
                >
                  Edit First
                </button>
                <button
                  onClick={() => handleSendCampaign(selectedSuggestion)}
                  disabled={sending}
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Campaign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
