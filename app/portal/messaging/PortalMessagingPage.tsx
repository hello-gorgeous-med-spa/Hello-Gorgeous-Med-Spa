"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  senderType: string;
  body: string;
  sentAt: string;
  readAt: string | null;
};

export function PortalMessagingPage() {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hg_portal_email") : null;
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    if (!email.trim()) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/memberships/wellness/messages?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [email]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/memberships/wellness/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, messageBody: newMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessages((prev) => [
        {
          id: data.id,
          senderType: "client",
          body: newMessage.trim(),
          sentAt: data.sentAt || new Date().toISOString(),
          readAt: null,
        },
        ...prev,
      ]);
      setNewMessage("");
    } catch {
      alert("Could not send message. Try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Secure Messaging</h1>
        <p className="text-black mt-1">
          HIPAA-compliant messaging with your provider. 24–48 hour response time.
        </p>
      </div>

      {!email && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">Enter your email to access messaging.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mt-3 w-full max-w-md px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      )}

      {email && (
        <div className="bg-white rounded-2xl border border-black overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
          <div className="p-4 border-b border-black bg-white">
            <p className="text-sm text-black">
              Messages are secure and will be responded to within 24–48 hours.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {loading ? (
              <p className="text-black text-center py-8">Loading…</p>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-black">
                <p className="mb-2">No messages yet.</p>
                <p className="text-sm">Send a message below and we&apos;ll get back to you.</p>
              </div>
            ) : (
              [...messages].reverse().map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderType === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      m.senderType === "client"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                    <p className={`text-xs mt-1 ${m.senderType === "client" ? "text-pink-100" : "text-black"}`}>
                      {formatTime(m.sentAt)}
                      {m.senderType === "provider" && " • Provider"}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-black">
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                className="flex-1 px-4 py-3 rounded-xl border border-black focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
