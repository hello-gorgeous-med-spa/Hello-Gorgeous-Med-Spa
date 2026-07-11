"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { RegenLeaderboard } from "@/lib/regen/staff-goals";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

const TOP_RANK_CLS: Record<number, string> = {
  1: "text-[#E6007E]",
  2: "text-black/70",
  3: "text-amber-600",
};

export default function RegenLeaderboardPage() {
  const [board, setBoard] = useState<RegenLeaderboard | null>(null);
  const [viewerUserId, setViewerUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/rx/leaderboard");
        const data = await res.json();
        if (res.ok) {
          setBoard(data.leaderboard);
          setViewerUserId(data.viewerUserId ?? null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™ · RE GEN
          </p>
          <h1 className="text-3xl font-black text-black">Leaderboard</h1>
          <p className="text-black/60 mt-1 text-sm">
            Month-to-date collected RE GEN sales credited to each team member.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx/my-day" className="font-bold text-[#E6007E] underline">
            My day
          </Link>
          <Link href="/admin/rx/my-book" className="font-bold text-[#E6007E] underline">
            My book
          </Link>
        </div>
      </div>

      {loading || !board ? (
        <p className="text-black/50">Loading…</p>
      ) : (
        <>
          <div className="rounded-2xl border-4 border-black bg-gradient-to-r from-[#FFF0F7] to-white p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
                {board.monthLabel} · day {board.daysElapsed} of {board.daysInMonth}
              </p>
              <p className="text-2xl font-black mt-1">{formatUsd(board.totalUsd)} team total</p>
            </div>
            {board.unassignedTotalUsd > 0 && (
              <p className="text-sm text-black/55">
                {formatUsd(board.unassignedTotalUsd)} unclaimed (self-serve online) —{" "}
                <Link href="/admin/rx/my-day" className="font-bold text-[#E6007E] underline">
                  work the house leads
                </Link>
              </p>
            )}
          </div>

          <ul className="space-y-3">
            {board.entries.map((e) => {
              const isMe = e.userId === viewerUserId;
              return (
                <li
                  key={e.userId}
                  className={`rounded-2xl border-4 p-4 ${
                    isMe
                      ? "border-[#E6007E] bg-rose-50"
                      : "border-black bg-white"
                  } shadow-[4px_4px_0_0_rgba(230,0,126,0.15)]`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl font-black w-10 text-center ${TOP_RANK_CLS[e.rank] ?? "text-black/40"}`}
                      >
                        #{e.rank}
                      </span>
                      <div>
                        <p className="font-black">
                          {e.displayName}
                          {isMe && <span className="text-[#E6007E]"> · you</span>}
                        </p>
                        <p className="text-xs text-black/45">
                          {e.orderCount} sale{e.orderCount === 1 ? "" : "s"}
                          {e.estCommissionUsd != null &&
                            ` · est. commission ${formatUsd(e.estCommissionUsd)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-[#E6007E]">{formatUsd(e.mtdTotalUsd)}</p>
                      <p
                        className={`text-xs font-bold ${e.pacePct >= 100 ? "text-emerald-600" : "text-black/45"}`}
                      >
                        {e.progressPct}% of {formatUsd(e.targetUsd)} goal
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]"
                      style={{ width: `${Math.min(100, e.progressPct)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
