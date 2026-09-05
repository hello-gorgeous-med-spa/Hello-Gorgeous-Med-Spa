export const REGEN_PUBLIC_TOOLS = [
  {
    slug: 'protein',
    title: 'Protein Calculator',
    blurb: 'Get a personalized daily protein target from your weight, activity, and goal.',
  },
  {
    slug: 'bmi',
    title: 'BMI Calculator',
    blurb: 'See your BMI and where it falls — a starting point for a weight-loss consult.',
  },
  {
    slug: 'glp1-titration',
    title: 'GLP-1 Titration Tracker',
    blurb: 'Track your week in program and see a typical next dose step-up.',
  },
  {
    slug: 'peptide-matcher',
    title: 'Peptide Protocol Matcher',
    blurb: 'Tell us your goal — recovery, sleep, skin, or libido — we suggest a starting conversation.',
  },
  {
    slug: 'hormone-symptoms',
    title: 'Hormone Symptom Checker',
    blurb: 'Check the symptoms you are noticing to see if a hormone panel is worth discussing.',
  },
  {
    slug: 'iv-finder',
    title: 'IV & Vitamin Blend Finder',
    blurb: 'Pick a goal — energy, immunity, recovery, or glow — and find a blend to ask about.',
  },
  {
    slug: 'injection-sites',
    title: 'Injection Site Rotation Tracker',
    blurb: 'Log where you last injected and get the next recommended site.',
  },
  {
    slug: 'savings',
    title: 'Savings Estimator',
    blurb: 'See how REGEN RX starting prices compare to typical national telehealth rates.',
  },
] as const;

export type RegenToolSlug = (typeof REGEN_PUBLIC_TOOLS)[number]['slug'];

export function getRegenTool(slug: string) {
  return REGEN_PUBLIC_TOOLS.find((t) => t.slug === slug) || null;
}

export function calcBmi(weightLb: number, heightIn: number) {
  if (!weightLb || !heightIn) return null;
  const bmi = (weightLb / (heightIn * heightIn)) * 703;
  let category = 'Underweight';
  if (bmi >= 18.5 && bmi < 25) category = 'Healthy range';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else if (bmi >= 30) category = 'Obesity range';
  return { bmi: Math.round(bmi * 10) / 10, category };
}

export function calcProteinGrams(weightLb: number, activity: 'low' | 'moderate' | 'high', goal: 'maintain' | 'lose' | 'gain') {
  if (!weightLb) return null;
  const kg = weightLb / 2.205;
  let perKg = activity === 'low' ? 1.2 : activity === 'moderate' ? 1.6 : 2.0;
  if (goal === 'lose') perKg += 0.2;
  if (goal === 'gain') perKg += 0.3;
  return Math.round(kg * perKg);
}

export const SEMA_STEPS = [
  { weeks: '1–4', dose: '0.25 mg/week', price: 195 },
  { weeks: '5–8', dose: '0.5 mg/week', price: 195 },
  { weeks: '9–12', dose: '1.0 mg/week', price: 235 },
  { weeks: '13–16', dose: '1.7 mg/week', price: 265 },
  { weeks: '17+', dose: '2.4 mg/week', price: 295 },
] as const;

export const TIRZ_STEPS = [
  { weeks: '1–4', dose: '2.5 mg/week', price: 235 },
  { weeks: '5–8', dose: '5 mg/week', price: 275 },
  { weeks: '9–12', dose: '7.5 mg/week', price: 315 },
  { weeks: '13–16', dose: '10 mg/week', price: 350 },
  { weeks: '17+', dose: '12.5 mg/week', price: 395 },
] as const;

export function typicalGlp1Step(med: 'sema' | 'tirz', week: number) {
  const steps = med === 'sema' ? SEMA_STEPS : TIRZ_STEPS;
  if (week <= 4) return steps[0];
  if (week <= 8) return steps[1];
  if (week <= 12) return steps[2];
  if (week <= 16) return steps[3];
  return steps[4];
}

export const PEPTIDE_MATCHES = {
  recovery: { name: 'Recovery & repair conversation', note: 'Often discussed: BPC-157 and recovery support. Your NP decides if a peptide is appropriate.', href: '/start?goal=peptides' },
  sleep: { name: 'Sleep & recovery conversation', note: 'Sleep, recovery, and evening routines are reviewed before any peptide is considered.', href: '/start?goal=peptides' },
  skin: { name: 'Skin & collagen conversation', note: 'Prescription skincare and select peptides may be discussed after screening.', href: '/start?goal=skincare' },
  libido: { name: 'Sexual health conversation', note: 'Hormone and sexual-health options are reviewed together — no one-size protocol.', href: '/start?goal=sexual-health' },
  energy: { name: 'Energy & longevity conversation', note: 'NAD+, B12, and hormone labs are common next steps — not automatic prescriptions.', href: '/start?goal=vitamins' },
} as const;

export const HORMONE_SYMPTOMS = [
  'Fatigue that sleep does not fix',
  'Low libido',
  'Brain fog',
  'Mood changes',
  'Hot flashes or night sweats',
  'Weight that will not move',
  'Hair thinning',
  'Poor sleep',
] as const;

export const IV_MATCHES = {
  energy: { name: 'Energy Boost / B12', note: 'B12 injectable from $35 or an Energy Boost drip in clinic.', href: '/products/b12' },
  immunity: { name: 'Immune Boost / Glutathione', note: 'Glutathione injectable from $75 or an Immune Boost drip.', href: '/products/glutathione' },
  recovery: { name: 'Recovery drip / NAD+', note: 'NAD+ from $125 or a Recovery drip after hard training or travel.', href: '/products/nad' },
  glow: { name: 'Beauty / Biotin', note: 'Biotin from $45 or a Beauty drip for hair, skin, and nails.', href: '/products/biotin' },
} as const;

export const INJECTION_SITES = [
  'Abdomen — upper left',
  'Abdomen — upper right',
  'Abdomen — lower left',
  'Abdomen — lower right',
  'Left thigh',
  'Right thigh',
  'Left arm (if trained)',
  'Right arm (if trained)',
] as const;
