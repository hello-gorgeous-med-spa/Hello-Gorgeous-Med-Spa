"use client";

import type { ReactElement, ReactNode } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { RegenToolsShell } from "@/components/regen/RegenToolsShell";
import {
  calcBmi,
  calcProteinGrams,
  HORMONE_SYMPTOMS,
  INJECTION_SITES,
  IV_MATCHES,
  PEPTIDE_MATCHES,
  typicalGlp1Step,
  type RegenToolSlug,
} from "@/lib/regen/public-tools";
import { TOOLS_BRAND as BRAND } from "@/lib/regen/tools-brand";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold text-black/70">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-black bg-white px-3 py-2.5 font-medium text-black";

function Result({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-6 rounded-2xl border-4 border-black p-4"
      style={{
        background: `linear-gradient(135deg, ${BRAND.blush} 0%, #fff 45%, #d1fae5 100%)`,
      }}
    >
      {children}
    </div>
  );
}

function ProteinTool() {
  const [weight, setWeight] = useState(160);
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("lose");
  const grams = calcProteinGrams(weight, activity, goal);
  return (
    <>
      <Field label="Weight (lb)">
        <input type="number" className={inputClass} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
      </Field>
      <Field label="Activity">
        <select className={inputClass} value={activity} onChange={(e) => setActivity(e.target.value as typeof activity)}>
          <option value="low">Mostly sitting</option>
          <option value="moderate">Walks / light training</option>
          <option value="high">Hard training most days</option>
        </select>
      </Field>
      <Field label="Goal">
        <select className={inputClass} value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}>
          <option value="maintain">Maintain</option>
          <option value="lose">Lose fat (including on a GLP-1)</option>
          <option value="gain">Build muscle</option>
        </select>
      </Field>
      {grams != null && (
        <Result>
          <p className="text-2xl font-black text-black">{grams} g / day</p>
          <p className="mt-1 text-sm font-medium text-black/60">
            Spread across meals. This is an educational target, not a medical order.
          </p>
        </Result>
      )}
    </>
  );
}

function BmiTool() {
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(6);
  const [weight, setWeight] = useState(180);
  const result = calcBmi(weight, feet * 12 + inches);
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Height (ft)">
          <input type="number" className={inputClass} value={feet} onChange={(e) => setFeet(Number(e.target.value))} />
        </Field>
        <Field label="Height (in)">
          <input type="number" className={inputClass} value={inches} onChange={(e) => setInches(Number(e.target.value))} />
        </Field>
      </div>
      <Field label="Weight (lb)">
        <input type="number" className={inputClass} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
      </Field>
      {result && (
        <Result>
          <p className="text-2xl font-black text-black">BMI {result.bmi}</p>
          <p className="mt-1 font-bold" style={{ color: BRAND.pink }}>
            {result.category}
          </p>
          <p className="mt-2 text-sm font-medium text-black/55">
            BMI is a screening number only. A consult looks at labs, history, and goals.
          </p>
        </Result>
      )}
    </>
  );
}

function TitrationTool() {
  const [med, setMed] = useState<"sema" | "tirz">("sema");
  const [week, setWeek] = useState(1);
  const step = typicalGlp1Step(med, week);
  return (
    <>
      <Field label="Medication">
        <select className={inputClass} value={med} onChange={(e) => setMed(e.target.value as typeof med)}>
          <option value="sema">Semaglutide</option>
          <option value="tirz">Tirzepatide</option>
        </select>
      </Field>
      <Field label={`Week in program: ${week}`}>
        <input
          type="range"
          min={1}
          max={24}
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="w-full accent-[#E91E8C]"
        />
      </Field>
      <Result>
        <p className="text-sm font-bold" style={{ color: BRAND.teal }}>
          Typical published step (not your prescription)
        </p>
        <p className="mt-1 text-2xl font-black text-black">{step.dose}</p>
        <p className="mt-1 font-medium text-black/70">
          REGEN RX published tier from ${step.price}/mo at this step, if prescribed.
        </p>
        <p className="mt-2 text-sm font-medium text-black/55">
          A licensed Illinois clinician sets the actual dose after intake. Many people stay at a lower step.
        </p>
      </Result>
    </>
  );
}

function PeptideTool() {
  const [goal, setGoal] = useState<keyof typeof PEPTIDE_MATCHES>("recovery");
  const match = PEPTIDE_MATCHES[goal];
  return (
    <>
      <Field label="What are you optimizing?">
        <select className={inputClass} value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}>
          <option value="recovery">Recovery</option>
          <option value="sleep">Sleep</option>
          <option value="skin">Skin</option>
          <option value="libido">Libido</option>
          <option value="energy">Energy</option>
        </select>
      </Field>
      <Result>
        <p className="text-xl font-black text-black">{match.name}</p>
        <p className="mt-2 text-sm font-medium text-black/70">{match.note}</p>
        <Link
          href={match.href}
          className="mt-4 inline-block rounded-full border-2 border-black px-4 py-2 text-sm font-black text-white"
          style={{ backgroundColor: BRAND.pink }}
        >
          Start intake
        </Link>
      </Result>
    </>
  );
}

function HormoneTool() {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (s: string) => setChecked((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]));
  return (
    <>
      <p className="mb-3 text-sm font-medium text-black/60">
        Check anything you have noticed for a few weeks or more.
      </p>
      <div className="space-y-2">
        {HORMONE_SYMPTOMS.map((s) => (
          <label key={s} className="flex gap-2 text-sm font-medium text-black/80">
            <input type="checkbox" className="accent-[#E91E8C]" checked={checked.includes(s)} onChange={() => toggle(s)} />
            {s}
          </label>
        ))}
      </div>
      <Result>
        {checked.length >= 3 ? (
          <p className="font-bold text-black">
            A hormone panel is a reasonable next conversation — {checked.length} symptoms checked.
          </p>
        ) : (
          <p className="font-medium text-black/70">
            Check a few items to see if labs are worth discussing. One symptom alone is not a diagnosis.
          </p>
        )}
        <Link
          href="/start?goal=hormones"
          className="mt-4 inline-block rounded-full border-2 border-black px-4 py-2 text-sm font-black text-white"
          style={{ backgroundColor: BRAND.pink }}
        >
          Talk to our NP
        </Link>
      </Result>
    </>
  );
}

function IvTool() {
  const [goal, setGoal] = useState<keyof typeof IV_MATCHES>("energy");
  const match = IV_MATCHES[goal];
  return (
    <>
      <Field label="Goal">
        <select className={inputClass} value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}>
          <option value="energy">Energy</option>
          <option value="immunity">Immunity</option>
          <option value="recovery">Recovery</option>
          <option value="glow">Glow</option>
        </select>
      </Field>
      <Result>
        <p className="text-xl font-black text-black">{match.name}</p>
        <p className="mt-2 text-sm font-medium text-black/70">{match.note}</p>
        <Link href={match.href} className="mt-4 inline-block text-sm font-black" style={{ color: BRAND.teal }}>
          See product →
        </Link>
      </Result>
    </>
  );
}

function SitesTool() {
  const [last, setLast] = useState<string>(INJECTION_SITES[0]);
  useEffect(() => {
    const saved = localStorage.getItem("regen-last-injection-site");
    if (saved && INJECTION_SITES.includes(saved as (typeof INJECTION_SITES)[number])) setLast(saved);
  }, []);
  const next = useMemo(() => {
    const i = INJECTION_SITES.indexOf(last as (typeof INJECTION_SITES)[number]);
    return INJECTION_SITES[(i + 1) % INJECTION_SITES.length];
  }, [last]);
  return (
    <>
      <Field label="Last site used">
        <select className={inputClass} value={last} onChange={(e) => setLast(e.target.value)}>
          {INJECTION_SITES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <button
        className="rounded-full border-2 border-black px-4 py-2 text-sm font-black text-white"
        style={{ backgroundColor: BRAND.teal }}
        onClick={() => {
          localStorage.setItem("regen-last-injection-site", last);
          setLast(next);
          localStorage.setItem("regen-last-injection-site", next);
        }}
      >
        Mark used — rotate to next
      </button>
      <Result>
        <p className="text-sm font-bold" style={{ color: BRAND.teal }}>
          Next recommended site
        </p>
        <p className="mt-1 text-xl font-black text-black">{next}</p>
        <p className="mt-2 text-sm font-medium text-black/55">Stay 2 inches from the navel. Saved on this device only.</p>
      </Result>
    </>
  );
}

function SavingsTool() {
  const [med, setMed] = useState<"sema" | "tirz">("sema");
  const [months, setMonths] = useState(6);
  const regen = med === "sema" ? 195 : 100;
  const national = med === "sema" ? 349 : 449;
  const save = (national - regen) * months;
  return (
    <>
      <Field label="Medication">
        <select className={inputClass} value={med} onChange={(e) => setMed(e.target.value as typeof med)}>
          <option value="sema">Semaglutide starting tier</option>
          <option value="tirz">Tirzepatide starting tier</option>
        </select>
      </Field>
      <Field label={`${months} months`}>
        <input
          type="range"
          min={1}
          max={12}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full accent-[#0D9488]"
        />
      </Field>
      <Result>
        <p className="font-medium text-black/75">
          REGEN RX from ${regen}/mo vs a typical national telehealth list around ${national}/mo.
        </p>
        <p className="mt-2 text-2xl font-black" style={{ color: BRAND.pink }}>
          About ${save.toLocaleString()} less over {months} months
        </p>
        <p className="mt-2 text-sm font-medium text-black/55">
          Comparison uses published starting tiers, not a named competitor. Your prescribed dose may differ.
        </p>
      </Result>
    </>
  );
}

const TOOLS: Record<RegenToolSlug, () => ReactElement> = {
  protein: ProteinTool,
  bmi: BmiTool,
  "glp1-titration": TitrationTool,
  "peptide-matcher": PeptideTool,
  "hormone-symptoms": HormoneTool,
  "iv-finder": IvTool,
  "injection-sites": SitesTool,
  savings: SavingsTool,
};

export default function ToolClient({ slug, title, blurb }: { slug: RegenToolSlug; title: string; blurb: string }) {
  const Body = TOOLS[slug];
  return (
    <RegenToolsShell>
      <div className="mx-auto max-w-xl px-6 pb-20 pt-28">
        <Link href="/tools" className="text-sm font-bold" style={{ color: BRAND.blush }}>
          ← All free tools
        </Link>
        <h1 className="mb-2 mt-4 font-serif text-3xl font-black text-white md:text-4xl">{title}</h1>
        <p className="mb-8 font-medium" style={{ color: BRAND.blush }}>
          {blurb}
        </p>
        <div className="rounded-3xl border-4 border-black bg-[#FAF9F6] p-6 shadow-[8px_8px_0_0_rgba(13,148,136,0.4)]">
          <Body />
        </div>
        <p className="mt-10 text-xs" style={{ color: BRAND.blush }}>
          Educational only. Not a diagnosis, prescription, or outcome guarantee. Illinois patients start at{" "}
          <Link href="/start" className="underline" style={{ color: BRAND.hot }}>
            /start
          </Link>
          .
        </p>
      </div>
    </RegenToolsShell>
  );
}
