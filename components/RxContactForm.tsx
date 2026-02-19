"use client";

import { useState } from "react";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";

const interestOptions = [
  { value: "hormones", label: "Hormone Optimization" },
  { value: "metabolic", label: "Medical Weight Loss" },
  { value: "peptides", label: "Peptides & Longevity" },
  { value: "sexual-health", label: "Sexual Wellness" },
  { value: "dermatology", label: "Prescription Dermatology" },
  { value: "membership", label: "RX Membership Info" },
  { value: "general", label: "General Inquiry" },
];

export function RxContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const interest = (formData.get("interest") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!name || !email || !interest) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields.");
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
          contact: email,
          phone,
          message: `[RX INQUIRY - ${interest.toUpperCase()}]\n\nPhone: ${phone || "Not provided"}\n\n${message || "No additional message"}`,
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

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-black mb-2">Thank You!</h3>
        <p className="text-black/70 mb-6">
          We&apos;ve received your inquiry. Our medical team will review and contact you within 24-48 hours.
        </p>
        <p className="text-sm text-black/60">
          Illinois residents only. A medical evaluation is required for all prescription services.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Full Name <span className="text-[#E6007E]">*</span>
          </label>
          <input
            className="w-full min-h-[48px] text-base rounded-lg bg-white border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#E6007E] transition-colors"
            placeholder="Your name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Email Address <span className="text-[#E6007E]">*</span>
          </label>
          <input
            className="w-full min-h-[48px] text-base rounded-lg bg-white border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#E6007E] transition-colors"
            placeholder="you@email.com"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Phone Number
          </label>
          <input
            className="w-full min-h-[48px] text-base rounded-lg bg-white border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#E6007E] transition-colors"
            placeholder="(555) 555-5555"
            name="phone"
            type="tel"
            autoComplete="tel"
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            I&apos;m interested in <span className="text-[#E6007E]">*</span>
          </label>
          <select
            className="w-full min-h-[48px] text-base rounded-lg bg-white border-2 border-black/20 px-4 py-3 text-black focus:outline-none focus:border-[#E6007E] transition-colors"
            name="interest"
            required
            disabled={status === "sending"}
          >
            <option value="">Select a program...</option>
            {interestOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Message (optional)
        </label>
        <textarea
          className="w-full min-h-[100px] text-base rounded-lg bg-white border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#E6007E] transition-colors resize-y"
          placeholder="Tell us about your health goals or questions..."
          name="message"
          disabled={status === "sending"}
        />
      </div>

      <div className="bg-pink-50 rounded-lg p-4 text-sm text-black/70">
        <p className="flex items-start gap-2">
          <svg className="w-5 h-5 text-[#E6007E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          By submitting, you confirm you are an Illinois resident and understand that a medical evaluation is required before any prescription therapy.
        </p>
      </div>

      {status === "error" && (
        <p className="text-[#E6007E] text-sm font-medium" role="alert">{errorMessage}</p>
      )}

      <button
        className="w-full min-h-[52px] px-8 py-4 bg-[#E6007E] hover:bg-pink-600 rounded-xl text-white text-base font-semibold transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

export function RxCTASection() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Schedule Telehealth */}
      <div className="p-6 rounded-2xl border-2 border-[#E6007E] bg-gradient-to-br from-[#E6007E] to-pink-600 text-white text-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2">Telehealth Consultation</h3>
        <p className="text-white/80 text-sm mb-4">
          Meet virtually with Ryan Kent, FNP-C for your medical evaluation.
        </p>
        <CTA href={BOOKING_URL} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-[#E6007E]">
          Book Telehealth
        </CTA>
      </div>

      {/* In-Office Visit */}
      <div className="p-6 rounded-2xl border-2 border-black bg-white text-center">
        <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-black mb-2">In-Office Consultation</h3>
        <p className="text-black/70 text-sm mb-4">
          Visit us at our Oswego, IL location for an in-person evaluation.
        </p>
        <CTA href={BOOKING_URL} variant="outline" className="w-full">
          Book In-Office
        </CTA>
      </div>

      {/* Call Us */}
      <div className="p-6 rounded-2xl border-2 border-black bg-white text-center">
        <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-black mb-2">Call Us Directly</h3>
        <p className="text-black/70 text-sm mb-4">
          Speak with our team about RX programs and eligibility.
        </p>
        <a 
          href="tel:6306366193" 
          className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-black rounded-xl font-semibold text-black hover:bg-black hover:text-white transition-colors"
        >
          (630) 636-6193
        </a>
      </div>
    </div>
  );
}
