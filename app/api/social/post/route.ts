// ============================================================
// POST /api/social/post — Publish now or schedule for later
// Body: { message, link?, imageUrl?, channels, scheduledAt? (ISO) }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { postToChannels, type SocialChannel } from "@/lib/hgos/social-posting";

const ALLOWED_CHANNELS: SocialChannel[] = ["facebook", "instagram", "google"];
const MIN_SCHEDULE_MINUTES = 1;
const MAX_SCHEDULE_DAYS = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, link, imageUrl, channels: rawChannels, scheduledAt: rawScheduledAt } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const channels = Array.isArray(rawChannels)
      ? (rawChannels as string[]).filter((c): c is SocialChannel => ALLOWED_CHANNELS.includes(c as SocialChannel))
      : [];

    if (channels.length === 0) {
      return NextResponse.json(
        { error: "At least one channel required: facebook, instagram, or google" },
        { status: 400 }
      );
    }

    const input = {
      message: message.trim(),
      link: link?.trim() || undefined,
      imageUrl: imageUrl?.trim() || undefined,
    };

    const scheduledAt = typeof rawScheduledAt === "string" && rawScheduledAt.trim() ? rawScheduledAt.trim() : null;
    if (scheduledAt) {
      const at = new Date(scheduledAt);
      if (Number.isNaN(at.getTime())) {
        return NextResponse.json({ error: "scheduledAt must be a valid ISO date/time" }, { status: 400 });
      }
      const now = new Date();
      const minTime = new Date(now.getTime() + MIN_SCHEDULE_MINUTES * 60 * 1000);
      const maxTime = new Date(now.getTime() + MAX_SCHEDULE_DAYS * 24 * 60 * 60 * 1000);
      if (at < minTime) {
        return NextResponse.json(
          { error: `Schedule time must be at least ${MIN_SCHEDULE_MINUTES} minute(s) from now` },
          { status: 400 }
        );
      }
      if (at > maxTime) {
        return NextResponse.json(
          { error: `Schedule time must be within ${MAX_SCHEDULE_DAYS} days` },
          { status: 400 }
        );
      }
      const supabase = createAdminSupabaseClient();
      if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
      }
      const { data: row, error } = await supabase
        .from("scheduled_social_posts")
        .insert({
          message: input.message,
          link: input.link ?? null,
          image_url: input.imageUrl ?? null,
          channels,
          scheduled_at: at.toISOString(),
          status: "pending",
        })
        .select("id, scheduled_at")
        .single();
      if (error) {
        console.error("[social/post] schedule insert", error);
        return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        scheduled: true,
        id: row.id,
        scheduledAt: row.scheduled_at,
      });
    }

    const results = await postToChannels(input, channels);
    return NextResponse.json({ success: true, results });
  } catch (e) {
    console.error("[social/post]", e);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}
