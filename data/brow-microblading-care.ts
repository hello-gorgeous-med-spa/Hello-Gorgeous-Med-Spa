/** Hello Gorgeous — Brow PMU / microblading pre & post care (client-facing). */

export const MICROBLADING_PREPOST_PATH = "/pre-post-care/microblading";
export const BROW_CONSULTATION_PACKET_PDF = "/handouts/education/brow-consultation-packet.pdf";
export const YOUR_BROW_JOURNEY_PATH = "/education/your-brow-journey";
export const YOUR_BROW_JOURNEY_HTML = "/handouts/education/your-brow-journey.html";
export const YOUR_BROW_JOURNEY_PDF = "/handouts/education/your-brow-journey.pdf";
export const BROW_INTAKE_PATH = "/forms/brow-intake";

/** Powder / ombré brow PMU — combined before & after (client consent on file). */
export const POWDER_BROWS_BEFORE_AFTER = {
  src: "/images/brow/powder-brows-before-after.png",
  alt: "Powder brows before and after permanent makeup at Hello Gorgeous Med Spa Oswego IL",
  title: "Powder Brows",
  caption: "Soft ombré shading — fuller shape, defined arch, natural finish.",
} as const;

export type CareListSection = {
  title: string;
  items: string[];
};

export type HealingPhase = {
  days: string;
  label: string;
  body: string;
};

export const MICROBLADING_PRE_CARE: CareListSection[] = [
  {
    title: "In the days before",
    items: [
      "Avoid blood thinners 24–48 hours prior — no alcohol, aspirin, ibuprofen, fish oil, or vitamin E (unless prescribed). They increase bleeding and can dilute pigment.",
      "Skip caffeine the morning of your appointment — it can increase sensitivity and bleeding.",
      "No tanning or sunburn for 1 week before. We cannot work on sunburned or freshly tanned skin.",
      "Pause active skincare — stop retinol, Retin-A, AHAs, BHAs, and exfoliants in the brow area for 1 week prior.",
      "No brow waxing, tinting, or threading for 3–5 days before — let your natural shape show so we can map accurately.",
      "Botox & filler should be done at least 2 weeks before (or after) your brow appointment.",
      "Facials, peels, or laser in the area should be at least 4 weeks prior.",
      "Cold sore history? Ask your physician about an antiviral before brow PMU to help prevent an outbreak.",
    ],
  },
  {
    title: "Day of your appointment",
    items: [
      "Eat a good meal beforehand to keep blood sugar steady and avoid lightheadedness.",
      "Come with clean, makeup-free brows if possible — or arrive a few minutes early to remove makeup.",
      "Feel free to bring an inspiration photo, but trust the mapping process — we tailor the shape to your face.",
      "Wear comfortable clothing and plan to relax. The appointment takes time, and that's a good thing.",
    ],
  },
];

export const MICROBLADING_RESCHEDULE_IF = [
  "You are pregnant or nursing",
  "You have an active cold sore or skin infection in the brow area",
  "You are sunburned",
  "You have started Accutane",
];

export const MICROBLADING_HEALING_TIMELINE: HealingPhase[] = [
  {
    days: "Days 1–2",
    label: "Bold",
    body: "Brows look dark & bold. This is normal. Gently blot any lymph fluid with a clean tissue every couple of hours for the first day. Apply aftercare balm sparingly if instructed.",
  },
  {
    days: "Days 3–5",
    label: "Darken",
    body: "Color deepens; light scabbing begins. Brows may feel tight or itchy. Do not pick or scratch — let flakes fall naturally.",
  },
  {
    days: "Days 6–10",
    label: "Flaking",
    body: "Scabs and flakes shed. Brows may look patchy or \"too light\" — pigment is settling beneath the surface.",
  },
  {
    days: "Days 10–14",
    label: "Ghosting",
    body: "Color may seem to nearly disappear. Don't panic — it will resurface as healing completes.",
  },
  {
    days: "Weeks 4–6",
    label: "True color",
    body: "Final color emerges. Your true healed result is visible — softer and more natural than day one.",
  },
  {
    days: "Weeks 6–8",
    label: "Touch-up",
    body: "Perfecting touch-up visit. We refine shape, color, and density. This visit is essential to your final result.",
  },
];

export const MICROBLADING_DO_LIST = [
  "Keep brows clean & dry as instructed",
  "Blot gently with clean tissue (days 1–2)",
  "Apply aftercare balm sparingly if directed",
  "Sleep on your back if possible",
  "Let scabs fall off on their own",
  "Be patient through the healing stages",
];

export const MICROBLADING_DONT_LIST = [
  "Pick, scratch, or peel scabs",
  "Get brows wet, sweaty, or steamy (10 days)",
  "Apply makeup to the area while healing",
  "Sun, tanning beds, pools, saunas (2 weeks)",
  "Use retinol, exfoliants, or acids on brows",
  "Work out heavily until healed",
];

export const MICROBLADING_HEALING_NOTE =
  "Healed PMU looks 30–50% lighter and softer than it does on day one. Trust the process — your perfecting touch-up at 6–8 weeks is when we bring everything to its final, beautiful result.";

export const MICROBLADING_INFECTION_WARNING =
  "Call us right away if you notice signs of infection — spreading redness, swelling, warmth, pus, or fever. We're always here for you: (630) 636-6193.";
