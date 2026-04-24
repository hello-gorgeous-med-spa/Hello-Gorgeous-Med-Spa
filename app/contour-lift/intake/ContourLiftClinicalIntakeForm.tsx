"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CL_INTAKE_CONTRA_ITEMS, type ContraId } from "@/lib/contour-clinical/intake-contraindications";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent } from "@/lib/contour-lift-analytics";

const PINK = "#E6007E";

const emptyContra = (): Record<ContraId, boolean> => {
  const o = {} as Record<ContraId, boolean>;
  for (const x of CL_INTAKE_CONTRA_ITEMS) o[x.id] = false;
  return o;
};

type Meta = {
  ok: boolean;
  case?: { id: string; email: string; full_name: string | null; phone: string | null; status: string };
  already_submitted?: boolean;
  intake_flags?: { requires_provider_review: boolean; submitted_at: string } | null;
};

export default function ContourLiftClinicalIntakeForm() {
  const sp = useSearchParams();
  const caseId = sp.get("case");
  const exp = sp.get("exp");
  const sig = sp.get("sig");

  const [meta, setMeta] = useState<Meta | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [flagsReview, setFlagsReview] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");
  const [emgName, setEmgName] = useState("");
  const [emgPhone, setEmgPhone] = useState("");
  const [treatmentInterest, setTreatmentInterest] = useState("");
  const [fitzpatrick, setFitzpatrick] = useState("3");
  const [uv, setUv] = useState("");
  const [selfTanner, setSelfTanner] = useState(false);
  const [meds, setMeds] = useState("");
  const [allergies, setAllergies] = useState("");
  const [history, setHistory] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");

  const [contra, setContra] = useState<Record<ContraId, boolean>>(emptyContra);

  const bmi = useMemo(() => {
    const h = parseFloat(heightIn);
    const w = parseFloat(weightLb);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0) return null;
    return Math.round((w / (h * h)) * 703 * 10) / 10;
  }, [heightIn, weightLb]);

  const load = useCallback(async () => {
    if (!caseId || !exp || !sig) {
      setLoadErr("This page needs a link from your care team. If you have questions, call the office.");
      return;
    }
    setLoadErr(null);
    const u = new URL("/api/public/contour-lift-intake", window.location.origin);
    u.searchParams.set("case", caseId);
    u.searchParams.set("exp", exp);
    u.searchParams.set("sig", sig);
    const r = await fetch(u.toString());
    const j = (await r.json()) as Meta & { error?: string };
    if (!r.ok) {
      setLoadErr(j.error || "Unable to open form.");
      setMeta(null);
      return;
    }
    setMeta(j);
    if (j.case) {
      setEmail(j.case.email);
      if (j.case.full_name) setFullName(j.case.full_name);
      if (j.case.phone) setPhone(j.case.phone);
    }
  }, [caseId, exp, sig]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleContra = (id: ContraId) => {
    setContra((c) => ({ ...c, [id]: !c[id] }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !exp || !sig) return;
    setSaving(true);
    setSaveErr(null);
    const fitzN = Math.min(6, Math.max(1, parseInt(fitzpatrick, 10) || 3));
    const answers = {
      full_name: fullName.trim(),
      date_of_birth: dob,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      address_line: addressLine.trim(),
      city: city.trim(),
      state: stateUS.trim(),
      zip: zip.trim(),
      emergency_contact_name: emgName.trim(),
      emergency_contact_phone: emgPhone.trim(),
      treatment_area_of_interest: treatmentInterest.trim(),
      fitzpatrick: fitzN,
      recent_uv_tanning: uv.trim(),
      self_tanner_use: selfTanner,
      current_medications: meds.trim() || "None reported",
      allergies: allergies.trim() || "None reported",
      medical_history: history.trim() || "See above",
      height_in: heightIn.trim() ? parseFloat(heightIn) : null,
      weight_lb: weightLb.trim() ? parseFloat(weightLb) : null,
      bmi: bmi != null && Number.isFinite(bmi) ? bmi : null,
      ...contra,
    };
    try {
      const r = await fetch("/api/public/contour-lift-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case: caseId, exp, sig, answers }),
      });
      const j = (await r.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
        requires_provider_review?: boolean;
        details?: unknown;
      };
      if (!r.ok) {
        setSaveErr(
          j.error + (j.details && typeof j.details === "object" ? " — check all required fields." : "")
        );
        return;
      }
      setFlagsReview(Boolean(j.requires_provider_review));
      setDone(true);
      pushContourLiftEvent(CONTOUR_LIFT_EVENTS.clinicalIntakeSubmit, {
        has_contra_yes: j.requires_provider_review ? true : false,
        requires_provider_review: j.requires_provider_review ? true : false,
      });
    } catch {
      setSaveErr("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadErr) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-black">
        <h1 className="font-serif text-2xl font-bold">Intake</h1>
        <p className="mt-3 text-sm text-red-800">{loadErr}</p>
      </div>
    );
  }

  if (!caseId || !exp || !sig) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-black">
        <h1 className="font-serif text-2xl font-bold">Intake</h1>
        <p className="mt-3 text-sm text-black/70">Use the secure link we emailed or texted to you to open this form.</p>
      </div>
    );
  }

  if (!meta) {
    return <p className="py-10 text-center text-sm text-black/50">Loading…</p>;
  }

  if (meta.already_submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-black">
        <h1 className="font-serif text-2xl font-bold" style={{ color: PINK }}>
          Thank you
        </h1>
        <p className="mt-3 text-sm">We already have a clinical intake on file for this request. The team will be in touch.</p>
        {meta.intake_flags?.submitted_at ? (
          <p className="mt-2 text-xs text-black/50">
            Submitted {new Date(meta.intake_flags.submitted_at).toLocaleString()}
          </p>
        ) : null}
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-black">
        <h1 className="font-serif text-2xl font-bold" style={{ color: PINK }}>
          Thank you
        </h1>
        <p className="mt-3 text-sm">
          Your information was received. Our clinical team will review your responses
          {flagsReview ? " (including the items you indicated for provider review) " : " "}
          and follow up with you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl space-y-8 px-4 py-8 pb-16 text-black md:px-6"
    >
      <header>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>
          Hello Gorgeous — Contour / Quantum
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold md:text-3xl">Clinical intake</h1>
        <p className="mt-2 text-sm text-black/70">
          This form is for <strong>Contour Lift™ / Quantum RF</strong> candidacy. Answer accurately; a “yes” to any
          safety item flags our provider team for review (not an automatic decline).
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Contact &amp; identity</h2>
        <label className="block text-sm">
          <span className="font-semibold">Full legal name *</span>
          <input
            required
            className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Date of birth * (YYYY-MM-DD)</span>
          <input
            required
            type="date"
            className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Phone *</span>
          <input
            required
            className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            autoComplete="tel"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Email * (must match your request)</span>
          <input
            required
            type="email"
            readOnly
            className="mt-1 w-full min-h-11 cursor-not-allowed border-2 border-black/20 bg-black/[0.04] px-2 py-2"
            value={email}
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold">Street address *</span>
            <input
              required
              className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              autoComplete="street-address"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">City *</span>
            <input required className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">State *</span>
            <input required className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2" value={stateUS} onChange={(e) => setStateUS(e.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold">ZIP *</span>
            <input required className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2" value={zip} onChange={(e) => setZip(e.target.value)} autoComplete="postal-code" />
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold">Emergency contact name *</span>
            <input
              required
              className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
              value={emgName}
              onChange={(e) => setEmgName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Emergency contact phone *</span>
            <input
              required
              className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
              value={emgPhone}
              onChange={(e) => setEmgPhone(e.target.value)}
              type="tel"
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-semibold">Treatment area of interest *</span>
          <input
            required
            className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
            value={treatmentInterest}
            onChange={(e) => setTreatmentInterest(e.target.value)}
            placeholder="e.g. submental, abdomen, neck…"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Fitzpatrick skin type *</span>
          <select
            className="mt-1 w-full min-h-11 border-2 border-black bg-white px-2 py-2"
            value={fitzpatrick}
            onChange={(e) => setFitzpatrick(e.target.value)}
          >
            <option value="1">I</option>
            <option value="2">II</option>
            <option value="3">III</option>
            <option value="4">IV</option>
            <option value="5">V</option>
            <option value="6">VI</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Recent UV or tanning exposure *</span>
          <input
            required
            className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
            value={uv}
            onChange={(e) => setUv(e.target.value)}
            placeholder="None / dates / type"
          />
        </label>
        <fieldset className="text-sm">
          <legend className="font-semibold">Self-tanner use *</legend>
          <label className="mt-1 flex items-center gap-2">
            <input type="radio" checked={!selfTanner} onChange={() => setSelfTanner(false)} />
            No
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={selfTanner} onChange={() => setSelfTanner(true)} />
            Yes
          </label>
        </fieldset>
        <label className="block text-sm">
          <span className="font-semibold">Current medications (or “None”)</span>
          <textarea className="mt-1 w-full border-2 border-black px-2 py-2" rows={3} value={meds} onChange={(e) => setMeds(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Allergies (or “None”)</span>
          <textarea className="mt-1 w-full border-2 border-black px-2 py-2" rows={2} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Relevant medical history *</span>
          <textarea
            required
            className="mt-1 w-full border-2 border-black px-2 py-2"
            rows={3}
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Surgeries, conditions, prior aesthetic treatments, etc."
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-semibold">Height (inches)</span>
            <input
              className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Weight (lb)</span>
            <input
              className="mt-1 w-full min-h-11 border-2 border-black px-2 py-2"
              value={weightLb}
              onChange={(e) => setWeightLb(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <p className="text-sm self-end text-black/70">
            BMI (est.): {bmi != null ? bmi : "—"}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">Safety &amp; contraindications</h2>
        <p className="mt-1 text-sm text-black/70">Check the box if the statement applies to you. Any check flags provider review.</p>
        <ul className="mt-3 space-y-2">
          {CL_INTAKE_CONTRA_ITEMS.map((it) => (
            <li key={it.id} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                id={it.id}
                checked={contra[it.id]}
                onChange={() => toggleContra(it.id)}
                className="mt-0.5 h-4 w-4"
              />
              <label htmlFor={it.id}>{it.label}</label>
            </li>
          ))}
        </ul>
      </section>

      {saveErr ? <p className="text-sm text-red-800">{saveErr}</p> : null}

      <div className="border-t-2 border-black/10 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="min-h-12 w-full max-w-sm border-2 border-black px-4 font-bold text-white"
          style={{ backgroundColor: PINK, borderColor: PINK }}
        >
          {saving ? "Submitting…" : "Submit intake"}
        </button>
        <p className="mt-2 text-xs text-black/50">
          By submitting, you confirm the information is accurate to the best of your knowledge. This is not a substitute
          for an in-person exam.
        </p>
      </div>
    </form>
  );
}
