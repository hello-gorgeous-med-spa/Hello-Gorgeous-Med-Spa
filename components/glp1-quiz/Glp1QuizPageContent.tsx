"use client";

import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { useMemo, useState } from "react";

import {
  ABSOLUTE_FLAGS,
  EMPTY_GLP1_QUIZ,
  GLP1_QUIZ_CONSULT_HREF,
  GLP1_QUIZ_DQ_COPY,
  GLP1_QUIZ_DQ_EXCEPTION,
  GLP1_QUIZ_NURSE_CTA,
  GLP1_QUIZ_PATH,
  GLP1_QUIZ_SMS,
  GLP1_QUIZ_STEPS,
  GLP1_QUIZ_TRUST,
  GLP1_REASONS,
  GLP1_TYPES,
  REVIEW_FLAGS,
  YES_NO,
  YES_NO_UNSURE,
  bmiLabel,
  computeBmi,
  glp1QuizShareUrl,
  validateGlp1QuizStep,
  type Glp1QuizBrand,
  type Glp1QuizForm,
  type Glp1QuizStatus,
} from "@/lib/glp1-quiz";
import { SITE } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const BRAND = {
  hg: {
    bg: "#0b0a0b",
    card: "#141214",
    ink: "#fff7f4",
    muted: "rgba(255,247,244,0.62)",
    accent: "#E6007E",
    gold: "#D4A373",
    logo: "/icons/icon-192x192.png",
    logoAlt: "Hello Gorgeous Med Spa",
    home: "/",
    name: "Hello Gorgeous",
  },
  regen: {
    bg: "#05080f",
    card: "#0d1524",
    ink: "#f4f7ff",
    muted: "rgba(244,247,255,0.62)",
    accent: "#2563eb",
    gold: "#0D9488",
    logo: "/images/regen/logo-full.png",
    logoAlt: "REGEN RX",
    home: "/",
    name: "REGEN RX",
  },
} as const;

function Choice({
  options,
  value,
  onChange,
  accent,
}: {
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  accent: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className="rounded-2xl border px-4 py-3 text-left text-sm font-medium transition"
            style={{
              borderColor: on ? accent : "rgba(255,255,255,0.12)",
              background: on ? `${accent}22` : "transparent",
              color: "#fff",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">{label}</span>
      {children}
      {error ? <span className="block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30";

export function Glp1QuizPageContent({ brand }: { brand: Glp1QuizBrand }) {
  const t = BRAND[brand];
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [form, setForm] = useState<Glp1QuizForm>(EMPTY_GLP1_QUIZ);
  const [errors, setErrors] = useState<Partial<Record<keyof Glp1QuizForm, string>>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{
    status: Glp1QuizStatus;
    hardFlags: string[];
    reviewFlags: string[];
    bmi: number | null;
  } | null>(null);
  const [fail, setFail] = useState("");
  const [staffPin, setStaffPin] = useState("");
  const [board, setBoard] = useState<Array<Record<string, unknown>> | null>(null);

  const bmi = useMemo(
    () => computeBmi(form.heightFt, form.heightIn, form.weightLbs),
    [form.heightFt, form.heightIn, form.weightLbs],
  );

  const set = <K extends keyof Glp1QuizForm>(key: K, value: Glp1QuizForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    const e = validateGlp1QuizStep(form, step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 2) setStep((s) => (s + 1) as 0 | 1 | 2);
  };

  const submit = async () => {
    const e = validateGlp1QuizStep(form, 2);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setFail("");
    try {
      const res = await fetch("/api/glp-1-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setFail(json.error || "Could not send. Call 630-636-6193.");
        if (json.errors) setErrors(json.errors);
        return;
      }
      setDone({
        status: json.status,
        hardFlags: json.hardFlags ?? [],
        reviewFlags: json.reviewFlags ?? [],
        bmi: json.bmi ?? bmi,
      });
    } catch {
      setFail("Could not send. Call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  };

  const loadBoard = async () => {
    const res = await fetch("/api/glp-1-quiz", { headers: { "x-staff-pin": staffPin } });
    const json = await res.json();
    setBoard(json.entries ?? []);
  };

  if (done) {
    const held = done.status === "disqualified";
    return (
      <div className={`${inter.className} min-h-screen px-5 py-16`} style={{ background: t.bg, color: t.ink }}>
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 p-8 text-center" style={{ background: t.card }}>
          <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: t.gold }}>
            {t.name} · GLP-1 screening
          </p>
          <h1 className={`${cormorant.className} mt-3 text-[36px]`}>
            {held ? "It looks like you may not qualify" : done.status === "needs_review" ? "Needs clinician review" : "Screening received"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: t.muted }}>
            {held ? GLP1_QUIZ_DQ_COPY : "A licensed Illinois clinician reviews every request. This is not a prescription and not a guaranteed start."}
          </p>
          {held ? (
            <p className="mt-3 text-sm" style={{ color: t.muted }}>
              {GLP1_QUIZ_DQ_EXCEPTION}
            </p>
          ) : null}
          {done.hardFlags.length ? (
            <ul className="mt-5 space-y-1 text-left text-sm text-rose-200">
              {done.hardFlags.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          ) : null}
          <a
            href={GLP1_QUIZ_CONSULT_HREF}
            className="mt-8 inline-flex rounded-full px-8 py-3 text-sm font-bold text-white"
            style={{ background: t.accent }}
          >
            {GLP1_QUIZ_NURSE_CTA}
          </a>
          <p className="mt-4 text-xs" style={{ color: t.muted }}>
            Ryan Kent, FNP-BC · $49 phone visit · credited toward therapy if prescribed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen`} style={{ background: t.bg, color: t.ink }}>
      <header className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href={t.home} className="flex items-center gap-3">
            <Image src={t.logo} alt={t.logoAlt} width={160} height={48} className="h-10 w-auto" />
          </Link>
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-xs font-semibold" style={{ color: t.gold }}>
            {SITE.phone}
          </a>
        </div>
        <div className="mx-auto mt-3 flex max-w-3xl flex-wrap gap-2">
          {GLP1_QUIZ_TRUST.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70"
            >
              {item}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-8 grid grid-cols-3 gap-2">
          {GLP1_QUIZ_STEPS.map((s, i) => {
            const on = i === step;
            const doneStep = i < step;
            return (
              <div key={s.id} className="text-center">
                <div
                  className="h-1.5 rounded-full"
                  style={{ background: on || doneStep ? t.accent : "rgba(255,255,255,0.12)" }}
                />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: on ? t.ink : t.muted }}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: t.gold }}>
          {t.name} · Medical weight-loss screening
        </p>
        <h1 className={`${cormorant.className} mt-2 text-4xl`}>See if GLP-1 care may fit.</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: t.muted }}>
          Three steps. A licensed Illinois clinician reviews every request. This is not a diagnosis, dose, or
          guaranteed prescription. Compounded medication is not FDA-approved.
        </p>

        {step === 0 ? (
          <section className="mt-8 space-y-6 rounded-[28px] border border-white/10 p-6" style={{ background: t.card }}>
            <Field label="What GLP-1 are you asking about?" error={errors.glpType}>
              <Choice options={GLP1_TYPES} value={form.glpType} onChange={(id) => set("glpType", id)} accent={t.accent} />
            </Field>
            <Field label="Primary reason" error={errors.reason}>
              <Choice options={GLP1_REASONS} value={form.reason} onChange={(id) => set("reason", id)} accent={t.accent} />
            </Field>
            <Field label="Your goals" error={errors.goals}>
              <textarea className={inputClass} rows={3} value={form.goals} onChange={(e) => set("goals", e.target.value)} />
            </Field>
            <Field label="Have you used a GLP-1 before?" error={errors.priorGlp1}>
              <Choice
                options={[
                  { id: "never", label: "No" },
                  { id: "yes", label: "Yes" },
                  { id: "stopped", label: "Yes — I stopped" },
                ]}
                value={form.priorGlp1}
                onChange={(id) => set("priorGlp1", id)}
                accent={t.accent}
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Height (ft)" error={errors.heightFt}>
                <input className={inputClass} inputMode="numeric" value={form.heightFt} onChange={(e) => set("heightFt", e.target.value)} />
              </Field>
              <Field label="Height (in)">
                <input className={inputClass} inputMode="numeric" value={form.heightIn} onChange={(e) => set("heightIn", e.target.value)} />
              </Field>
              <Field label="Weight (lb)" error={errors.weightLbs}>
                <input className={inputClass} inputMode="numeric" value={form.weightLbs} onChange={(e) => set("weightLbs", e.target.value)} />
              </Field>
            </div>
            {bmi != null ? (
              <p className="text-sm" style={{ color: t.gold }}>
                BMI {bmi} · {bmiLabel(bmi)} — we confirm at consult
              </p>
            ) : null}
            <Field label="Recent weight-loss attempts">
              <input className={inputClass} value={form.recentAttempts} onChange={(e) => set("recentAttempts", e.target.value)} />
            </Field>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="mt-8 space-y-5 rounded-[28px] border border-white/10 p-6" style={{ background: t.card }}>
            <Field label="Full name" error={errors.fullName}>
              <input className={inputClass} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Date of birth" error={errors.dob}>
                <input type="date" className={inputClass} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
            </div>
            <Field label="Email" error={errors.email}>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Street address" error={errors.address}>
              <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="City" error={errors.city}>
                <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label="State" error={errors.state}>
                <input className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value.toUpperCase())} />
              </Field>
              <Field label="ZIP" error={errors.zip}>
                <input className={inputClass} value={form.zip} onChange={(e) => set("zip", e.target.value)} />
              </Field>
            </div>
            <p className="text-xs" style={{ color: t.muted }}>
              Telehealth GLP-1 review is for Illinois adults 21+. If you live outside Illinois, we will ask you to
              see a local clinician.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Emergency contact">
                <input className={inputClass} value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} />
              </Field>
              <Field label="Emergency phone">
                <input className={inputClass} value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} />
              </Field>
            </div>
            <Field label="How did you hear about us?">
              <input className={inputClass} value={form.howHeard} onChange={(e) => set("howHeard", e.target.value)} />
            </Field>
            <p className="text-xs leading-relaxed" style={{ color: t.muted }}>
              After a clinician approves, we send a clinic invoice. Medication is filled by a licensed compounding
              pharmacy (503A, patient-specific) when that is the plan. You do not place the pharmacy order yourself.
            </p>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="mt-8 space-y-8 rounded-[28px] border border-white/10 p-6" style={{ background: t.card }}>
            <div>
              <h2 className={`${cormorant.className} text-2xl`}>Section A · Safety stops</h2>
              <p className="mt-1 text-xs" style={{ color: t.muted }}>
                Yes on any of these holds telemedicine GLP-1 on this form.
              </p>
              <div className="mt-4 space-y-4">
                {ABSOLUTE_FLAGS.map((f) => (
                  <Field key={f.id} label={f.label} error={errors[f.id]}>
                    <Choice options={YES_NO} value={form[f.id]} onChange={(id) => set(f.id, id)} accent={t.accent} />
                  </Field>
                ))}
              </div>
            </div>
            <div>
              <h2 className={`${cormorant.className} text-2xl`}>Section B · Needs review</h2>
              <div className="mt-4 space-y-4">
                {REVIEW_FLAGS.map((f) => (
                  <Field key={f.id} label={f.label} error={errors[f.id]}>
                    <Choice options={YES_NO_UNSURE} value={form[f.id]} onChange={(id) => set(f.id, id)} accent={t.accent} />
                  </Field>
                ))}
                {form.type2 === "yes" ? (
                  <Field label="Most recent A1C if you know it">
                    <input className={inputClass} value={form.a1c} onChange={(e) => set("a1c", e.target.value)} />
                  </Field>
                ) : null}
              </div>
            </div>
            <div>
              <h2 className={`${cormorant.className} text-2xl`}>Section C · Meds & allergies</h2>
              <div className="mt-4 space-y-4">
                <Field label="Current medications (or None)" error={errors.meds}>
                  <textarea className={inputClass} rows={2} value={form.meds} onChange={(e) => set("meds", e.target.value)} />
                </Field>
                <Field label="Insulin?">
                  <Choice options={YES_NO} value={form.insulin} onChange={(id) => set("insulin", id)} accent={t.accent} />
                </Field>
                <Field label="Sulfonylurea?">
                  <Choice options={YES_NO} value={form.sulfonylurea} onChange={(id) => set("sulfonylurea", id)} accent={t.accent} />
                </Field>
                <Field label="Blood thinners?">
                  <Choice options={YES_NO} value={form.bloodThinners} onChange={(id) => set("bloodThinners", id)} accent={t.accent} />
                </Field>
                <Field label="Allergies (or None)" error={errors.allergies}>
                  <input className={inputClass} value={form.allergies} onChange={(e) => set("allergies", e.target.value)} />
                </Field>
                <Field label="Supplements">
                  <input className={inputClass} value={form.supplements} onChange={(e) => set("supplements", e.target.value)} />
                </Field>
                <Field label="Alcohol per week">
                  <input className={inputClass} value={form.alcohol} onChange={(e) => set("alcohol", e.target.value)} />
                </Field>
                <Field label="Smoking or vaping">
                  <input className={inputClass} value={form.smoking} onChange={(e) => set("smoking", e.target.value)} />
                </Field>
              </div>
            </div>
            <div>
              <h2 className={`${cormorant.className} text-2xl`}>Section D · Lifestyle</h2>
              <div className="mt-4 space-y-4">
                <Field label="How do you eat most days?">
                  <input className={inputClass} value={form.diet} onChange={(e) => set("diet", e.target.value)} />
                </Field>
                <Field label="Exercise per week">
                  <input className={inputClass} value={form.exercise} onChange={(e) => set("exercise", e.target.value)} />
                </Field>
                <Field label="Sleep">
                  <input className={inputClass} value={form.sleep} onChange={(e) => set("sleep", e.target.value)} />
                </Field>
                <Field label="Willing to change food, movement, and follow-up?" error={errors.willingChanges}>
                  <Choice options={YES_NO} value={form.willingChanges} onChange={(id) => set("willingChanges", id)} accent={t.accent} />
                </Field>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 p-4 text-sm" style={{ color: t.muted }}>
              <p>Photo ID and a selfie are collected at the consult — do not upload them on this page.</p>
              {(
                [
                  ["ackRxOnly", "I understand a request is not a prescription. A licensed Illinois clinician decides."],
                  ["ackSideEffects", "I understand GLP-1 medicines can have side effects and need monitoring."],
                  ["ackCompounded", "I understand compounded medication is not FDA-approved for this use."],
                  ["ackSms", "I agree you may text or email me about this request at the number and email I gave."],
                  ["ackHipaa", "I have read the privacy notice and agree you may use this information for my care."],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex gap-3 text-left text-white/80">
                  <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} />
                  <span>{label}</span>
                </label>
              ))}
              {errors.ackRxOnly || errors.ackHipaa ? <p className="text-xs text-rose-300">All five boxes are required.</p> : null}
            </div>
            {fail ? <p className="text-sm text-rose-300">{fail}</p> : null}
          </section>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" className="text-sm text-white/60" onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full px-8 py-3 text-sm font-bold text-white"
              style={{ background: t.accent }}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={submit}
              className="rounded-full px-8 py-3 text-sm font-bold text-white disabled:opacity-60"
              style={{ background: t.accent }}
            >
              {busy ? "Sending…" : "Submit for review"}
            </button>
          )}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs" style={{ color: t.muted }}>
          <p>
            Text this quiz:{" "}
            <a className="underline" href={`sms:?&body=${encodeURIComponent(GLP1_QUIZ_SMS)}`}>
              {glp1QuizShareUrl(brand)}
            </a>
          </p>
          <p className="mt-4">Staff board</p>
          <div className="mt-2 flex gap-2">
            <input
              className={inputClass}
              placeholder="Staff PIN"
              value={staffPin}
              onChange={(e) => setStaffPin(e.target.value)}
            />
            <button type="button" onClick={loadBoard} className="rounded-xl border border-white/20 px-3 py-2">
              Load
            </button>
          </div>
          {board ? (
            <p className="mt-2">{board.length} quiz rows in queue.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { GLP1_QUIZ_PATH };
