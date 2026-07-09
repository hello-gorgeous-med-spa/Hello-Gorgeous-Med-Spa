// Client-facing "typical protocol" summaries, adapted from the pharmacy's
// dosing guides. Educational — the provider confirms each client's exact dose.
export const PROTOCOLS = {
  nad: {
    route: 'Subcutaneous or IM injection',
    summary: 'A short loading phase, then a steady maintenance rhythm.',
    phases: [
      { label:'Week 1', dose:'50 mg', freq:'every other day' },
      { label:'Week 2', dose:'100 mg', freq:'every other day' },
      { label:'Loading', dose:'100 mg', freq:'daily × 10–14 days' },
      { label:'Maintenance', dose:'100–200 mg', freq:'2–3× weekly' },
    ],
    howTo: 'Inject slowly over 1–2 minutes — going slow dramatically reduces the flushing, warmth, or "flu-like" wave some people feel. The abdomen is the easiest site. Hydrate before and after, and rotate injection spots.',
  },
  sermorelin: {
    route: 'Subcutaneous injection, nightly',
    summary: 'Taken at night to work with your body\u2019s natural growth-hormone rhythm.',
    phases: [
      { label:'Starting', dose:'200 mcg', freq:'nightly at bedtime' },
      { label:'Standard', dose:'300 mcg', freq:'nightly at bedtime' },
      { label:'Advanced', dose:'500 mcg', freq:'nightly at bedtime' },
      { label:'Cycle', dose:'5 days on', freq:'2 days off' },
    ],
    howTo: 'Inject into the abdomen about 30 minutes before bed, on an empty stomach (food blunts the release). Sleep often improves in 2–4 weeks; body-composition changes take 3–6 months. Many protocols run 5 days on / 2 days off to keep your response strong.',
  },
  'cjc-ipamorelin': {
    route: 'Subcutaneous injection, nightly',
    summary: 'A growth-hormone support pairing, dosed at night in cycles.',
    phases: [
      { label:'Typical', dose:'as prescribed', freq:'nightly at bedtime' },
      { label:'Timing', dose:'empty stomach', freq:'~30 min before bed' },
      { label:'Cycle', dose:'5 days on', freq:'2 days off' },
    ],
    howTo: 'Injected into the abdomen at night on an empty stomach to align with your natural growth-hormone pulse. Typically run in cycles; your provider sets your exact dose and cycle length based on your goals and labs.',
  },
  tesamorelin: {
    route: 'Subcutaneous injection',
    summary: 'Short daily cycles with brief rest days built in.',
    phases: [
      { label:'Standard', dose:'~1 mg (0.2 mL)', freq:'daily × 5 days' },
      { label:'Rest', dose:'—', freq:'2 days off' },
      { label:'Cycle', dose:'repeat', freq:'~3 weeks total' },
    ],
    howTo: 'Injected subcutaneously, usually as 5 days on / 2 days off. Best paired with consistent sleep and resistance training. Your provider may check IGF-1 to fine-tune your dose.',
  },
  pentadeca: {
    route: 'Subcutaneous injection',
    summary: 'Daily during recovery, with the option to double up for acute injuries.',
    phases: [
      { label:'Systemic', dose:'250 mcg', freq:'daily' },
      { label:'Acute injury', dose:'500 mcg', freq:'twice daily' },
      { label:'Cycle', dose:'4–8 weeks', freq:'then 2–4 weeks off' },
    ],
    howTo: 'Injected just under the skin — near the injury site when possible for a localized effect, otherwise in the abdomen. A 28–31G insulin syringe is ideal; rotate sites. Because it clears quickly, twice-daily dosing is common during an acute injury.',
  },
  bpc157: {
    route: 'Subcutaneous injection',
    summary: 'Daily during a recovery window, often near the area being treated.',
    phases: [
      { label:'Standard', dose:'250–500 mcg', freq:'daily' },
      { label:'Acute', dose:'up to 500 mcg', freq:'twice daily' },
      { label:'Cycle', dose:'4–8 weeks', freq:'then reassess' },
    ],
    howTo: 'Injected just under the skin, ideally near the injury or in the abdomen for gut-focused goals. Uses a small insulin syringe; rotate sites. Often stacked with TB-500 for recovery. Runs in a defined cycle with a check-in before repeating.',
  },
  tb500: {
    route: 'Subcutaneous injection, weekly',
    summary: 'A weekly loading rhythm, then a lighter maintenance schedule.',
    phases: [
      { label:'Loading', dose:'2–5 mg / week', freq:'split into 2–3 doses, 4–6 wks' },
      { label:'Maintenance', dose:'2 mg', freq:'every 2 weeks' },
    ],
    howTo: 'Injected subcutaneously and frequently paired with BPC-157 or PDA (the "recovery stack") for tendon, muscle, and soft-tissue repair. Your provider tailors the loading length to your recovery goals.',
  },
  ss31: {
    route: 'Subcutaneous injection, cyclical',
    summary: 'Five days on, two off — run in multi-week cycles with a rest period.',
    phases: [
      { label:'Standard', dose:'4 mg (0.25 mL)', freq:'daily × 5 days' },
      { label:'Rest', dose:'—', freq:'2 days off, weekly' },
      { label:'Cycle', dose:'8–12 weeks', freq:'then 4–8 weeks off' },
    ],
    howTo: 'A mitochondrial-support peptide injected subcutaneously on a 5-on / 2-off weekly pattern. Cycles typically run 8–12 weeks with a rest period before resuming.',
  },
  pt141: {
    route: 'Subcutaneous injection, as needed',
    summary: 'Taken before intimacy — start with a low test dose.',
    phases: [
      { label:'First dose', dose:'0.5 mg', freq:'test for tolerance' },
      { label:'Standard', dose:'1.0–1.5 mg', freq:'as needed' },
      { label:'Maximum', dose:'1.75 mg', freq:'max 1 per 24 hrs' },
    ],
    howTo: 'Inject into the abdomen 30–45 minutes before anticipated activity. Effects last roughly 4–10 hours. Start with the low test dose — mild nausea is the most common early effect and usually settles. Limit to about 8 doses per month, and don\u2019t combine with full-dose ED pills.',
  },
  glutathione: {
    route: 'IV, IM, or SubQ',
    summary: 'Flexible routes — from quick IM shots to skin-brightening IV courses.',
    phases: [
      { label:'Wellness (IM/SubQ)', dose:'200–600 mg', freq:'1–2× weekly' },
      { label:'Skin brightening (IV)', dose:'600–1200 mg', freq:'weekly × 8–12 wks' },
      { label:'At-home (SubQ)', dose:'100–200 mg', freq:'2–3× weekly' },
    ],
    howTo: 'IV is the gold-standard route (given slowly over 5–15 minutes); IM and SubQ are convenient for routine or at-home use. A faint sulfur smell is normal. Pairs well with vitamin C. Keep refrigerated and protected from light.',
  },
  'methylene-blue': {
    route: 'Oral capsule, mornings',
    summary: 'Start low and build up gradually over a few weeks.',
    phases: [
      { label:'Week 1', dose:'5 mg', freq:'daily (AM)' },
      { label:'Week 2', dose:'10 mg', freq:'daily (AM)' },
      { label:'Week 3+', dose:'15–20 mg', freq:'daily (AM)' },
    ],
    howTo: 'Take with water in the morning to avoid sleep disruption. Blue-green urine is expected and harmless. Important: methylene blue interacts with many antidepressants — review all your medications with your provider first.',
  },
  naltrexone: {
    route: 'Oral capsule, bedtime',
    summary: 'A slow, gentle titration to your target low dose.',
    phases: [
      { label:'Weeks 1–2', dose:'1.5 mg', freq:'at bedtime' },
      { label:'Weeks 3–4', dose:'3 mg', freq:'at bedtime' },
      { label:'Week 5+', dose:'4.5 mg', freq:'at bedtime (target)' },
    ],
    howTo: 'Taken at night. Vivid dreams or lighter sleep are common early on — if that happens, your provider may hold a dose longer before advancing, or split it. Allow 8–12 weeks to feel the full effect.',
  },
};
