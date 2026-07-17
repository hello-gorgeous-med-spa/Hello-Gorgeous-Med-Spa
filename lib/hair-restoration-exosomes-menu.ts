import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const HAIR_RESTORATION_EXOSOMES_MENU_PATH = "/services/hair-restoration-exosomes" as const;

export const HAIR_RESTORATION_EXOSOMES_MENU: ServiceMenuConfig = {
  path: HAIR_RESTORATION_EXOSOMES_MENU_PATH,
  metaTitle:
    "AnteAGE MDX Biosome Hair & Scalp Treatment in Oswego, IL | Exosome Hair Restoration",
  metaDescription:
    "AnteAGE MDX® Biosome Hair Solution scalp treatments in Oswego — growth factors & exosomes for thinning hair. From $350–$499. NP-supervised. Serving Naperville, Aurora & Plainfield.",
  hero: {
    eyebrow: "Oswego, IL · Regenerative hair restoration",
    titleAccent: "AnteAGE MDX® Hair Biosomes",
    subtitle:
      "Professional scalp protocols with AnteAGE MDX® Biosome Hair Solution — growth factors, exosomes, and follicle-targeted signaling for thinning hair. NP-directed care for men and women.",
    secondaryCta: { label: "Gentlemen’s Club hair menu", href: "/gentlemens-club#hair" },
  },
  gallery: [
    {
      src: "/images/anteage/hair/mdx-biosome-hair-solution-ba.png",
      alt: "AnteAGE MDX Biosome Hair Solution box with before and after scalp density results",
      caption: "AnteAGE MDX® Biosome Hair Solution — professional kit + results",
      frame: "portrait",
    },
    {
      src: "/images/anteage/hair/mdx-hair-exosome-vials.png",
      alt: "AnteAGE MDX Hair Exosome Solution vials for professional scalp treatment",
      caption: "MDX Hair Exosome vials — clinical regenerative protocol",
      frame: "portrait",
    },
    {
      src: "/images/anteage/hair/before-after-crown-2-months.png",
      alt: "AnteAGE MDX hair restoration crown before and after at two months",
      caption: "Crown density — clinical before & after",
      frame: "landscape",
    },
  ],
  sections: [
    {
      id: "biosomes",
      number: "01",
      title: "AnteAGE MDX® Biosome Hair Solution",
      description:
        "Professional Biosome™ Hair Solution for topical use with scalp microneedling or micro-injections — lyophilized biosomes plus diluent, formulated to support follicle signaling (including WNT pathways), with caffeine for stimulation and azelaic acid for DHT-aware support. For professional use only.",
      highlights: [
        "Growth factors & biosome / exosome signaling",
        "Targets thinning at crown, temples & part line",
        "At-home aftercare kit with treatment packages",
        "Safe when medically appropriate for most skin/hair types",
        "Pairs with Rx minoxidil/finasteride or PRF when indicated",
      ],
      pricing: [
        {
          label: "Hair Restoration with Exosome Injections",
          price: "From $499",
          href: "/book",
          note: "45 min · series recommended",
        },
        {
          label: "AnteAGE MD Scalp Treatment",
          price: "From $350",
          href: "/book",
          note: "60 min · growth-factor entry tier",
        },
      ],
      learnMoreHref: "/book",
      badge: "FLAGSHIP",
    },
    {
      id: "scalp-md",
      number: "02",
      title: "AnteAGE MD Scalp Treatment",
      description:
        "Targeted AnteAGE MD® growth-factor scalp protocol — an entry regenerative tier for follicle support and scalp health between MDX biosome/exosome series, or as a first step after consult.",
      highlights: [
        "Growth-factor focused scalp protocol",
        "Supports density goals with less intensity than full MDX",
        "Series of 3–6 sessions typical",
        "Ideal bridge between consult and advanced MDX",
      ],
      pricing: [
        { label: "AnteAGE MD Scalp Treatment", price: "From $350", href: "/book" },
      ],
      learnMoreHref: "/book",
    },
    {
      id: "stack",
      number: "03",
      title: "Stack with Rx & PRF",
      description:
        "Many clients combine AnteAGE scalp protocols with compounded DHT support, topical or oral minoxidil, and in-office PRF hair restoration when clinically appropriate — mapped at your NP consult.",
      highlights: [
        "Finasteride / dutasteride / minoxidil when appropriate",
        "PRF scalp series from $600/session",
        "Gentlemen’s Club hair + hormone pathways",
        "Hair readiness quiz for a first pass",
      ],
      pricing: [
        { label: "PRF Hair Restoration", price: "From $600", href: "/services/prp" },
        { label: "Hair readiness quiz", price: "Free", href: "/quiz/hair-readiness" },
        { label: "Gentlemen’s Club", price: "Consult", href: "/gentlemens-club" },
      ],
      learnMoreHref: "/quiz/hair-readiness",
      badge: "STACK",
    },
  ],
  faqs: [
    {
      question: "What is AnteAGE MDX Biosome Hair Solution?",
      answer:
        "It is a professional AnteAGE MDX® hair serum system — lyophilized Biosomes™ plus diluent — used topically with scalp microneedling or micro-injection protocols. It delivers growth-factor and biosome signaling designed to support follicle health. It is for professional use only and is not an OTC retail product.",
    },
    {
      question: "Who is a candidate for AnteAGE scalp treatment in Oswego?",
      answer:
        "Adults with pattern thinning, reduced density at the crown or temples, or shedding who want a regenerative, non-surgical option. We screen medical history, medications (including TRT/DHT interactions), and expectations at consult. Results vary; not every pattern of hair loss responds the same way.",
    },
    {
      question: "How much does AnteAGE hair restoration cost?",
      answer:
        "AnteAGE MD Scalp Treatment starts from $350 per session. Hair Restoration with Exosome / Biosome injections starts from $499 per session. Series pricing and stacks with PRF or Rx are quoted after evaluation.",
    },
    {
      question: "How many sessions will I need?",
      answer:
        "Most clients plan a series of 3–6 sessions spaced weeks apart, then maintenance. Visible density changes are gradual — often assessed over months, not days. We photograph progress when helpful.",
    },
    {
      question: "Is this the same as PRF hair restoration?",
      answer:
        "No. PRF uses your own blood-derived growth factors. AnteAGE MDX adds laboratory-grade biosome/exosome signaling. Many clients use one or both when medically appropriate — your provider designs the plan.",
    },
    {
      question: "Do you serve Naperville, Aurora, and Plainfield?",
      answer:
        "Yes. Treatments are performed at Hello Gorgeous Med Spa, 74 W Washington St, Oswego, IL — convenient for Naperville, Aurora, Plainfield, Yorkville, and Montgomery.",
    },
  ],
};
