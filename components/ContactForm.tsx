"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const contact = (formData.get("contact") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!name || !contact || !message) {
      setStatus("error");
      setErrorMessage("Please fill in name, email or phone, and message.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
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
    <form className="mt-6 grid gap-4 keyboard-safe" onSubmit={handleSubmit}>
      <input
        className="w-full min-h-[48px] text-base rounded-lg bg-black border border-black px-4 py-3 text-white placeholder:text-black focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-[#FF2D8E]/50"
        placeholder="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
        disabled={status === "sending"}
      />
      <input
        className="w-full min-h-[48px] text-base rounded-lg bg-black border border-black px-4 py-3 text-white placeholder:text-black focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-[#FF2D8E]/50"
        placeholder="Email or phone"
        name="contact"
        type="text"
        autoComplete="email"
        required
        disabled={status === "sending"}
      />
      <textarea
        className="w-full min-h-[120px] text-base rounded-lg bg-black border border-black px-4 py-3 text-white placeholder:text-black focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-[#FF2D8E]/50 resize-y"
        placeholder="How can we help?"
        name="message"
        required
        disabled={status === "sending"}
      />
      {status === "success" && (
        <p className="text-green-400 text-sm font-medium" role="status">Thank you. We’ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="text-[#FF2D8E] text-sm font-medium" role="alert">{errorMessage}</p>
      )}
      <button
        className="w-full min-h-[48px] px-8 py-4 bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 rounded-full text-base font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition-all duration-300 hover:scale-105 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none md:w-auto"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
