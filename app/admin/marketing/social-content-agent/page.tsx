"use client";

// ============================================================
// Social Content Agent — preset library + week queue for FB / etc.
// Uses same /api/social/post as "Post to Social" + sessionStorage handoff.
// ============================================================

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FACEBOOK_PAGE_PRESETS,
  SUGGESTED_WEEK_PRESET_IDS,
  getFacebookPagePresetById,
  presetToDraft,
  type FacebookPagePreset,
} from "@/lib/facebook-page-presets";

const STORAGE_KEY = "hgSocialPresetDraft";

export default function SocialContentAgentPage() {
  const router = useRouter();
  const [queueBusy, setQueueBusy] = useState(false);
  const [queueLog, setQueueLog] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [postTime, setPostTime] = useState("10:00");

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : "https://www.hellogorgeousmedspa.com"),
    [],
  );

  const openInComposer = useCallback(
    (preset: FacebookPagePreset) => {
      const draft = presetToDraft(preset, origin);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      router.push("/admin/marketing/post-social");
    },
    [origin, router],
  );

  const queueSuggestedWeek = useCallback(async () => {
    setQueueBusy(true);
    setQueueLog([]);
    const log: string[] = [];
    const start = new Date(`${startDate}T${postTime}:00`);
    if (Number.isNaN(start.getTime())) {
      setQueueLog(["Invalid start date/time."]);
      setQueueBusy(false);
      return;
    }
    const minAhead = new Date(Date.now() + 60_000);
    if (start.getTime() < minAhead.getTime()) {
      setQueueLog(["Choose a start date and time at least 1–2 minutes from now (server checks scheduled posts)."]);
      setQueueBusy(false);
      return;
    }
    let dayOffset = 0;
    for (const id of SUGGESTED_WEEK_PRESET_IDS) {
      const preset = getFacebookPagePresetById(id);
      if (!preset) continue;
      const when = new Date(start);
      when.setDate(when.getDate() + dayOffset);
      const draft = presetToDraft(preset, origin);
      const body = {
        message: draft.message,
        link: draft.link || undefined,
        imageUrl: draft.imageUrl || undefined,
        channels: draft.channels,
        scheduledAt: when.toISOString(),
      };
      try {
        const res = await fetch("/api/social/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as { scheduled?: boolean; error?: string; id?: string };
        if (data.scheduled && data.id) {
          log.push(
            `✓ ${preset.label} → ${when.toLocaleString()} (scheduled)`,
          );
        } else {
          log.push(`✗ ${preset.label}: ${data.error || res.statusText}`);
        }
      } catch (e) {
        log.push(`✗ ${preset.label}: ${e instanceof Error ? e.message : String(e)}`);
      }
      dayOffset += 1;
    }
    setQueueLog(log);
    setQueueBusy(false);
  }, [origin, startDate, postTime]);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/marketing" className="text-pink-600 hover:underline text-sm">
          ← Marketing
        </Link>
        <h1 className="text-2xl font-bold text-black mt-4 mb-2">Social Content Agent</h1>
        <p className="text-black/80 mb-6 max-w-2xl">
          Your Meta Graph credentials already power{" "}
          <Link href="/admin/marketing/post-social" className="text-pink-600 font-semibold underline">
            Post to Social
          </Link>
          . This agent gives you <strong>one-click presets</strong> (copy + link + image) and an optional{" "}
          <strong>7-day queue</strong> so great content goes out even when you&apos;re slammed.
        </p>

        <div className="rounded-xl border-2 border-black bg-white p-5 mb-8 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
          <h2 className="font-bold text-black mb-2">Queue a suggested week (Facebook)</h2>
          <p className="text-sm text-black/70 mb-4">
            Schedules <strong>{SUGGESTED_WEEK_PRESET_IDS.length}</strong> posts — one per day — starting on the date you pick.
            Cron publishes within ~15 minutes of each time. Requires Supabase +{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">CRON_SECRET</code> on Vercel (same as your existing scheduled posts).
          </p>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-black/70 mb-1">First post day</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black/70 mb-1">Local post time</label>
              <input
                type="time"
                value={postTime}
                onChange={(e) => setPostTime(e.target.value)}
                className="border rounded-lg px-3 py-2 text-black"
              />
            </div>
            <button
              type="button"
              disabled={queueBusy}
              onClick={() => void queueSuggestedWeek()}
              className="px-5 py-2.5 rounded-lg bg-[#E6007E] text-white font-semibold hover:bg-[#c9006e] disabled:opacity-50"
            >
              {queueBusy ? "Scheduling…" : "Schedule 7-day sequence"}
            </button>
          </div>
          {queueLog.length > 0 && (
            <ul className="text-sm space-y-1 font-mono bg-gray-50 rounded-lg p-3 border border-gray-200">
              {queueLog.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}
        </div>

        <h2 className="text-lg font-bold text-black mb-3">Preset library</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FACEBOOK_PAGE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col shadow-sm hover:border-[#E6007E]/40 transition-colors"
            >
              <div className="font-semibold text-black">{preset.label}</div>
              <p className="text-sm text-black/65 mt-1 flex-1">{preset.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openInComposer(preset)}
                  className="text-sm px-3 py-2 rounded-lg bg-[#2D63A4] text-white font-medium hover:bg-[#234a7a]"
                >
                  Edit & post…
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(preset.message);
                  }}
                  className="text-sm px-3 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50"
                >
                  Copy text
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-black/55 mt-8 max-w-2xl">
          This is not autonomous AI — it&apos;s your approved copy, queued safely through your own API.{" "}
          <strong>Hands-off option:</strong> on Vercel set{" "}
          <code className="bg-gray-100 px-1">SOCIAL_AUTO_QUEUE_ENABLED=true</code> so Sunday cron runs{" "}
          <code className="bg-gray-100 px-1">/api/cron/queue-suggested-week</code> (same 7-day preset sequence). Requires{" "}
          <code className="bg-gray-100 px-1">CRON_SECRET</code>, Supabase, and publish cron — see{" "}
          <code className="bg-gray-100 px-1">docs/SOCIAL_POSTING_SETUP.md</code> in the repo. For Instagram, add{" "}
          <code className="bg-gray-100 px-1">META_INSTAGRAM_BUSINESS_ACCOUNT_ID</code> and remember IG requires an image URL for
          feed posts.
        </p>
      </div>
    </div>
  );
}
