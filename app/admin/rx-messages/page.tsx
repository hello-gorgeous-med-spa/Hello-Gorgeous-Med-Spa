"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import type { RxMessageThread, RxSecureMessage } from "@/lib/rx-secure-messages";

export default function AdminRxMessagesPage() {
  const [threads, setThreads] = useState<RxMessageThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RxSecureMessage[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx-messages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setThreads(data.threads || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setSelectedId(threadId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rx-messages?threadId=${encodeURIComponent(threadId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load thread");
      setMessages(data.messages || []);
      void loadThreads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load thread");
    }
  }, [loadThreads]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !reply.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/rx-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedId, messageBody: reply.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setMessages((prev) => [...prev, data.message]);
      setReply("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  const selected = threads.find((t) => t.id === selectedId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black">RX Secure Messages</h1>
            <p className="text-sm text-[#FFB8DC]/80 mt-1">
              Patient portal threads — reply here, not in SMS body for clinical content.
            </p>
          </div>
          <div className="flex gap-3 text-xs">
            <Link href="/admin/rx-dispatch" className="text-[#FFB8DC] hover:text-white">
              Dispatch →
            </Link>
            <Link href="/admin/rx-ledger" className="text-[#FFB8DC] hover:text-white">
              Ledger →
            </Link>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

        <div className="grid md:grid-cols-[280px_1fr] gap-4 min-h-[520px]">
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-[#FFB8DC]">
              Threads {loading ? "…" : `(${threads.length})`}
            </div>
            <div className="max-h-[480px] overflow-y-auto">
              {threads.length === 0 && !loading && (
                <p className="p-4 text-sm text-white/50">No threads yet.</p>
              )}
              {threads.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => void loadThread(t.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/10 transition ${
                    selectedId === t.id ? "bg-[#E6007E]/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">
                      {t.patientName || t.patientEmail}
                    </span>
                    {t.unreadStaff > 0 && (
                      <span className="shrink-0 rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold">
                        {t.unreadStaff}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/45 mt-0.5">Ref {t.intakeRef}</p>
                  {t.lastPreview && (
                    <p className="text-xs text-white/55 mt-1 line-clamp-2">{t.lastPreview}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 flex flex-col min-h-[480px]">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-white/45 text-sm">
                Select a thread to reply
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="font-bold">{selected.patientName || selected.patientEmail}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    Ref {selected.intakeRef} · {selected.patientPhone || "—"}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        m.senderType === "staff"
                          ? "ml-auto bg-[#E6007E] text-white"
                          : "bg-black/40 border border-white/10"
                      }`}
                    >
                      <p>{m.body}</p>
                      <p className="text-[10px] opacity-60 mt-1">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendReply} className="p-4 border-t border-white/10 flex gap-2">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply to patient…"
                    className="flex-1 rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm outline-none focus:border-[#E6007E]"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="rounded-lg bg-[#E6007E] px-4 py-2 text-sm font-bold disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
