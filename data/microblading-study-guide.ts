/** Hello Gorgeous — Microblading performance study guide (single source of truth). */

export const MICROBLADING_STUDY_GUIDE_PATH = "/education/microblading-study-guide";

export type StudyCallout = {
  title: string;
  body: string;
  variant: "tip" | "warning" | "info";
};

export type StudyCard = {
  category: string;
  title: string;
  bullets: string[];
};

export type StudyStep = {
  step: number;
  title: string;
  body: string;
  detail?: string[];
};

export type StudyTableRow = {
  label: string;
  value: string;
};

export type StudySection = {
  id: string;
  navLabel: string;
  heading: string;
  subheading?: string;
  intro?: string;
  bullets?: string[];
  cards?: StudyCard[];
  steps?: StudyStep[];
  table?: StudyTableRow[];
  callouts?: StudyCallout[];
  checklist?: string[];
};

export const MICROBLADING_GUIDE_META = {
  title: "Microblading Study Guide",
  tagline: "How to perform microblading — mapping, spine strokes, technique & aftercare",
  series: "Hello Gorgeous · Provider Education",
  accent: "#8B4513",
  intro:
    "A structured study guide for Hello Gorgeous providers and trainees. Covers brow anatomy, golden-ratio mapping, spine placement, five-step stroke building, sterile technique, and client aftercare. Always follow Illinois body-art regulations, your scope of practice, and medical director protocols.",
  pills: ["#BrowMapping", "#SpineStrokes", "#SkinDepth", "#SterileTechnique", "#Aftercare"],
};

export const MICROBLADING_STUDY_SECTIONS: StudySection[] = [
  {
    id: "overview",
    navLabel: "Overview",
    heading: "Why this guide exists",
    intro:
      "Microblading is manual cosmetic tattooing that creates hair-like strokes in the upper dermis. Results depend on mapping accuracy, stroke architecture, consistent depth, and pigment choice — not speed.",
    bullets: [
      "Goal: natural, asymmetrically balanced brows that heal soft — not solid blocks of color",
      "You are implanting pigment with a blade, not injecting — pressure and angle control everything",
      "Every face is different; the spine position changes the entire personality of the brow",
      "Document, consent, patch-test when indicated, and photograph at every stage",
    ],
    callouts: [
      {
        variant: "warning",
        title: "Scope & compliance",
        body:
          "Illinois requires appropriate body-art licensing and facility compliance for permanent cosmetics. Work only within your training, supervision, and Hello Gorgeous protocols. When in doubt — consult Ryan Kent, FNP-BC or defer the service.",
      },
    ],
  },
  {
    id: "anatomy",
    navLabel: "Anatomy",
    heading: "Eyebrow & skin anatomy you must know",
    subheading: "Depth is non-negotiable — too shallow fades; too deep blows out gray",
    cards: [
      {
        category: "Brow structure",
        title: "Landmarks",
        bullets: [
          "Head (inner) · arch · tail — three anchors before any blade touches skin",
          "Frontalis and orbicularis oculi influence shape when client squints — map at rest",
          "Brow bone projection affects how strokes read from the front vs. profile",
        ],
      },
      {
        category: "Hair pattern",
        title: "Growth direction",
        bullets: [
          "Head: strokes often rise vertically or slightly upward",
          "Body: arch strokes follow a soft diagonal toward the tail",
          "Tail: strokes flatten horizontally — never drag downward into the eye",
        ],
      },
      {
        category: "Skin layers",
        title: "Target depth",
        bullets: [
          "Epidermis: too superficial — pigment sheds in days (scratching, not tattooing)",
          "Upper papillary dermis: ideal zone for crisp hair strokes",
          "Reticular dermis: too deep — migration, gray/blue cast, blurred edges",
        ],
      },
      {
        category: "Healing",
        title: "What happens after",
        bullets: [
          "Days 1–3: dark, bold — clients panic here; set expectations upfront",
          "Days 4–10: flaking/scabbing — never pick; pigment trapped under scab",
          "Weeks 4–6: true color emerges — touch-up window typically 6–8 weeks",
        ],
      },
    ],
    table: [
      { label: "Correct depth feel", value: "Light \"pop\" through epidermis — audible faint scratch, no drag resistance" },
      { label: "Too shallow", value: "Strokes disappear on wipe; client reports no sensation" },
      { label: "Too deep", value: "Excessive bleeding, blurred strokes, prolonged swelling" },
    ],
  },
  {
    id: "tools",
    navLabel: "Tools",
    heading: "Tools, setup & sterile field",
    intro: "One setup discipline prevents cross-contamination and inconsistent stroke quality.",
    checklist: [
      "Disposable microblading pen holder + single-use blade (18U / 14U / flex per plan)",
      "Pigment cup — fresh pour per client, never double-dip from master bottle on skin",
      "Mapping pencil (white or brown), calipers, string/thread for symmetry check",
      "Topical anesthetic per protocol — only on intact skin, timed per manufacturer",
      "Barrier film on bed, tray, phone, lamp handles; gloves changed between phases",
      "Sharps container, biohazard waste, consent & medical history completed first",
    ],
    callouts: [
      {
        variant: "tip",
        title: "Blade selection",
        body:
          "Finer blades (18U) suit detail and tail work; wider configurations cover body faster but demand lighter pressure. Match blade to stroke phase — skeleton first, fillers last.",
      },
    ],
  },
  {
    id: "mapping",
    navLabel: "Mapping",
    heading: "Brow mapping — symmetry before strokes",
    subheading: "Measure twice, blade once",
    steps: [
      {
        step: 1,
        title: "Find the head",
        body: "Vertical line from alar wing (nostril edge) through inner canthus — brow should start here or slightly medial per face shape.",
      },
      {
        step: 2,
        title: "Find the arch",
        body: "Diagonal from nostril through pupil center (or slightly lateral) — highest point of arch. Adjust for hooded lids or low brow bone.",
      },
      {
        step: 3,
        title: "Find the tail",
        body: "Diagonal from nostril through outer canthus — tail should not drop below head (\"sad brow\"). Connect head → arch → tail with light outline.",
      },
      {
        step: 4,
        title: "Mark the spine",
        body: "The spine is where upper and lower stroke fields meet — the visual \"part\" of the brow. Choose low, medium, or high (next section).",
      },
      {
        step: 5,
        title: "Client approval",
        body: "Client views bilateral mapping in mirror, signs off on shape and color. Photograph mapping before numbing — your liability shield.",
      },
    ],
  },
  {
    id: "spine",
    navLabel: "Spine",
    heading: "Spine placement — low, medium & high",
    intro:
      "The spine divides the brow into an upper and lower stroke field. It controls how open, soft, or structured the brow reads.",
    cards: [
      {
        category: "Low spine",
        title: "Soft & approachable",
        bullets: [
          "Spine sits closer to the lower border — more room above for upward strokes",
          "Best for: round faces, clients wanting gentle lift, sparse natural tails",
          "Risk if wrong: can look flat if upper field is over-filled",
        ],
      },
      {
        category: "Medium spine",
        title: "Balanced — most common",
        bullets: [
          "Spine runs through the vertical center of brow height at the arch zone",
          "Best for: average brow thickness goals, first-time clients, versatile healing",
          "Practice this until automatic before exploring extremes",
        ],
      },
      {
        category: "High spine",
        title: "Structured & lifted",
        bullets: [
          "Spine closer to top border — lower field carries density, upper field stays light",
          "Best for: clients wanting editorial lift, hooded eyes (with caution)",
          "Risk if wrong: can read harsh or surprised if over-stroked above spine",
        ],
      },
    ],
    callouts: [
      {
        variant: "info",
        title: "Practice sheets",
        body:
          "Use blank brow templates to trace low, medium, and high spine patterns until muscle memory forms. Speed comes after 50+ paper repetitions — not before.",
      },
    ],
  },
  {
    id: "five-steps",
    navLabel: "5-step strokes",
    heading: "Five-step stroke build (skeleton → finish)",
    subheading: "Never skip Step 1 — the skeleton IS the brow",
    steps: [
      {
        step: 1,
        title: "Skeleton strokes",
        body: "Place the minimum strokes that define head, arch flow, and tail direction. These are your guardrails — if skeleton is wrong, fillers only amplify the mistake.",
        detail: ["Light pressure", "Fewer strokes than you think", "Step back every 3–4 strokes"],
      },
      {
        step: 2,
        title: "Guide grid (optional)",
        body: "Some artists add faint directional guide lines between spine and border to keep stroke angles consistent — especially on asymmetric clients.",
      },
      {
        step: 3,
        title: "Primary strokes",
        body: "Build the main body strokes following natural growth direction. Alternate sides every few strokes to prevent one brow from swelling/difficulty before the other.",
        detail: ["Stretch skin taut — three-point tension", "Blade at 90° to skin surface", "One-direction passes — no sawing"],
      },
      {
        step: 4,
        title: "Filler strokes",
        body: "Shorter, lighter strokes between primaries to create density without solid fill. Less is more — you can add at touch-up; you cannot subtract.",
      },
      {
        step: 5,
        title: "Tail & detail pass",
        body: "Refine tail taper, check symmetry from 6 ft away, wipe with damp gauze, evaluate gaps at arm's length. Apply aftercare and photograph healed-color reference card.",
      },
    ],
  },
  {
    id: "technique",
    navLabel: "Technique",
    heading: "Blade technique — angle, pressure & stretch",
    cards: [
      {
        category: "Angle",
        title: "90° to skin",
        bullets: [
          "Blade perpendicular to skin — not tilted like a pencil",
          "Tilt causes thin/thick stroke inconsistency and depth variation",
        ],
      },
      {
        category: "Pressure",
        title: "Let the blade do the work",
        bullets: [
          "Think \"tap and lift\" — not drag and carve",
          "Two-pass same stroke = double depth = blowout risk",
        ],
      },
      {
        category: "Stretch",
        title: "Three-point tension",
        bullets: [
          "Non-dominant hand spreads skin flat in direction opposite stroke",
          "No stretch = blade skips; over-stretch = distorted healed shape",
        ],
      },
      {
        category: "Pigment",
        title: "Wipe & re-dip rhythm",
        bullets: [
          "Dip lightly — excess pigment obscures stroke placement",
          "Wipe between passes to see true gap pattern",
          "Match pigment to undertone (warm vs. cool base) — test on stroke card",
        ],
      },
    ],
    table: [
      { label: "Stroke length — head", value: "Short, rising" },
      { label: "Stroke length — body", value: "Medium, diagonal toward tail" },
      { label: "Stroke length — tail", value: "Longest, horizontal taper" },
      { label: "Between-stroke spacing", value: "≈ width of one stroke — avoid parallel railroad tracks" },
    ],
  },
  {
    id: "procedure",
    navLabel: "Procedure",
    heading: "Day-of procedure flow",
    steps: [
      { step: 1, title: "Consult & consent", body: "Medical history, contraindications, patch test status, shape goals, healing expectations. No service without signed consent." },
      { step: 2, title: "Pre-photos", body: "Front, both 45°, profile — same lighting every time for portfolio consistency." },
      { step: 3, title: "Cleanse & prep", body: "Remove makeup/oils, disinfect brow area, apply barrier where needed." },
      { step: 4, title: "Map & approve", body: "Golden ratio mapping, spine selection, client mirror approval." },
      { step: 5, title: "Numb (if protocol allows)", body: "Timed per product label. Re-wipe — residue affects pigment uptake." },
      { step: 6, title: "Microblade — 5-step build", body: "Skeleton → primaries → fillers → tail detail. Alternate sides. Wipe often." },
      { step: 7, title: "Pigment mask (optional)", body: "Some protocols leave pigment on 3–5 min; follow your training standard." },
      { step: 8, title: "Clean & aftercare", body: "Remove excess pigment, apply aftercare ointment thin layer, review written instructions, schedule touch-up." },
    ],
    checklist: [
      "Contraindications ruled out (pregnancy, accutane within 12 mo, keloid history, active skin condition in area)",
      "Blood-thinners / bleeding disorders disclosed",
      "No recent sunburn, peel, or laser on brow area",
      "Emergency contact on file",
    ],
  },
  {
    id: "color",
    navLabel: "Color",
    heading: "Color theory & pigment selection",
    intro: "Healed color = pigment base + client undertone + depth + sun exposure. Always heal cooler than you draw.",
    bullets: [
      "Warm undertone clients: avoid ash-heavy formulas alone — they heal gray",
      "Cool undertone clients: add warmth or healed result shifts reddish/orange",
      "Fitzpatrick I–II: lighter values; re-evaluate at touch-up before darkening",
      "Fitzpatrick IV–VI: richer bases; avoid titanium-heavy lighteners that heal ashy",
      "Oily skin: strokes blur faster — set expectation for more frequent refresh",
      "Dry/mature skin: often holds crisp strokes longer; use lighter hand",
    ],
    callouts: [
      {
        variant: "tip",
        title: "The swipe test",
        body: "Mix candidate pigment on a stroke card, wipe halfway — the remaining line approximates healed value better than the wet dip looks.",
      },
    ],
  },
  {
    id: "aftercare",
    navLabel: "Aftercare",
    heading: "Client aftercare — what you must teach",
    cards: [
      {
        category: "Days 1–7",
        title: "Protect the investment",
        bullets: [
          "Thin aftercare ointment 2× daily — no heavy occlusive layers",
          "No water on brows (quick shower OK — no steam, no soaking)",
          "No makeup, retinol, acids, or sunscreen on brows",
          "No picking, scratching, or peeling — let scabs fall naturally",
        ],
      },
      {
        category: "Days 7–14",
        title: "Healing continues",
        bullets: [
          "Brows may look \"ghosted\" or patchy — normal",
          "Still avoid aggressive exercise, sauna, swimming",
          "SPF on healed skin once fully closed (not on open strokes)",
        ],
      },
      {
        category: "Weeks 4–8",
        title: "Touch-up window",
        bullets: [
          "Schedule touch-up when true color stabilizes",
          "Bring reference photos — assess symmetry and density gaps",
          "Second pass uses same 5-step logic — less is still more",
        ],
      },
    ],
    callouts: [
      {
        variant: "warning",
        title: "When to call the clinic",
        body: "Unusual swelling beyond 48h, spreading redness, pus, fever, or allergic reaction signs — client contacts Hello Gorgeous immediately; document and follow medical escalation protocol.",
      },
    ],
  },
  {
    id: "practice",
    navLabel: "Practice",
    heading: "Your practice roadmap",
    intro: "Competence order: paper → fake skin → supervised live model → independent client.",
    bullets: [
      "Week 1–2: Trace low / medium / high spine sheets — 10 brows each daily",
      "Week 3–4: Five-step build on practice skins — focus on depth consistency",
      "Week 5+: Supervised models with full documentation; Ryan/Dani sign-off before solo book",
      "Maintain a stroke journal — photograph every stage, note pigment + blade + spine choice",
      "Retouch training is separate skill — do not touch-up until baseline application is consistent",
    ],
    callouts: [
      {
        variant: "info",
        title: "Hello Gorgeous standard",
        body:
          "We do not rush symmetry. We do not chase Instagram darkness on day one. We build brows that still look like the client on day 30 — that is the Hello Gorgeous difference.",
      },
    ],
  },
];

export const MICROBLADING_QUICK_REFERENCE = [
  { label: "Ideal depth", value: "Upper papillary dermis" },
  { label: "Blade angle", value: "90° to skin" },
  { label: "Touch-up timing", value: "6–8 weeks post-heal" },
  { label: "Mapping rule", value: "Nostril → pupil → canthus" },
  { label: "Stroke order", value: "Skeleton → primary → filler → tail" },
];
