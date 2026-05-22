/** InMode Quantum RF launch packages — neck & abdomen + FREE Morpheus8 Burst bonus. */

import { SITE } from "@/lib/seo";

export const QUANTUM_RF_LAUNCH_FLYER = {
  src: "/images/promo/quantum-rf-launch-flyer.png",
  alt: "Hello Gorgeous Med Spa Quantum RF body contouring packages — neck $2,499, abdomen $3,999, FREE Morpheus8 Burst — Oswego IL",
} as const;

export const QUANTUM_RF_LAUNCH_PATH = "/quantum-rf-oswego-il";
export const CHERRY_FINANCING_URL = "https://pay.withcherry.com/hellogorgeous";

export type QuantumRFLaunchPackage = {
  id: string;
  name: string;
  price: string;
  financing: string;
  badge?: string;
  highlights: string[];
  bonus: string;
};

export const QUANTUM_RF_LAUNCH_PACKAGES: QuantumRFLaunchPackage[] = [
  {
    id: "neck",
    name: "Neck Quantum RF Package",
    price: "$2,499",
    financing: "As low as $89/mo with Cherry",
    highlights: [
      "Neck tightening · fat reduction + skin contraction",
      "Immediate visible results · local anesthesia only",
      "Results build for up to 6 months",
      "No operating room · no general anesthesia",
    ],
    bonus: "FREE Morpheus8 Burst included ($1,200 value)",
  },
  {
    id: "abdomen",
    name: "Abdomen Quantum RF Package",
    price: "$3,999",
    financing: "As low as $111/mo with Cherry",
    badge: "BEST VALUE",
    highlights: [
      "Abdomen contouring · stubborn fat + skin tightening",
      "Immediate visible sculpting · post-GLP-1 laxity specialist",
      "One treatment session · 5–7 day recovery",
      "Peak results up to 6 months as collagen builds",
    ],
    bonus: "FREE Morpheus8 Burst included ($1,500 value)",
  },
];

export const QUANTUM_RF_LAUNCH_STATS = [
  { value: "1", label: "Treatment session for optimal results" },
  { value: "5–7 days", label: "Typical recovery — no hospital, no OR" },
  { value: "6 mo", label: "Peak tightening as collagen rebuilds" },
] as const;

export const QUANTUM_RF_LAUNCH_SOCIAL = {
  google: {
    message: `⚡ NEW at Hello Gorgeous — InMode Quantum RF body contouring · Oswego, IL

Lipo-level results. No surgery. No operating room.

Neck package — $2,499 · includes FREE Morpheus8 Burst ($1,200 value)
Abdomen package — $3,999 · includes FREE Morpheus8 Burst ($1,500 value)

✓ Local anesthesia only · 1 session · 5–7 day recovery
✓ Ryan Kent, FNP-BC · Danielle Alcala, RN-S
✓ Cherry financing — as low as 0% APR

Free consultation — link below.`,
    link: `${SITE.url}${QUANTUM_RF_LAUNCH_PATH}`,
    imagePath: QUANTUM_RF_LAUNCH_FLYER.src,
  },
  facebook: {
    message: `✨ The New Standard in Body Contouring — NOW at Hello Gorgeous Med Spa, Oswego IL

Lipo results. No surgery. No operating room.

NOW INTRODUCING · INMODE QUANTUM RF

Neck Quantum RF Package — $2,499
→ Neck tightening + fat reduction + skin contraction
→ FREE Morpheus8 Burst ($1,200 value)

Abdomen Quantum RF Package — $3,999 ⭐ BEST VALUE
→ Abdomen contouring + post-GLP-1 skin laxity
→ FREE Morpheus8 Burst ($1,500 value)

1 session · local anesthesia · 5–7 day recovery · results build up to 6 months

Ryan Kent, FNP-BC & Danielle Alcala, RN-S
Cherry financing: pay.withcherry.com/hellogorgeous

Book your free consult 👇`,
    link: `${SITE.url}${QUANTUM_RF_LAUNCH_PATH}`,
    imagePath: QUANTUM_RF_LAUNCH_FLYER.src,
  },
};
