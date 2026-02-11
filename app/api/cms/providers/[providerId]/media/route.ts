"use server";

import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { generateProviderMediaAltText } from "@/lib/providers/media";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { providerId: string };
};

const mediaSelect = `
  id,
  provider_id,
  media_type,
  status,
  service_tag,
  title,
  description,
  video_url,
  before_image_url,
  after_image_url,
  thumbnail_url,
  alt_text,
  duration_seconds,
  width,
  height,
  tags,
  featured,
  consent_confirmed,
  watermark_enabled,
  sort_order,
  metadata,
  created_at,
  updated_at,
  published_at
`;

function requireProviderId(context: RouteContext) {
  const providerId = context.params?.providerId;
  if (!providerId) {
    throw new Error("Provider id required");
  }
  return providerId;
}

function validateMediaPayload(payload: {
  media_type: string;
  video_url?: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
}) {
  if (payload.media_type === "video" && !payload.video_url) {
    return "Video uploads require video_url";
  }
  if (payload.media_type === "before_after") {
    if (!payload.before_image_url || !payload.after_image_url) {
      return "Before/after uploads require both before_image_url and after_image_url";
    }
  }
  return null;
}

function enforceConsentRule({
  status,
  media_type,
  consent_confirmed,
}: {
  status?: string;
  media_type?: string;
  consent_confirmed?: boolean;
}) {
  if (status === "published" && media_type === "before_after" && consent_confirmed !== true) {
    return "Client consent must be confirmed before publishing before/after media.";
  }
  return null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const providerId = requireProviderId(context);
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ media: [] });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const mediaType = searchParams.get("type");
    const featured = searchParams.get("featured");
    const serviceTag = searchParams.get("service");

    let query = supabase.from("provider_media").select(mediaSelect).eq("provider_id", providerId).order("sort_order", { ascending: true }).order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (mediaType && mediaType !== "all") {
      query = query.eq("media_type", mediaType);
    }
    if (featured === "true") {
      query = query.eq("featured", true);
    }
    if (serviceTag && serviceTag !== "all") {
      query = query.eq("service_tag", serviceTag);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Provider media GET error:", error);
      return NextResponse.json({ media: [] });
    }

    return NextResponse.json({ media: data || [] });
  } catch (error) {
    console.error("Provider media GET exception:", error);
    return NextResponse.json({ media: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const providerId = requireProviderId(context);
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();

    if (!body.media_type) {
      return NextResponse.json({ error: "media_type is required" }, { status: 400 });
    }
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const provider = await supabase.from("providers").select("display_name").eq("id", providerId).single();
    if (provider.error || !provider.data) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const payload = {
      provider_id: providerId,
      media_type: body.media_type,
      status: body.status || "draft",
      service_tag: body.service_tag || "other",
      title: body.title,
      description: body.description || null,
      video_url: body.video_url || null,
      before_image_url: body.before_image_url || null,
      after_image_url: body.after_image_url || null,
      thumbnail_url: body.thumbnail_url || null,
      duration_seconds: body.duration_seconds ?? null,
      width: body.width ?? null,
      height: body.height ?? null,
      tags: body.tags || null,
      featured: body.featured ?? false,
      consent_confirmed: body.consent_confirmed ?? false,
      watermark_enabled: body.watermark_enabled ?? true,
      sort_order: body.sort_order ?? 0,
      metadata: body.metadata || {},
    };

    const validationError = validateMediaPayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    payload["alt_text"] =
      body.alt_text ||
      generateProviderMediaAltText({
        providerName: provider.data.display_name || "Hello Gorgeous Provider",
        serviceTag: payload.service_tag,
        headline: payload.title,
      });

    const consentError = enforceConsentRule({
      status: payload.status,
      media_type: payload.media_type,
      consent_confirmed: payload.consent_confirmed,
    });
    if (consentError) {
      return NextResponse.json({ error: consentError }, { status: 400 });
    }

    if (payload.status === "published") {
      (payload as any).published_at = new Date().toISOString();
    }

    const { data, error } = await supabase.from("provider_media").insert(payload).select(mediaSelect).single();

    if (error) throw error;

    return NextResponse.json({ success: true, media: data });
  } catch (error) {
    console.error("Provider media POST error:", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    requireProviderId(context); // ensure valid context
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Media id is required" }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase.from("provider_media").select(mediaSelect).eq("id", id).single();
    if (existingError || !existing) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const payload: Record<string, any> = {};
    const updatableFields = [
      "media_type",
      "status",
      "service_tag",
      "title",
      "description",
      "video_url",
      "before_image_url",
      "after_image_url",
      "thumbnail_url",
      "alt_text",
      "duration_seconds",
      "width",
      "height",
      "tags",
      "featured",
      "consent_confirmed",
      "watermark_enabled",
      "sort_order",
      "metadata",
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        payload[field] = body[field];
      }
    }

    const validationError = validateMediaPayload({
      media_type: payload.media_type || existing.media_type,
      video_url: payload.video_url ?? existing.video_url,
      before_image_url: payload.before_image_url ?? existing.before_image_url,
      after_image_url: payload.after_image_url ?? existing.after_image_url,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const consentError = enforceConsentRule({
      status: payload.status || existing.status,
      media_type: payload.media_type || existing.media_type,
      consent_confirmed: payload.consent_confirmed ?? existing.consent_confirmed,
    });
    if (consentError) {
      return NextResponse.json({ error: consentError }, { status: 400 });
    }

    if (!payload.alt_text && (payload.media_type || existing.media_type) === "before_after") {
      const providerName = body.provider_name || "Hello Gorgeous Provider";
      payload.alt_text = generateProviderMediaAltText({
        providerName,
        serviceTag: (payload.service_tag || existing.service_tag) as any,
        headline: payload.title || existing.title,
      });
    }

    if (payload.status === "published" && existing.status !== "published") {
      payload.published_at = new Date().toISOString();
    } else if (payload.status && payload.status !== "published" && existing.status === "published") {
      payload.published_at = null;
    }

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("provider_media").update(payload).eq("id", id).select(mediaSelect).single();

    if (error) throw error;

    return NextResponse.json({ success: true, media: data });
  } catch (error) {
    console.error("Provider media PUT error:", error);
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireProviderId(context);
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Media id required" }, { status: 400 });
    }

    const { error } = await supabase.from("provider_media").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Provider media DELETE error:", error);
    return NextResponse.json({ error: "Failed to archive media" }, { status: 500 });
  }
}
