// ============================================================
// Move approved blog_social_posts → scheduled_social_posts
// so /api/cron/scheduled-social-posts can publish to Meta + Google.
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { SocialChannel } from '@/lib/hgos/social-posting';

export type PromoteBlogSocialResult = {
  inserted: number;
  errors: string[];
  scheduledIds: string[];
};

const VALID_CHANNELS: SocialChannel[] = ['facebook', 'instagram', 'google'];

function isSocialChannel(s: string): s is SocialChannel {
  return VALID_CHANNELS.includes(s as SocialChannel);
}

/**
 * Inserts one scheduled_social_posts row per approved blog_social_posts row
 * that has not yet been promoted (promoted_to_queue_at IS NULL).
 */
export async function promoteApprovedBlogSocialPostsToQueue(
  supabase: SupabaseClient
): Promise<PromoteBlogSocialResult> {
  const errors: string[] = [];
  const scheduledIds: string[] = [];

  const { data: rows, error: fetchErr } = await supabase
    .from('blog_social_posts')
    .select('id, message, link, image_url, channel, scheduled_at, status')
    .eq('status', 'approved')
    .is('promoted_to_queue_at', null);

  if (fetchErr) {
    return {
      inserted: 0,
      errors: [fetchErr.message],
      scheduledIds: [],
    };
  }

  if (!rows?.length) {
    return { inserted: 0, errors: [], scheduledIds: [] };
  }

  const now = Date.now();

  for (const row of rows) {
    if (!isSocialChannel(row.channel)) {
      errors.push(`Invalid channel on ${row.id}`);
      continue;
    }

    let scheduledAt = row.scheduled_at ? new Date(row.scheduled_at).toISOString() : new Date().toISOString();
    if (Number.isNaN(Date.parse(scheduledAt))) {
      scheduledAt = new Date().toISOString();
    }
    if (Date.parse(scheduledAt) > now + 365 * 24 * 60 * 60 * 1000) {
      scheduledAt = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    const channels: SocialChannel[] = [row.channel];

    const { data: inserted, error: insErr } = await supabase
      .from('scheduled_social_posts')
      .insert({
        message: row.message,
        link: row.link ?? null,
        image_url: row.image_url ?? null,
        channels,
        scheduled_at: scheduledAt,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insErr || !inserted?.id) {
      errors.push(insErr?.message || `Insert failed for blog_social_posts ${row.id}`);
      continue;
    }

    const { error: updErr } = await supabase
      .from('blog_social_posts')
      .update({ promoted_to_queue_at: new Date().toISOString() })
      .eq('id', row.id);

    if (updErr) {
      errors.push(`Queued ${inserted.id} but failed to mark promoted: ${updErr.message}`);
    }

    scheduledIds.push(inserted.id);
  }

  return { inserted: scheduledIds.length, errors, scheduledIds };
}
