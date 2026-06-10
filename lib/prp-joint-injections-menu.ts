import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { PRP_THERAPY_MENU_PATH } from "@/lib/prp-therapy-menu";

export const PRP_JOINT_INJECTIONS_MENU_PATH = "/services/prp-joint-injections" as const;

export const PRP_JOINT_INJECTIONS_MENU: ServiceMenuConfig = {
  path: PRP_JOINT_INJECTIONS_MENU_PATH,
  metaTitle: "PRP Joint Injections | Regenerative Joint & Tendon Support | Hello Gorgeous Oswego",
  metaDescription:
    "PRP joint injections in Oswego, IL — platelet-rich plasma for joint pain, tendon recovery, and sports injuries. NP-led medical evaluation required. Book a consult.",
  hero: {
    eyebrow: "Oswego, IL · Medical regenerative protocols",
    titleAccent: "PRP Joint Injections",
    subtitle:
      "Concentrated platelets from your own blood, injected where joints and tendons need regenerative support — clinician-evaluated, medically supervised, never diagnosed online.",
    secondaryCta: { label: "PRP therapy menu", href: PRP_THERAPY_MENU_PATH },
  },
  sections: [
    {
      id: "what-is",
      number: "01",
      title: "What are PRP joint injections?",
      description:
        "We draw your blood, concentrate the platelets, and inject the PRP into the affected joint or tendon area. The growth factors support your body's own repair process — a regenerative approach used for joint pain, tendon recovery, and sports injuries.",
      highlights: [
        "Your own concentrated platelets — no synthetic medication",
        "Joint pain · tendon recovery · sports injury support",
        "Medical evaluation required before any injection",
        "Results build gradually over weeks to months",
        "NP-supervised at every step",
      ],
      pricing: [
        { label: "PRP — Joint / Body", price: "Consult", note: "Quoted after medical evaluation" },
        { label: "Evaluation & candidacy consult", price: "Book", note: "In-person required — we don't diagnose online" },
      ],
      learnMoreHref: PRP_THERAPY_MENU_PATH,
      badge: "MEDICAL",
    },
    {
      id: "who-its-for",
      number: "02",
      title: "Who it may help",
      description:
        "PRP joint protocols are typically discussed for nagging, activity-limiting issues that haven't resolved with rest — always confirmed by clinician evaluation first.",
      highlights: [
        "Knee, shoulder, elbow & other joint discomfort",
        "Tendinopathy & overuse injuries",
        "Athletes managing recovery between seasons",
        "Clients seeking alternatives before more invasive options",
        "Not a substitute for emergency or surgical orthopedic care",
      ],
      pricing: [
        { label: "Who decides candidacy?", price: "Your NP", note: "History, exam & goals reviewed at consult" },
        { label: "Imaging or records", price: "Bring them", note: "Prior X-ray/MRI reports help planning" },
      ],
      learnMoreHref: PRP_THERAPY_MENU_PATH,
    },
    {
      id: "what-to-expect",
      number: "03",
      title: "What to expect",
      description:
        "A medical visit, not a spa appointment — evaluation first, then a planned series if PRP is appropriate for your situation.",
      highlights: [
        "In-person evaluation & history review",
        "Blood draw → centrifuge → targeted injection",
        "Soreness at the site for a few days is common",
        "Relative rest, then graded return to activity",
        "Series of 1–3 injections typical when indicated",
      ],
      pricing: [
        { label: "Typical visit length", price: "45–60 min", note: "Draw + processing + injection" },
        { label: "Pre & post PRP/PRF care guide", price: "Free", href: "/pre-post-care/prp-prf" },
      ],
      learnMoreHref: "/pre-post-care/prp-prf",
    },
    {
      id: "safety",
      number: "04",
      title: "Safety & honest expectations",
      description:
        "PRP uses your own blood-derived components, so it's generally well tolerated — but it's still a medical procedure with screening, and results vary by condition and severity.",
      highlights: [
        "Screening for blood disorders, infection & medications",
        "Avoid blood thinners pre-draw when possible",
        "Improvement is gradual — not an overnight fix",
        "We'll tell you honestly if PRP isn't the right tool",
        "Ryan Kent, FNP-BC oversees every protocol",
      ],
      pricing: [
        { label: "Medical oversight", price: "Included", note: "FNP-BC on site 7 days a week" },
        { label: "Follow-up check-in", price: "Included", note: "Progress reviewed against plan" },
      ],
      learnMoreHref: "/why-choose-us",
    },
    {
      id: "related",
      number: "05",
      title: "Related regenerative menus",
      description:
        "Joint protocols are one branch of our PRP program — skin, scalp, and facial paths each have their own menu with published pricing.",
      highlights: [
        "PRP therapy menu — skin, scalp & joint overview",
        "PRF / PRP menu — under-eye, hair, injectables",
        "PRP Facial menu — Vampire Facial & stacks",
        "Regenerative Medicine hub compares everything",
      ],
      pricing: [
        { label: "PRP therapy menu", price: "Menu →", href: PRP_THERAPY_MENU_PATH },
        { label: "PRF / PRP menu", price: "Menu →", href: "/services/prf-prp" },
        { label: "PRP Facial menu", price: "Menu →", href: "/services/prp-facial" },
        { label: "Regenerative Medicine hub", price: "Hub →", href: "/regenerative-medicine-oswego-il" },
      ],
      learnMoreHref: "/regenerative-medicine-oswego-il",
    },
  ],
  faqs: [
    {
      question: "Is PRP a medical treatment?",
      answer:
        "Yes — PRP joint protocols involve medical evaluation, screening, and clinical judgment. An in-person consult is required to determine whether PRP is appropriate for your joint or tendon issue.",
    },
    {
      question: "Will this page diagnose my condition?",
      answer:
        "No — this page is educational. Diagnosis requires clinician evaluation and appropriate workup. Bring any prior imaging reports (X-ray, MRI) to your consult; they help us plan.",
    },
    {
      question: "How much do PRP joint injections cost?",
      answer:
        "Joint and body PRP is quoted after your medical evaluation, since the plan depends on the area, severity, and number of injections indicated. You'll have exact pricing before anything is scheduled.",
    },
    {
      question: "How many injections will I need?",
      answer:
        "When PRP is indicated, protocols commonly use 1–3 injections spaced weeks apart, with improvement assessed along the way. Your NP sets the plan based on your response.",
    },
    {
      question: "How long until I feel improvement?",
      answer:
        "Regenerative repair is gradual. Some clients notice change within a few weeks; tendon and joint remodeling often continues over 2–3 months. We set honest expectations at consult — PRP is not an instant fix.",
    },
    {
      question: "Is PRP safe for joints?",
      answer:
        "Because PRP uses your own blood-derived components, it's generally well tolerated. Expected effects include temporary soreness at the injection site. We screen for blood disorders, infection, and medications that affect platelets before every draw.",
    },
    {
      question: "What's the first step?",
      answer:
        "Book a consultation to discuss your symptoms, history, and goals. Call (630) 636-6193 or book online — we'll tell you honestly whether PRP is worth pursuing for your situation.",
    },
  ],
};
