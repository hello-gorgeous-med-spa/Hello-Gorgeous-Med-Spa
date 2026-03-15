import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface MetricsInput {
  campaignId?: string;
  socialPostId?: string;
  platform: string;
  postId?: string;
  views?: number;
  impressions?: number;
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  profileVisits?: number;
  linkClicks?: number;
  bookings?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: MetricsInput = await request.json();
    
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("campaign_metrics")
      .insert({
        campaign_id: body.campaignId,
        social_post_id: body.socialPostId,
        platform: body.platform,
        post_id: body.postId,
        views: body.views || 0,
        impressions: body.impressions || 0,
        reach: body.reach || 0,
        likes: body.likes || 0,
        comments: body.comments || 0,
        shares: body.shares || 0,
        saves: body.saves || 0,
        clicks: body.clicks || 0,
        profile_visits: body.profileVisits || 0,
        link_clicks: body.linkClicks || 0,
        bookings: body.bookings || 0,
        fetched_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing metrics:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, metrics: data });
  } catch (error) {
    console.error("Metrics POST error:", error);
    return NextResponse.json({ error: "Failed to store metrics" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const platform = searchParams.get("platform");
    const days = parseInt(searchParams.get("days") || "30");

    const supabase = await createServerSupabaseClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from("campaign_metrics")
      .select(`
        *,
        social_posts (
          hook,
          caption,
          visual_style,
          service,
          hashtags
        )
      `)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (campaignId) {
      query = query.eq("campaign_id", campaignId);
    }
    if (platform) {
      query = query.eq("platform", platform);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ metrics: [], summary: getEmptySummary() });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary stats
    const metrics = data || [];
    const summary = calculateSummary(metrics);

    return NextResponse.json({ metrics, summary });
  } catch (error) {
    console.error("Metrics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

function getEmptySummary() {
  return {
    totalViews: 0,
    totalEngagement: 0,
    totalBookings: 0,
    avgEngagementRate: 0,
    avgConversionRate: 0,
    topPerformingPlatform: null,
    totalPosts: 0,
  };
}

function calculateSummary(metrics: Array<{
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  bookings?: number;
  engagement_rate?: number;
  conversion_rate?: number;
  platform?: string;
}>) {
  if (metrics.length === 0) return getEmptySummary();

  const totalViews = metrics.reduce((sum, m) => sum + (m.views || 0), 0);
  const totalEngagement = metrics.reduce(
    (sum, m) => sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0) + (m.saves || 0),
    0
  );
  const totalBookings = metrics.reduce((sum, m) => sum + (m.bookings || 0), 0);
  const avgEngagementRate = metrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0) / metrics.length;
  const avgConversionRate = metrics.reduce((sum, m) => sum + (m.conversion_rate || 0), 0) / metrics.length;

  // Find top platform
  const platformStats: Record<string, number> = {};
  metrics.forEach((m) => {
    if (m.platform) {
      platformStats[m.platform] = (platformStats[m.platform] || 0) + (m.engagement_rate || 0);
    }
  });
  const topPerformingPlatform = Object.entries(platformStats).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalViews,
    totalEngagement,
    totalBookings,
    avgEngagementRate: Math.round(avgEngagementRate * 10000) / 100,
    avgConversionRate: Math.round(avgConversionRate * 10000) / 100,
    topPerformingPlatform,
    totalPosts: metrics.length,
  };
}
