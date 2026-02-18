import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const serviceTag = searchParams.get("service");
    
    const supabase = await createServerSupabaseClient();
    
    // Get provider ID
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    let query = supabase
      .from("provider_media")
      .select("*")
      .eq("provider_id", provider.id)
      .eq("status", "published")
      .eq("consent_confirmed", true);

    if (type) {
      query = query.eq("type", type);
    }
    if (serviceTag) {
      query = query.eq("service_tag", serviceTag);
    }

    const { data: media, error } = await query
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ media: media || [] });
  } catch (error: unknown) {
    console.error("Error fetching provider media:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerSupabaseClient();
    const body = await req.json();
    
    // Get provider ID
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // Validate consent for before_after
    if (body.type === "before_after" && body.status === "published" && !body.consent_confirmed) {
      return NextResponse.json(
        { error: "Consent must be confirmed before publishing before/after photos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("provider_media")
      .insert({
        ...body,
        provider_id: provider.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ media: data });
  } catch (error: unknown) {
    console.error("Error creating provider media:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create media" },
      { status: 500 }
    );
  }
}
