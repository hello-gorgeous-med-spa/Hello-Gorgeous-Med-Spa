export const FORMULATION_SEXUAL_HEALTH_SOURCE = "https://formulationrx.com/sexual-health/";

export const SEXUAL_HEALTH_STATS = [
  {
    title: "Men & women",
    body: "A distinct toolkit for each — not a one-size men’s-only shelf.",
  },
  {
    title: "5 routes",
    body: "Oral, sublingual, injectable, topical/vaginal, and nasal — chosen so the patient will actually use it.",
  },
  {
    title: "Beyond the pill",
    body: "For non-responders, side-effect issues, and people who do not want a tablet.",
  },
] as const;

export const SEXUAL_HEALTH_GAPS = [
  {
    title: "Oral, optimized",
    body: "PDE5 therapy in strengths and combinations a manufactured tablet does not offer — more, less, or a smoother daily approach when a clinician decides it fits.",
    forms: "Sildenafil & tadalafil in custom strengths · sildenafil/tadalafil combos · tadalafil/L-arginine · tadalafil/yohimbine",
  },
  {
    title: "Sublingual, faster",
    body: "Rapid-dissolve and troche forms that bypass the gut for quicker onset — including combinations that add a neuro-arousal component.",
    forms: "Sildenafil/apomorphine RDT · sildenafil/L-arginine · tadalafil/oxytocin/PT-141 troches",
  },
  {
    title: "Injectable (ICI)",
    body: "For oral non-responders — intracavernosal therapy titrated to the individual. Gold-standard fallback when pills are not enough. Clinician-directed only.",
    forms: "BiMix · TriMix · QuadMix · alprostadil — see the ladder",
  },
] as const;

export const ICI_LADDER = [
  {
    name: "BiMix",
    detail: "Papaverine + phentolamine — the two-agent foundation.",
  },
  {
    name: "TriMix",
    detail: "Papaverine + phentolamine + alprostadil (PGE₁) — titratable across a wide potency range.",
  },
  {
    name: "QuadMix",
    detail: "Adds atropine when a stronger response is needed.",
  },
] as const;

export const WOMENS_SEXUAL_CARDS = [
  {
    title: "Arousal & sensation",
    body: "A compounded topical applied where it works — a combination that is not sold off the shelf, with an optional testosterone component when prescribed.",
    forms: "Sildenafil / arginine / papaverine vaginal cream · optional testosterone 0.1%",
  },
  {
    title: "Comfort & GSM",
    body: "For genitourinary syndrome of menopause — dryness, atrophy, and painful intimacy — custom vaginal estrogen and soothing preparations in gentle bases.",
    forms: "Vaginal estriol & estradiol creams/gels · soothing vaginal creams",
  },
  {
    title: "Libido & hormones",
    body: "Low-dose testosterone and DHEA options for desire — dosed for women, which commercial products rarely offer. Part of a broader hormone plan when appropriate.",
    forms: "Low-dose testosterone & DHEA · clinician-directed BHRT",
  },
] as const;

export const SEXUAL_HEALTH_ROUTES = [
  "Capsules",
  "Sublingual / troche",
  "Injectable (ICI)",
  "Topical / vaginal",
  "Nasal spray",
  "Combinations",
] as const;
