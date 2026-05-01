"use client";

import { useState } from "react";
import Link from "next/link";

type SegmentReport = {
  segment: string;
  groupId: string;
  desiredCount: number;
  added: number;
  removed: number;
  errors: string[];
};

type SyncResult = {
  ok: boolean;
  customersScanned?: number;
  segments?: SegmentReport[];
  generatedAt?: string;
  error?: string;
};

export default function SquareSegmentsPage() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  async function runSync() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/marketing/square-segments/sync", {
        method: "POST",
        cache: "no-store",
      });
      const data = (await res.json()) as SyncResult;
      setResult(data);
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : "Network error" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto text-black">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/marketing" className="text-black hover:underline">← Marketing</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">Square segments</span>
      </div>

      <h1 className="text-xl font-bold mb-1">Square Customer-Group sync</h1>
      <p className="text-sm text-black/70 mb-4">
        One-click rebuild of the auto-maintained Square Customer Groups. Use these as the audience for any campaign you create in <strong>Square Marketing</strong>.
        The sync only adds and removes members — it never deletes a group.
      </p>

      <section className="border border-black/10 rounded-lg p-4 bg-white mb-4">
        <h2 className="text-sm font-semibold mb-2">Segments this sync maintains</h2>
        <ul className="text-sm space-y-1 text-black/80">
          <li><strong>HG First-Time Clients</strong> — created in Square within the last 30 days. Welcome-flow audience.</li>
          <li><strong>HG Lapsed (90+ Days)</strong> — Square profile activity ≥ 90 days ago, ≤ 730 days. Win-back audience.</li>
          <li><strong>HG Birthday Month</strong> — birthday month equals the current month. Birthday-offer audience.</li>
          <li><strong>HG All Opt-In</strong> — every customer with email or phone on file. Newsletter / general blasts.</li>
        </ul>
        <p className="text-[11px] text-black/50 mt-3">
          Segment criteria live in <code className="bg-black/5 px-1 rounded">lib/marketing/square-segments.ts</code> — change there to refine.
          Run nightly later by hitting <code className="bg-black/5 px-1 rounded">POST /api/marketing/square-segments/sync</code> from a cron.
        </p>
      </section>

      <button
        type="button"
        onClick={runSync}
        disabled={running}
        className="px-4 py-2 rounded bg-[#E6007E] text-white text-sm font-medium disabled:opacity-50 hover:bg-[#c00069]"
      >
        {running ? "Running sync…" : "Run sync now"}
      </button>

      {result && (
        <section className="mt-6 border border-black/10 rounded-lg p-4 bg-white">
          {result.ok ? (
            <>
              <p className="text-sm mb-2">
                Scanned <strong>{result.customersScanned ?? 0}</strong> customers ·{" "}
                <span className="text-black/60 text-xs">
                  {result.generatedAt ? new Date(result.generatedAt).toLocaleString() : ""}
                </span>
              </p>
              <table className="w-full text-sm">
                <thead className="bg-black/5">
                  <tr>
                    <th className="text-left p-2">Segment</th>
                    <th className="text-left p-2">Members</th>
                    <th className="text-left p-2">Added</th>
                    <th className="text-left p-2">Removed</th>
                    <th className="text-left p-2">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.segments ?? []).map((s) => (
                    <tr key={s.segment} className="border-t border-black/5">
                      <td className="p-2 font-mono text-xs">{s.segment}</td>
                      <td className="p-2">{s.desiredCount}</td>
                      <td className="p-2 text-green-700">{s.added}</td>
                      <td className="p-2 text-amber-700">{s.removed}</td>
                      <td className="p-2 text-xs text-red-700">{s.errors.length || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="text-sm text-red-700">Failed: {result.error ?? "Unknown error"}</p>
          )}
        </section>
      )}
    </div>
  );
}
