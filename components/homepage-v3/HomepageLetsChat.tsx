"use client";

import { useState } from "react";

const AREAS = [
  "Botox & Injectables",
  "Dermal Fillers",
  "Weight Loss",
  "Hormone Therapy",
  "Skin Treatments",
  "Other",
];

export function HomepageLetsChat() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const contact = (formData.get("contact") as string)?.trim();
    const area = (formData.get("area") as string)?.trim();
    const message = (formData.get("message") as string)?.trim() || "Sent from homepage Let's Chat";

    if (!name || !contact) {
      setStatus("error");
      setErrorMessage("Please enter your name and email or phone.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message: area ? `Area of interest: ${area}\n\n${message}` : message,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send. Please try again or call us.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or call us.");
    }
  }

  return (
    <section className="bg-black py-20 md:py-24" aria-labelledby="lets-chat-heading">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <h2 id="lets-chat-heading" className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
          Let&apos;s Chat
        </h2>
        <p className="text-white/80 text-center mb-10">
          Questions? Tell us a little about yourself and we&apos;ll get back to you soon.
        </p>

        <form
          className="rounded-2xl border-2 border-white/20 bg-white/5 p-6 md:p-8 grid gap-4"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full min-h-[48px] rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:border-[#E6007E]"
            placeholder="Name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={status === "sending"}
          />
          <input
            className="w-full min-h-[48px] rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:border-[#E6007E]"
            placeholder="Email or phone"
            name="contact"
            type="text"
            autoComplete="email"
            required
            disabled={status === "sending"}
          />
          <select
            className="w-full min-h-[48px] rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:border-[#E6007E] [color-scheme:dark]"
            name="area"
            disabled={status === "sending"}
          >
            <option value="">Area of interest (optional)</option>
            {AREAS.map((a) => (
              <option key={a} value={a} className="bg-black text-white">
                {a}
              </option>
            ))}
          </select>
          <textarea
            className="w-full min-h-[100px] rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:border-[#E6007E] resize-y"
            placeholder="How can we help?"
            name="message"
            disabled={status === "sending"}
          />
          {status === "success" && (
            <p className="text-[#E6007E] text-sm font-medium" role="status">
              Thanks! We&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-[#E6007E] text-sm font-medium" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className="w-full min-h-[48px] px-8 py-4 bg-[#E6007E] hover:bg-[#C90A68] text-white font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:pointer-events-none"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
