"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { RxSecureMessage } from "@/lib/rx-secure-messages";

type ThreadSummary = {
  threadId: string;
  intakeRef: string;
  track: string | null;
  lastPreview: string | null;
  unreadPatient: number;
};

export function PortalRxCareTeam() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RxSecureMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadSummary = useCallback(async () => {
    const res = await fetch("/api/portal/rx/messages");
    if (!res.ok) return;
    const json = (await res.json()) as {
      threads: ThreadSummary[];
      primaryThreadId: string | null;
      unreadTotal: number;
    };
    setThreads(json.threads ?? []);
    setUnreadTotal(json.unreadTotal ?? 0);
    if (!activeThreadId && json.primaryThreadId) {
      setActiveThreadId(json.primaryThreadId);
    }
  }, [activeThreadId]);

  const loadMessages = useCallback(async (threadId: string) => {
    const res = await fetch(`/api/portal/rx/messages?threadId=${encodeURIComponent(threadId)}`);
    if (!res.ok) return;
    const json = (await res.json()) as { messages: RxSecureMessage[] };
    setMessages(json.messages ?? []);
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (expanded && activeThreadId) void loadMessages(activeThreadId);
  }, [expanded, activeThreadId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/portal/rx/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageBody: draft.trim(), threadId: activeThreadId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send");
      setDraft("");
      if (json.threadId) setActiveThreadId(json.threadId);
      await loadMessages(json.threadId || activeThreadId!);
    } catch {
      alert("Could not send message. Try again or call (630) 636-6193.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-[#FFF0F7] transition-colors"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Care team</p>
          <p className="font-bold text-black mt-0.5">Message Ryan &amp; the RX team</p>
          <p className="text-xs text-black/55 mt-1">Secure messaging — we reply within 24 hours</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {unreadTotal > 0 && (
            <span className="rounded-full bg-[#E6007E] text-white text-[10px] font-bold px-2 py-1">
              {unreadTotal} new
            </span>
          )}
          <span className="text-black/40">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-black/10">
          {threads.length > 1 && (
            <div className="px-4 py-2 border-b border-black/5 flex flex-wrap gap-2">
              {threads.map((t) => (
                <button
                  key={t.threadId}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(t.threadId);
                    void loadMessages(t.threadId);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                    activeThreadId === t.threadId
                      ? "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E]"
                      : "border-black/20 text-black/70"
                  }`}
                >
                  Ref {t.intakeRef}
                  {t.unreadPatient > 0 ? ` · ${t.unreadPatient}` : ""}
                </button>
              ))}
            </div>
          )}

          <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-3 bg-[#FAFAFA]">
            {messages.length === 0 ? (
              <p className="text-sm text-black/55 text-center py-6">
                No messages yet. Ask about dosing, side effects, or your refill timing.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderType === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.senderType === "patient"
                        ? "bg-[#E6007E] text-white"
                        : "bg-white border border-black/10 text-black"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p className={`text-[10px] mt-1 ${m.senderType === "patient" ? "text-pink-100" : "text-black/45"}`}>
                      {new Date(m.createdAt).toLocaleString()}
                      {m.senderType === "staff" ? " · Care team" : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-black/10 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border-2 border-black px-3 py-2 text-sm"
              maxLength={4000}
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              className="rounded-lg bg-[#E6007E] px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
