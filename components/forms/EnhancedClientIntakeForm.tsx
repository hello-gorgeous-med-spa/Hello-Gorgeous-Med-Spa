"use client";

import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  contactMethod: string;
  aestheticGoals: string;
  treatments: string[];
  areas: string[];
  conditions: string[];
  allergies: string;
  budget: string;
  timeline: string;
  financing: string;
  referralSource: string;
  referredBy: string;
  additionalNotes: string;
  consentPrivacy: boolean;
  consentCommunication: boolean;
  consentMedicalAccuracy: boolean;
  hp: string;
};

const TREATMENTS = [
  { value: "morpheus8", label: "Morpheus8 Burst" },
  { value: "co2", label: "Solaria CO2 Laser" },
  { value: "rf", label: "Quantum RF" },
  { value: "weightloss", label: "GLP-1 Weight Loss" },
  { value: "botox", label: "Botox / Dysport" },
  { value: "filler", label: "Dermal Fillers" },
  { value: "prp", label: "PRP / PRF" },
  { value: "facial", label: "Facials" },
  { value: "chemical-peel", label: "Chemical Peels" },
  { value: "microneedling", label: "Microneedling" },
];

const AREAS = [
  "Face",
  "Neck",
  "Jawline",
  "Under eyes",
  "Abdomen",
  "Arms",
  "Thighs",
  "Knees",
  "Chest",
];

const CONDITIONS = [
  "Pregnant",
  "Breastfeeding",
  "Diabetes",
  "Thyroid disorder",
  "Autoimmune condition",
  "Bleeding disorder",
  "Pacemaker/metal implants",
  "Cold sores/herpes",
];

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  contactMethod: "text",
  aestheticGoals: "",
  treatments: [],
  areas: [],
  conditions: [],
  allergies: "",
  budget: "",
  timeline: "",
  financing: "",
  referralSource: "",
  referredBy: "",
  additionalNotes: "",
  consentPrivacy: false,
  consentCommunication: false,
  consentMedicalAccuracy: false,
  hp: "",
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function EnhancedClientIntakeForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/client-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit form.");
      setDone(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit form.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-[#E6007E]">Thank you - intake received.</h2>
        <p className="mt-2 text-black/75">
          Our team will review your intake and start a personalized proposal before your consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border-2 border-black bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-lg border border-black/20 px-3 py-2"
          placeholder="First name *"
          value={form.firstName}
          onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-black/20 px-3 py-2"
          placeholder="Last name *"
          value={form.lastName}
          onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
          required
        />
        <input
          type="email"
          className="rounded-lg border border-black/20 px-3 py-2"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-black/20 px-3 py-2"
          placeholder="Phone *"
          value={form.phone}
          onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="date"
          className="rounded-lg border border-black/20 px-3 py-2"
          value={form.dob}
          onChange={(e) => setForm((s) => ({ ...s, dob: e.target.value }))}
          required
        />
        <select
          className="rounded-lg border border-black/20 px-3 py-2"
          value={form.contactMethod}
          onChange={(e) => setForm((s) => ({ ...s, contactMethod: e.target.value }))}
        >
          <option value="text">Preferred contact: Text</option>
          <option value="phone">Preferred contact: Phone</option>
          <option value="email">Preferred contact: Email</option>
        </select>
      </div>

      <textarea
        className="min-h-[110px] w-full rounded-lg border border-black/20 px-3 py-2"
        placeholder="Tell us your goals *"
        value={form.aestheticGoals}
        onChange={(e) => setForm((s) => ({ ...s, aestheticGoals: e.target.value }))}
        required
      />

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Treatments of interest *</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {TREATMENTS.map((t) => (
            <label key={t.value} className="flex items-center gap-2 rounded-lg border border-black/10 p-2 text-sm">
              <input
                type="checkbox"
                checked={form.treatments.includes(t.value)}
                onChange={() => setForm((s) => ({ ...s, treatments: toggle(s.treatments, t.value) }))}
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Areas</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {AREAS.map((a) => (
            <label key={a} className="flex items-center gap-2 rounded-lg border border-black/10 p-2 text-sm">
              <input
                type="checkbox"
                checked={form.areas.includes(a)}
                onChange={() => setForm((s) => ({ ...s, areas: toggle(s.areas, a) }))}
              />
              {a}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Medical conditions</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 rounded-lg border border-black/10 p-2 text-sm">
              <input
                type="checkbox"
                checked={form.conditions.includes(c)}
                onChange={() => setForm((s) => ({ ...s, conditions: toggle(s.conditions, c) }))}
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <textarea
        className="min-h-[90px] w-full rounded-lg border border-black/20 px-3 py-2"
        placeholder="Allergies (if any)"
        value={form.allergies}
        onChange={(e) => setForm((s) => ({ ...s, allergies: e.target.value }))}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <select className="rounded-lg border border-black/20 px-3 py-2" value={form.budget} onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}>
          <option value="">Budget range</option>
          <option value="under-1000">Under $1,000</option>
          <option value="1000-2500">$1,000-$2,500</option>
          <option value="2500-5000">$2,500-$5,000</option>
          <option value="over-5000">Over $5,000</option>
        </select>
        <select className="rounded-lg border border-black/20 px-3 py-2" value={form.timeline} onChange={(e) => setForm((s) => ({ ...s, timeline: e.target.value }))}>
          <option value="">Timeline</option>
          <option value="asap">ASAP</option>
          <option value="1-month">Within 1 month</option>
          <option value="1-3-months">1-3 months</option>
          <option value="exploring">Exploring options</option>
        </select>
        <select className="rounded-lg border border-black/20 px-3 py-2" value={form.financing} onChange={(e) => setForm((s) => ({ ...s, financing: e.target.value }))}>
          <option value="">Payment preference</option>
          <option value="full">Pay in full</option>
          <option value="cherry">Cherry financing</option>
          <option value="carecredit">CareCredit</option>
          <option value="not-sure">Need guidance</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="rounded-lg border border-black/20 px-3 py-2"
          value={form.referralSource}
          onChange={(e) => setForm((s) => ({ ...s, referralSource: e.target.value }))}
        >
          <option value="">How did you hear about us?</option>
          <option value="google">Google</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="referral">Friend referral</option>
          <option value="existing-client">Existing client</option>
        </select>
        <input
          className="rounded-lg border border-black/20 px-3 py-2"
          placeholder="If referred, who?"
          value={form.referredBy}
          onChange={(e) => setForm((s) => ({ ...s, referredBy: e.target.value }))}
        />
      </div>

      <textarea
        className="min-h-[90px] w-full rounded-lg border border-black/20 px-3 py-2"
        placeholder="Anything else we should know?"
        value={form.additionalNotes}
        onChange={(e) => setForm((s) => ({ ...s, additionalNotes: e.target.value }))}
      />

      <input
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={form.hp}
        onChange={(e) => setForm((s) => ({ ...s, hp: e.target.value }))}
        name="company"
      />

      <div className="space-y-2 rounded-xl border border-black/10 bg-[#FFF0F7] p-4 text-sm">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={form.consentPrivacy}
            onChange={(e) => setForm((s) => ({ ...s, consentPrivacy: e.target.checked }))}
            required
          />
          I acknowledge the privacy policy and consent to secure storage of this intake.
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={form.consentCommunication}
            onChange={(e) => setForm((s) => ({ ...s, consentCommunication: e.target.checked }))}
            required
          />
          I consent to contact by phone, text, or email for scheduling and follow-up.
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={form.consentMedicalAccuracy}
            onChange={(e) => setForm((s) => ({ ...s, consentMedicalAccuracy: e.target.checked }))}
            required
          />
          I confirm this information is accurate to the best of my knowledge.
        </label>
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        disabled={busy}
      >
        {busy ? "Submitting..." : "Submit intake"}
      </button>
    </form>
  );
}
