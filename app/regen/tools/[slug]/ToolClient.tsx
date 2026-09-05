'use client';

import type { ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { RegenPublicNav } from '@/components/regen/RegenPublicNav';
import {
  calcBmi,
  calcProteinGrams,
  HORMONE_SYMPTOMS,
  INJECTION_SITES,
  IV_MATCHES,
  PEPTIDE_MATCHES,
  typicalGlp1Step,
  type RegenToolSlug,
} from '@/lib/regen/public-tools';

const BRAND = { teal: '#0D9488', pink: '#E91E8C', dark: '#0A0A0A', gray: '#9CA3AF' };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm text-white/70 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/10';

function Result({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: `${BRAND.teal}40`, backgroundColor: `${BRAND.teal}15` }}>{children}</div>;
}

function ProteinTool() {
  const [weight, setWeight] = useState(160);
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('lose');
  const grams = calcProteinGrams(weight, activity, goal);
  return (
    <>
      <Field label="Weight (lb)"><input type="number" className={inputClass} value={weight} onChange={(e) => setWeight(Number(e.target.value))} /></Field>
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
          <p className="text-white text-2xl font-bold">{grams} g / day</p>
          <p className="text-white/60 text-sm mt-1">Spread across meals. This is an educational target, not a medical order.</p>
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
        <Field label="Height (ft)"><input type="number" className={inputClass} value={feet} onChange={(e) => setFeet(Number(e.target.value))} /></Field>
        <Field label="Height (in)"><input type="number" className={inputClass} value={inches} onChange={(e) => setInches(Number(e.target.value))} /></Field>
      </div>
      <Field label="Weight (lb)"><input type="number" className={inputClass} value={weight} onChange={(e) => setWeight(Number(e.target.value))} /></Field>
      {result && (
        <Result>
          <p className="text-white text-2xl font-bold">BMI {result.bmi}</p>
          <p className="text-white/70 mt-1">{result.category}</p>
          <p className="text-white/50 text-sm mt-2">BMI is a screening number only. A consult looks at labs, history, and goals.</p>
        </Result>
      )}
    </>
  );
}

function TitrationTool() {
  const [med, setMed] = useState<'sema' | 'tirz'>('sema');
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
        <input type="range" min={1} max={24} value={week} onChange={(e) => setWeek(Number(e.target.value))} className="w-full" />
      </Field>
      <Result>
        <p className="text-white/60 text-sm">Typical published step (not your prescription)</p>
        <p className="text-white text-2xl font-bold mt-1">{step.dose}</p>
        <p className="text-white/70 mt-1">REGEN RX published tier from ${step.price}/mo at this step, if prescribed.</p>
        <p className="text-white/50 text-sm mt-2">Ryan sets the actual dose after intake. Many people stay at a lower step.</p>
      </Result>
    </>
  );
}

function PeptideTool() {
  const [goal, setGoal] = useState<keyof typeof PEPTIDE_MATCHES>('recovery');
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
        <p className="text-white text-xl font-bold">{match.name}</p>
        <p className="text-white/70 text-sm mt-2">{match.note}</p>
        <Link href={match.href} className="inline-block mt-4 px-4 py-2 rounded-full text-white text-sm font-bold" style={{ backgroundColor: BRAND.pink }}>Start intake</Link>
      </Result>
    </>
  );
}

function HormoneTool() {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (s: string) => setChecked((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]));
  return (
    <>
      <p className="text-white/60 text-sm mb-3">Check anything you have noticed for a few weeks or more.</p>
      <div className="space-y-2">
        {HORMONE_SYMPTOMS.map((s) => (
          <label key={s} className="flex gap-2 text-white/80 text-sm">
            <input type="checkbox" checked={checked.includes(s)} onChange={() => toggle(s)} />
            {s}
          </label>
        ))}
      </div>
      <Result>
        {checked.length >= 3 ? (
          <p className="text-white">A hormone panel is a reasonable next conversation — {checked.length} symptoms checked.</p>
        ) : (
          <p className="text-white/70">Check a few items to see if labs are worth discussing. One symptom alone is not a diagnosis.</p>
        )}
        <Link href="/start?goal=hormones" className="inline-block mt-4 px-4 py-2 rounded-full text-white text-sm font-bold" style={{ backgroundColor: BRAND.pink }}>Talk to our NP</Link>
      </Result>
    </>
  );
}

function IvTool() {
  const [goal, setGoal] = useState<keyof typeof IV_MATCHES>('energy');
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
        <p className="text-white text-xl font-bold">{match.name}</p>
        <p className="text-white/70 text-sm mt-2">{match.note}</p>
        <Link href={match.href} className="inline-block mt-4 text-sm" style={{ color: BRAND.teal }}>See product →</Link>
      </Result>
    </>
  );
}

function SitesTool() {
  const [last, setLast] = useState<string>(INJECTION_SITES[0]);
  useEffect(() => {
    const saved = localStorage.getItem('regen-last-injection-site');
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
          {INJECTION_SITES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <button
        className="px-4 py-2 rounded-lg text-white text-sm"
        style={{ backgroundColor: BRAND.teal }}
        onClick={() => {
          localStorage.setItem('regen-last-injection-site', last);
          setLast(next);
          localStorage.setItem('regen-last-injection-site', next);
        }}
      >
        Mark used — rotate to next
      </button>
      <Result>
        <p className="text-white/60 text-sm">Next recommended site</p>
        <p className="text-white text-xl font-bold mt-1">{next}</p>
        <p className="text-white/50 text-sm mt-2">Stay 2 inches from the navel. Saved on this device only.</p>
      </Result>
    </>
  );
}

function SavingsTool() {
  const [med, setMed] = useState<'sema' | 'tirz'>('sema');
  const [months, setMonths] = useState(6);
  const regen = med === 'sema' ? 195 : 100;
  const national = med === 'sema' ? 349 : 449;
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
        <input type="range" min={1} max={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full" />
      </Field>
      <Result>
        <p className="text-white">REGEN RX from ${regen}/mo vs a typical national telehealth list around ${national}/mo.</p>
        <p className="text-white text-2xl font-bold mt-2">About ${save.toLocaleString()} less over {months} months</p>
        <p className="text-white/50 text-sm mt-2">Comparison uses published starting tiers, not a named competitor. Your prescribed dose may differ.</p>
      </Result>
    </>
  );
}

const TOOLS: Record<RegenToolSlug, () => ReactElement> = {
  protein: ProteinTool,
  bmi: BmiTool,
  'glp1-titration': TitrationTool,
  'peptide-matcher': PeptideTool,
  'hormone-symptoms': HormoneTool,
  'iv-finder': IvTool,
  'injection-sites': SitesTool,
  savings: SavingsTool,
};

export default function ToolClient({ slug, title, blurb }: { slug: RegenToolSlug; title: string; blurb: string }) {
  const Body = TOOLS[slug];
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      <RegenPublicNav />
      <div className="max-w-xl mx-auto px-6 pt-28 pb-20">
        <Link href="/tools" className="text-sm" style={{ color: BRAND.teal }}>← All free tools</Link>
        <h1 className="text-3xl font-black text-white mt-4 mb-2">{title}</h1>
        <p className="mb-8" style={{ color: BRAND.gray }}>{blurb}</p>
        <Body />
        <p className="text-xs mt-10" style={{ color: BRAND.gray }}>
          Educational only. Not a diagnosis, prescription, or outcome guarantee. Illinois patients start at{' '}
          <Link href="/start" className="underline" style={{ color: BRAND.teal }}>/start</Link>.
        </p>
      </div>
    </div>
  );
}
