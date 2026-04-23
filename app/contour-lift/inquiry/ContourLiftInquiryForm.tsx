"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent } from "@/lib/contour-lift-analytics";
import {
  CONTOUR_LIFT_INQUIRY_OK_KEY,
  getOrCreateSessionId,
  getStoredUtm,
  inferLeadSourceBucket,
} from "@/lib/utm-session";

const PINK = "#E6007E";

const CONTACT_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email" },
] as const;

export function ContourLiftInquiryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [areaOfConcern, setAreaOfConcern] = useState("");
  const [contactMethod, setContactMethod] = useState<(typeof CONTACT_OPTIONS)[number]["value"]>("text");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim() || !areaOfConcern.trim()) {
      setError("Please complete the short form so we can follow up.");
      return;
    }

    setSubmitting(true);
    try {
      const utm = getStoredUtm();
      const leadSourceBucket = inferLeadSourceBucket(
        utm,
        typeof document !== "undefined" ? document.referrer : undefined
      );
      const res = await fetch("/api/public/contour-lift-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          area_of_concern: areaOfConcern.trim(),
          contact_method: contactMethod,
          lead_source_bucket: leadSourceBucket,
          session_id: getOrCreateSessionId(),
          from_page: typeof window !== "undefined" ? window.location.pathname : "/contour-lift/inquiry",
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not send. Please try again.");
      }

      try {
        sessionStorage.setItem(CONTOUR_LIFT_INQUIRY_OK_KEY, "1");
      } catch {
        /* ignore */
      }
      pushContourLiftEvent(CONTOUR_LIFT_EVENTS.leadSubmit, { form: "contour_lift_inquiry" });
      router.push("/contour-lift/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
      <div>
        <label htmlFor="cl-name" className="block text-sm font-semibold text-black">
          Name
        </label>
        <input
          id="cl-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full border-2 border-black px-3 py-2.5 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div>
        <label htmlFor="cl-email" className="block text-sm font-semibold text-black">
          Email
        </label>
        <input
          id="cl-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full border-2 border-black px-3 py-2.5 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div>
        <label htmlFor="cl-phone" className="block text-sm font-semibold text-black">
          Phone
        </label>
        <input
          id="cl-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full border-2 border-black px-3 py-2.5 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div>
        <label htmlFor="cl-area" className="block text-sm font-semibold text-black">
          Area of concern
        </label>
        <input
          id="cl-area"
          name="area_of_concern"
          placeholder="e.g. jawline, abdomen, after weight loss"
          value={areaOfConcern}
          onChange={(e) => setAreaOfConcern(e.target.value)}
          className="mt-1.5 w-full border-2 border-black px-3 py-2.5 text-base text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-black">Preferred contact</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTACT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex cursor-pointer items-center gap-2 border-2 border-black px-3 py-2 text-sm has-[:checked]:text-white"
              style={
                contactMethod === opt.value
                  ? { backgroundColor: PINK, borderColor: PINK }
                  : { backgroundColor: "white" }
              }
            >
              <input
                type="radio"
                name="contact_method"
                value={opt.value}
                checked={contactMethod === opt.value}
                onChange={() => setContactMethod(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-md px-8 text-sm font-bold uppercase tracking-widest text-white transition enabled:hover:opacity-95 disabled:opacity-50"
          style={{ backgroundColor: PINK }}
        >
          {submitting ? "Sending…" : "See if I’m a candidate"}
        </button>
        <Link href="/services/quantum-rf" className="text-center text-sm font-semibold text-black underline-offset-4 hover:underline">
          Back to Contour Lift
        </Link>
      </div>
    </form>
  );
}
