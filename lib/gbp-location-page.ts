import type { Metadata } from "next";

import { isDeindexedLocalSlug } from "@/lib/city-seo-tier";
import { GBP_SLUG_TO_SERVICE, type GbpServiceSlug } from "@/lib/gbp-urls";
import { pageMetadata, SERVICES, SITE } from "@/lib/seo";

const TREATMENT_FAQ_TEMPLATES: Record<string, { howLong?: string; cost?: string; isSafe?: string }> = {
  "botox-dysport-jeuveau": {
    howLong: "Most clients see results for about 3–4 months.",
    cost: "Botox starts at $10/unit for new clients. We'll provide clear pricing at your consultation.",
    isSafe: "Yes. Botox is FDA-approved. Our injectors use precise dosing for natural results.",
  },
  "weight-loss-therapy": {
    howLong: "Many clients see noticeable changes within the first few months.",
    cost: "Pricing depends on your plan. We'll outline costs during your consultation.",
    isSafe: "Yes. Our programs are medically supervised with lab monitoring.",
  },
  "prf-prp": {
    howLong: "Many protocols recommend a series. Results can be gradual over weeks to months.",
    cost: "PRF/PRP pricing varies by treatment area. We'll provide clear pricing at your consultation.",
    isSafe: "Yes. PRF and PRP use your own blood-derived components.",
  },
  "biote-hormone-therapy": {
    howLong: "Some notice improvements within weeks.",
    cost: "Costs depend on protocol and labs. We'll outline at your consultation.",
    isSafe: "Yes. BioTE is administered by licensed providers with lab monitoring.",
  },
  "lip-filler": {
    howLong: "Often 6–12+ months depending on product.",
    cost: "Lip filler pricing depends on product and volume.",
    isSafe: "Yes. Lip fillers are FDA-approved. Our injectors use conservative dosing.",
  },
};

export const GBP_CONTEXTUAL_LINKS: Record<string, string> = {
  "Weight Loss in Oswego": "/weight-loss-oswego-il",
  "PRF Hair Restoration in Oswego": "/prf-hair-restoration-oswego-il",
  "Hormone Therapy in Oswego": "/hormone-therapy-oswego-il",
  "Botox in Oswego": "/botox-oswego",
};

export function gbpLocalFaqs(
  serviceName: string,
  cityLabel: string,
  serviceSlug: string,
): Array<{ question: string; answer: string }> {
  const t = TREATMENT_FAQ_TEMPLATES[serviceSlug] || {};
  const items: Array<{ question: string; answer: string }> = [
    {
      question: `Do you offer ${serviceName} in ${cityLabel}?`,
      answer:
        "Yes—Hello Gorgeous Med Spa is located in Oswego, IL and serves clients from the surrounding area including Naperville, Aurora, Plainfield, and Yorkville. We offer consultations to determine the best plan for your goals.",
    },
  ];
  if (t.howLong) items.push({ question: `How long does ${serviceName} last?`, answer: t.howLong });
  if (t.cost) items.push({ question: `How much does ${serviceName} cost in Oswego?`, answer: t.cost });
  if (t.isSafe) items.push({ question: `Is ${serviceName} safe?`, answer: t.isSafe });
  items.push(
    {
      question: "Do I need a consultation first?",
      answer:
        "We recommend starting with a consultation so we can confirm candidacy, set expectations, and build a safe plan.",
    },
    {
      question: "How do I book?",
      answer:
        "Use our Book page to schedule. If you have questions first, contact us or use the expert chat for general education.",
    },
  );
  return items;
}

export function geoContextCityForGbpSlug(slug: string): "naperville" | "plainfield" | "aurora" | "oswego" {
  if (slug.includes("naperville")) return "naperville";
  if (slug.includes("plainfield")) return "plainfield";
  if (slug.includes("aurora")) return "aurora";
  return "oswego";
}

export function isWeightLossGbpSlug(slug: string): boolean {
  return GBP_SLUG_TO_SERVICE[slug]?.serviceSlug === "weight-loss-therapy";
}

/** Metadata for indexed GBP location pages (850+ word content in LOCATION_PAGE_CONTENT). */
export function gbpLocationMetadata(slug: GbpServiceSlug): Metadata {
  const mapping = GBP_SLUG_TO_SERVICE[slug];
  if (!mapping) {
    return pageMetadata({ title: "Service", description: "Service.", path: `/${slug}` });
  }

  const { serviceSlug, cityLabel } = mapping;
  const s = SERVICES.find((x) => x.slug === serviceSlug);
  if (!s) {
    return pageMetadata({ title: "Service", description: "Service.", path: `/${slug}` });
  }

  const base = pageMetadata({
    title: `${s.name} in ${cityLabel} — ${SITE.name}`,
    description: `${s.name} in ${cityLabel} with licensed nurse practitioners at Hello Gorgeous Med Spa. ${s.short} Free consultations. Call ${SITE.phone}.`,
    path: `/${slug}`,
  });

  if (isDeindexedLocalSlug(slug)) {
    return { ...base, robots: { index: false, follow: true } };
  }

  return base;
}

/**
 * GBP slugs that keep bespoke flagship pages (reviews, ISR). All other GBP URLs
 * should be served only via app/[slug] + LOCATION_PAGE_CONTENT — no thin duplicates.
 */
export const GBP_FLAGSHIP_DEDICATED_SLUGS = new Set<GbpServiceSlug>([
  "botox-oswego-il",
  "hormone-therapy-oswego-il",
]);
