"use server";

import { NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import { PROVIDER_FALLBACKS, PROVIDER_MEDIA_FALLBACK } from "@/lib/providers/fallback";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { slug: string };
};

const providerSelect = `
  id,
  slug,
  display_name,
  first_name,
  last_name,
  credentials,
  tagline,
  short_bio,
  philosophy,
  headshot_url,
  hero_image_url,
  intro_video_url,
  booking_url,
  color_hex,
  is_active
`;

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
  published_at
`;

export async function GET(request: NextRequest, context: RouteContext) {
  const slug = context.params?.slug?.toLowerCase();
  if (!slug) {
    return NextResponse.json({ error: "Missing provider" }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(fallbackResponse(slug));
    }

    const { data: provider } = await supabase
      .from("providers")
      .select(providerSelect)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!provider) {
      const fallback = fallbackResponse(slug);
      if (!fallback.provider) {
        return NextResponse.json({ provider: null }, { status: 404 });
      }
      return NextResponse.json(fallback);
    }

    const { data: media } = await supabase
      .from("provider_media")
      .select(mediaSelect)
      .eq("provider_id", provider.id)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    const videos = (media || []).filter((item) => item.media_type === "video");
    const results = (media || []).filter((item) => item.media_type === "before_after" && item.consent_confirmed);

    return NextResponse.json({
      provider,
      videos,
      results,
    });
  } catch (error) {
    console.error("Provider media public GET error:", error);
    const fallback = fallbackResponse(slug);
    if (!fallback.provider) {
      return NextResponse.json({ provider: null }, { status: 500 });
    }
    return NextResponse.json(fallback);
  }
}

function fallbackResponse(slug: string) {
  const provider = Object.values(PROVIDER_FALLBACKS).find((p) => p.slug === slug) || null;
  const media = PROVIDER_MEDIA_FALLBACK[slug] || [];
  if (!provider) {
    return { provider: null, videos: [], results: [] };
  }
  const videos = media.filter((m) => m.media_type === "video");
  const results = media.filter((m) => m.media_type === "before_after");
  return {
    provider: {
      id: provider.id,
      slug: provider.slug,
      display_name: provider.display_name,
      first_name: provider.first_name,
      last_name: provider.last_name,
      credentials: provider.credentials,
      tagline: provider.tagline,
      short_bio: provider.short_bio,
      philosophy: provider.philosophy,
      headshot_url: provider.headshot_url,
      hero_image_url: provider.hero_image_url,
      intro_video_url: provider.intro_video_url,
      booking_url: provider.booking_url,
      color_hex: provider.color_hex,
      is_active: true,
    },
    videos,
    results,
  };
}
