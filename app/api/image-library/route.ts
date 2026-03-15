import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ images: [] });
    }

    let query = supabase
      .from("image_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.log("image_library query error (returning empty):", error.code, error.message);
      return NextResponse.json({ images: [] });
    }

    return NextResponse.json({ images: data || [] });
  } catch (error) {
    console.error("Image library GET error:", error);
    return NextResponse.json({ images: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, category, tags, source, width, height, file_size } = body;

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("image_library")
      .insert({
        name,
        url,
        category: category || "general",
        tags: tags || [],
        source: source || "upload",
        width,
        height,
        file_size,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving image:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ image: data });
  } catch (error) {
    console.error("Image library POST error:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("image_library")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting image:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Image library DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, tags, is_favorite } = body;

    if (!id) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (is_favorite !== undefined) updateData.is_favorite = is_favorite;

    const { data, error } = await supabase
      .from("image_library")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating image:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ image: data });
  } catch (error) {
    console.error("Image library PATCH error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}
