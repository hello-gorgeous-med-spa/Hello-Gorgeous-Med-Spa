import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { PRP_FACIAL_MENU_PATH } from "@/lib/prp-facial-menu";
import { PRF_PRP_MENU_PATH } from "@/lib/prf-prp-menu";
import { PRP_THERAPY_MENU_PATH } from "@/lib/prp-therapy-menu";

export const EZ_PRF_GEL_MENU_PATH = "/services/ez-prf-gel" as const;

export const EZ_PRF_GEL_MENU: ServiceMenuConfig = {
  path: EZ_PRF_GEL_MENU_PATH,
  metaTitle: "EZ PRF Gel Menu | Injectable Regenerative Volume | Hello Gorgeous Oswego",
  metaDescription:
    "EZ PRF Gel in Oswego, IL — heat-processed platelet-rich fibrin in an injectable gel for natural regenerative rejuvenation. Not HA filler. NP-led consult required.",
  hero: {
    eyebrow: "Oswego, IL · Injectable regenerative medicine",
    titleAccent: "EZ PRF Gel Menu",
    subtitle:
      "Your blood, processed into an injectable fibrin gel — regenerative volume and skin quality without synthetic filler. Natural-looking results from your own growth factors, mapped at consult.",
    secondaryCta: { label: "PRF / PRP menu", href: PRF_PRP_MENU_PATH },
  },
  sections: [
    {
      id: "what-is",
      number: "01",
      title: "What is EZ PRF Gel?",
      description:
        "After a standard blood draw, your PRF is heat-processed into a smooth injectable gel rich in platelets, leukocytes, and growth factors. It is placed where your plan calls for regenerative volume or texture support — powered by you, not a factory filler syringe.",
      highlights: [
        "Derived from your own blood — no HA filler",
        "Heat-processed PRF in injectable gel form",
        "Regenerative signaling + soft volumizing effect",
        "NP consult required before first treatment",
        "Series often recommended for best outcomes",
      ],
      pricing: [
        { label: "EZ PRF Gel consult", price: "Free", note: "Candidacy & treatment map" },
        { label: "EZ PRF Gel treatment", price: "From $500", note: "Quoted at consult · area dependent" },
      ],
      learnMoreHref: "/regenerative-medicine-oswego-il",
      badge: "REGENERATIVE",
    },
    {
      id: "vs-filler",
      number: "02",
      title: "EZ PRF Gel vs dermal filler",
      description:
        "Hyaluronic acid fillers add immediate volume with a gel carrier. EZ PRF Gel works through your fibrin matrix and growth-factor release — different mechanism, different timeline, often a softer regenerative look rather than sharp contour sculpting.",
      highlights: [
        "Not Juvederm, Restylane, or Revanesse",
        "No synthetic HA — your biology only",
        "Swelling common first 1–2 weeks as gel settles",
        "Conservative dosing for natural movement & expression",
        "Hyaluronidase dissolver does not apply to PRF",
      ],
      pricing: [
        { label: "Dermal fillers menu", price: "From $650", href: "/services/injectables" },
        { label: "PRF under-eye (non-gel)", price: "$500", href: PRF_PRP_MENU_PATH, note: "45 min · fibrin injectable" },
      ],
      learnMoreHref: "/services/injectables",
    },
    {
      id: "areas",
      number: "03",
      title: "Common treatment areas",
      description:
        "EZ PRF Gel is mapped face-by-face at consult — under-eye hollowing, mid-face soft volume, perioral texture, and areas where you want regenerative improvement without a foreign filler product.",
      highlights: [
        "Under-eye & mid-face soft volume",
        "Perioral lines & texture support",
        "Temple & lateral face when appropriate",
        "Pairs with skin-quality protocols over time",
        "Not every area is a PRF candidate — we say no when needed",
      ],
      pricing: [
        { label: "EZ PRF Gel session", price: "From $500", note: "Per session · consult for exact quote" },
        { label: "EZ PRF Gel upgrade add-on", price: "+$100", note: "When stacked on qualifying protocol" },
      ],
      learnMoreHref: EZ_PRF_GEL_MENU_PATH,
      badge: "CONSULT FIRST",
    },
    {
      id: "protocol",
      number: "04",
      title: "What to expect & downtime",
      description:
        "Plan on a blood draw, processing time, and careful placement. Mild swelling, puffiness, or bruising is normal — especially under-eye — and usually settles over 1–2 weeks as the gel integrates.",
      highlights: [
        "Blood draw → spin → heat-process → inject",
        "Visit length varies · plan 60–90 minutes",
        "Avoid blood thinners pre-draw when possible",
        "Sun protection & gentle skincare post-treatment",
        "Written aftercare from pre/post PRP-PRF guide",
      ],
      pricing: [
        { label: "Pre & post PRP/PRF care guide", price: "Free", href: "/pre-post-care/prp-prf" },
        { label: "Typical visit length", price: "60–90 min", note: "Draw + processing + treatment" },
      ],
      learnMoreHref: "/pre-post-care/prp-prf",
    },
    {
      id: "related",
      number: "05",
      title: "Related regenerative menus",
      description:
        "EZ PRF Gel sits inside our broader PRF/PRP program — facial Vampire protocols, scalp restoration, and standard PRF injectables each have their own menu and pricing.",
      highlights: [
        "PRF / PRP menu — under-eye, hair, injectables",
        "PRP Facial menu — Vampire · Express · microneedling",
        "PRP therapy — skin, scalp & joint paths",
        "Microneedling + PRP/PRF add-ons available",
        "Regenerative Medicine hub compares all options",
      ],
      pricing: [
        { label: "PRF / PRP menu", price: "Menu →", href: PRF_PRP_MENU_PATH },
        { label: "PRP Facial menu", price: "Menu →", href: PRP_FACIAL_MENU_PATH },
        { label: "PRP therapy menu", price: "Menu →", href: PRP_THERAPY_MENU_PATH },
        { label: "Microneedling menu", price: "From $249", href: "/services/microneedling" },
      ],
      learnMoreHref: "/regenerative-medicine-oswego-il",
    },
  ],
  faqs: [
    {
      question: "Is EZ PRF Gel the same as filler?",
      answer:
        "No. EZ PRF Gel is made from your own platelet-rich fibrin after a blood draw and heat-processing step. Dermal fillers use hyaluronic acid gels like Juvederm or Restylane. The feel, timeline, and mechanism are different — your provider will recommend the right tool at consult.",
    },
    {
      question: "How is EZ PRF Gel different from standard PRF?",
      answer:
        "Standard PRF is injected as a fibrin clot or liquid fibrin matrix. EZ PRF Gel is heat-processed into a smoother injectable gel format that can be placed for regenerative volume and texture in selected areas. Both use your blood; the processing and placement differ.",
    },
    {
      question: "How many sessions are needed?",
      answer:
        "Many clients benefit from a series of 2–3 treatments spaced several weeks apart, then maintenance once or twice a year. Your plan depends on area, anatomy, and goals — we map it at your free consult.",
    },
    {
      question: "Is there downtime?",
      answer:
        "Swelling, puffiness, or bruising is common — especially under-eye — and often peaks in the first few days. Most clients return to normal activities quickly but should avoid strenuous exercise, saunas, and aggressive skincare for the first few days per your aftercare sheet.",
    },
    {
      question: "How much does EZ PRF Gel cost?",
      answer:
        "Treatment is quoted at consult based on area and product needed. Published menu pricing starts around $500 per session; add-on upgrades on qualifying protocols may be less. You approve the plan before we treat.",
    },
    {
      question: "Is EZ PRF Gel safe?",
      answer:
        "Because it uses your own blood-derived components, it's generally well tolerated when performed by trained medical staff. We review pregnancy, blood disorders, active infection, and medications before every draw. All treatments are NP-supervised at Hello Gorgeous.",
    },
    {
      question: "Can EZ PRF Gel be combined with microneedling or Morpheus8?",
      answer:
        "Often yes, when timed correctly. Regenerative plans may stack EZ PRF Gel with AnteAGE microneedling, Morpheus8, or PRP facial protocols — we sequence treatments so you heal safely and results stack.",
    },
  ],
};
