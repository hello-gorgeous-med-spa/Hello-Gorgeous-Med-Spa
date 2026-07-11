"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { MyDayBoard, MyDayTask } from "@/lib/regen/staff-my-day";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

const PRIORITY_STYLE: Record<number, { label: string; cls: string }> = {
  1: { label: "Do first", cls: "bg-[#E6007E] text-white" },
  2: { label: "Recover $", cls: "bg-amber-400 text-black" },
  3: { label: "Fulfill", cls: "bg-black text-white" },
};

function TaskCard({ task }: { task: MyDayTask }) {
  const badge = PRIORITY_STYLE[task.priority];
  return (
    <li className="rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-wider ${badge.cls}`}>
            {badge.label}
          </span>
          <p className="mt-2 font-black">{task.title}</p>
          <p className="text-sm text-black/60 mt-0.5 max-w-md">{task.action}</p>
        </div>
        <div className="text-right">
          <p className="font-black text-[#E6007E] text-lg">{formatUsd(task.amountUsd)}</p>
          <p className="text-xs text-black/45">
            {task.ageDays === 0 ? "today" : `${task.ageDays}d old`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-bold">{task.patientName || "No name captured"}</span>
        {task.phone && (
          <a href={`tel:${task.phone.replace(/\D/g, "")}`} className="font-bold text-[#E6007E] underline">
            Call
          </a>
        )}
        {task.phone && (
          <a href={`sms:${task.phone.replace(/\D/g, "")}`} className="font-bold text-[#E6007E] underline">
            Text
          </a>
        )}
        {task.email && (
          <a href={`mailto:${task.email}`} className="font-bold text-[#E6007E] underline">
            Email
          </a>
        )}
        <Link href={task.href} className="ml-auto text-xs font-bold text-black underline">
          {task.reference} →
        </Link>
      </div>
    </li>
  );
}

export default function MyDayPage() {
  const [board, setBoard] = useState<MyDayBoard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/rx/my-day");
        const data = await res.json();
        if (res.ok) setBoard(data.board);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™ · RE GEN
          </p>
          <h1 className="text-3xl font-black text-black">My day</h1>
          <p className="text-black/60 mt-1 text-sm max-w-xl">
            Your prioritized follow-ups — work top to bottom and nothing slips.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx/my-book" className="font-bold text-[#E6007E] underline">
            My book
          </Link>
          <Link href="/admin/rx/leaderboard" className="font-bold text-[#E6007E] underline">
            Leaderboard
          </Link>
          <Link href="/admin/rx/portal" className="font-bold text-[#E6007E] underline">
            Sell RE GEN
          </Link>
        </div>
      </div>

      {loading || !board ? (
        <p className="text-black/50">Loading…</p>
      ) : (
        <>
          <div className="rounded-2xl border-4 border-[#E6007E] bg-gradient-to-r from-[#FFF0F7] to-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
                  {board.summary.displayName} · {board.summary.monthLabel}
                </p>
                <p className="text-2xl font-black mt-1">
                  {formatUsd(board.summary.mtdTotalUsd)}
                  <span className="text-sm font-bold text-black/45">
                    {" "}
                    of {formatUsd(board.summary.targetUsd)} goal
                  </span>
                </p>
                {board.summary.estCommissionUsd != null && (
                  <p className="text-sm text-black/65">
                    Est. commission so far:{" "}
                    <strong className="text-[#E6007E]">
                      {formatUsd(board.summary.estCommissionUsd)}
                    </strong>
                  </p>
                )}
              </div>
              <div className="text-right">
                {board.summary.rank != null && (
                  <p className="font-black text-lg">
                    #{board.summary.rank}
                    <span className="text-sm font-bold text-black/45"> of {board.summary.teamSize}</span>
                  </p>
                )}
                <p
                  className={`text-sm font-bold ${board.summary.pacePct >= 100 ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {board.summary.pacePct >= 100 ? "On pace" : "Behind pace"} ({board.summary.pacePct}%)
                </p>
              </div>
            </div>
            <div className="mt-3 h-3 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]"
                style={{ width: `${Math.min(100, board.summary.progressPct)}%` }}
              />
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-black text-lg">
              My follow-ups{" "}
              <span className="text-sm font-bold text-black/45">({board.tasks.length})</span>
            </h2>
            {board.tasks.length === 0 ? (
              <p className="text-sm text-black/50 rounded-xl border-2 border-dashed border-black/15 px-4 py-6 text-center">
                Queue clear — go make a sale. Every RE GEN checkout you assist lands here automatically.
              </p>
            ) : (
              <ul className="space-y-3">
                {board.tasks.map((t) => (
                  <TaskCard key={`${t.kind}-${t.reference}`} task={t} />
                ))}
              </ul>
            )}
          </section>

          {board.houseLeads.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-black text-lg">
                House leads — first to follow up wins{" "}
                <span className="text-sm font-bold text-black/45">({board.houseLeads.length})</span>
              </h2>
              <p className="text-sm text-black/55 -mt-2">
                Self-serve online orders with no seller attached. Follow up, help them finish, and the
                relationship is yours.
              </p>
              <ul className="space-y-3">
                {board.houseLeads.map((t) => (
                  <TaskCard key={`${t.kind}-${t.reference}`} task={t} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
