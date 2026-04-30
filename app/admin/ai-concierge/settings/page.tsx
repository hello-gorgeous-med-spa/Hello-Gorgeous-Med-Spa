"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

export default function AiConciergeSettingsPage() {
  const [transfer, setTransfer] = useState("+16308813398");
  const [greeting, setGreeting] = useState(
    "Hello! Thank you for calling Hello Gorgeous Med Spa. This is Sarah. How can I help you today?",
  );
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("ai_concierge_settings").select("setting_key, setting_value").in("setting_key", ["transfer_e164", "greeting"]);
      const rows = data ?? [];
      for (const row of rows as { setting_key: string; setting_value: Record<string, unknown> }[]) {
        if (row.setting_key === "transfer_e164" && typeof row.setting_value.number === "string") {
          setTransfer(row.setting_value.number);
        }
        if (row.setting_key === "greeting" && typeof row.setting_value.text === "string") {
          setGreeting(row.setting_value.text);
        }
      }
      setLoading(false);
    })();
  }, []);

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
    setSaved(true);
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Settings</h2>
      <p className="text-sm text-black/70 mb-4">
        The transfer number is now live — Sarah&apos;s gather route reads <code className="bg-black/5 px-1 rounded text-xs">ai_concierge_settings.transfer_e164</code> first,
        then falls back to <code className="bg-black/5 px-1 rounded text-xs">AI_CONCIERGE_TRANSFER_E164</code>. The greeting is still informational
        (incoming TwiML uses Sarah&apos;s default until we wire greeting server-side).
      </p>
      {loading ? (
        <p className="text-sm">Loading…</p>
      ) : (
        <form onSubmit={save} className="max-w-xl space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Transfer line (E.164)</span>
            <input
              className="mt-1 w-full border border-black/15 rounded px-2 py-1 text-sm font-mono"
              value={transfer}
              onChange={(e) => setTransfer(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Greeting (planned)</span>
            <textarea className="mt-1 w-full border border-black/15 rounded px-2 py-1 text-sm min-h-[90px]" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
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
