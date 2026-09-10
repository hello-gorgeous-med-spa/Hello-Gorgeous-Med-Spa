"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { PEPPY_CLIENT_QUICK, PEPPY_OPS_QUICK } from "@/lib/regen/peppy-knowledge";
import type { PeppySurface } from "@/lib/regen/peppy";

const AVATAR = "/images/mascots/peppy-avatar.png";

type Message = { id: string; role: "user" | "assistant"; content: string };

const WELCOME: Record<PeppySurface, string> = {
  client:
    "Hey — I'm Peppy. I can walk you through REGEN RX: Illinois telehealth, A licensed Illinois clinician reviews every request, compounded meds are not FDA-approved. What do you want to know?",
  ops: "I'm Peppy for the clinic. Ask me how we approve, paste FormuConnect, refund, talk to a guest, or what to do when a chart is thin. I run REGEN the way we built it.",
};

export function PeppyChat({
  surface,
  variant = "widget",
}: {
  surface: PeppySurface;
  variant?: "widget" | "page";
}) {
  const ops = surface === "ops";
  const [open, setOpen] = useState(variant === "page");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME[surface] },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const user: Message = { id: String(Date.now()), role: "user", content };
    const next = [...messages, user];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/regen/peppy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const json = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: json.response || json.error || "I hit a snag. Try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: ops
            ? "I could not reach the brain. Open /ops/playbook and keep moving."
            : "Something glitched. Call (630) 636-6193 — the team will help.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const quick = ops ? PEPPY_OPS_QUICK : PEPPY_CLIENT_QUICK;
  const panel = (
    <div
      className={`flex flex-col overflow-hidden border-2 bg-white ${
        variant === "page" ? "h-[min(80vh,40rem)] w-full rounded-2xl border-black" : "h-[500px] w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border-pink-500/30 shadow-2xl"
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 ${ops ? "bg-slate-900" : "bg-gradient-to-r from-[#1a1025] to-[#2d1a3d]"}`}>
        <Image src={AVATAR} alt="Peppy" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white">Peppy</p>
          <p className={`text-xs ${ops ? "text-teal-300" : "text-pink-300"}`}>
            {ops ? "Clinic copilot · staff only" : "Your REGEN RX guide"}
          </p>
        </div>
        {variant === "widget" ? (
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close Peppy">
            ✕
          </button>
        ) : null}
      </div>
      <div className={`flex-1 space-y-3 overflow-y-auto p-4 ${ops ? "bg-slate-950" : "bg-gray-50"}`}>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <p
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? ops
                    ? "bg-teal-600 text-white"
                    : "bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white"
                  : ops
                    ? "border border-white/10 bg-white/5 text-white/90"
                    : "border border-gray-200 bg-white text-gray-800 shadow-sm"
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}
        {busy ? <p className={ops ? "text-teal-300 text-xs" : "text-pink-600 text-xs"}>Peppy is thinking…</p> : null}
        <div ref={endRef} />
      </div>
      {messages.length <= 2 ? (
        <div className={`flex flex-wrap gap-2 border-t px-4 py-3 ${ops ? "border-white/10 bg-slate-900" : "border-gray-100 bg-white"}`}>
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                ops ? "border border-teal-500/40 bg-teal-500/10 text-teal-200" : "border border-pink-200 bg-pink-50 text-pink-700"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className={`flex gap-2 border-t p-3 ${ops ? "border-white/10 bg-slate-900" : "border-gray-200 bg-white"}`}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={ops ? "Ask how we run Today, pharmacy, refunds…" : "Ask about REGEN RX…"}
          className={`flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none ${
            ops ? "border border-white/15 bg-white/5 text-white" : "border border-gray-200 text-gray-900"
          }`}
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className={`rounded-xl px-3 py-2 text-sm font-bold text-white disabled:opacity-40 ${ops ? "bg-teal-500" : "bg-[#E6007E]"}`}
        >
          Send
        </button>
      </form>
    </div>
  );

  if (variant === "page") return panel;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full px-5 py-3 text-white shadow-lg print:hidden ${
          ops ? "bg-teal-600 hover:bg-teal-500" : "bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] shadow-pink-500/30"
        }`}
        aria-label="Ask Peppy"
      >
        <Image src={AVATAR} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
        <span className="font-semibold">{open ? "Close" : "Ask Peppy"}</span>
      </button>
      {open ? <div className="fixed bottom-24 right-6 z-[90] print:hidden">{panel}</div> : null}
    </>
  );
}
