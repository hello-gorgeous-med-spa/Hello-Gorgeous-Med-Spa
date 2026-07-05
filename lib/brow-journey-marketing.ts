/**
 * Your Brow Journey — microblading / brow PMU landing (Jen Vokoun · Hello Gorgeous).
 * Copy guardrail: sell Hello Gorgeous on its own strengths — never name or disparage competitors.
 */

import { BOOK_PAGE_PATH } from "@/lib/flows";
import {
  BROW_CONSULTATION_PACKET_PDF,
  BROW_INTAKE_PATH,
} from "@/data/brow-microblading-care";
import { BROW_PMU_OSWEGO_PATH, BROW_PMU_SEO_KEYWORDS } from "@/data/brow-pmu-seo";
import { SITE } from "@/lib/seo";

export const BROW_JOURNEY_PATH = BROW_PMU_OSWEGO_PATH;

export const BROW_JOURNEY_BRAND = {
  pink: "#FF2D8E",
  pinkDeep: "#E6007E",
  black: "#000000",
  cardFrom: "#140109",
  cardTo: "#0a0206",
} as const;

export const BROW_JOURNEY_CONTACT = {
  bookHref: BOOK_PAGE_PATH,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://withcherry.com/apply",
} as const;

export const BROW_JOURNEY_PRICING = {
  microblading: "$450",
  combo: "$550",
  touchup: "Included",
  refresher: "$250",
  meetMicroblading: "$350",
  meetCombo: "$400",
} as const;

const IMG = "/images/brow-journey";

export const BROW_JOURNEY_IMAGES = {
  heroJen: `${IMG}/jen-vokoun-2.jpg`,
  artistJen: `${IMG}/jen-vokoun.jpg`,
  founderDani: `${IMG}/founder-dani.png`,
  microbladeTechnique: `${IMG}/brow-microblade2.png`,
  powderTechnique: `${IMG}/pmu-shading.jpg`,
  comboTechnique: `${IMG}/brow-mapping.png`,
  nanoTechnique: `${IMG}/pmu-machine.jpg`,
  tdHands: `${IMG}/td-hands.webp`,
  tdChart: `${IMG}/td-chart.webp`,
  priceMicroblade: `${IMG}/pmu-microblade.jpg`,
  priceShading: `${IMG}/pmu-shading.jpg`,
  priceMachine: `${IMG}/pmu-machine.jpg`,
  priceNatural: `${IMG}/pmu-natural.jpg`,
  cherryQr: `${IMG}/cherry-qr.png`,
  blogCompare: `${IMG}/brow-compare.png`,
  blogNatural: `${IMG}/pmu-natural.jpg`,
  blogTypes: `${IMG}/brow-types.png`,
} as const;

export const BROW_JOURNEY_NAV = [
  { href: "#techniques", label: "Techniques" },
  { href: "#shapes", label: "Shapes" },
  { href: "#pigments", label: "Pigments" },
  { href: "#healing", label: "Healing" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#blog", label: "Blog" },
  { href: "#forms", label: "Client Intake" },
] as const;

export const BROW_JOURNEY_TECHNIQUES = [
  {
    id: "microblading",
    kicker: "Hair-stroke · Manual",
    name: "Microblading",
    image: BROW_JOURNEY_IMAGES.microbladeTechnique,
    imageAlt: "Microblading with a manual blade",
    description:
      "Fine, crisp individual strokes drawn by hand with a manual blade to mimic real brow hairs. The most natural, barely-there look — like you were simply born with fuller brows.",
    bestFor:
      "Normal to dry skin, those wanting the most natural hair-like result, and clients with gaps or sparse areas to fill.",
    specs: { finish: "Natural, hair-like", lasts: "1–2 years", skin: "Dry / normal" },
  },
  {
    id: "powder",
    kicker: "Machine · Shaded",
    name: "Ombré / Powder Brows",
    image: BROW_JOURNEY_IMAGES.powderTechnique,
    imageAlt: "Powder / ombré brows",
    description:
      "A soft, misted shading applied with a digital machine — light at the front, building to a defined tail. Mimics the look of softly filled-in brow powder or pencil.",
    bestFor:
      "Oily skin, mature skin, those who wear brow makeup daily, and anyone wanting a polished, done look that lasts.",
    specs: { finish: "Soft, filled-in", lasts: "2–3 years", skin: "All, esp. oily" },
  },
  {
    id: "combo",
    kicker: "Strokes + Shading",
    name: "Combo / Hybrid Brows",
    image: BROW_JOURNEY_IMAGES.comboTechnique,
    imageAlt: "Combo / hybrid brow work",
    description:
      "The best of both — crisp hair strokes through the front for realism, blended with soft ombré shading through the body and tail for definition and density.",
    bestFor:
      "Combination skin, those wanting natural and defined, and clients who love texture up front with fullness behind it.",
    specs: { finish: "Natural + defined", lasts: "2–3 years", skin: "Combination" },
  },
  {
    id: "nano",
    kicker: "Machine · Digital Strokes",
    name: "Machine Hair Strokes (Nano)",
    image: BROW_JOURNEY_IMAGES.nanoTechnique,
    imageAlt: "Machine hair strokes (nano)",
    description:
      "Hair-like strokes created with a fine digital needle instead of a manual blade. Gentler on the skin, more consistent, and a great option for skin types where manual microblading may blur.",
    bestFor:
      "Clients wanting the microblading look but with slightly oilier skin, or anyone preferring a machine technique.",
    specs: { finish: "Crisp strokes", lasts: "1.5–2.5 yrs", skin: "Normal / combo" },
  },
] as const;

export const BROW_JOURNEY_TECHNIQUE_COMPARE = [
  { name: "Microblading", look: "Most natural, hair strokes", skin: "Dry / normal", longevity: "1–2 yrs" },
  { name: "Ombré / Powder", look: "Soft, filled-in makeup look", skin: "All, esp. oily", longevity: "2–3 yrs" },
  { name: "Combo / Hybrid", look: "Natural front + defined body", skin: "Combination", longevity: "2–3 yrs" },
  { name: "Machine Nano", look: "Crisp digital strokes", skin: "Normal / combo", longevity: "1.5–2.5 yrs" },
] as const;

export const BROW_JOURNEY_SHAPES = [
  {
    name: "Arch",
    description: "Defined peak with lift. Adds structure and elegance; flattering on round or fuller faces.",
    path: "M8 26 C 34 18, 52 8, 66 8 C 80 8, 100 16, 112 24",
  },
  {
    name: "Soft Arch",
    description: "A gentle, natural rise. The most universally flattering, classic everyday brow.",
    path: "M8 25 C 38 16, 58 13, 74 14 C 90 15, 104 20, 112 24",
  },
  {
    name: "High Arch",
    description: "A dramatic, lifted peak for a bold, eye-opening, glamorous effect.",
    path: "M8 28 C 36 20, 54 4, 68 4 C 78 4, 100 18, 112 26",
  },
  {
    name: "Round",
    description: "Soft, curved with no sharp peak. Softens angular features and feels youthful.",
    path: "M8 26 C 28 12, 48 8, 60 8 C 74 8, 94 13, 112 26",
  },
  {
    name: "Round Arch",
    description: "Curved shape with a subtle lift; balances softness with definition.",
    path: "M8 26 C 30 14, 50 10, 64 11 C 82 12, 100 17, 112 24",
  },
  {
    name: "Upward",
    description: 'Brushed and angled upward for a fresh, "fox-eye" lifted appearance.',
    path: "M8 28 C 40 22, 74 12, 112 6",
  },
  {
    name: "Straight",
    description: "Minimal arch, horizontal flow. Modern, youthful, softening — the popular K-beauty look.",
    path: "M8 20 C 40 16, 74 16, 112 18",
  },
] as const;

export const BROW_JOURNEY_TD_SHADES = [
  { name: "Ash Brown", fitz: "F1–F3", color: "#8B6B43" },
  { name: "Grey", fitz: "F1–F3", color: "#6E624E" },
  { name: "Blonde", fitz: "F1–F2", color: "#B98D54" },
  { name: "Medium Brown", fitz: "F1–F3", color: "#6F4327" },
  { name: "Dark Brown", fitz: "F1–F4", color: "#4E2E1B" },
  { name: "Bolder Brown", fitz: "F3–F5", color: "#3B2417" },
  { name: "Ebony", fitz: "F4–F6", color: "#241611" },
] as const;

export const BROW_JOURNEY_PRE_CARE = {
  before: [
    "Avoid blood thinners 24–48 hrs prior — no alcohol, aspirin, ibuprofen, fish oil, or vitamin E (unless prescribed).",
    "No tanning or sunburn for 1 week before. We cannot work on sunburned or freshly tanned skin.",
    "Pause active skincare — stop retinol, Retin-A, AHAs, BHAs, and exfoliants in the brow area for 1 week.",
    "No brow waxing, tinting, or threading for 3–5 days — let your natural shape show so we can map accurately.",
    "Botox & filler at least 2 weeks before (or after); facials, peels, or laser at least 4 weeks prior.",
    "Cold sore history? Ask your physician about an antiviral before brow PMU.",
  ],
  dayOf: [
    "Skip caffeine the morning of — it can increase sensitivity and bleeding.",
    "Eat a good meal beforehand to keep blood sugar steady and avoid lightheadedness.",
    "Come with clean, makeup-free brows if possible — or arrive a few minutes early to remove makeup.",
    "Feel free to bring an inspiration photo, but trust the mapping process.",
    "Wear comfortable clothing and plan to relax. The appointment takes time, and that's a good thing.",
  ],
  reschedule:
    "You are pregnant or nursing · have an active cold sore or skin infection in the brow area · are sunburned · or have started Accutane. Your safety always comes first — we'll happily find you a new date.",
} as const;

export const BROW_JOURNEY_HEALING = [
  { when: "Days 1–2", tag: "BOLD", body: "Brows look dark & bold. This is normal. Gently blot any lymph fluid with a clean tissue every couple of hours for the first day. Apply aftercare balm sparingly if instructed." },
  { when: "Days 3–5", tag: "DARKEN", body: "Color deepens; light scabbing begins. Brows may feel tight or itchy. Do not pick or scratch — let flakes fall naturally." },
  { when: "Days 6–10", tag: "FLAKING", body: 'Scabs and flakes shed. Brows may look patchy or "too light" — pigment is settling beneath the surface.' },
  { when: "Days 10–14", tag: "GHOSTING", body: "Color may seem to nearly disappear. Don't panic — it will resurface as healing completes." },
  { when: "Weeks 4–6", tag: "TRUE COLOR", body: "Final color emerges. Your true healed result is visible — softer and more natural than day one." },
  { when: "Weeks 6–8", tag: "TOUCH-UP", body: "Perfecting touch-up visit. We refine shape, color, and density. This visit is essential to your final result." },
] as const;

export const BROW_JOURNEY_AFTERCARE = {
  do: [
    "Keep brows clean & dry as instructed",
    "Blot gently with a clean tissue (days 1–2)",
    "Apply aftercare balm sparingly if directed",
    "Sleep on your back if possible",
    "Let scabs fall off on their own",
    "Be patient through the healing stages",
  ],
  dont: [
    "Pick, scratch, or peel scabs",
    "Get brows wet, sweaty, or steamy (10 days)",
    "Apply makeup to the area while healing",
    "Sun, tanning beds, pools, saunas (2 weeks)",
    "Use retinol, exfoliants, or acids on brows",
    "Work out heavily until healed",
  ],
} as const;

export const BROW_JOURNEY_FAQS = [
  {
    q: "Does it hurt?",
    a: "Most clients are surprised how comfortable it is. We apply a professional numbing cream before and during, so you'll typically feel light pressure or scratching rather than pain.",
  },
  {
    q: "How long does it last?",
    a: "Depending on your technique, skin type, and aftercare, brow PMU lasts roughly 1–3 years. Microblading tends toward 1–2 years; ombré and combo can last 2–3. An annual color refresher keeps them looking their best.",
  },
  {
    q: "How long is the appointment?",
    a: "Plan for about 2 to 2.5 hours. That includes consultation, custom mapping, numbing, and the procedure — we never rush your brows.",
  },
  {
    q: "Is the touch-up really necessary?",
    a: "Yes — the 6-week perfecting touch-up is essential to your final result, and it's included with your initial session. It's when we refine shape, color, and density after your skin has healed.",
  },
  {
    q: "Will it look natural?",
    a: "Absolutely. We custom-map your brows to your bone structure and match pigment to your skin tone using premium Tina Davies colors. Healed results are always softer and more natural than they look on day one.",
  },
  {
    q: "How do I prep — and who shouldn't get it?",
    a: "Avoid blood thinners, caffeine, tanning, and retinol before your visit (see our full pre-care guide). Brow PMU isn't suitable during pregnancy or nursing, with certain skin or health conditions, or on Accutane — your free consultation screens you safely.",
  },
  {
    q: "How much is it, and do you offer financing?",
    a: "See our pricing on this page — and yes, you can pay over time with 0% APR options through Cherry. Apply in seconds with no hard credit check to see your options.",
  },
] as const;

export const BROW_JOURNEY_BLOG = [
  {
    href: "#techniques",
    image: BROW_JOURNEY_IMAGES.blogCompare,
    imageAlt: "Microblading vs powder brows",
    kicker: "Techniques",
    title: "Microblading vs. Powder Brows: which is right for you?",
    teaser: "Skin type, lifestyle, and the look you love all decide your best technique. Here's how to choose with confidence.",
  },
  {
    href: "#healing",
    image: BROW_JOURNEY_IMAGES.blogNatural,
    imageAlt: "Healed, natural brows",
    kicker: "Aftercare",
    title: "Your brow healing timeline, day by day",
    teaser: 'Bold, then dark, then flaky, then "gone," then perfect. Know each stage so you can trust the process.',
  },
  {
    href: "#prep",
    image: BROW_JOURNEY_IMAGES.blogTypes,
    imageAlt: "Brow technique types",
    kicker: "Prep",
    title: "How to prep for your first brow appointment",
    teaser: "A little prep makes a big difference. The do's and don'ts that help your brows heal beautifully.",
  },
] as const;

export const BROW_JOURNEY_FORMS = {
  pdfHref: BROW_CONSULTATION_PACKET_PDF,
  intakeHref: BROW_INTAKE_PATH,
  checklist: [
    "Client intake & health history",
    "Contraindications & informed consent",
    "Technique & brow-shape guide",
    "Pre & post-care instructions",
  ],
} as const;

export { BROW_PMU_SEO_KEYWORDS };

export const BROW_JOURNEY_SEO = {
  title: "Your Brow Journey | Microblading & Brow PMU Oswego IL | Hello Gorgeous",
  description:
    "Wake up with brows you love. Microblading, powder, combo & nano brows by Jen Vokoun at Hello Gorgeous Med Spa in Oswego — NP-directed, Tina Davies pigments, free consult. Naperville, Aurora & Fox Valley.",
  ogAlt: "Jen Vokoun — permanent makeup artist at Hello Gorgeous Med Spa, Oswego IL",
} as const;
