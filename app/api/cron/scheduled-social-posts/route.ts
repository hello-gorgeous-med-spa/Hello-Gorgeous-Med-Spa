// ============================================================
// CRON: Publish scheduled social posts when scheduled_at <= now
// Runs every 15 min. Uses same credentials as immediate post.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { postToChannels, type SocialChannel } from "@/lib/hgos/social-posting";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data: due, error } = await supabase
    .from("scheduled_social_posts")
    .select("id, message, link, image_url, channels")
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true });

  if (error || !due?.length) {
    return NextResponse.json({ processed: 0, pending: due?.length ?? 0 });
  }

  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const row of due) {
    const channels = (row.channels || []) as SocialChannel[];
    if (channels.length === 0) {
      await supabase
        .from("scheduled_social_posts")
        .update({ status: "failed", error: "No channels" })
        .eq("id", row.id);
      results.push({ id: row.id, ok: false, error: "No channels" });
      continue;
    }
    try {
      const postResults = await postToChannels(
        {
          message: row.message,
          link: row.link ?? undefined,
          imageUrl: row.image_url ?? undefined,
        },
        channels
      );
      const anyOk = Object.values(postResults).some((r) => r?.ok);
      const anyErr = Object.entries(postResults)
        .filter(([, r]) => r && !r.ok && r.error)
        .map(([ch, r]) => `${ch}: ${r?.error}`)
        .join("; ");
      await supabase
        .from("scheduled_social_posts")
        .update({
          status: anyOk ? "sent" : "failed",
          results: postResults,
          error: anyErr || null,
        })
        .eq("id", row.id);
      results.push({ id: row.id, ok: anyOk, error: anyErr || undefined });
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      await supabase
        .from("scheduled_social_posts")
        .update({ status: "failed", error: err })
        .eq("id", row.id);
      results.push({ id: row.id, ok: false, error: err });
    }
  }

  return NextResponse.json({
    processed: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
