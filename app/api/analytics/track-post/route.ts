import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface TrackPostRequest {
  campaignId?: string;
  platform: "instagram" | "facebook" | "tiktok" | "youtube";
  postId?: string;
  postUrl?: string;
  caption?: string;
  hook?: string;
  visualStyle?: string;
  hashtags?: string[];
  service?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackPostRequest = await request.json();
    const { campaignId, platform, postId, postUrl, caption, hook, visualStyle, hashtags, service } = body;

    if (!platform) {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("social_posts")
      .insert({
        campaign_id: campaignId,
        platform,
        post_id: postId,
        post_url: postUrl,
        caption,
        hook,
        visual_style: visualStyle,
        hashtags: hashtags || [],
        service,
        posted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error tracking post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    console.error("Track post error:", error);
    return NextResponse.json({ error: "Failed to track post" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const platform = searchParams.get("platform");
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("social_posts")
      .select("*")
      .order("posted_at", { ascending: false })
      .limit(limit);

    if (campaignId) {
      query = query.eq("campaign_id", campaignId);
    }
    if (platform) {
      query = query.eq("platform", platform);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ posts: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
