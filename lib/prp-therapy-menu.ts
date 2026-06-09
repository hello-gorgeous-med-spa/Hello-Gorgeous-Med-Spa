import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { PRP_FACIAL_MENU_PATH } from "@/lib/prp-facial-menu";

export const PRP_THERAPY_MENU_PATH = "/services/prp" as const;

export const PRP_THERAPY_MENU: ServiceMenuConfig = {
  path: PRP_THERAPY_MENU_PATH,
  metaTitle: "PRP Therapy Menu | Skin, Scalp & Joint | Hello Gorgeous Oswego",
  metaDescription:
    "PRP therapy in Oswego, IL — platelet-rich plasma for skin renewal, hair restoration, and joint support. NP-led draws, your own growth factors. Book consult.",
  hero: {
    eyebrow: "Oswego, IL · Regenerative Medicine",
    titleAccent: "PRP Therapy Menu",
    subtitle:
      "Platelet-rich plasma from your own blood — targeted regenerative support for skin quality, scalp renewal, and clinician-guided joint protocols. NP-supervised in downtown Oswego.",
    secondaryCta: { label: "Regenerative Medicine hub", href: "/regenerative-medicine-oswego-il" },
  },
  sections: [
    {
      id: "overview",
      number: "01",
      title: "What is PRP therapy?",
      description:
        "We draw a small sample of your blood, spin it to concentrate platelets and growth factors, then use that PRP where your plan calls for it — face, scalp, or targeted body areas. No synthetic filler; your biology does the work.",
      highlights: [
        "Uses your own platelet-rich plasma",
        "Skin · scalp · joint protocols available",
        "Results build gradually over weeks to months",
        "Series often recommended, then maintenance",
        "NP review of meds, pregnancy & blood disorders pre-draw",
      ],
      pricing: [
        { label: "PRP consult & candidacy review", price: "Free", note: "Book online or call" },
        { label: "Pre & post PRP/PRF care guide", price: "Free", href: "/pre-post-care/prp-prf" },
      ],
      learnMoreHref: "/regenerative-medicine-oswego-il",
      badge: "YOUR BIOLOGY",
    },
    {
      id: "facial-skin",
      number: "02",
      title: "PRP for skin & face",
      description:
        "Facial PRP lives on our dedicated menu — Vampire Facial, Express glow, and microneedling + PRP stacks with published pricing and downtime guidance.",
      highlights: [
        "Full Vampire Facial with microneedling",
        "PRP Express for lighter downtime",
        "Microneedling + PRP collagen stack",
        "Pairs with AnteAGE, Morpheus8 & peels when timed right",
        "See full facial PRP menu for every tier",
      ],
      pricing: [
        { label: "PRP Facial — Full (Vampire Facial)", price: "$400", href: PRP_FACIAL_MENU_PATH, note: "60 min" },
        { label: "Microneedling + PRP", price: "$500", href: PRP_FACIAL_MENU_PATH, note: "75 min" },
        { label: "PRP Facial — Express", price: "From $299", href: PRP_FACIAL_MENU_PATH, note: "Quoted at booking" },
        { label: "Full PRP facial menu", price: "Menu →", href: PRP_FACIAL_MENU_PATH },
      ],
      learnMoreHref: PRP_FACIAL_MENU_PATH,
      badge: "FACIAL MENU",
    },
    {
      id: "hair",
      number: "03",
      title: "PRP & PRF for hair restoration",
      description:
        "Scalp injections with PRP or PRF to support thinning hair, postpartum shedding, and androgenic patterns — series-based protocols with NP oversight.",
      highlights: [
        "PRP hair restoration injections",
        "PRF option for slower-release growth factors",
        "Series of 3–4 typical · maintenance after",
        "Complements topical & Rx plans when appropriate",
        "Consult required before first treatment",
      ],
      pricing: [
        { label: "PRP — Hair Restoration", price: "Consult", href: PRP_THERAPY_MENU_PATH, note: "Quoted at visit" },
        { label: "PRF Hair Restoration", price: "$600", href: "/services/prf-prp", note: "75 min · series recommended" },
        { label: "PRF / PRP treatments menu", price: "Menu →", href: "/services/prf-prp" },
      ],
      learnMoreHref: "/services/prf-prp",
    },
    {
      id: "joint-body",
      number: "04",
      title: "PRP for joint & body support",
      description:
        "Medical PRP injections for joint-focused and sports-recovery protocols — evaluation required. We do not diagnose online; in-person consult confirms fit.",
      highlights: [
        "Clinician-led evaluation required",
        "Uses concentrated platelets from your draw",
        "Often paired with rehab & activity modification",
        "Not a substitute for emergency orthopedic care",
        "Separate from cosmetic facial PRP pricing",
      ],
      pricing: [
        { label: "PRP — Joint / Body", price: "Consult", note: "Quoted after medical evaluation" },
        { label: "PRP joint injections overview", price: "Learn →", href: "/services/prp-joint-injections" },
      ],
      learnMoreHref: "/services/prp-joint-injections",
      badge: "MEDICAL",
    },
    {
      id: "pairings",
      number: "05",
      title: "Smart pairings & aftercare",
      description:
        "Regenerative plans work best when sequenced — we time microneedling, lasers, and injectables so you heal safely and results stack.",
      highlights: [
        "Avoid blood thinners pre-draw when possible",
        "Sun protection & gentle skincare post-treatment",
        "PRF upgrade path when longer release is needed",
        "Microneedling menu for AnteAGE & Morpheus8",
        "Download pre/post guide before your visit",
      ],
      pricing: [
        { label: "Microneedling menu", price: "From $249", href: "/services/microneedling" },
        { label: "PRF / PRP menu", price: "Menu →", href: "/services/prf-prp" },
        { label: "Pre & post PRP/PRF care", price: "Free", href: "/pre-post-care/prp-prf" },
      ],
      learnMoreHref: "/pre-post-care/prp-prf",
    },
  ],
  faqs: [
    {
      question: "What areas can PRP treat?",
      answer:
        "At Hello Gorgeous, PRP is used for facial skin renewal (Vampire Facial and microneedling stacks), scalp hair restoration, and clinician-guided joint/body protocols after an in-person evaluation. Your consult maps the right tier to your goals.",
    },
    {
      question: "How is PRP different from PRF?",
      answer:
        "Both start with your blood. PRP concentrates platelets in plasma for faster release; PRF adds a fibrin scaffold for slower, longer growth-factor release — often preferred for under-eye, texture, and hair protocols. See our PRF/PRP menu for injectable PRF pricing.",
    },
    {
      question: "How long until I see results?",
      answer:
        "Regenerative treatments are gradual. Facial glow may show within days to weeks; collagen remodeling and hair/scalp improvements often build over 4–12 weeks across a series. We set realistic timelines at consult.",
    },
    {
      question: "How many sessions will I need?",
      answer:
        "Many clients do 3–4 sessions spaced 4–6 weeks apart, then maintenance once or twice a year. Hair and scar protocols may need more. We tailor the plan — no one-size-fits-all packages without a consult.",
    },
    {
      question: "Is PRP safe?",
      answer:
        "PRP uses your own blood-derived components — no foreign filler. It's generally well tolerated when performed by trained medical staff. We screen pregnancy, blood disorders, active infection, and medications that increase bruising before every draw.",
    },
    {
      question: "What's the difference between this page and the PRP Facial menu?",
      answer:
        "This menu covers all PRP therapy paths — skin, scalp, and medical joint protocols. The PRP Facial menu is the detailed pricing hub for Vampire Facial, Express, and microneedling + PRP facial stacks.",
    },
  ],
};
