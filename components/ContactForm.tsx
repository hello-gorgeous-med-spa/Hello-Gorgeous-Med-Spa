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
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
        placeholder="Name"
        name="name"
        required
        disabled={status === "sending"}
      />
      <input
        className="w-full rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
        placeholder="Email or phone"
        name="contact"
        type="text"
        required
        disabled={status === "sending"}
      />
      <textarea
        className="w-full min-h-[140px] rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
        placeholder="How can we help?"
        name="message"
        required
        disabled={status === "sending"}
      />
      {status === "success" && (
        <p className="text-green-400 text-sm font-medium">Thank you. We’ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
      )}
      <button
        className="px-8 py-4 bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:pointer-events-none"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
