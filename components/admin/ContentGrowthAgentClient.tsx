"use client";

import { useState } from "react";

type TaskItem = {
  id: string;
  title: string;
  channel: "content" | "distribution" | "seo" | "conversion";
  reason: string;
  route: string;
  owner: string;
  dueBy: string;
  checklist: string[];
  priority: 1 | 2 | 3;
};

type AgentPayload = {
  ok: boolean;
  mode: "plan" | "execute";
  runAt: string;
  tasks: TaskItem[];
  totals: Record<string, number>;
  notes: string[];
  loggedToAutomationTable: boolean;
  errors: string[];
};

export function ContentGrowthAgentClient() {
  const [payload, setPayload] = useState<AgentPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(mode: "plan" | "execute") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/agents/content-growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, maxTasks: 20 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to run content growth agent.");
      setPayload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run content growth agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border-2 border-black bg-white p-5">
        <h2 className="text-xl font-bold text-[#E6007E]">Run Content Growth Agent</h2>
        <p className="mt-2 text-sm text-black/70">
          Generates a weekly compounding queue across content, SEO, distribution, and conversion optimization.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => run("plan")}
            disabled={loading}
            className="rounded-lg border-2 border-black px-4 py-2 text-sm font-semibold text-black"
          >
            Generate Weekly Plan
          </button>
          <button
            type="button"
            onClick={() => run("execute")}
            disabled={loading}
            className="rounded-lg bg-[#E6007E] px-4 py-2 text-sm font-semibold text-white"
          >
            Execute + Log Run
          </button>
        </div>
        {loading ? <p className="mt-3 text-sm text-black/60">Running agent...</p> : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      {payload ? (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            {Object.entries(payload.totals).map(([channel, count]) => (
              <article key={channel} className="rounded-xl border border-black/20 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-black/60">{channel}</p>
                <p className="mt-1 text-2xl font-black text-[#E6007E]">{count}</p>
              </article>
            ))}
          </div>

          <div className="space-y-3">
            {payload.tasks.map((task) => (
              <article key={task.id} className="rounded-2xl border-2 border-black bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-black">{task.title}</h3>
                  <span className="rounded-full bg-[#FFF0F7] px-3 py-1 text-xs font-semibold text-[#E6007E]">
                    P{task.priority} · {task.channel}
                  </span>
                </div>
                <p className="mt-2 text-sm text-black/75">{task.reason}</p>
                <p className="mt-2 text-sm text-black/70">
                  Route: <span className="font-mono">{task.route}</span> · Owner: {task.owner} · Due: {task.dueBy}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-black/80">
                  {task.checklist.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <section className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
            <h3 className="text-lg font-bold text-black">Agent notes</h3>
            <ul className="mt-3 space-y-1 text-sm text-black/80">
              {payload.notes.map((note) => (
                <li key={note}>- {note}</li>
              ))}
              {payload.loggedToAutomationTable ? <li>- Run logged to automation logs.</li> : null}
              {payload.errors.map((entry) => (
                <li key={entry} className="text-red-700">
                  - {entry}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </section>
  );
}
