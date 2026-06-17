import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { BOOKING_URL } from "@/lib/flows";
import { getServicePageOswego } from "@/lib/service-pages-oswego";

export const BOTOX_OSWEGO_PATH = "/botox-oswego" as const;

const page = getServicePageOswego("botox-oswego")!;

export const BOTOX_OSWEGO_MENU: ServiceMenuConfig = {
  path: BOTOX_OSWEGO_PATH,
  metaTitle: page.metaTitle,
  metaDescription: page.metaDescription,
  hero: {
    eyebrow: "Oswego, IL · Kendall County · All 5 neurotoxin brands",
    titleBefore: "Botox in Oswego, IL —",
    titleAccent: "From $10/unit",
    subtitle: page.valueProp,
    primaryCta: { label: "Book Free Consultation", href: page.bookingUrl ?? BOOKING_URL },
    secondaryCta: { label: "Full injectables menu", href: "/services/injectables" },
  },
  sections: [
    {
      id: "pricing",
      number: "01",
      title: "Botox & neurotoxin pricing",
      description:
        page.pricing ??
        "Botox is $10 per unit at Hello Gorgeous. You approve units before we inject — no surprises at checkout.",
      highlights: [
        "Botox $10/unit — published openly, no membership required",
        "Dysport $14/unit · Jeuveau $11/unit · Xeomin & Daxxify at consult",
        "Typical upper face: 20–40 units total",
        "Forehead · 11s · crow's feet · lip flip · masseter & more",
        "Men often need more units — we assess in motion at consult",
      ],
      pricing: [
        { label: "Botox", price: "$10/unit", href: BOTOX_OSWEGO_PATH },
        { label: "Jeuveau", price: "$11/unit", href: "/jeuveau-oswego" },
        { label: "Dysport", price: "$14/unit", href: "/dysport-oswego", note: "Often 2–3× Botox units" },
        { label: "Xeomin", price: "Consult", href: "/xeomin-oswego-il" },
        { label: "Daxxify — 6-month neurotoxin", price: "Consult", href: "/daxxify-oswego-il" },
        { label: "Lip flip", price: "From $99", href: "/lip-flip-oswego-il", note: "~4 units" },
      ],
      learnMoreHref: "/services/injectables",
      badge: "$10/UNIT",
    },
    {
      id: "why",
      number: "02",
      title: `Why Hello Gorgeous for ${page.serviceName}`,
      description:
        "Family-owned, NP-directed, and here longer than most competitors have been open — same experienced hands, authentic product, honest pricing.",
      highlights: page.whyBullets,
      pricing: [
        { label: "Free consultation", price: "Always", note: "Every visit — no pressure to commit" },
        { label: "Day-14 touch-up", price: "Included", note: "True asymmetry through day 21 per policy" },
        { label: "Same-day Botox", price: "Often yes", note: "Call before noon — 630-636-6193" },
      ],
      learnMoreHref: "/why-choose-us",
    },
    {
      id: "how-it-works",
      number: "03",
      title: `What is ${page.serviceName}? How it works`,
      description: page.howItWorksParagraphs[0] ?? "",
      highlights: [
        "Neuromodulator — temporarily relaxes targeted facial muscles",
        "Results begin in 3–5 days · full effect by day 14",
        "Lasts about 3–4 months for most clients",
        "FDA-approved since 2002 · conservative, natural dosing",
        "Not a filler — softens dynamic lines, not static volume loss",
      ],
      pricing: [
        { label: "Botox vs Dysport vs Jeuveau guide", price: "Compare →", href: "/botox-vs-dysport-vs-jeuveau" },
        { label: "Full injectables menu", price: "Menu →", href: "/services/injectables" },
      ],
      learnMoreHref: "/botox-vs-dysport-vs-jeuveau",
    },
    {
      id: "what-to-expect",
      number: "04",
      title: "What to expect at your appointment",
      description:
        "From free consult to day-14 follow-up — clear steps, written aftercare, and a complimentary touch-up window when clinically appropriate.",
      highlights: page.whatToExpectSteps,
      pricing: [
        { label: "Typical treatment time", price: "5–10 min", note: "After consult & numbing if requested" },
        { label: "Pre & post neurotoxin care", price: "Free", href: "/pre-post-care/botox" },
      ],
      learnMoreHref: "/pre-post-care/botox",
    },
    {
      id: "related",
      number: "05",
      title: "Related treatments in Oswego",
      description:
        "Stack injectables with fillers, Morpheus8, or skincare — we map a full-face plan at your consult, not a hard upsell.",
      highlights: [
        "Dysport & Jeuveau for clients who respond better to alternate brands",
        "Dermal fillers & lip filler for volume and contour",
        "Brotox & men's neurotoxin — The Gentlemen's Club",
        "Allē rewards on qualifying Botox purchases",
      ],
      pricing: page.relatedServices.map((slug) => {
        const rel = getServicePageOswego(slug);
        return {
          label: rel?.serviceName ?? slug,
          price: "Learn →",
          href: `/${slug}`,
        };
      }),
      learnMoreHref: "/services/injectables",
    },
  ],
  faqs: page.faqs.map((f) => ({ question: f.q, answer: f.a })),
};
