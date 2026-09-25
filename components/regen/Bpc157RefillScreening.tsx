"use client";

import { Cormorant_Garamond, Inter } from "next/font/google";
import { useMemo, useState } from "react";

import {
  ADHERENCE_OPTIONS,
  ALCOHOL_OPTIONS,
  BENEFIT_WHEN,
  CONDITION_OPTIONS,
  EMPTY_BPC157_REFILL,
  FORM_TYPES,
  MISSED_OPTIONS,
  SAFETY_FLAGS,
  STORAGE_OPTIONS,
  bpc157RedFlags,
  validateBpc157Refill,
  type Bpc157RefillErrors,
  type Bpc157RefillForm,
} from "@/lib/regen/bpc-157-refill-screening";
import { RegenCompoundShop } from "@/components/regen/RegenCompoundShop";
import {
  formatRequestPrice,
  inferFormTypeFromSku,
  REGEN_REFILL_REQUEST_SMS,
  REGEN_REQUEST_ACK,
  regenRequestShareUrl,
  regenRequestSkuById,
  regenRequestSkuGroups,
  smsRegenRequestHref,
  type RegenRequestIntent,
  type RegenRequestSku,
} from "@/lib/regen/refill-request-catalog";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });

function Field({
  label,
  error,
  span,
  children,
}: {
  label: string;
  error?: string;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-white/45">{label}</span>
      {children}
      {error ? <p className="mt-1 text-[11px] text-red-300">{error}</p> : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-[#121216] px-4 py-2.5 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-[#f5c2c7]/50 focus:ring-2 focus:ring-[#f5c2c7]/20";

function YesNo({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <div className={`flex shrink-0 gap-1 rounded-full border bg-black/40 p-1 ${error ? "border-red-400/40" : "border-white/10"}`}>
      {["Yes", "No"].map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`h-7 rounded-full px-3 text-[11px] font-medium tracking-wide transition ${
            value === r ? (r === "Yes" ? "bg-red-400 text-black" : "bg-white text-black") : "text-white/50 hover:text-white/80"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

function SafetyRow({
  label,
  value,
  detail,
  onChange,
  error,
}: {
  label: string;
  value: string;
  detail: string;
  onChange: (v: string, detail?: string) => void;
  error?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border px-4 py-3.5 ${
        value === "Yes" ? "border-red-400/30 bg-red-500/5" : "border-white/10 bg-[#121216]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[12.5px] leading-snug ${value === "Yes" ? "text-red-200" : "text-white/75"}`}>{label}</span>
        <YesNo value={value} onChange={(v) => onChange(v, detail)} error={!!error} />
      </div>
      {value === "Yes" ? (
        <textarea
          value={detail}
          onChange={(e) => onChange(value, e.target.value)}
          placeholder="Describe — when, severity, action taken..."
          rows={2}
          className="w-full rounded-xl border border-red-300/20 bg-black/40 px-4 py-2.5 text-[12px] text-white placeholder:text-white/30 outline-none"
        />
      ) : null}
      {error ? <p className="text-[11px] text-red-300">{error}</p> : null}
    </div>
  );
}

function Section({ n, title, desc, children }: { n: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] border border-white/[0.08] bg-[#0d0d11] p-5 md:p-6">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#f5c2c7]">{n}</p>
      <h2 className={`${cormorant.className} mt-1 text-[26px]`}>{title}</h2>
      <p className="mt-1 mb-5 text-[13px] text-white/45">{desc}</p>
      {children}
    </section>
  );
}

export function Bpc157RefillScreening({
  initialSkuId,
  initialIntent,
}: {
  initialSkuId?: string;
  initialIntent?: "refill" | "add";
}) {
  const seedSku = regenRequestSkuById(initialSkuId);
  const [form, setForm] = useState<Bpc157RefillForm>({
    ...EMPTY_BPC157_REFILL,
    skuId: seedSku?.id ?? "",
    requestIntent: initialIntent ?? "",
    strength: seedSku?.pack ?? "",
    formType: seedSku ? inferFormTypeFromSku(seedSku) : "",
  });
  const [errors, setErrors] = useState<Bpc157RefillErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ redFlags: string[] } | null>(null);
  const [copied, setCopied] = useState("");
  const [staffPin, setStaffPin] = useState("");
  const [staffRows, setStaffRows] = useState<
    Array<{
      id: string;
      createdAt: string;
      name: string;
      requestIntent: string;
      skuName: string;
      priceLabel: string;
      formType: string;
      improvement: number;
      adherence: string;
      redFlags: string[];
    }>
  >([]);
  const [staffErr, setStaffErr] = useState("");

  const liveFlags = useMemo(() => bpc157RedFlags(form), [form]);
  const selectedSku = regenRequestSkuById(form.skuId);
  const productName = selectedSku?.name ?? "this medication";

  function set<K extends keyof Bpc157RefillForm>(key: K, value: Bpc157RefillForm[K]) {
    setForm((cur) => ({ ...cur, [key]: value }));
  }

  function applySku(sku: RegenRequestSku, intent?: RegenRequestIntent) {
    setForm((cur) => ({
      ...cur,
      skuId: sku.id,
      requestIntent: intent ?? cur.requestIntent,
      strength: sku.pack,
      formType: inferFormTypeFromSku(sku),
    }));
  }

  function pickFromShop(sku: RegenRequestSku) {
    applySku(sku);
    window.setTimeout(() => {
      document.getElementById("screening")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function toggleCondition(c: string) {
    setForm((cur) => {
      if (c === "None") return { ...cur, conditions: cur.conditions.includes("None") ? [] : ["None"] };
      const withoutNone = cur.conditions.filter((x) => x !== "None");
      return {
        ...cur,
        conditions: withoutNone.includes(c) ? withoutNone.filter((x) => x !== c) : [...withoutNone, c],
      };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateBpc157Refill(form);
    setErrors(next);
    if (Object.keys(next).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/regen/refill-screening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrors(data.errors ?? { fullName: data.error || "Could not save." });
        return;
      }
      setDone({ redFlags: data.redFlags ?? [] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        regenRequestShareUrl({ skuId: form.skuId, intent: form.requestIntent }),
      );
      setCopied("Copied");
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("Failed");
    }
  }

  async function loadStaff() {
    setStaffErr("");
    const res = await fetch("/api/regen/refill-screening", { headers: { "x-staff-pin": staffPin } });
    const data = await res.json();
    if (!res.ok) {
      setStaffErr(data.error || "Staff PIN required.");
      return;
    }
    setStaffRows(data.entries ?? []);
  }

  function downloadCsv() {
    const rows = [
      ["Time", "Client", "Intent", "Protocol", "Price", "Form", "% Improvement", "Adherence", "Red Flags"],
      ...staffRows.map((r) => [
        r.createdAt,
        r.name,
        r.requestIntent,
        r.skuName,
        r.priceLabel,
        r.formType,
        String(r.improvement),
        r.adherence,
        r.redFlags.join("; "),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regen-refill-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const sans = inter.className;
  const serif = cormorant.className;

  if (done) {
    const held = done.redFlags.length > 0;
    return (
      <div className={`${sans} min-h-screen bg-[#050507] px-5 py-16 text-white`}>
        <div className="mx-auto max-w-xl rounded-[24px] border border-white/10 bg-[#0d0d11] p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5c2c7]">Hello Gorgeous Medical Spa</p>
          <h1 className={`${serif} mt-3 text-[36px]`}>{held ? "Red Flags — Requires Review" : "Screening Received."}</h1>
          <p className="mt-3 text-[14px] text-white/60">
            {held
              ? "Your answers triggered a clinical hold. Ryan reviews before any refill is invoiced or sent."
              : "Clinical team will review within 1 business day. A refill is another review — not an automatic fill."}
          </p>
          {held ? (
            <ul className="mt-5 space-y-1 text-left text-[13px] text-red-200">
              {done.redFlags.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setForm({
                ...EMPTY_BPC157_REFILL,
                skuId: seedSku?.id ?? "",
                requestIntent: initialIntent ?? "",
                strength: seedSku?.pack ?? "",
                formType: seedSku ? inferFormTypeFromSku(seedSku) : "",
              });
            }}
            className="mt-8 rounded-full bg-[#f5c2c7] px-6 py-3 text-[13px] text-black"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sans} min-h-screen bg-[#050507] text-white selection:bg-[#f5c2c7]/30`}>
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4 md:px-8">
          <p className={`${serif} text-[15px] tracking-[0.12em] uppercase`}>Hello Gorgeous Medical Spa</p>
          <p className="hidden text-[10px] uppercase tracking-[0.18em] text-white/40 md:inline">REGEN RX Request</p>
          <div className="flex gap-2">
            <a href={smsRegenRequestHref()} className="h-8 rounded-full border border-white/10 px-3 text-[11px] leading-8 text-white/70">
              Text This Form
            </a>
            <button type="button" onClick={copyLink} className="h-8 rounded-full border border-white/10 px-3 text-[11px] text-white/70">
              {copied || "Copy link"}
            </button>
          </div>
        </div>
      </header>

      <RegenCompoundShop
        selectedId={form.skuId}
        intent={form.requestIntent}
        serifClassName={serif}
        onIntent={(id) => set("requestIntent", id)}
        onPick={pickFromShop}
      />

      <div className="mx-auto grid max-w-[1120px] items-start gap-8 px-5 py-8 md:px-8 md:py-12 lg:grid-cols-[1.15fr_0.85fr]">
        <form id="screening" onSubmit={submit} className="space-y-6 scroll-mt-6">
          <div className="mb-2">
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#f5c2c7]">
              Screening · Medical protocol
            </p>
            <h2 className={`${serif} text-[36px] leading-[0.95] tracking-[-0.03em] md:text-[44px]`}>
              Complete your
              <br />
              <span className="italic font-normal text-[#f5c2c7]">request</span>
            </h2>
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-white/55">
              We Screen You Like A Medical Practice Because We Are One. Ryan reviews every request. Red-flag answers
              trigger a clinical hold — not an automatic fill.
            </p>
          </div>

          <Section n="00" title="Your request" desc="Refill an existing protocol, or ask to add something new.">
            <div className="mb-4 flex flex-wrap gap-2">
              {(
                [
                  ["refill", "Requesting a refill"],
                  ["add", "I would like to add"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set("requestIntent", id)}
                  className={`rounded-full border px-4 py-2 text-[12px] ${
                    form.requestIntent === id
                      ? "border-[#f5c2c7] bg-[#f5c2c7] text-black"
                      : "border-white/15 text-white/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.requestIntent ? <p className="mb-2 text-[11px] text-red-300">{errors.requestIntent}</p> : null}
            <Field label="Protocol / SKU *" error={errors.skuId}>
              <select
                className={inputCls}
                value={form.skuId}
                onChange={(e) => {
                  const next = regenRequestSkuById(e.target.value);
                  setForm((cur) => ({
                    ...cur,
                    skuId: e.target.value,
                    strength: next?.pack ?? cur.strength,
                    formType: next ? inferFormTypeFromSku(next) : cur.formType,
                  }));
                }}
              >
                <option value="">Select what you want…</option>
                {regenRequestSkuGroups().map((g) => (
                  <optgroup key={g.hub} label={g.label}>
                    {g.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — {formatRequestPrice(item)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
            {selectedSku ? (
              <div className="mt-4 rounded-xl border border-[#f5c2c7]/25 bg-[#f5c2c7]/5 px-4 py-3 text-[13px]">
                <p className="text-[#f5c2c7]">
                  {selectedSku.name}
                  {selectedSku.sku !== "review" ? ` · SKU ${selectedSku.sku}` : ""}
                </p>
                <p className="mt-1 text-white/70">{selectedSku.pack}</p>
                <p className="mt-1 font-medium text-white">{formatRequestPrice(selectedSku)}</p>
                <p className="mt-2 text-[11px] text-white/40">
                  Patient price from Formulation sheet × 2.5. A refill is another review — not an automatic fill.
                </p>
              </div>
            ) : null}
          </Section>

          <Section n="01" title="Identity & Compliance" desc="Required for chart matching and safe dispensing.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" error={errors.fullName}>
                <input className={inputCls} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane A. Doe" />
              </Field>
              <Field label="DOB *" error={errors.dob}>
                <input className={inputCls} type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
              </Field>
              <Field label="Phone *" error={errors.phone}>
                <input className={inputCls} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 000-0000" />
              </Field>
              <Field label="Email *" error={errors.email}>
                <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
              </Field>
              <Field label="Form requesting refill *" error={errors.formType}>
                <select className={inputCls} value={form.formType} onChange={(e) => set("formType", e.target.value)}>
                  <option value="">Select…</option>
                  {FORM_TYPES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field
                label={form.requestIntent === "add" ? "Strength / dose you want *" : "Strength / dose currently using *"}
                error={errors.strength}
              >
                <input className={inputCls} value={form.strength} onChange={(e) => set("strength", e.target.value)} placeholder="e.g. 500mcg daily SubQ" />
              </Field>
              <Field label="How stored?">
                <select className={inputCls} value={form.storedHow} onChange={(e) => set("storedHow", e.target.value)}>
                  <option value="">Select…</option>
                  {STORAGE_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Missed doses last 2 weeks?">
                <select className={inputCls} value={form.missedDoses} onChange={(e) => set("missedDoses", e.target.value)}>
                  <option value="">Select…</option>
                  {MISSED_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reconstitution date (if applicable)">
                <input className={inputCls} type="date" value={form.reconstDate} onChange={(e) => set("reconstDate", e.target.value)} />
              </Field>
              <Field label="Requesting early? Why?" span>
                <textarea className={inputCls} rows={2} value={form.earlyWhy} onChange={(e) => set("earlyWhy", e.target.value)} placeholder="Travel, lost vial, dose adjustment discussed..." />
              </Field>
              {form.missedDoses && form.missedDoses !== "None" ? (
                <Field label="Why missed?" span>
                  <textarea className={inputCls} rows={2} value={form.missedWhy} onChange={(e) => set("missedWhy", e.target.value)} placeholder="Illness, forgot, injection anxiety..." />
                </Field>
              ) : null}
            </div>
          </Section>

          <Section n="02" title="Indication & Response" desc="Helps us confirm continued benefit.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Original goal / symptom for ${productName} *`} error={errors.originalGoal} span>
                <textarea className={inputCls} rows={2} value={form.originalGoal} onChange={(e) => set("originalGoal", e.target.value)} placeholder="e.g., Gut repair post NSAID use, shoulder tendinopathy, post-op healing support..." />
              </Field>
              <Field label="Exact % (0-100)" span>
                <div>
                  <input type="range" min={0} max={100} value={form.improvement} onChange={(e) => set("improvement", Number(e.target.value))} className="w-full accent-[#f5c2c7]" />
                  <div className="mt-1 flex justify-between text-[11px] text-white/40">
                    <span>0% No change</span>
                    <span className="text-[#f5c2c7]">{form.improvement}%</span>
                    <span>100% Resolved</span>
                  </div>
                </div>
              </Field>
              <Field label="First noticed benefit *" error={errors.firstBenefit}>
                <select className={inputCls} value={form.firstBenefit} onChange={(e) => set("firstBenefit", e.target.value)}>
                  <option value="">Select…</option>
                  {BENEFIT_WHEN.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="What makes better / worse">
                <input className={inputCls} value={form.betterWorse} onChange={(e) => set("betterWorse", e.target.value)} placeholder="Rest, PT, sleep, stress..." />
              </Field>
              <Field label="Re-injury, new injury, surgery, change in activity since last fill?" span>
                <textarea className={inputCls} rows={2} value={form.reinjury} onChange={(e) => set("reinjury", e.target.value)} placeholder="No changes, or describe..." />
              </Field>
            </div>
          </Section>

          <Section n="03" title="Safety Stop Light" desc="Yes/No — If Yes, details required. Any Yes = clinical review.">
            <div className="space-y-3">
              {SAFETY_FLAGS.filter((f) => !("injectableOnly" in f && f.injectableOnly) || form.formType === "Injectable SubQ").map((f) => (
                <SafetyRow
                  key={f.id}
                  label={f.label}
                  value={form[f.id]}
                  detail={form[`${f.id}Detail` as keyof Bpc157RefillForm] as string}
                  error={errors[f.id]}
                  onChange={(v, d) =>
                    setForm((cur) => ({
                      ...cur,
                      [f.id]: v,
                      [`${f.id}Detail`]: d ?? cur[`${f.id}Detail` as keyof Bpc157RefillForm],
                    }))
                  }
                />
              ))}
              {form.formType === "Injectable SubQ" ? (
                <SafetyRow
                  label="Rotating sites and new needle each time?"
                  value={form.s6Rotating === "No" ? "No" : form.s6Rotating === "Yes" ? "Yes" : ""}
                  detail=""
                  onChange={(v) => set("s6Rotating", v)}
                />
              ) : null}
              <Field label="Any other side effects" span>
                <textarea className={inputCls} rows={2} value={form.otherSideEffects} onChange={(e) => set("otherSideEffects", e.target.value)} placeholder="None, or describe..." />
              </Field>
            </div>
          </Section>

          <Section n="04" title="Medical Update" desc="Changes since last fill affect safety.">
            <p className="mb-3 text-[11px] uppercase tracking-widest text-white/40">New medical conditions?</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {CONDITION_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCondition(c)}
                  className={`h-9 rounded-full border px-3.5 text-[12px] transition ${
                    form.conditions.includes(c)
                      ? "border-[#f5c2c7] bg-[#f5c2c7] text-black"
                      : "border-white/15 text-white/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {form.conditions.includes("Other") ? (
              <Field label="Describe other condition" span>
                <input className={inputCls} value={form.conditionOther} onChange={(e) => set("conditionOther", e.target.value)} />
              </Field>
            ) : null}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Pregnant / TTC / breastfeeding? *" error={errors.pregnant}>
                <select className={inputCls} value={form.pregnant} onChange={(e) => set("pregnant", e.target.value)}>
                  <option value="">Select…</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </Field>
              <Field label="Weight change?">
                <input className={inputCls} value={form.weightChange} onChange={(e) => set("weightChange", e.target.value)} placeholder="e.g., +3lb, stable" />
              </Field>
              <Field label="Alcohol per week">
                <select className={inputCls} value={form.alcohol} onChange={(e) => set("alcohol", e.target.value)}>
                  <option value="">Select…</option>
                  {ALCOHOL_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="New medications / supplements / peptides? * Include blood thinners, NSAIDs, steroids, other peptides, hormone therapy"
                error={errors.newMeds}
                span
              >
                <textarea className={inputCls} rows={2} value={form.newMeds} onChange={(e) => set("newMeds", e.target.value)} placeholder="List all new meds, or None..." />
              </Field>
              <Field label="Taking exactly as directed or changed dose/frequency on own? *" error={errors.adherence}>
                <select className={inputCls} value={form.adherence} onChange={(e) => set("adherence", e.target.value)}>
                  <option value="">Select…</option>
                  {ADHERENCE_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section n="05" title="Goals & Consent" desc="Final attestation required.">
            <div className="grid gap-4">
              <Field label="Goal for next cycle *" error={errors.nextGoal}>
                <textarea className={inputCls} rows={2} value={form.nextGoal} onChange={(e) => set("nextGoal", e.target.value)} placeholder="Continue healing, return to running, maintain gut health..." />
              </Field>
              <Field label="Questions for provider">
                <textarea className={inputCls} rows={2} value={form.questions} onChange={(e) => set("questions", e.target.value)} placeholder="Optional..." />
              </Field>
              <label className={`rounded-xl border p-4 ${errors.ack ? "border-red-400/40" : "border-white/10"}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={form.ack} onChange={(e) => set("ack", e.target.checked)} className="mt-1 accent-[#f5c2c7]" />
                  <span className="text-[12.5px] leading-relaxed text-white/75">{REGEN_REQUEST_ACK(productName)}</span>
                </div>
                {errors.ack ? <p className="mt-2 text-[11px] text-red-300">{errors.ack}</p> : null}
              </label>
              <Field label="Signature * Full legal name" error={errors.signature}>
                <input className={inputCls} value={form.signature} onChange={(e) => set("signature", e.target.value)} placeholder="Type full name to sign" />
              </Field>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#f5c2c7] py-4 text-[14px] font-medium text-black disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit for Medical Review"}
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-white/40">
              By submitting you confirm information is accurate. Clinical team will review within 1 business day. If red
              flags present, refill may be held.
            </p>
          </Section>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-[20px] border border-white/[0.08] bg-[#0d0d11] p-5">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Live Screening Summary</p>
            <p className={`${serif} mt-2 text-[22px]`}>{form.fullName || "Client"}</p>
            <p className="mt-1 text-[13px] text-white/50">
              {form.requestIntent === "add" ? "Add" : form.requestIntent === "refill" ? "Refill" : "Request"} ·{" "}
              {selectedSku?.name ?? "No protocol yet"}
            </p>
            {selectedSku ? <p className="text-[13px] text-[#f5c2c7]">{formatRequestPrice(selectedSku)}</p> : null}
            <p className="mt-1 text-[13px] text-white/50">Improvement {form.improvement}%</p>
            <p className="text-[13px] text-white/50">Adherence {form.adherence || "—"}</p>
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-widest text-white/40">Red Flags Detected</p>
              {liveFlags.length === 0 ? (
                <p className="mt-2 text-[13px] text-white/45">None yet</p>
              ) : (
                <ul className="mt-2 space-y-1 text-[12px] text-red-200">
                  {liveFlags.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="rounded-[20px] border border-white/[0.08] bg-[#0d0d11] p-5">
            <p className="text-[10px] uppercase tracking-widest text-white/40">SMS Deliverable</p>
            <p className="mt-2 text-[13px] text-[#f5c2c7]">
              {regenRequestShareUrl({ skuId: form.skuId, intent: form.requestIntent }).replace("https://", "")}
            </p>
            <p className="mt-2 text-[12px] text-white/45">Short URL + native SMS composer. iOS/Android opens Messages.</p>
            <p className="sr-only">{REGEN_REFILL_REQUEST_SMS}</p>
          </div>
          <div className="rounded-[20px] border border-white/[0.08] bg-[#0d0d11] p-5">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Admin · All Refills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                type="password"
                inputMode="numeric"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                placeholder="Staff PIN"
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-[13px]"
              />
              <button type="button" onClick={loadStaff} className="rounded-full bg-white px-4 py-2 text-[12px] text-black">
                Load board
              </button>
              <button type="button" onClick={downloadCsv} disabled={!staffRows.length} className="rounded-full border border-white/15 px-4 py-2 text-[12px] disabled:opacity-40">
                Download CSV
              </button>
            </div>
            {staffErr ? <p className="mt-2 text-[12px] text-red-300">{staffErr}</p> : null}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="text-[10px] uppercase tracking-widest text-white/35">
                  <tr>
                    <th className="py-2 pr-3">Client</th>
                    <th className="py-2 pr-3">Protocol</th>
                    <th className="py-2 pr-3">Intent</th>
                    <th className="py-2 pr-3">%</th>
                    <th className="py-2">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {staffRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-3 text-white/35">
                        No requests yet. Submit to populate dashboard.
                      </td>
                    </tr>
                  ) : (
                    staffRows.map((r) => (
                      <tr key={r.id} className="border-t border-white/5">
                        <td className="py-2 pr-3">{r.name}</td>
                        <td className="py-2 pr-3 text-white/50">{r.skuName || r.formType}</td>
                        <td className="py-2 pr-3 text-white/50">{r.requestIntent || r.formType}</td>
                        <td className="py-2 pr-3">{r.improvement}</td>
                        <td className="py-2 text-red-200">{r.redFlags.length || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-[11px] uppercase tracking-widest text-white/30">
        © Hello Gorgeous Medical Spa — Medical Intake · HIPAA-aware handling · Investigational use disclosure required
        <span className="mt-2 block normal-case tracking-normal text-white/35">
          GLP-1 patients use{" "}
          <a href="/glp1-refill" className="text-[#f5c2c7] underline">
            /glp1-refill
          </a>
        </span>
      </footer>
    </div>
  );
}
