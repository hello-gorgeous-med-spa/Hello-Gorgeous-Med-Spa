"use client";

import { useEffect, useRef, useState } from "react";

import type { RxSecureMessage } from "@/lib/rx-secure-messages";
import { RX_CARE_TEXT_DISPLAY, RX_CARE_TEXT_SMS } from "@/lib/rx-contact";

type Props = {
  initialRef?: string;
  initialEmail?: string;
  compact?: boolean;
};

export function RxSecureMessages({ initialRef = "", initialEmail = "", compact = false }: Props) {
  const [intakeRef, setIntakeRef] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [unlocked, setUnlocked] = useState(Boolean(initialRef && initialEmail));
  const [messages, setMessages] = useState<RxSecureMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!unlocked || !intakeRef.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    fetch(
      `/api/rx/messages?ref=${encodeURIComponent(intakeRef)}&email=${encodeURIComponent(email)}`,
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Could not load messages");
        setMessages(data.messages || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load messages"))
      .finally(() => setLoading(false));
  }, [unlocked, intakeRef, email]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!intakeRef.trim() || !email.trim()) {
      setError("Enter your reference code and email");
      return;
    }
    setUnlocked(true);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/rx/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeRef: intakeRef.trim(),
          email: email.trim(),
          messageBody: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send");
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSending(false);
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!unlocked) {
    return (
      <form onSubmit={unlock} className={compact ? "space-y-3" : "rounded-2xl border-2 border-black bg-white p-6 space-y-4"}>
        {!compact && (
          <>
            <h2 className="font-serif text-xl font-bold text-black">Secure RX messaging</h2>
            <p className="text-sm text-black/65 leading-relaxed">
              Message our clinical team 24/7 — dose questions, shipping updates, or anything about your
              Hello Gorgeous RX™ protocol. Replies during business hours; urgent issues text{" "}
              <a href={RX_CARE_TEXT_SMS} className="font-semibold text-[#E6007E] underline">
                {RX_CARE_TEXT_DISPLAY}
              </a>
              .
            </p>
          </>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-black/55">
            Reference code
          </label>
          <input
            value={intakeRef}
            onChange={(e) => setIntakeRef(e.target.value.toUpperCase())}
            placeholder="From your refill confirmation"
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E6007E]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-black/55">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Same email on your form"
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E6007E]"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#E6007E] px-4 py-3 text-sm font-bold text-white hover:bg-black transition-colors"
        >
          Open secure thread
        </button>
      </form>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"}>
      {!compact && (
        <div className="border-b border-black/10 bg-[#FFF0F7] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">Secure thread</p>
          <p className="mt-1 text-sm font-semibold text-black">
            Ref {intakeRef.toUpperCase()} · {email}
          </p>
        </div>
      )}
      <div className={`${compact ? "max-h-64" : "max-h-96"} overflow-y-auto px-4 py-4 space-y-3 bg-white`}>
        {loading && <p className="text-sm text-black/50">Loading messages…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-black/55 leading-relaxed">
            No messages yet. Ask about dosing, shipping, or your next telehealth visit — we&apos;ll reply here.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.senderType === "patient" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.senderType === "patient"
                  ? "bg-[#E6007E] text-white rounded-br-md"
                  : "bg-black/5 text-black rounded-bl-md border border-black/10"
              }`}
            >
              <p>{m.body}</p>
              <p
                className={`mt-1 text-[10px] ${
                  m.senderType === "patient" ? "text-white/70" : "text-black/45"
                }`}
              >
                {m.senderType === "staff" && m.sentBy ? `${m.sentBy} · ` : ""}
                {formatTime(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="border-t border-black/10 p-4 flex gap-2 bg-white">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a secure message…"
          maxLength={4000}
          className="flex-1 rounded-xl border-2 border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E6007E]"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-[#E6007E] disabled:opacity-50 transition-colors"
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
      {error && <p className="px-4 pb-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default RxSecureMessages;
