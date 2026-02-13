"use client";

import { useState, useRef, useEffect } from "react";
import { trackEvent } from "@/components/GoogleAnalytics";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

type Suggested = { slug: string; name: string; reason: string };

type Props = { initialMessage?: string };

const INPUT_BASE =
  "w-full rounded-xl bg-black border border-gray-800 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 input-touch";

export function FixWhatBothersMeForm({ initialMessage = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [suggested, setSuggested] = useState<Suggested[]>([]);
  const [messageValue, setMessageValue] = useState(initialMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea (min 4 rows, grow on input), no horizontal scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 24;
    const minRows = 4;
    const minHeight = lineHeight * minRows;
    el.style.height = `${Math.max(minHeight, el.scrollHeight)}px`;
  }, [messageValue]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = (fd.get("phone") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();

    if (!message) {
      setStatus("error");
      setErrorMsg("Please share what's on your mind.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/concerns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      trackEvent("concern_submit", {});
      setSuggested(data.suggested || []);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or call us.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-950/20 to-black p-6 sm:p-8 text-center keyboard-safe">
        <div className="text-4xl mb-4">💗</div>
        <h2 className="text-2xl font-bold text-white">Thank you.</h2>
        <p className="mt-3 text-gray-300">
          We've received what you shared. We'll review it and get back to you—or you can book below if one of these fits.
        </p>
        {/* Stacked cards on mobile, reserve min-height to avoid CLS when suggestions load */}
        <div className="mt-8 text-left min-h-[120px]">
          {suggested.length > 0 && (
            <>
              <p className="text-pink-400 text-sm font-semibold uppercase tracking-wider mb-3">
                We think these might help
              </p>
              <ul className="space-y-3" role="list">
                {suggested.map((s) => (
                  <li key={s.slug} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{s.name}</p>
                      <p className="text-sm text-gray-400">{s.reason}</p>
                    </div>
                    <Link
                      href={s.slug === "quiz" ? "/quiz" : `/book/${s.slug}`}
                      className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-hg-pink hover:bg-hg-pinkDeep text-white text-sm font-semibold uppercase tracking-widest rounded-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
                    >
                      {s.slug === "quiz" ? "Start" : "Book"}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <p className="mt-8 text-gray-500 text-sm">
          <Link href="/" className="text-hg-pink hover:text-hg-pinkDeep">Back to home</Link>
          {" · "}
          <Link href={BOOKING_URL} className="text-hg-pink hover:text-hg-pinkDeep">See all services</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-800 bg-black/40 p-6 md:p-8 keyboard-safe">
      <p className="text-gray-400 text-sm mb-4">
        Name and contact are optional. If you leave them, we can reach out personally.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Prefer to talk? <a href="tel:630-636-6193" className="text-hg-pink hover:text-hg-pinkDeep font-medium">Call (630) 636-6193</a>
      </p>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your name (optional)"
            autoComplete="name"
            className={INPUT_BASE}
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            autoComplete="email"
            className={INPUT_BASE}
          />
        </div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone (optional)"
          autoComplete="tel"
          className={INPUT_BASE}
        />
        <div>
          <label htmlFor="message" className="sr-only">
            What bothers you?
          </label>
          <textarea
            ref={textareaRef}
            id="message"
            name="message"
            required
            rows={4}
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            placeholder="What's going on? What would you change if you could? (e.g. weight, skin, lines, energy, pigmentation, anything.)"
            className={`${INPUT_BASE} min-h-[96px] resize-none overflow-y-auto py-3`}
            style={{ overflowX: "hidden" }}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-red-400 text-sm" role="alert">
          {errorMsg}
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-black/40 -mx-6 -mb-6 px-6 py-4 md:static md:bg-transparent md:mx-0 md:mb-0 md:py-0">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex-1 min-h-[44px] px-10 py-4 bg-hg-pink hover:bg-hg-pinkDeep text-white font-semibold uppercase tracking-widest rounded-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg disabled:opacity-70 disabled:pointer-events-none disabled:hover:translate-y-0"
        >
          {status === "sending" ? "Sending…" : "Share with us"}
        </button>
        <Link
          href="/book"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center px-10 py-4 border border-hg-pink text-hg-pink font-semibold uppercase tracking-widest rounded-md hover:bg-hg-pink hover:text-white transition-all duration-300 ease-out hover:-translate-y-[2px] text-center text-sm"
        >
          I know what I want — book now
        </Link>
      </div>
    </form>
  );
}
