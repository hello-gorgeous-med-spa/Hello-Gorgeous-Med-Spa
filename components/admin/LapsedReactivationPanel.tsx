"use client";

import { useCallback, useEffect, useState } from "react";

type Preview = {
  connected: boolean;
  totalLapsed: number;
  eligibleAfterCooldown: number;
  error?: string;
};

type BlastResult = {
  ok: boolean;
  dryRun: boolean;
  totalLapsed: number;
  eligibleAfterCooldown: number;
  contacted: number;
  smsSuccess: number;
  smsFailed: number;
  errors: string[];
};

export function LapsedReactivationPanel() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [dryRunning, setDryRunning] = useState(false);
  const [result, setResult] = useState<BlastResult | null>(null);
  const [error, setError] = useState("");

  const loadPreview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/local-dominance/lapsed-blast");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setPreview(json.preview ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  async function runBlast(dryRun: boolean) {
    if (dryRun) setDryRunning(true);
    else setSending(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/local-dominance/lapsed-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun, maxBatch: 50 }),
      });
      const json = (await res.json()) as BlastResult & { error?: string };
      if (!res.ok && !json.contacted) throw new Error(json.error || json.errors?.[0] || "Blast failed");
      setResult(json);
      if (!dryRun) void loadPreview();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Blast failed");
    } finally {
      setSending(false);
      setDryRunning(false);
    }
  }

  return (
    <section className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
      <h3 className="text-lg font-black text-black">Lapsed client reactivation · one-click SMS</h3>
      <p className="mt-1 text-sm text-black/65">
        Square segment &quot;HG Lapsed (90+ Days)&quot; · RX-focused message (GLP-1 from $249/mo · peptide consult $49
        · free guides). Max 50/batch · 30-day cooldown per contact.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-black/50">Loading lapsed counts…</p>
      ) : preview?.error ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {preview.error}. Sync segments at{" "}
          <a href="/admin/marketing/square-segments" className="font-semibold underline">
            Square segments
          </a>
          .
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatBox label="Lapsed w/ phone" value={preview?.totalLapsed ?? 0} />
          <StatBox label="Eligible now" value={preview?.eligibleAfterCooldown ?? 0} highlight />
          <StatBox label="Batch limit" value={50} suffix="/ send" />
        </div>
      )}

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      ) : null}

      {result ? (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
          {result.dryRun ? "Preview" : "Sent"}: {result.smsSuccess} SMS
          {result.dryRun ? " would send" : " delivered"} · {result.contacted} contacted
          {result.smsFailed ? ` · ${result.smsFailed} failed` : ""}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={dryRunning || loading || !preview?.eligibleAfterCooldown}
          onClick={() => void runBlast(true)}
          className="rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-50"
        >
          {dryRunning ? "Previewing…" : "Preview blast (dry run)"}
        </button>
        <button
          type="button"
          disabled={sending || loading || !preview?.eligibleAfterCooldown}
          onClick={() => {
            if (
              !window.confirm(
                `Send up to 50 lapsed-client SMS now? (${preview?.eligibleAfterCooldown ?? 0} eligible)`,
              )
            ) {
              return;
            }
            void runBlast(false);
          }}
          className="rounded-lg bg-[#E6007E] px-4 py-2 text-sm font-bold text-white hover:bg-[#c9006e] disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send reactivation blast →"}
        </button>
        <button
          type="button"
          onClick={() => void loadPreview()}
          className="rounded-lg border border-black/20 px-3 py-2 text-xs font-semibold hover:bg-white"
        >
          Refresh
        </button>
      </div>
    </section>
  );
}

function StatBox({
  label,
  value,
  suffix,
  highlight,
}: {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border p-3 ${highlight ? "border-[#E6007E] bg-white" : "border-black/15 bg-white/80"}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-black/55">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#E6007E]">
        {value.toLocaleString()}
        {suffix ? <span className="text-sm font-semibold text-black/50">{suffix}</span> : null}
      </p>
    </article>
  );
}
