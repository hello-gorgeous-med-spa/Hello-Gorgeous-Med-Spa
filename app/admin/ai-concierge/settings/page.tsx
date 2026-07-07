"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

const RING_FIRST_DEFAULT_TIMEOUT_SECONDS = 20;
const RING_FIRST_MIN_TIMEOUT = 5;
const RING_FIRST_MAX_TIMEOUT = 60;

export default function AiConciergeSettingsPage() {
  const [transfer, setTransfer] = useState("+16308813398");
  const [greeting, setGreeting] = useState(
    "Hello! Thank you for calling Hello Gorgeous Med Spa. This is Sarah. How can I help you today?",
  );
  const [ringFirstEnabled, setRingFirstEnabled] = useState(true);
  const [ringFirstTimeout, setRingFirstTimeout] = useState<number>(
    RING_FIRST_DEFAULT_TIMEOUT_SECONDS,
  );
  const [ringFirstNumber, setRingFirstNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("ai_concierge_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["transfer_e164", "greeting", "ring_first"]);
      const rows = data ?? [];
      for (const row of rows as { setting_key: string; setting_value: Record<string, unknown> }[]) {
        if (row.setting_key === "transfer_e164" && typeof row.setting_value.number === "string") {
          setTransfer(row.setting_value.number);
        }
        if (row.setting_key === "greeting" && typeof row.setting_value.text === "string") {
          setGreeting(row.setting_value.text);
        }
        if (row.setting_key === "ring_first") {
          const v = row.setting_value as {
            enabled?: unknown;
            timeout?: unknown;
            timeout_seconds?: unknown;
            number?: unknown;
          };
          if (typeof v.enabled === "boolean") setRingFirstEnabled(v.enabled);
          const t =
            typeof v.timeout === "number"
              ? v.timeout
              : typeof v.timeout_seconds === "number"
                ? v.timeout_seconds
                : null;
          if (t != null) setRingFirstTimeout(t);
          if (typeof v.number === "string") setRingFirstNumber(v.number);
        }
      }
      setLoading(false);
    })();
  }, []);

  function clampTimeout(n: number): number {
    if (!Number.isFinite(n)) return RING_FIRST_DEFAULT_TIMEOUT_SECONDS;
    return Math.min(Math.max(Math.round(n), RING_FIRST_MIN_TIMEOUT), RING_FIRST_MAX_TIMEOUT);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await supabase.from("ai_concierge_settings").upsert(
      { setting_key: "transfer_e164", setting_value: { number: transfer.trim() } },
      { onConflict: "setting_key" },
    );
    await supabase.from("ai_concierge_settings").upsert(
      { setting_key: "greeting", setting_value: { text: greeting.trim() } },
      { onConflict: "setting_key" },
    );
    await supabase.from("ai_concierge_settings").upsert(
      {
        setting_key: "ring_first",
        setting_value: {
          enabled: ringFirstEnabled,
          timeout: clampTimeout(ringFirstTimeout),
          number: ringFirstNumber.trim() || null,
        },
      },
      { onConflict: "setting_key" },
    );
    setSaved(true);
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Settings</h2>
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <strong>Sarah / Twilio voice is retired.</strong> Main line uses Comcast voicemail with Michelle at
        the front desk. These settings apply only if you re-enable{" "}
        <code className="bg-black/5 px-1 rounded">AI_CONCIERGE_VOICE_ENABLED=true</code> in Vercel and point
        a Twilio number at this webhook again.
      </div>
      <p className="text-sm text-black/70 mb-4">
        When voice is enabled, values are read live by Twilio routes — no redeploy needed.
      </p>
      {loading ? (
        <p className="text-sm">Loading…</p>
      ) : (
        <form onSubmit={save} className="max-w-xl space-y-6">
          <fieldset className="border border-black/10 rounded-lg p-4">
            <legend className="text-sm font-semibold px-1">Ring-first (Pattern B)</legend>
            <p className="text-xs text-black/70 mb-3">
              When a call comes in, Twilio rings the staff cell first. If no-one picks up within the timeout (busy / no-answer / failed),
              Sarah greets the caller and continues with booking + questions. Disable to have Sarah answer immediately on ring 1.
            </p>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={ringFirstEnabled}
                onChange={(e) => setRingFirstEnabled(e.target.checked)}
              />
              <span className="text-sm">Ring staff first, fall back to Sarah on no-answer</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium">Timeout (seconds)</span>
                <input
                  type="number"
                  min={RING_FIRST_MIN_TIMEOUT}
                  max={RING_FIRST_MAX_TIMEOUT}
                  className="mt-1 w-full border border-black/15 rounded px-2 py-1 text-sm font-mono disabled:bg-black/5"
                  value={ringFirstTimeout}
                  onChange={(e) => setRingFirstTimeout(Number(e.target.value))}
                  disabled={!ringFirstEnabled}
                />
                <span className="text-[10px] text-black/50">
                  {RING_FIRST_MIN_TIMEOUT}–{RING_FIRST_MAX_TIMEOUT}s. ~20s ≈ 4 rings.
                </span>
              </label>
              <label className="block">
                <span className="text-xs font-medium">Override ring number (optional)</span>
                <input
                  type="tel"
                  placeholder="Defaults to transfer number below"
                  className="mt-1 w-full border border-black/15 rounded px-2 py-1 text-sm font-mono disabled:bg-black/5"
                  value={ringFirstNumber}
                  onChange={(e) => setRingFirstNumber(e.target.value)}
                  disabled={!ringFirstEnabled}
                />
                <span className="text-[10px] text-black/50">E.164 (e.g. +16308813398).</span>
              </label>
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-medium">Transfer line (E.164)</span>
            <input
              className="mt-1 w-full border border-black/15 rounded px-2 py-1 text-sm font-mono"
              value={transfer}
              onChange={(e) => setTransfer(e.target.value)}
            />
            <span className="text-[10px] text-black/50">
              Used by Sarah when she escalates to a human, and as the default ring-first target if you didn&apos;t override above.
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Greeting (planned)</span>
            <textarea
              className="mt-1 w-full border border-black/15 rounded px-2 py-1 text-sm min-h-[90px]"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
            />
          </label>
          <button type="submit" className="px-3 py-1.5 rounded bg-black text-white text-sm">
            Save
          </button>
          {saved && <span className="text-sm text-green-700 ml-2">Saved</span>}
        </form>
      )}
    </>
  );
}
