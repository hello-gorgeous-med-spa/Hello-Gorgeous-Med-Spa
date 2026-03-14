import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("video_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty array
      if (error.code === "42P01") {
        console.log("video_library table not found, returning empty array");
        return NextResponse.json({ videos: [] });
      }
      console.error("Error fetching video library:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ videos: data || [] });
  } catch (error) {
    console.error("Video library GET error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, service, format, url, caption, thumbnail_url, duration, file_size } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("video_library")
      .insert({
        name,
        service,
        format,
        url,
        caption,
        thumbnail_url,
        duration,
        file_size,
        status: "completed",
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving video:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ video: data });
  } catch (error) {
    console.error("Video library POST error:", error);
    return NextResponse.json({ error: "Failed to save video" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("video_library")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting video:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video library DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
