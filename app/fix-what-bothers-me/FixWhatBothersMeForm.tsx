"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

type Suggested = { slug: string; name: string; reason: string };

type Props = { initialMessage?: string };

export function FixWhatBothersMeForm({ initialMessage = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [suggested, setSuggested] = useState<Suggested[]>([]);
  const [messageValue, setMessageValue] = useState(initialMessage);

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
      <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-950/20 to-black p-8 text-center">
        <div className="text-4xl mb-4">💗</div>
        <h2 className="text-2xl font-bold text-white">Thank you.</h2>
        <p className="mt-3 text-gray-300">
          We've received what you shared. We'll review it and get back to you—or you can book below if one of these fits.
        </p>
        {suggested.length > 0 && (
          <div className="mt-8 text-left">
            <p className="text-pink-400 text-sm font-semibold uppercase tracking-wider mb-3">
              We think these might help
            </p>
            <ul className="space-y-3">
              {suggested.map((s) => (
                <li key={s.slug} className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{s.name}</p>
                    <p className="text-sm text-gray-400">{s.reason}</p>
                  </div>
                  <Link
                    href={s.slug === "quiz" ? "/quiz" : `/book/${s.slug}`}
                    className="flex-shrink-0 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    {s.slug === "quiz" ? "Start" : "Book"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-8 text-gray-500 text-sm">
          <Link href="/" className="text-pink-400 hover:text-pink-300">Back to home</Link>
          {" · "}
          <Link href={BOOKING_URL} className="text-pink-400 hover:text-pink-300">See all services</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-800 bg-black/40 p-6 md:p-8">
      <p className="text-gray-400 text-sm mb-6">
        Name and contact are optional. If you leave them, we can reach out personally.
      </p>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your name (optional)"
            className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone (optional)"
          className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
        />
        <div>
          <label htmlFor="message" className="sr-only">
            What bothers you?
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            placeholder="What's going on? What would you change if you could? (e.g. weight, skin, lines, energy, pigmentation, anything.)"
            className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-y min-h-[160px]"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-red-400 text-sm">{errorMsg}</p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-70 disabled:pointer-events-none"
        >
          {status === "sending" ? "Sending…" : "Share with us"}
        </button>
        <Link
          href="/book"
          className="flex-1 px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 text-center transition-colors"
        >
          I know what I want — book now
        </Link>
      </div>
    </form>
  );
}
