"use client";

import { useState, useEffect } from "react";

interface MetricsSummary {
  totalViews: number;
  totalEngagement: number;
  totalBookings: number;
  avgEngagementRate: number;
  avgConversionRate: number;
  topPerformingPlatform: string | null;
  totalPosts: number;
}

interface CampaignMetric {
  id: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  bookings: number;
  engagement_rate: number;
  created_at: string;
  social_posts?: {
    hook: string;
    caption: string;
    visual_style: string;
    service: string;
  };
}

interface Recommendations {
  service: string;
  recommended_hooks: string[];
  recommended_hashtags: string[];
  best_posting_times: string[];
  best_visual_style: string;
  best_caption_style: string;
  analysis_notes: string;
  confidence_score: number;
  campaigns_analyzed: number;
  avg_engagement_rate: number;
}

export default function CampaignAnalyticsPage() {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [metrics, setMetrics] = useState<CampaignMetric[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("all");
  const [timeRange, setTimeRange] = useState(30);

  const services = [
    { id: "all", name: "All Services" },
    { id: "weightloss", name: "Weight Loss" },
    { id: "botox", name: "Botox" },
    { id: "solaria", name: "Laser/Solaria" },
    { id: "fillers", name: "Fillers" },
    { id: "morpheus8", name: "Morpheus8" },
  ];

  useEffect(() => {
    loadData();
  }, [selectedService, timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load metrics
      const metricsRes = await fetch(`/api/analytics/metrics?days=${timeRange}`);
      const metricsData = await metricsRes.json();
      setMetrics(metricsData.metrics || []);
      setSummary(metricsData.summary);

      // Load recommendations
      const recsRes = await fetch(
        `/api/ai/analyze-campaigns?service=${selectedService === "all" ? "" : selectedService}`
      );
      const recsData = await recsRes.json();
      setRecommendations(recsData.recommendations);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
    setIsLoading(false);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService === "all" ? null : selectedService,
          forceRefresh: true,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    }
    setIsAnalyzing(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="admin-dark min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            📊 Campaign Analytics & AI Insights
          </h1>
          <p className="text-gray-400">
            Self-learning optimization engine - tracks what converts to bookings
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id} className="bg-gray-900">
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none"
          >
            <option value="7" className="bg-gray-900">Last 7 days</option>
            <option value="30" className="bg-gray-900">Last 30 days</option>
            <option value="90" className="bg-gray-900">Last 90 days</option>
          </select>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-400 hover:to-purple-400 disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "🧠 Run AI Analysis"}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              {[
                { label: "Total Views", value: formatNumber(summary?.totalViews || 0), icon: "👁️", color: "blue" },
                { label: "Engagement", value: formatNumber(summary?.totalEngagement || 0), icon: "❤️", color: "pink" },
                { label: "Bookings", value: summary?.totalBookings || 0, icon: "📅", color: "green" },
                { label: "Eng. Rate", value: `${summary?.avgEngagementRate?.toFixed(2) || 0}%`, icon: "📈", color: "purple" },
                { label: "Conv. Rate", value: `${summary?.avgConversionRate?.toFixed(2) || 0}%`, icon: "💰", color: "yellow" },
                { label: "Top Platform", value: summary?.topPerformingPlatform || "N/A", icon: "🏆", color: "orange" },
                { label: "Total Posts", value: summary?.totalPosts || 0, icon: "📱", color: "teal" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">🧠 AI Recommendations</h2>
                  {recommendations?.confidence_score && (
                    <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                      {Math.round(recommendations.confidence_score * 100)}% confidence
                    </span>
                  )}
                </div>

                {recommendations ? (
                  <div className="space-y-6">
                    {/* Best Hooks */}
                    <div>
                      <h3 className="text-sm text-pink-400 uppercase tracking-wide mb-2">🎯 Top Performing Hooks</h3>
                      <div className="space-y-2">
                        {recommendations.recommended_hooks?.slice(0, 5).map((hook, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                          >
                            <span className="text-pink-500 font-bold">{i + 1}</span>
                            <span className="text-white text-sm">"{hook}"</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Hashtags */}
                    <div>
                      <h3 className="text-sm text-purple-400 uppercase tracking-wide mb-2"># Top Hashtags</h3>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.recommended_hashtags?.slice(0, 10).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best Times */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm text-blue-400 uppercase tracking-wide mb-2">⏰ Best Times</h3>
                        <div className="space-y-1">
                          {recommendations.best_posting_times?.map((time, i) => (
                            <div key={i} className="text-white text-sm">{time}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm text-green-400 uppercase tracking-wide mb-2">🎨 Best Style</h3>
                        <div className="text-white text-sm">{recommendations.best_visual_style}</div>
                        <div className="text-gray-400 text-xs mt-1">{recommendations.best_caption_style}</div>
                      </div>
                    </div>

                    {/* Analysis Notes */}
                    {recommendations.analysis_notes && (
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm">{recommendations.analysis_notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recommendations yet. Run AI analysis to generate.</p>
                  </div>
                )}
              </div>

              {/* Top Performing Campaigns */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-6">🏆 Top Performing Content</h2>

                {metrics.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {metrics
                      .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
                      .slice(0, 10)
                      .map((metric, i) => (
                        <div
                          key={metric.id}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg ${
                                metric.platform === "instagram" ? "text-pink-400" :
                                metric.platform === "tiktok" ? "text-cyan-400" :
                                metric.platform === "facebook" ? "text-blue-400" :
                                "text-red-400"
                              }`}>
                                {metric.platform === "instagram" ? "📸" :
                                 metric.platform === "tiktok" ? "🎵" :
                                 metric.platform === "facebook" ? "👥" : "▶️"}
                              </span>
                              <span className="text-xs text-gray-400">{metric.platform}</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                              {((metric.engagement_rate || 0) * 100).toFixed(2)}% eng
                            </span>
                          </div>

                          {metric.social_posts?.hook && (
                            <p className="text-white text-sm font-medium mb-2">
                              "{metric.social_posts.hook}"
                            </p>
                          )}

                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>👁️ {formatNumber(metric.views)}</span>
                            <span>❤️ {metric.likes}</span>
                            <span>💬 {metric.comments}</span>
                            <span>🔄 {metric.shares}</span>
                            {metric.bookings > 0 && (
                              <span className="text-green-400">📅 {metric.bookings} bookings</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-gray-400 mb-2">No campaign data yet</p>
                    <p className="text-gray-500 text-sm">
                      Publish campaigns and the system will track performance automatically
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">📈 Conversion Funnel</h2>
              <div className="flex items-center justify-between">
                {[
                  { label: "Views", value: summary?.totalViews || 0, color: "blue" },
                  { label: "Engagement", value: summary?.totalEngagement || 0, color: "purple" },
                  { label: "Profile Visits", value: Math.round((summary?.totalViews || 0) * 0.05), color: "pink" },
                  { label: "Link Clicks", value: Math.round((summary?.totalViews || 0) * 0.02), color: "orange" },
                  { label: "Bookings", value: summary?.totalBookings || 0, color: "green" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-${step.color}-400`}>
                        {formatNumber(step.value)}
                      </div>
                      <div className="text-xs text-gray-400">{step.label}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="mx-4 text-gray-600">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
