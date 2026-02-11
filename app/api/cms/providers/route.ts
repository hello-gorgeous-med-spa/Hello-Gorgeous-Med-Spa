"use server";

import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export const dynamic = "force-dynamic";

const providerSelect = `
  id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  title,
  slug,
  display_name,
  tagline,
  headshot_url,
  hero_image_url,
  short_bio,
  philosophy,
  intro_video_url,
  booking_url,
  credentials,
  color_hex,
  is_active,
  schema_meta,
  created_at,
  updated_at
`;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sanitizeProviderPayload(body: Record<string, any>) {
  const allowed: Record<string, any> = {};
  const fields = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "title",
    "display_name",
    "tagline",
    "headshot_url",
    "hero_image_url",
    "short_bio",
    "philosophy",
    "intro_video_url",
    "booking_url",
    "credentials",
    "color_hex",
    "is_active",
    "schema_meta",
  ];

  for (const field of fields) {
    if (body[field] !== undefined) {
      allowed[field] = body[field];
    }
  }

  if (body.slug) {
    allowed.slug = slugify(body.slug);
  } else if (body.display_name) {
    allowed.slug = slugify(body.display_name);
  }

  return allowed;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ providers: [] });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const activeOnly = searchParams.get("active") === "true";

    let query = supabase.from("providers").select(providerSelect);

    if (id) {
      query = query.eq("id", id).limit(1).single();
    } else if (slug) {
      query = query.eq("slug", slug).limit(1).single();
    } else {
      query = query.order("display_name", { ascending: true });
      if (activeOnly) {
        query = query.eq("is_active", true);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Providers CMS GET error:", error);
      return NextResponse.json({ providers: id || slug ? null : [] });
    }

    if (id || slug) {
      return NextResponse.json({ provider: data });
    }

    const providers = data || [];
    const providerIds = providers.map((p: any) => p.id);

    let mediaCounts: Record<string, { videos: number; results: number }> = {};

    if (providerIds.length > 0) {
      const { data: counts } = await supabase
        .from("provider_media")
        .select("provider_id, media_type", { count: "exact", head: false })
        .in("provider_id", providerIds)
        .eq("status", "published");

      mediaCounts = (counts || []).reduce((acc: Record<string, { videos: number; results: number }>, item: any) => {
        if (!acc[item.provider_id]) {
          acc[item.provider_id] = { videos: 0, results: 0 };
        }
        if (item.media_type === "video") {
          acc[item.provider_id].videos += 1;
        } else if (item.media_type === "before_after") {
          acc[item.provider_id].results += 1;
        }
        return acc;
      }, {});
    }

    const hydrated = providers.map((provider: any) => ({
      ...provider,
      media_counts: mediaCounts[provider.id] || { videos: 0, results: 0 },
    }));

    return NextResponse.json({ providers: hydrated });
  } catch (error) {
    console.error("Providers CMS GET exception:", error);
    return NextResponse.json({ providers: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();

    if (!body.display_name) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }

    const payload = sanitizeProviderPayload(body);
    if (!payload.slug) {
      payload.slug = slugify(body.display_name);
    }
    payload.is_active = body.is_active ?? true;
    payload.color_hex = body.color_hex || "#ec4899";
    payload.schema_meta = payload.schema_meta || {};

    const { data, error } = await supabase.from("providers").insert(payload).select(providerSelect).single();

    if (error) throw error;

    return NextResponse.json({ success: true, provider: data });
  } catch (error) {
    console.error("Providers CMS POST error:", error);
    return NextResponse.json({ error: "Failed to create provider" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Provider id is required" }, { status: 400 });
    }

    const payload = sanitizeProviderPayload(body);

    if (payload.slug) {
      const { data: duplicate } = await supabase
        .from("providers")
        .select("id")
        .eq("slug", payload.slug)
        .neq("id", id)
        .maybeSingle();

      if (duplicate) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
    }

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("providers")
      .update(payload)
      .eq("id", id)
      .select(providerSelect)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, provider: data });
  } catch (error) {
    console.error("Providers CMS PUT error:", error);
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Provider id required" }, { status: 400 });
    }

    const { error } = await supabase.from("providers").update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Providers CMS DELETE error:", error);
    return NextResponse.json({ error: "Failed to deactivate provider" }, { status: 500 });
  }
}
