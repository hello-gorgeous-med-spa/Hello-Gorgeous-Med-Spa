"use client";

import { useEffect, useState } from "react";

import type { RxWeightProgress } from "@/lib/rx-weight-log";

function MiniChart({ entries }: { entries: RxWeightProgress["entries"] }) {
  if (entries.length < 2) return null;

  const weights = entries.map((e) => e.weightLbs);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = Math.max(max - min, 5);
  const w = 280;
  const h = 72;
  const pad = 4;

  const points = entries
    .map((entry, i) => {
      const x = pad + (i / (entries.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (entry.weightLbs - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs h-16" aria-hidden>
      <polyline
        fill="none"
        stroke="#E6007E"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export function PortalRxWeightProgress() {
  const [data, setData] = useState<RxWeightProgress | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/portal/rx/weight");
    const json = (await res.json()) as RxWeightProgress & { error?: string };
    if (!res.ok) throw new Error(json.error || "Could not load weight progress");
    setData(json);
    if (json.goalWeightLbs != null) setGoalInput(String(json.goalWeightLbs));
  }

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Could not load"));
  }, []);

  async function saveWeight(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/rx/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weightLbs: Number(weightInput) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save");
      setData(json);
      setWeightInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/rx/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalWeightLbs: Number(goalInput) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save goal");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save goal");
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) {
    return null;
  }

  if (!data || data.entryCount === 0) {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Weight progress</p>
        <p className="mt-2 text-sm text-black/70">
          Log your weight to track progress — like Hims, but with your local NP team.
        </p>
        <form onSubmit={saveWeight} className="mt-4 flex flex-wrap gap-2 items-end">
          <label className="flex-1 min-w-[120px]">
            <span className="text-xs font-semibold text-black/60">Current weight (lbs)</span>
            <input
              type="number"
              step="0.1"
              min={50}
              max={800}
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-black px-3 py-2 text-sm"
              placeholder="185"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !weightInput}
            className="rounded-lg bg-[#E6007E] px-4 py-2.5 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
          >
            {busy ? "Saving…" : "Log weight"}
          </button>
        </form>
      </div>
    );
  }

  const changeLabel =
    data.changeLbs == null
      ? null
      : data.changeLbs <= 0
        ? `${Math.abs(data.changeLbs)} lbs lost`
        : `${data.changeLbs} lbs gained`;

  return (
    <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Weight progress</p>
          <p className="mt-1 text-3xl font-black text-black">
            {data.currentWeightLbs}
            <span className="text-lg font-bold text-black/50"> lbs</span>
          </p>
          {changeLabel && (
            <p className="text-sm font-semibold text-green-700 mt-1">{changeLabel} since start</p>
          )}
          {data.goalWeightLbs != null && (
            <p className="text-xs text-black/55 mt-1">Goal: {data.goalWeightLbs} lbs</p>
          )}
        </div>
        <MiniChart entries={data.entries} />
      </div>

      <form onSubmit={saveWeight} className="mt-4 flex flex-wrap gap-2 items-end border-t border-black/10 pt-4">
        <label className="flex-1 min-w-[120px]">
          <span className="text-xs font-semibold text-black/60">Log today&apos;s weight</span>
          <input
            type="number"
            step="0.1"
            min={50}
            max={800}
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-black px-3 py-2 text-sm"
            placeholder={String(data.currentWeightLbs ?? "")}
          />
        </label>
        <button
          type="submit"
          disabled={busy || !weightInput}
          className="rounded-lg border-2 border-[#E6007E] px-4 py-2.5 text-sm font-bold text-[#E6007E] hover:bg-[#FFF0F7] disabled:opacity-60"
        >
          Update
        </button>
      </form>

      <form onSubmit={saveGoal} className="mt-3 flex flex-wrap gap-2 items-end">
        <label className="flex-1 min-w-[120px]">
          <span className="text-xs font-semibold text-black/60">Goal weight (lbs)</span>
          <input
            type="number"
            step="0.1"
            min={50}
            max={800}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !goalInput}
          className="text-xs font-semibold text-[#E6007E] hover:underline disabled:opacity-60"
        >
          Save goal
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
