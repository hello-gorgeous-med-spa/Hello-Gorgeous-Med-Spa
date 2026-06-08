import { VITAMIN_MEMBERSHIPS, VITAMIN_SHOTS } from "@/lib/vitamin-bar";
import { IV_DRIP_MENU, IV_THERAPY_SERVICE_PATH } from "@/lib/iv-drip-menu";
import { NAD_PLUS_INJECTIONS_PATH } from "@/lib/nad-plus-injections";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const WELLNESS_MENU_PATH = "/services/wellness" as const;

const TOP_SHOTS = VITAMIN_SHOTS.slice(0, 8);

export const WELLNESS_MENU: ServiceMenuConfig = {
  path: WELLNESS_MENU_PATH,
  metaTitle: "Wellness Menu | IV Therapy, Vitamin Bar & Peptides | Hello Gorgeous Oswego",
  metaDescription:
    "Wellness at Hello Gorgeous — IV therapy drips, Vitamin Bar shots from $25, NAD+ injections, peptide menu, and memberships. Oswego med spa drive-thru wellness.",
  hero: {
    eyebrow: "Oswego, IL · Drive-thru Vitamin Bar",
    titleAccent: "Wellness Menu",
    subtitle:
      "IV hydration, Vitamin Bar shots, NAD+, peptides, and monthly wellness memberships — NP-supervised, book online or pull up to the window.",
    primaryCta: { label: "Open Hello Gorgeous app", href: "/app" },
    secondaryCta: { label: "Full IV drip menu", href: IV_THERAPY_SERVICE_PATH },
  },
  sections: [
    {
      id: "iv-therapy",
      number: "01",
      title: "IV Therapy",
      description:
        "Medical-grade IV cocktails for hydration, immunity, energy, recovery, and glow — administered by our clinical team.",
      highlights: [
        ...IV_DRIP_MENU.slice(0, 4).map((d) => d.name),
        "Build Your IV Bag custom option",
        "Book with Danielle or Ryan on Fresha",
        "Member discounts on select plans",
      ],
      pricing: [
        { label: "Hydration therapy", price: "From $125", href: IV_THERAPY_SERVICE_PATH },
        { label: "Myers' Cocktail", price: "$175–$199", href: IV_THERAPY_SERVICE_PATH },
        { label: "Beauty / Glow drip", price: "$189–$199", href: IV_THERAPY_SERVICE_PATH },
        { label: "Recovery / Athletic drip", price: "From $225", href: IV_THERAPY_SERVICE_PATH },
        { label: "NAD+ IV infusion", price: "From $350", href: IV_THERAPY_SERVICE_PATH, note: "2–4 hour protocol" },
        { label: "View all 9 signature drips", price: "Menu →", href: IV_THERAPY_SERVICE_PATH },
      ],
      learnMoreHref: IV_THERAPY_SERVICE_PATH,
      badge: "IV MENU",
    },
    {
      id: "vitamin-bar",
      number: "02",
      title: "Vitamin Bar Shots",
      description:
        "Pull up, get your shot, glow on — B12, skinny shots, glutathione, biotin, tri-immune, and more. Pre-pay in the app or pay at the window.",
      highlights: [
        "Drive-thru wellness window",
        "10-minute in-and-out visits",
        "Member pricing on every shot",
        "Mon–Fri 10–8 · Sat 10–5",
        "Pre-pay via Hello Gorgeous app",
      ],
      pricing: [
        ...TOP_SHOTS.map((s) => ({
          label: s.name,
          price: `$${s.price}`,
          note: s.memberPrice ? `Members $${s.memberPrice}` : undefined,
        })),
        { label: "Full shot menu (12+ options)", price: "From $25", href: "/app" },
      ],
      learnMoreHref: "/app",
      badge: "DRIVE-THRU",
    },
    {
      id: "nad",
      number: "03",
      title: "NAD+ Injections",
      description:
        "Cellular energy and recovery support — quick NAD+ injections for fatigue, brain fog, and metabolic wellness under NP supervision.",
      highlights: [
        "Quick injection visit",
        "Cellular energy & focus support",
        "Also available as IV infusion",
        "Member pricing available",
        "Oswego · western suburbs",
      ],
      pricing: [
        { label: "NAD+ injection (visit)", price: "$40", href: NAD_PLUS_INJECTIONS_PATH },
        { label: "NAD+ shot (Vitamin Bar menu)", price: "$99", href: "/app", note: "Members $85" },
        { label: "NAD+ IV infusion", price: "From $350", href: IV_THERAPY_SERVICE_PATH },
      ],
      learnMoreHref: NAD_PLUS_INJECTIONS_PATH,
      badge: "NEW",
    },
    {
      id: "injection-menu",
      number: "04",
      title: "Peptides & Injection Menu",
      description:
        "Provider-guided peptides and wellness injections — PT-141, BPC-157, sermorelin, GLP-1 support, and our full injection menu poster.",
      highlights: [
        "Peptide therapy consult required",
        "BPC-157 · sermorelin · tesamorelin",
        "GLP-1 metabolic programs",
        "Free vitamin shot for new clients",
        "PDF menu in spa & online",
      ],
      pricing: [
        { label: "Injection menu overview", price: "Consult", href: "/injection-menu" },
        { label: "Peptide therapy hub", price: "Consult", href: "/peptides" },
        { label: "Free vitamin shot (new clients)", price: "FREE", href: "/free-vitamin", note: "One per new client" },
        { label: "Medical weight loss (GLP-1)", price: "From $400", href: "/rx/metabolic" },
      ],
      learnMoreHref: "/injection-menu",
    },
    {
      id: "memberships",
      number: "05",
      title: "Wellness Memberships",
      description:
        "Monthly plans for shots, IV credits, and drive-thru priority — cancel anytime, billed through Square in the Hello Gorgeous app.",
      highlights: [
        "Glow Pass · Energy Unlimited · VIP Wellness",
        "Member pricing on all shots",
        "Priority booking & rollover credits",
        "Stack with facial memberships",
        "No long-term contracts",
      ],
      pricing: VITAMIN_MEMBERSHIPS.filter((m) => !m.category).map((m) => ({
        label: m.name,
        price: `$${m.pricePerMonth}/mo`,
        href: "/monthly-memberships",
        note: m.summary,
      })),
      learnMoreHref: "/monthly-memberships",
      badge: "MEMBERSHIPS",
    },
  ],
  faqs: [
    {
      question: "What's the difference between IV therapy and Vitamin Bar shots?",
      answer:
        "IV therapy delivers fluids and nutrients directly into your bloodstream over 30–60+ minutes — best for hydration, hangovers, and high-dose protocols. Vitamin Bar shots are quick intramuscular injections in about 10 minutes at our drive-thru window.",
    },
    {
      question: "How do I join a wellness membership?",
      answer:
        "Open the Hello Gorgeous app at hellogorgeousmedspa.com/app, tap Membership, and checkout through Square. Glow Pass starts at $49/mo with 2 shots included.",
    },
    {
      question: "Which NAD+ option should I choose?",
      answer:
        "The $40 NAD+ injection is a quick boost for energy and focus. The Vitamin Bar NAD+ shot ($99, members $85) is a higher-dose protocol. NAD+ IV infusions from $350 are for full cellular recovery sessions — we recommend at consult.",
    },
  ],
};
