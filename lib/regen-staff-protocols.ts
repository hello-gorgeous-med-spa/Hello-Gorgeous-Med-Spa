/**
 * RE GEN Staff Protocols Hub — guides, social templates, invoice quick-picks.
 */

import {
  REGEN_SOCIAL_CALENDAR_JULY_2026,
  type RegenSocialPost,
} from "@/lib/marketing/regen-social-calendar-july-2026";
import {
  listRxInvoiceTemplates,
  type RxInvoiceTemplate,
} from "@/lib/rx-invoice-templates";

export type RegenProtocolGuide = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: "getting-started" | "peptides" | "in-spa" | "posters";
  format: "pdf" | "html";
};

export type RegenStaffSocialPost = RegenSocialPost & {
  /** Downloadable creative from Desktop calendar kit */
  staffImagePath?: string;
  captionFile?: string;
};

/** Desktop July 2026 kit → hosted under /staff/protocols/social/july-2026/ */
const JULY_2026_STAFF_ASSETS: Record<
  string,
  { image: string; caption: string }
> = {
  "regen-launch-full": {
    image: "/staff/protocols/social/july-2026/images/01-mon-w1-launch.jpg",
    caption: "/staff/protocols/social/july-2026/captions/01-mon-w1-launch.txt",
  },
  "regen-glp1-learn": {
    image: "/staff/protocols/social/july-2026/images/02-wed-w1-glp1-learn.png",
    caption: "/staff/protocols/social/july-2026/captions/02-wed-w1-glp1-learn.txt",
  },
  "regen-weight-loss-cta": {
    image: "/staff/protocols/social/july-2026/images/03-fri-w1-weight-loss.png",
    caption: "/staff/protocols/social/july-2026/captions/03-fri-w1-weight-loss.txt",
  },
  "regen-peptides-learn": {
    image: "/staff/protocols/social/july-2026/images/04-mon-w2-peptides-learn.png",
    caption: "/staff/protocols/social/july-2026/captions/04-mon-w2-peptides-learn.txt",
  },
  "regen-hormones-learn": {
    image: "/staff/protocols/social/july-2026/images/05-wed-w2-hormones-learn.jpg",
    caption: "/staff/protocols/social/july-2026/captions/05-wed-w2-hormones-learn.txt",
  },
  "regen-peptides-hub": {
    image: "/staff/protocols/social/july-2026/images/06-fri-w2-peptides-hub.png",
    caption: "/staff/protocols/social/july-2026/captions/06-fri-w2-peptides-hub.txt",
  },
  "regen-trust-clinic": {
    image: "/staff/protocols/social/july-2026/images/07-mon-w3-trust-clinic.jpg",
    caption: "/staff/protocols/social/july-2026/captions/07-mon-w3-trust-clinic.txt",
  },
  "regen-how-it-works": {
    image: "/staff/protocols/social/july-2026/images/08-wed-w3-how-it-works.jpg",
    caption: "/staff/protocols/social/july-2026/captions/08-wed-w3-how-it-works.txt",
  },
  "regen-hormones-hub": {
    image: "/staff/protocols/social/july-2026/images/09-fri-w3-hormones-hub.png",
    caption: "/staff/protocols/social/july-2026/captions/09-fri-w3-hormones-hub.txt",
  },
  "regen-spa-qr-start": {
    image: "/staff/protocols/social/july-2026/images/10-mon-w4-spa-qr.jpg",
    caption: "/staff/protocols/social/july-2026/captions/10-mon-w4-spa-qr.txt",
  },
  "regen-learn-hub": {
    image: "/staff/protocols/social/july-2026/images/11-wed-w4-learn-hub.jpg",
    caption: "/staff/protocols/social/july-2026/captions/11-wed-w4-learn-hub.txt",
  },
  "regen-weight-loss-naperville": {
    image: "/staff/protocols/social/july-2026/images/12-fri-w4-naperville.png",
    caption: "/staff/protocols/social/july-2026/captions/12-fri-w4-naperville.txt",
  },
};

const WEEK_1_STAFF_ASSETS: Record<string, { image: string; caption: string }> = {
  "regen-launch-full": {
    image: "/staff/protocols/social/week-1/images/01-mon-launch-provider.jpg",
    caption: "/staff/protocols/social/week-1/captions/01-mon-launch.txt",
  },
  "regen-glp1-learn": {
    image: "/staff/protocols/social/week-1/images/02-wed-glp1-learn.png",
    caption: "/staff/protocols/social/week-1/captions/02-wed-glp1-learn.txt",
  },
  "regen-weight-loss-cta": {
    image: "/staff/protocols/social/week-1/images/03-fri-weight-loss.png",
    caption: "/staff/protocols/social/week-1/captions/03-fri-weight-loss.txt",
  },
};

export const REGEN_CORE_PROTOCOL_GUIDES: RegenProtocolGuide[] = [
  {
    id: "online-guide",
    title: "Hello Gorgeous RX — Online Guide",
    description: "Patient journey, portals, and how to talk about RE GEN on the phone.",
    href: "/staff/protocols/guides/Hello-Gorgeous-RX-Your-Online-Guide.html",
    category: "getting-started",
    format: "html",
  },
  {
    id: "study-guide",
    title: "RE GEN Staff Study Guide",
    description: "Product knowledge, categories, and talking points (PDF).",
    href: "/staff/regen-study-guide.pdf",
    category: "getting-started",
    format: "pdf",
  },
  {
    id: "pharmacy-selector",
    title: "Pharmacy Selector",
    description: "Compare Formulation Rx, BoomRx & Olympia pricing at the counter.",
    href: "/staff/pharmacy-selector.html",
    category: "getting-started",
    format: "html",
  },
  {
    id: "fcc-peptide-menu",
    title: "FCC Peptide Options 2026",
    description: "Formulation Rx peptide menu reference.",
    href: "/staff/protocols/guides/peptides/FCC%20Peptide%20Options%202026.pdf",
    category: "peptides",
    format: "pdf",
  },
  {
    id: "poster-1",
    title: "RX Poster (editable set 1)",
    description: "In-spa / print poster — RE GEN services.",
    href: "/staff/protocols/guides/posters/RX_Posters__editable_.001.jpeg",
    category: "posters",
    format: "pdf",
  },
  {
    id: "poster-2",
    title: "RX Poster (editable set 2)",
    description: "In-spa / print poster — alternate layout.",
    href: "/staff/protocols/guides/posters/RX_Posters__editable_.002.jpeg",
    category: "posters",
    format: "pdf",
  },
];

export const REGEN_PEPTIDE_DOSING_GUIDES: RegenProtocolGuide[] = [
  "5-Amino-1MQ_Capsules Dosing Guide (1).pdf",
  "ATP Mitochondrial.pdf",
  "Glutathione_Injection Dosing Guide (1).pdf",
  "LDN_Dosing_Guide Dosing Guide (4).pdf",
  "Methylene Blue .pdf",
  "Methylene_Blue_Capsules Dosing Guide (1).pdf",
  "NAD+_Injection Dosing Guide (2).pdf",
  "Oxytocin_Nasal_Spray Dosing Guide.pdf",
  "Pentadeca_Arginate_Injection_Dosing Guide.pdf",
  "SS-31_Elamipretide_Injection Dosing Guide.pdf",
  "Selank_Nasal_Spray Dosing Guide.pdf",
  "Sermorelin_Injection Dosing Guide (2).pdf",
  "Tesamorelin Injection Dosing Guide (2).pdf",
  "Thymosin_Beta_4_Injection Dosing Guide.pdf",
].map((filename) => ({
  id: filename.replace(/\.pdf$/i, "").replace(/\s+/g, "-").toLowerCase(),
  title: filename.replace(/\.pdf$/i, "").replace(/_/g, " "),
  description: "NP dosing reference — Formulation Rx / FCC.",
  href: `/staff/protocols/guides/peptides/${encodeURIComponent(filename)}`,
  category: "peptides" as const,
  format: "pdf" as const,
}));

/** Staff favorites shown first — full catalog via getRegenAllInvoiceTemplates() */
export const REGEN_INVOICE_QUICK_PICK_IDS = [
  "glp1-consult",
  "rx-consult",
  "rx-telehealth-refill",
  "rx-shipping",
  "glp1-insurance-oversight",
  "peptide-bpc-157",
  "peptide-sermorelin",
  "peptide-nad-plus",
  "glp1-tirz-2.5",
  "glp1-sema-0.25-0.5",
] as const;

export function enrichStaffSocialPosts(
  posts: RegenSocialPost[],
  assetMap: Record<string, { image: string; caption: string }>,
): RegenStaffSocialPost[] {
  return posts.map((post) => {
    const assets = assetMap[post.slug];
    return {
      ...post,
      staffImagePath: assets?.image ?? post.imagePath,
      captionFile: assets?.caption,
    };
  });
}

export function getRegenStaffSocialJuly2026(): RegenStaffSocialPost[] {
  return enrichStaffSocialPosts(REGEN_SOCIAL_CALENDAR_JULY_2026, JULY_2026_STAFF_ASSETS);
}

export function getRegenStaffSocialWeek1(): RegenStaffSocialPost[] {
  const week1 = REGEN_SOCIAL_CALENDAR_JULY_2026.filter((p) => p.week === 1);
  return enrichStaffSocialPosts(week1, WEEK_1_STAFF_ASSETS);
}

export function getRegenInvoiceQuickPicks(): RxInvoiceTemplate[] {
  const all = listRxInvoiceTemplates();
  const picks: RxInvoiceTemplate[] = [];
  for (const id of REGEN_INVOICE_QUICK_PICK_IDS) {
    const t = all.find((x) => x.id === id);
    if (t) picks.push(t);
  }
  return picks;
}

export function getRegenAllInvoiceTemplates(): RxInvoiceTemplate[] {
  return listRxInvoiceTemplates();
}

export function rxInvoiceQuickLink(templateId: string): string {
  return `/admin/rx-invoices?template=${encodeURIComponent(templateId)}`;
}
