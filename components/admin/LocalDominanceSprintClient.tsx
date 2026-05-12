"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LOCAL_DOMINANCE_CAMPAIGNS, LOCAL_DOMINANCE_TASKS } from "@/lib/local-dominance-sprint";

type Scorecard = {
  leadsLast30Days: number;
  leadsLast7Days: number;
  funnelLeadsLast30Days: number;
  reviewRequestRunsLast7Days: number;
  nurtureRunsLast7Days: number;
};

const STORAGE_KEY = "hg-local-dominance-checks-v1";

export function LocalDominanceSprintClient() {
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setChecked(JSON.parse(raw));
      } catch {
        setChecked({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    fetch("/api/admin/local-dominance/scorecard")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setScorecard(data.scorecard);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load scorecard."));
  }, []);

  const completion = useMemo(() => {
    const ids = LOCAL_DOMINANCE_TASKS.map((item) => item.id);
    const done = ids.filter((id) => checked[id]).length;
    return { done, total: ids.length, pct: ids.length ? Math.round((done / ids.length) * 100) : 0 };
  }, [checked]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border-2 border-black bg-white p-5">
        <h2 className="text-xl font-black text-black">Local Dominance Scorecard</h2>
        <p className="mt-1 text-sm text-black/70">Run this sprint weekly to grow awareness without heavy ad spend.</p>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <Metric label="Leads (30d)" value={scorecard?.leadsLast30Days ?? 0} />
          <Metric label="Leads (7d)" value={scorecard?.leadsLast7Days ?? 0} />
          <Metric label="Funnel Leads (30d)" value={scorecard?.funnelLeadsLast30Days ?? 0} />
          <Metric label="Review Runs (7d)" value={scorecard?.reviewRequestRunsLast7Days ?? 0} />
          <Metric label="Nurture Runs (7d)" value={scorecard?.nurtureRunsLast7Days ?? 0} />
        </div>
      </section>

      <section className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
        <h3 className="text-lg font-bold text-black">Weekly execution progress</h3>
        <p className="mt-1 text-sm text-black/75">
          {completion.done}/{completion.total} tasks complete ({completion.pct}%)
        </p>
        <div className="mt-3 h-3 rounded-full bg-white">
          <div className="h-3 rounded-full bg-[#E6007E]" style={{ width: `${completion.pct}%` }} />
        </div>
      </section>

      <section className="space-y-3">
        {LOCAL_DOMINANCE_TASKS.map((task) => (
          <article key={task.id} className="rounded-2xl border-2 border-black bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-black">{task.title}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.priority === "high" ? "bg-[#E6007E] text-white" : "bg-black text-white"}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-sm text-black/75">{task.why}</p>
            <p className="mt-1 text-sm text-black/75">Owner: {task.owner}</p>
            <ul className="mt-3 space-y-1 text-sm text-black/80">
              {task.checklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setChecked((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  checked[task.id] ? "bg-green-600 text-white" : "bg-black text-white"
                }`}
              >
                {checked[task.id] ? "Completed" : "Mark complete"}
              </button>
              <Link href={task.route} className="rounded-lg border border-black px-4 py-2 text-sm font-semibold text-black hover:bg-black/5">
                Open route
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border-2 border-black bg-white p-5">
        <h3 className="text-lg font-bold text-black">Campaign queue (launch in rotation)</h3>
        <div className="mt-3 space-y-2">
          {LOCAL_DOMINANCE_CAMPAIGNS.map((campaign) => (
            <article key={campaign.id} className="rounded-xl border border-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">{campaign.channel}</p>
              <p className="mt-1 font-bold text-black">{campaign.audience}</p>
              <p className="text-sm text-black/75">{campaign.objective}</p>
              <p className="mt-1 text-sm text-black/75">Offer: {campaign.offer}</p>
              <p className="text-sm text-black/75">CTA: {campaign.cta}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-black/20 bg-[#FFF0F7] p-3">
      <p className="text-xs uppercase tracking-wide text-black/60">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#E6007E]">{value}</p>
    </article>
  );
}
