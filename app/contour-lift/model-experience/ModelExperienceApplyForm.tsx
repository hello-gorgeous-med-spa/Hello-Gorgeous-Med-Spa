"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent } from "@/lib/contour-lift-analytics";
import {
  CONTOUR_LIFT_INQUIRY_OK_KEY,
  getOrCreateSessionId,
  getStoredUtm,
  inferLeadSourceBucket,
} from "@/lib/utm-session";

const CONTACT_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email" },
] as const;

const FROM_PAGE = "/contour-lift/model-experience";

export function ModelExperienceApplyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [context, setContext] = useState("");
  const [about, setAbout] = useState("");
  const [contactMethod, setContactMethod] = useState<(typeof CONTACT_OPTIONS)[number]["value"]>("text");
  const [attend, setAttend] = useState(false);
  const [media, setMedia] = useState(false);
  const [understand, setUnderstand] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim() || !area) {
      setError("Please add your name, email, phone, and primary area of interest.");
      return;
    }
    if (!attend || !media || !understand) {
      setError("Please confirm the three checkboxes to submit.");
      return;
    }

    const areaBlock = [
      `Primary area: ${area}`,
      context ? `Context: ${context}` : null,
      about.trim() ? `About: ${about.trim()}` : null,
      "Clinical model interest — May 4, Oswego, IL. Consent: can attend, photo/video use OK, understand selective program.",
    ]
      .filter(Boolean)
      .join(" \n");

    setSubmitting(true);
    try {
      const utm = getStoredUtm();
      const leadSourceBucket = inferLeadSourceBucket(
        utm,
        typeof document !== "undefined" ? document.referrer : undefined
      );
      const bucket = leadSourceBucket
        ? `contour_model_may4|${leadSourceBucket}`.slice(0, 100)
        : "contour_model_may4";
      const res = await fetch("/api/public/contour-lift-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          area_of_concern: areaBlock,
          contact_method: contactMethod,
          lead_source_bucket: bucket,
          session_id: getOrCreateSessionId(),
          from_page: FROM_PAGE,
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
      pushContourLiftEvent(CONTOUR_LIFT_EVENTS.leadSubmit, { form: "contour_model_experience_may4" });
      router.push("/contour-lift/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cml-form" noValidate>
      <div className="cml-field">
        <label htmlFor="cml-name">Full name</label>
        <input
          id="cml-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="cml-field">
        <label htmlFor="cml-email">Email</label>
        <input
          id="cml-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="cml-field">
        <label htmlFor="cml-phone">Phone</label>
        <input
          id="cml-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="cml-field">
        <label htmlFor="cml-area">Primary area of interest</label>
        <select
          id="cml-area"
          name="area"
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">Select one</option>
          <option>Jawline / lower face</option>
          <option>Chin &amp; neck</option>
          <option>Arms</option>
          <option>Abdomen</option>
          <option>Knees / thighs</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="cml-field">
        <label htmlFor="cml-context">Context (select what applies)</label>
        <select id="cml-context" name="context" value={context} onChange={(e) => setContext(e.target.value)}>
          <option value="">Optional</option>
          <option>Post-GLP-1 (Ozempic, Wegovy, Mounjaro)</option>
          <option>Postpartum</option>
          <option>Age-related laxity</option>
          <option>Other weight loss</option>
          <option>Prefer not to say</option>
        </select>
      </div>
      <div className="cml-field">
        <label htmlFor="cml-about">A bit about what you&apos;re hoping to address</label>
        <textarea
          id="cml-about"
          name="about"
          placeholder="Optional — but helpful for reviewing your application."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>
      <div className="cml-field">
        <span className="cml-eyebrow" style={{ marginBottom: 12, display: "block" }}>
          Preferred contact
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CONTACT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--line)",
                padding: "8px 14px",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer",
                background: contactMethod === opt.value ? "var(--pink-soft)" : "white",
                borderColor: contactMethod === opt.value ? "var(--pink)" : "var(--line)",
              }}
            >
              <input
                type="radio"
                name="contact"
                value={opt.value}
                checked={contactMethod === opt.value}
                onChange={() => setContactMethod(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      <div className="cml-consent">
        <input id="cml-attend" name="attend" type="checkbox" checked={attend} onChange={(e) => setAttend(e.target.checked)} />
        <label htmlFor="cml-attend">I&apos;m able to attend on May 4th in Oswego, IL.</label>
      </div>
      <div className="cml-consent">
        <input id="cml-media" name="media" type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} />
        <label htmlFor="cml-media">
          I&apos;m comfortable with before/after photo and video documentation for clinical use.
        </label>
      </div>
      <div className="cml-consent">
        <input
          id="cml-understand"
          name="understand"
          type="checkbox"
          checked={understand}
          onChange={(e) => setUnderstand(e.target.checked)}
        />
        <label htmlFor="cml-understand">
          I understand this is a selective clinical opportunity, not a giveaway, and applying does not guarantee selection.
        </label>
      </div>
      {error ? <p className="cml-err">{error}</p> : null}
      <div className="cml-submit-row">
        <p className="cml-micro">A consultation is required. Individual results may vary.</p>
        <button type="submit" className="cml-btn cml-btn-primary" disabled={submitting}>
          {submitting ? "Sending…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
