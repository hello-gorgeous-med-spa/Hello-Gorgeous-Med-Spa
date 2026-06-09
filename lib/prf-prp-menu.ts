import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { PRP_FACIAL_MENU_PATH } from "@/lib/prp-facial-menu";
import { PRP_THERAPY_MENU_PATH } from "@/lib/prp-therapy-menu";

export const PRF_PRP_MENU_PATH = "/services/prf-prp" as const;

export const PRF_PRP_MENU: ServiceMenuConfig = {
  path: PRF_PRP_MENU_PATH,
  metaTitle: "PRF / PRP Menu | Under-Eye, Hair & Injectable Regenerative | Hello Gorgeous",
  metaDescription:
    "PRF and PRP menu in Oswego — under-eye $500, hair restoration $600, EZ PRF Gel, and PRP therapy for skin & scalp. Your own growth factors, NP-led.",
  hero: {
    eyebrow: "Oswego, IL · Your own biology",
    titleAccent: "PRF / PRP Menu",
    subtitle:
      "Platelet-rich fibrin and plasma from your blood — longer-release PRF for under-eye, texture, and hair; PRP for skin, scalp, and targeted renewal. NP-supervised regenerative medicine.",
    secondaryCta: { label: "PRP therapy menu", href: PRP_THERAPY_MENU_PATH },
  },
  sections: [
    {
      id: "prp-vs-prf",
      number: "01",
      title: "PRP vs PRF — what's the difference?",
      description:
        "Same draw, different spin. PRP delivers concentrated platelets in plasma for faster action. PRF keeps a fibrin matrix so growth factors release more slowly — often better for injectable under-eye, texture, and hair series.",
      highlights: [
        "PRP — faster platelet release in plasma",
        "PRF — fibrin scaffold, slower sustained release",
        "Both use your blood — no synthetic filler",
        "Provider picks format based on area & goals",
        "Consult required for all injectable PRF",
      ],
      pricing: [
        { label: "PRP therapy overview", price: "Menu →", href: PRP_THERAPY_MENU_PATH },
        { label: "PRP facial menu (Vampire · Express)", price: "Menu →", href: PRP_FACIAL_MENU_PATH },
      ],
      learnMoreHref: "/regenerative-medicine-oswego-il",
      badge: "COMPARE",
    },
    {
      id: "under-eye-texture",
      number: "02",
      title: "PRF under-eye & texture",
      description:
        "Injectable PRF for hollows, crepey under-eye skin, and targeted texture — slower release than standard PRP for delicate areas.",
      highlights: [
        "Under-eye hollow & texture protocols",
        "Uses your own fibrin matrix",
        "Swelling or bruising possible 2–5 days",
        "Series often recommended",
        "Not a replacement for tear-trough filler when volume is the main issue",
      ],
      pricing: [
        { label: "PRF under-eye", price: "$500", note: "45 min · area dependent" },
        { label: "PRF injectable consult", price: "Free", note: "Candidacy & plan at visit" },
      ],
      learnMoreHref: "/pre-post-care/prp-prf",
    },
    {
      id: "hair",
      number: "03",
      title: "PRF & PRP hair restoration",
      description:
        "Scalp injections to support thinning hair, shedding, and pattern loss — PRF for longer-release signaling, PRP for classic platelet protocols.",
      highlights: [
        "Direct scalp injection series",
        "PRF Hair Restoration — published pricing",
        "PRP hair protocols quoted at consult",
        "3–4 session series typical",
        "Complements topical & Rx when appropriate",
      ],
      pricing: [
        { label: "PRF Hair Restoration", price: "$600", note: "75 min · series recommended" },
        { label: "Platelet-Rich Fibrin (PRF) for hair loss", price: "$600", note: "Same protocol · book online for Fresha rate" },
        { label: "PRP — Hair Restoration", price: "Consult", href: PRP_THERAPY_MENU_PATH },
      ],
      learnMoreHref: PRP_THERAPY_MENU_PATH,
      badge: "SCALP",
    },
    {
      id: "ez-prf-gel",
      number: "04",
      title: "EZ PRF Gel & advanced injectable PRF",
      description:
        "Heat-processed PRF in an injectable gel format for natural volumizing and regenerative rejuvenation — distinct from HA filler. Consult required.",
      highlights: [
        "Injectable gel from your own PRF",
        "Natural-looking regenerative volume",
        "Different mechanism than Juvederm/Restylane",
        "Swelling common first 1–2 weeks",
        "NP maps candidacy at consult",
      ],
      pricing: [
        { label: "EZ PRF Gel", price: "Consult", href: "/services/ez-prf-gel" },
        { label: "EZ PRF Gel treatment page", price: "Learn →", href: "/services/ez-prf-gel" },
      ],
      learnMoreHref: "/services/ez-prf-gel",
    },
    {
      id: "facial-pairings",
      number: "05",
      title: "Facial PRP, microneedling & aftercare",
      description:
        "Facial Vampire protocols and microneedling stacks live on the PRP Facial menu — PRF upgrades and pairings are sequenced so you heal safely.",
      highlights: [
        "Vampire Facial · Express · microneedling + PRP",
        "PRP add-on to AnteAGE microneedling (+$250)",
        "Time IPL, peels & Morpheus8 around healing",
        "Avoid blood thinners pre-draw when possible",
        "Pre/post care guide included",
      ],
      pricing: [
        { label: "PRP Facial — Full", price: "$400", href: PRP_FACIAL_MENU_PATH, note: "60 min Vampire Facial" },
        { label: "Microneedling + PRP", price: "$500", href: PRP_FACIAL_MENU_PATH, note: "75 min" },
        { label: "PRP / PRF add-on to microneedling", price: "+$250", href: "/services/microneedling" },
        { label: "Pre & post PRP/PRF care guide", price: "Free", href: "/pre-post-care/prp-prf" },
      ],
      learnMoreHref: PRP_FACIAL_MENU_PATH,
    },
  ],
  faqs: [
    {
      question: "What's the difference between PRP and PRF?",
      answer:
        "Both use your blood. PRP concentrates platelets in plasma for relatively fast release. PRF includes a fibrin clot/matrix that slows growth-factor release — often preferred for under-eye injectables, texture, and hair series where sustained signaling helps.",
    },
    {
      question: "Is PRF the same as filler?",
      answer:
        "No. PRF is derived from your own blood components. EZ PRF Gel can add soft volume through regenerative signaling, but it behaves differently from hyaluronic acid fillers like Juvederm or Restylane. Your provider will recommend the right tool at consult.",
    },
    {
      question: "How many PRF sessions will I need?",
      answer:
        "Many protocols use 3–4 sessions spaced 4–6 weeks apart, then maintenance once or twice a year. Under-eye and hair plans vary by anatomy and goals — we build a custom series at your consult.",
    },
    {
      question: "What is the downtime?",
      answer:
        "Mild swelling, pinkness, or bruising is common for 2–5 days after injectable PRF, especially under-eye. Hair and facial protocols vary. We send written aftercare and timing guidance before you leave.",
    },
    {
      question: "Is PRF safe?",
      answer:
        "Because PRF uses your own blood-derived components, it's generally well tolerated. We review pregnancy, blood disorders, active infection, and medications before every draw. All treatments are NP-supervised at Hello Gorgeous.",
    },
    {
      question: "Can PRF be combined with microneedling or Morpheus8?",
      answer:
        "Often yes, when timed correctly. Many clients stack PRP/PRF with AnteAGE microneedling or Morpheus8 for collagen and regenerative signaling — we sequence treatments so you heal safely.",
    },
  ],
};
