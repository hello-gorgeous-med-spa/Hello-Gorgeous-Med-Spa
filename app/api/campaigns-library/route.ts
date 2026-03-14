import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");
    
    const supabase = await createClient();
    
    let query = supabase
      .from("campaigns_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (service && service !== "all") {
      query = query.eq("service", service);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ campaigns: [] });
      }
      console.error("Error fetching campaigns:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (error) {
    console.error("Campaigns library GET error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      service,
      prompt,
      headline,
      subheadline,
      hooks,
      benefits,
      cta,
      instagram_caption,
      tiktok_caption,
      facebook_caption,
      hashtags,
      target_audience,
      tone,
      images,
      video_url,
      video_format,
    } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns_library")
      .insert({
        name: name || headline,
        service,
        prompt,
        headline,
        subheadline,
        hooks: hooks || [],
        benefits: benefits || [],
        cta,
        instagram_caption,
        tiktok_caption,
        facebook_caption,
        hashtags: hashtags || [],
        target_audience,
        tone,
        images: images || [],
        video_url,
        video_format,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving campaign:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaign: data });
  } catch (error) {
    console.error("Campaigns library POST error:", error);
    return NextResponse.json({ error: "Failed to save campaign" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_published, published_platforms } = body;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
    }

    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};
    if (is_published !== undefined) {
      updateData.is_published = is_published;
      updateData.published_at = is_published ? new Date().toISOString() : null;
    }
    if (published_platforms !== undefined) {
      updateData.published_platforms = published_platforms;
    }

    const { data, error } = await supabase
      .from("campaigns_library")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating campaign:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaign: data });
  } catch (error) {
    console.error("Campaigns library PATCH error:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("campaigns_library")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting campaign:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Campaigns library DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
