/**
 * Quantum RF — flagship Journey marketing (InMode Luxora workstation).
 * Canonical route: /services/quantum-rf (peer to Morpheus8 + Solaria Journeys).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { QUANTUM_RF_LAUNCH_PACKAGES } from "@/lib/quantum-rf-launch-promo";
import { SITE } from "@/lib/seo";

export const QUANTUM_RF_PATH = "/services/quantum-rf" as const;

export const QUANTUM_RF_CONTACT = {
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://pay.withcherry.com/hellogorgeous",
} as const;

export const QUANTUM_RF_MARKETING = {
  name: "Quantum RF",
  product: "InMode QuantumRF",
  tagline: "Subdermal fat reduction + skin tightening — minimally invasive",
  eyebrow: "Hello Gorgeous Med Spa · Oswego, Illinois",
  headline: "Quantum RF Skin Tightening & Body Contouring",
  headlineAccent: "in Oswego, IL",
  subhead:
    "Advanced minimally invasive radiofrequency technology designed for soft tissue contraction and personalized contour refinement.",
  physicianLine: "Performed by Dr. Mukesh Arora, MD — Treating Physician & Medical Director",
  trustLine:
    "Three advanced InMode technologies on site: Quantum RF + Morpheus8 Burst + Solaria CO₂. Medical Director: Dr. Mukesh Arora, MD.",
  /** Service areas for local SEO */
  serviceAreas: [
    "Oswego",
    "Naperville",
    "Aurora",
    "Plainfield",
    "Yorkville",
    "Montgomery",
  ] as const,
  phoneDisplay: QUANTUM_RF_CONTACT.phoneDisplay,
  phoneHref: QUANTUM_RF_CONTACT.phoneTel,
  bookHref: QUANTUM_RF_CONTACT.bookHref,
  textTel: QUANTUM_RF_CONTACT.textTel,
  textDisplay: QUANTUM_RF_CONTACT.textDisplay,
  careHref: "/pre-post-care/quantum-rf",
  landerHref: "/quantum-rf-oswego",
  compareMorpheusHref: "/services/morpheus8",
  compareSolariaHref: "/services/solaria-co2",
  trifectaHref: "/specials",
  inmodeUrl: "https://www.inmodemd.com/technologies/quantumrf/",
  /** Luxora / InMode platform hero */
  heroVideo: "/videos/quantum-rf/luxora-inmode-hero.mp4",
  clinicVideo: "/videos/quantum/quantum-rf-clinic-reedit-oswego.mp4",
  images: {
    hero: "/images/quantum-rf/quantum-hero.jpg",
    overview: "/images/quantum-rf/quantum-rf-technology-inmode-overview.png",
    handpieces: "/images/quantum-rf/quantum-rf-inmode-handpieces-ba.jpg",
    procedure: "/images/quantum-rf/quantum-rf-procedure-may-4.jpg",
    room: "/images/quantum-rf/quantum-rf-treatment-room-may-4.jpg",
    founder: "/images/team/danielle-alcala-glazier-portrait.png",
    jawlineClinic: "/images/quantum-rf/quantum-rf10-jawline-before-after.jpg",
    clientChinCinematic: "/images/quantum-rf/hg-client-chin-cinematic.jpg",
    clientAbdomenCinematic: "/images/quantum-rf/hg-client-abdomen-cinematic.jpg",
    clinicalNeck: "/images/quantum-rf/clinical-ba-jawline-neck-tightening.png",
    clinicalAbdomen: "/images/quantum-rf/clinical-ba-abdomen-skin-tightening.png",
    clinicalArm: "/images/quantum-rf/clinical-ba-upper-arm-tightening.png",
    clinicalKnee: "/images/quantum-rf/clinical-ba-knee-skin-tightening.png",
    clinicalProfile: "/images/quantum-rf/clinical-ba-profile-jawline-submental.png",
    clinicalLowerFace: "/images/quantum-rf/clinical-ba-lower-face-jawline.png",
    // Dr. Arora clinic treatment photos (Oct 2026)
    drAroraGrid: "/images/quantum-rf/clinic-results/dr-arora-procedure-grid.jpg",
    drAroraTreating1: "/images/quantum-rf/clinic-results/dr-arora-treating-1.jpg",
    drAroraTreating2: "/images/quantum-rf/clinic-results/dr-arora-treating-2.jpg",
    clinicAbdomenBaBranded1: "/images/quantum-rf/clinic-results/abdomen-ba-branded-1.jpg",
    clinicAbdomenBaBranded2: "/images/quantum-rf/clinic-results/abdomen-ba-branded-2.jpg",
    clinicAbdomenBaSideBranded: "/images/quantum-rf/clinic-results/abdomen-ba-side-branded.jpg",
  },
} as const;

export const QUANTUM_RF_INTRO_SPECIAL = {
  badge: "Launch packages · FREE Morpheus8 Burst",
  title: "Neck $2,499 · Abdomen $3,999",
  priceLabel: "From $2,499",
  priceNote: "each package includes complimentary Morpheus8 Burst · Cherry financing",
  description:
    "One treatment session · local anesthesia · fat reduction + skin contraction. Results continue building up to 6 months.",
  ctaLabel: "Book free consult",
  href: QUANTUM_RF_PATH,
} as const;

export const QUANTUM_RF_NAV = [
  { href: "#inmode", label: "InMode" },
  { href: "#why", label: "Why Quantum" },
  { href: "#treats", label: "Treats" },
  { href: "#results", label: "Results" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

/** What Is QuantumRF? — educational section for AI search optimization */
export const QUANTUM_RF_WHAT_IS = {
  eyebrow: "InMode QuantumRF Technology",
  title: "What Is",
  titleAccent: "InMode QuantumRF?",
  body: [
    "QuantumRF is an advanced, minimally invasive radiofrequency technology designed to deliver energy beneath the skin for soft tissue contraction.",
    "At Hello Gorgeous Med Spa in Oswego, Illinois, Dr. Mukesh Arora uses this technology as part of individualized treatment planning for appropriate patients seeking improvement in skin laxity and body contours.",
    "The treatment may be considered for areas such as the abdomen, arms, neck and other suitable regions following clinical evaluation.",
  ],
  disclaimer: "Treatment outcomes, recovery and candidacy vary.",
  inmodeLink: "https://www.inmodemd.com/technologies/quantumrf/",
} as const;

export const QUANTUM_RF_INMODE_STORY = {
  eyebrow: "Why QuantumRF / Luxora",
  title: "Advanced body contour",
  titleAccent: "without an operating room",
  body: [
    "QuantumRF uses bipolar radiofrequency through a small probe to deliver precise fat reduction and skin tightening — minimally invasive, in-office under local anesthesia.",
    "Unlike multi-session fat freezes, QuantumRF is designed for meaningful change in a single treatment with concurrent skin contraction — then collagen keeps remodeling for months. Individual results vary.",
  ],
  quote:
    "We brought Luxora home so you can choose real contour change with physician oversight — Quantum for volume, Morpheus8 for texture, Solaria for surface.",
  chips: ["QuantumRF 10 · face & small zones", "QuantumRF · body contour", "Minimally invasive", "Local anesthesia"],
} as const;

export const QUANTUM_RF_FOUNDER_NOTE = {
  eyebrow: "A Note From Danielle",
  title: "Why Quantum completes Contour",
  paragraphs: [
    "Stubborn fat and soft laxity don’t always need a scalpel — and they don’t always respond to surface treatments alone. QuantumRF works in the fat layer while contracting tissue above it.",
    "Dr. Mukesh Arora, MD is our Medical Director. I own the InMode client experience and the training journey. We map honest expectations — neck, abdomen, arms, or a multi-treatment plan.",
    "Welcome to Contour at Hello Gorgeous — physician-led care, boutique experience.",
  ],
  signOff: "xoxo, Danielle",
  role: "Founder · Hello Gorgeous Med Spa",
} as const;

/** Section 4: Why Consider Quantum RF — benefits grid per ticket */
export const QUANTUM_RF_BENEFITS = [
  {
    id: "minimally-invasive",
    title: "Minimally Invasive Technology",
    body: "Uses radiofrequency energy delivered beneath the skin through a minimally invasive approach.",
  },
  {
    id: "tissue-contraction",
    title: "Designed for Soft Tissue Contraction",
    body: "Targets tissue contraction as part of individualized aesthetic treatment planning.",
  },
  {
    id: "personalized",
    title: "Personalized Contour Refinement",
    body: "Treatment areas and expectations are determined during consultation.",
  },
  {
    id: "physician-performed",
    title: "Physician-Performed Treatment",
    body: "Dr. Mukesh Arora, MD, personally performs the Quantum RF procedures described on this page.",
  },
  {
    id: "access-points",
    title: "Smaller Access Points",
    body: "A minimally invasive approach generally uses smaller access sites than open excisional procedures.",
  },
  {
    id: "recovery",
    title: "Recovery Based on Your Procedure",
    body: "Some patients may experience less downtime than with more extensive surgery. Swelling, bruising, discomfort and other recovery effects are possible.",
  },
] as const;

/** Section 5: Meet Your Physician */
export const QUANTUM_RF_PHYSICIAN = {
  eyebrow: "Your Treating Physician",
  title: "Meet Dr. Mukesh Arora, MD",
  body: [
    "At Hello Gorgeous Med Spa, Quantum RF treatment is performed by Dr. Mukesh Arora, MD, our treating physician and Medical Director.",
    "Dr. Arora provides medical oversight, evaluates treatment suitability and performs advanced procedures within his clinical practice.",
    "His approach emphasizes individualized assessment, realistic expectations and appropriate clinical follow-up.",
  ],
  image: "/images/quantum-rf/clinic-results/dr-arora-treating-2.jpg",
  bioLink: "/team/dr-arora",
} as const;

/** Section 6: Behind the Treatment — treatment gallery */
export const QUANTUM_RF_TREATMENT_GALLERY = {
  eyebrow: "Behind the Treatment",
  title: "See Quantum RF Treatment at Hello Gorgeous",
  description:
    "Procedures are planned according to patient anatomy, individual concerns and clinical assessment.",
  images: [
    {
      src: "/images/quantum-rf/clinic-results/dr-arora-treating-1.jpg",
      alt: "Dr. Mukesh Arora and patient during Quantum RF treatment at Hello Gorgeous Med Spa",
      label: "Dr. Arora with patient",
    },
    {
      src: "/images/quantum-rf/clinic-results/dr-arora-treating-2.jpg",
      alt: "Close-up of Quantum RF treatment technique performed by Dr. Mukesh Arora",
      label: "Treatment technique",
    },
    {
      src: "/images/quantum-rf/clinic-results/dr-arora-procedure-grid.jpg",
      alt: "Clinical procedure environment at Hello Gorgeous Med Spa showing Quantum RF treatment",
      label: "Clinical environment",
    },
  ],
} as const;

/** Section 7: Who May Be a Candidate? */
export const QUANTUM_RF_CANDIDACY = {
  eyebrow: "Treatment Candidacy",
  title: "Is Quantum RF Right for You?",
  body: [
    "Quantum RF may be considered for appropriately selected adults concerned about skin laxity or changes in body contours.",
    "A consultation is necessary to determine whether the procedure is suitable based on skin condition, anatomy, medical history, treatment goals and potential risks.",
    "Patients with substantial excess skin or significant fat-removal goals may require different treatment approaches.",
    "Dr. Arora will discuss available options and appropriate expectations during the consultation.",
  ],
} as const;

/** Section 8: Recovery and Expectations */
export const QUANTUM_RF_RECOVERY = {
  eyebrow: "Recovery Information",
  title: "What Is Recovery Like After Quantum RF?",
  body: [
    "Recovery varies based on the treatment area, procedural technique and individual healing response.",
    "Temporary swelling, bruising, tenderness and activity limitations may occur. More significant complications are possible and should be discussed during informed consent.",
    "Patients receive individualized instructions concerning aftercare, follow-up and return to regular activities.",
  ],
  disclaimer:
    "Recovery timelines vary by patient. Specific recovery expectations will be discussed during your consultation.",
} as const;

export const QUANTUM_RF_WHAT_IT_DOES = [
  {
    id: "fat",
    title: "Fat reduction",
    body: "Controlled RF coagulates subcutaneous fat — targeted volume change without suction cannulas. Results vary by patient.",
    stat: "1×",
    statLabel: "treatment typical",
  },
  {
    id: "tighten",
    title: "Skin contraction",
    body: "Same session heat stimulates collagen — contour plus firmer tissue over 3–6 months.",
    stat: "1×",
    statLabel: "typical session",
  },
  {
    id: "probe",
    title: "Tiny entry points",
    body: "Small probe + local numbing — no general anesthesia, no operating room.",
    stat: "In-office",
    statLabel: "procedure",
  },
  {
    id: "luxora",
    title: "Luxora platform",
    body: "Pairs with Morpheus8 Burst & Solaria CO₂ for complete face + body rebuilds.",
    stat: "Trifecta",
    statLabel: "ready",
  },
] as const;

export const QUANTUM_RF_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We measure areas, review photos, and tell you honestly if Quantum, Morpheus8 Body, or both fit best.",
  },
  {
    step: "2",
    title: "Prep & numbing",
    body: "Marking, photos, and local anesthesia protocol for comfort before the probe.",
  },
  {
    step: "3",
    title: "QuantumRF session",
    body: "Typically one treatment per planned zone — deep warmth, controlled passes, no OR.",
  },
  {
    step: "4",
    title: "Heal & remodel",
    body: "Usually 5–7 day social recovery · contour builds weeks 4+ · peak tightening up to 6 months.",
  },
] as const;

export const QUANTUM_RF_TREATS = [
  "Neck & jawline fullness",
  "Submental (under-chin)",
  "Abdomen / stubborn fat",
  "Flanks · love handles",
  "Upper arms",
  "Inner thighs",
  "Post-GLP-1 soft laxity",
  "Mild–moderate skin laxity with fat",
] as const;

export const QUANTUM_RF_AREAS_10 = [
  "Face",
  "Neck",
  "Love handles",
  "Inner thighs",
] as const;

export const QUANTUM_RF_PACKAGES = [
  ...QUANTUM_RF_LAUNCH_PACKAGES.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    detail: pkg.financing,
    bullets: [...pkg.highlights.slice(0, 3), pkg.bonus],
    highlight: Boolean(pkg.badge),
    badge: pkg.badge,
  })),
  {
    id: "arms-knees",
    name: "Arms · knees · custom",
    price: "Consult",
    detail: "quoted by zone",
    bullets: ["QuantumRF 10 / body mapping", "Often paired with Morpheus8", "Honest candidacy screen"],
    highlight: false,
  },
  {
    id: "trifecta",
    name: "VIP Trifecta",
    price: "Specials →",
    detail: "Quantum + Morpheus8 + Solaria",
    bullets: ["Complete InMode overhaul", "Exclusive bundle pricing", "Priority booking"],
    highlight: false,
    href: "/specials",
  },
] as const;

const BA = "/images/quantum-rf/inmode-ba";

export type QuantumRfResult = {
  src: string;
  alt: string;
  label: string;
  area: "face" | "body";
  source: "clinic" | "inmode";
};

export const QUANTUM_RF_FEATURED_RESULTS: QuantumRfResult[] = [
  {
    src: QUANTUM_RF_MARKETING.images.clinicAbdomenBaBranded1,
    alt: "Quantum RF abdomen front view before and after — performed by Dr. Mukesh Arora, MD at Hello Gorgeous Med Spa Oswego",
    label: "Abdomen · Front View",
    area: "body",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicAbdomenBaSideBranded,
    alt: "Quantum RF abdomen side view before and after — performed by Dr. Mukesh Arora, MD at Hello Gorgeous Med Spa Oswego",
    label: "Abdomen · Side View",
    area: "body",
    source: "clinic",
  },
];

export const QUANTUM_RF_RESULTS: QuantumRfResult[] = [
  ...QUANTUM_RF_FEATURED_RESULTS,
  {
    src: QUANTUM_RF_MARKETING.images.clinicAbdomenBaBranded2,
    alt: "Quantum RF abdomen contouring before and after — performed by Dr. Mukesh Arora, MD",
    label: "Abdomen contour · Dr. Arora",
    area: "body",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.drAroraGrid,
    alt: "Dr. Mukesh Arora performing Quantum RF procedure at Hello Gorgeous Med Spa — provider at work",
    label: "Dr. Arora performing Quantum RF",
    area: "body",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clientChinCinematic,
    alt: "Quantum RF chin and neck before and after — Hello Gorgeous Med Spa client, Oswego",
    label: "Chin & neck · our client",
    area: "face",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clientAbdomenCinematic,
    alt: "Quantum RF abdomen before and after — Hello Gorgeous Med Spa client, Oswego",
    label: "Abdomen · our client",
    area: "body",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalNeck,
    alt: "Quantum RF jawline and neck tightening before and after — InMode clinical",
    label: "Jawline & neck · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalProfile,
    alt: "Quantum RF profile jawline submental before and after — InMode clinical",
    label: "Profile · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalLowerFace,
    alt: "Quantum RF lower face jawline before and after — InMode clinical",
    label: "Lower face · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: QUANTUM_RF_MARKETING.images.jawlineClinic,
    alt: "QuantumRF 10 jawline before and after — InMode clinical",
    label: "QuantumRF 10 jawline · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalAbdomen,
    alt: "Quantum RF abdomen skin tightening before and after — InMode clinical",
    label: "Abdomen · InMode",
    area: "body",
    source: "inmode",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalArm,
    alt: "Quantum RF upper arm tightening before and after — InMode clinical",
    label: "Arms · InMode",
    area: "body",
    source: "inmode",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalKnee,
    alt: "Quantum RF knee skin tightening before and after — InMode clinical",
    label: "Knees · InMode",
    area: "body",
    source: "inmode",
  },
  {
    src: `${BA}/face-lside.jpg`,
    alt: "QuantumRF 10 face left side before and after — InMode clinical",
    label: "Face L · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/face-rside.jpg`,
    alt: "QuantumRF 10 face right side before and after — InMode clinical",
    label: "Face R · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/face-ba-collage.jpg`,
    alt: "QuantumRF face before and after collage — InMode",
    label: "Face collage · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/arm-l-front.jpg`,
    alt: "QuantumRF arms left front before and after — InMode clinical",
    label: "Arm · InMode",
    area: "body",
    source: "inmode",
  },
  {
    src: `${BA}/arm-r-front-pr.jpg`,
    alt: "QuantumRF arms right front before and after — InMode clinical",
    label: "Arm · InMode",
    area: "body",
    source: "inmode",
  },
];

export const QUANTUM_RF_FAQS = [
  {
    q: "What is QuantumRF?",
    a: "QuantumRF by InMode uses bipolar radiofrequency through a small probe to reduce fat and tighten skin in one in-office treatment — minimally invasive, under local anesthesia, no operating room required.",
  },
  {
    q: "Who performs Quantum RF at Hello Gorgeous Med Spa?",
    a: "Dr. Mukesh Arora, MD, our Medical Director, performs Quantum RF treatments at Hello Gorgeous Med Spa in Oswego, Illinois. Dr. Arora is a board-certified Internal Medicine physician with over 30 years of medical experience.",
  },
  {
    q: "Am I a candidate for Quantum RF?",
    a: "Quantum RF may be appropriate for patients with mild to moderate skin laxity and localized fat deposits in areas like the abdomen, arms, neck, or thighs. A consultation with Dr. Arora is required to assess candidacy. Factors include skin quality, treatment goals, medical history, and realistic expectations. Not everyone is a candidate.",
  },
  {
    q: "Is Quantum RF an alternative to liposuction?",
    a: "Quantum RF is a minimally invasive option that some patients consider as an alternative to surgical liposuction. While it can address smaller fat deposits and skin laxity without general anesthesia or an operating room, results and candidacy differ from surgical procedures. A consultation will help determine if Quantum RF or another approach is appropriate for your goals.",
  },
  {
    q: "What is the recovery like?",
    a: "Most patients experience mild swelling and tenderness for several days. Plan for approximately 5–7 days of social recovery for body areas. A compression garment may be recommended. Face and neck protocols typically have shorter recovery. There is no hospital stay. Recovery experiences vary by patient.",
  },
  {
    q: "How is Quantum RF different from CoolSculpting?",
    a: "CoolSculpting uses cryolipolysis (freezing) over multiple sessions. QuantumRF uses radiofrequency energy to heat tissue, potentially addressing both fat and skin laxity in a single treatment. The approaches, candidacy requirements, and expected outcomes differ. A consultation can help determine which may be appropriate.",
  },
  {
    q: "What is the difference between Quantum RF and Morpheus8?",
    a: "Morpheus8 is RF microneedling designed for skin texture, scars, and collagen remodeling at shallower depths. QuantumRF works beneath the skin surface for fat reduction and tissue contraction. Some patients benefit from combining both technologies. Dr. Arora can recommend an appropriate treatment plan during your consultation.",
  },
  {
    q: "How much does Quantum RF cost?",
    a: "Current packages: Neck $2,499 and Abdomen $3,999 — each includes complimentary Morpheus8 Burst. Arms, knees, and custom zones are quoted at consultation. Cherry financing is available. Pricing is subject to change.",
  },
  {
    q: "When will I see results?",
    a: "Some patients notice initial changes within weeks, but collagen remodeling continues for 3–6 months. Final results depend on the treatment area, individual response, and adherence to aftercare instructions. Results vary by patient.",
  },
  {
    q: "Are results permanent?",
    a: "Treated fat cells do not regenerate, but maintaining results depends on weight stability and lifestyle factors. Skin tightening may continue to improve for months as collagen rebuilds. Results are not guaranteed and vary by individual.",
  },
  {
    q: "Do you serve patients from Naperville, Aurora, and Plainfield?",
    a: "Yes. Hello Gorgeous Med Spa in Oswego serves patients from throughout the western Chicago suburbs including Naperville, Aurora, Plainfield, Yorkville, Montgomery, and surrounding communities. We are located at 74 W. Washington Street in downtown Oswego, IL.",
  },
  {
    q: "What treatments help loose skin after weight loss or GLP-1 therapy?",
    a: "Quantum RF and Morpheus8 Burst are often considered for patients with skin laxity following significant weight loss, including after GLP-1 or tirzepatide therapy. Quantum RF addresses both fat and skin tightening in one session under local anesthesia. Morpheus8 treats skin texture and mild laxity at shallower depths with RF microneedling. A consultation with Dr. Arora is required to assess which treatment—or combination—may be appropriate for your specific situation. Results vary by patient.",
  },
  {
    q: "Which advanced aesthetic technologies are available at Hello Gorgeous?",
    a: "Hello Gorgeous Med Spa in Oswego offers three advanced InMode technologies under physician direction: Quantum RF for subdermal body contouring, Morpheus8 Burst for RF microneedling (face and body), and Solaria CO₂ for fractional laser resurfacing. All three are performed or supervised by Dr. Mukesh Arora, MD, our Medical Director. We are a verified InMode provider serving Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery.",
  },
] as const;

export const QUANTUM_RF_NAV_ACTIVE_PREFIXES = [
  QUANTUM_RF_PATH,
  "/quantum-rf",
  "/pre-post-care/quantum",
  "/aftercare/quantum",
] as const;

export function isQuantumRfNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return QUANTUM_RF_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`),
  );
}

export const QUANTUM_RF_SEO = {
  title: "Quantum RF Skin Tightening & Body Contouring | Oswego IL | Dr. Arora",
  description:
    "Quantum RF skin tightening and body contouring performed by Dr. Mukesh Arora, MD at Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, Plainfield, Yorkville and the western Chicago suburbs. Minimally invasive radiofrequency treatment for soft tissue contraction. Free consultation.",
  ogAlt: "Quantum RF body contouring performed by Dr. Mukesh Arora, MD — Hello Gorgeous Med Spa Oswego IL",
  /** Extended keywords for AI search optimization */
  keywords: [
    "Quantum RF Oswego IL",
    "skin tightening Naperville",
    "body contouring Aurora IL",
    "QuantumRF InMode",
    "non surgical body contouring",
    "skin laxity treatment Plainfield",
    "Yorkville med spa",
    "Montgomery IL aesthetics",
    "Dr. Mukesh Arora",
    "radiofrequency skin tightening Chicago suburbs",
  ],
} as const;
