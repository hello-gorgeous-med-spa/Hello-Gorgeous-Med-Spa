// ============================================================
// Queue 7-day Facebook preset sequence (America/Chicago 10:00)
// Used by /api/cron/queue-suggested-week + could be called from jobs.
// ============================================================

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { SITE } from "@/lib/seo";
import {
  SUGGESTED_WEEK_PRESET_IDS,
  getFacebookPagePresetById,
  presetToDraft,
} from "@/lib/facebook-page-presets";
import {
  businessDateTimeToUTC,
  BUSINESS_TIMEZONE,
  getBusinessDayOfWeek,
} from "@/lib/business-timezone";

function addCalendarDays(ymd: string, n: number): string {
  const noon = businessDateTimeToUTC(ymd, 12, 0);
  const next = new Date(noon.getTime() + n * 24 * 60 * 60 * 1000);
  return next.toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });
}

/**
 * First Monday 10:00 (Chicago) at least ~1 minute after `ref`, and its YYYY-MM-DD.
 */
export function findNextWeekSequenceStart(
  ref: Date = new Date()
): { mondayYmd: string; firstPostAt: Date } {
  const startYmd = ref.toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });
  for (let i = 0; i < 21; i++) {
    const ymd = addCalendarDays(startYmd, i);
    if (getBusinessDayOfWeek(ymd) !== 1) continue;
    const instant = businessDateTimeToUTC(ymd, 10, 0);
    if (instant.getTime() > ref.getTime() + 60_000) {
      return { mondayYmd: ymd, firstPostAt: instant };
    }
  }
  throw new Error("Could not find a valid Monday 10:00 America/Chicago in the next 3 weeks.");
}

export type QueueWeekResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  weekStart?: string;
  firstPostAt?: string;
  inserted?: { id: string; label: string; scheduledAt: string }[];
  errors?: string[];
};

/**
 * Inserts 7 `scheduled_social_posts` rows (same preset order as Social Content Agent).
 * Skips if 7+ pending posts already exist in the same 7-day window (unless force).
 */
export async function queueSuggestedWeekFromPresets(options: {
  /** Public site origin for absolute link + image URLs. Defaults to SITE.url. */
  origin?: string;
  /** Re-queue even if the week already has 7 pending posts. */
  force?: boolean;
  /** Optional override for first day (YYYY-MM-DD Chicago). Must be a Monday. */
  mondayYmdOverride?: string;
}): Promise<QueueWeekResult> {
  const origin = (options.origin ?? SITE.url).replace(/\/$/, "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { ok: false, reason: "Database not configured (SUPABASE_SERVICE_ROLE_KEY)" };
  }

  let mondayYmd: string;
  let firstPostAt: Date;

  if (options.mondayYmdOverride) {
    mondayYmd = options.mondayYmdOverride;
    if (getBusinessDayOfWeek(mondayYmd) !== 1) {
      return { ok: false, reason: "mondayYmdOverride must be a Monday in America/Chicago." };
    }
    firstPostAt = businessDateTimeToUTC(mondayYmd, 10, 0);
    if (firstPostAt.getTime() < Date.now() + 60_000) {
      return { ok: false, reason: "Override Monday 10:00 must be at least ~1 minute in the future." };
    }
  } else {
    const found = findNextWeekSequenceStart(new Date());
    mondayYmd = found.mondayYmd;
    firstPostAt = found.firstPostAt;
  }

  const rangeEndExclusive = businessDateTimeToUTC(addCalendarDays(mondayYmd, 7), 10, 0);

  if (!options.force) {
    const { count, error: cErr } = await supabase
      .from("scheduled_social_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .gte("scheduled_at", firstPostAt.toISOString())
      .lt("scheduled_at", rangeEndExclusive.toISOString());

    if (cErr) {
      return { ok: false, reason: cErr.message };
    }
    if ((count ?? 0) >= 7) {
      return {
        ok: true,
        skipped: true,
        reason: "Week already has 7+ pending posts in this window. Pass force=1 to queue anyway.",
        weekStart: mondayYmd,
        firstPostAt: firstPostAt.toISOString(),
      };
    }
  }

  const inserted: { id: string; label: string; scheduledAt: string }[] = [];
  const errors: string[] = [];

  for (let dayOffset = 0; dayOffset < SUGGESTED_WEEK_PRESET_IDS.length; dayOffset++) {
    const id = SUGGESTED_WEEK_PRESET_IDS[dayOffset];
    const preset = getFacebookPagePresetById(id);
    if (!preset) {
      errors.push(`Missing preset: ${id}`);
      continue;
    }
    const postDay = addCalendarDays(mondayYmd, dayOffset);
    const when = businessDateTimeToUTC(postDay, 10, 0);
    const draft = presetToDraft(preset, origin);

    const { data, error } = await supabase
      .from("scheduled_social_posts")
      .insert({
        message: draft.message,
        link: draft.link || null,
        image_url: draft.imageUrl || null,
        channels: draft.channels,
        scheduled_at: when.toISOString(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      errors.push(`${preset.label}: ${error.message}`);
    } else if (data) {
      inserted.push({
        id: data.id,
        label: preset.label,
        scheduledAt: when.toISOString(),
      });
    }
  }

  return {
    ok: errors.length === 0,
    weekStart: mondayYmd,
    firstPostAt: firstPostAt.toISOString(),
    inserted,
    errors: errors.length ? errors : undefined,
  };
}
