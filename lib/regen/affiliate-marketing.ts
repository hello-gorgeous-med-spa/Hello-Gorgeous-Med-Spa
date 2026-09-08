/**
 * Partner marketing kit — public assets affiliates may download and post.
 * BoomRx / pharmacy internals stay on ops, never on this list.
 */

const KIT = "/regen/marketing/kit";

export type AffiliateMarketingAsset = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  kind: "pdf" | "video" | "html" | "markdown" | "image";
  downloadName?: string;
  visualOnly?: boolean;
};

export const AFFILIATE_MARKETING_PATH = "/affiliates/marketing" as const;
export const AFFILIATE_PLAYBOOK_PATH = "/affiliates/playbook" as const;

export const AFFILIATE_NAV = [
  { href: "/affiliates", label: "Program" },
  { href: AFFILIATE_MARKETING_PATH, label: "Marketing" },
  { href: AFFILIATE_PLAYBOOK_PATH, label: "Playbook" },
  { href: "/affiliates/dashboard", label: "Dashboard" },
  { href: "/affiliates/login", label: "Login" },
] as const;

export const AFFILIATE_KIT_DOCS: AffiliateMarketingAsset[] = [
  {
    id: "flyer-pdf",
    title: "Client flyer (print PDF)",
    blurb: "Two-page Hello Gorgeous × REGEN RX flyer. GORGEOUS20 on the QR. Hand this at the desk or email it.",
    href: `${KIT}/REGEN-RX-Hello-Gorgeous-client-flyer.pdf`,
    kind: "pdf",
    downloadName: "REGEN-RX-Hello-Gorgeous-client-flyer.pdf",
  },
  {
    id: "flyer-fb",
    title: "Flyer photo for Facebook",
    blurb: "JPG Facebook will actually accept. PDF uploads get rejected — use this photo instead.",
    href: `${KIT}/images/flyer-facebook-page-1.png`,
    kind: "image",
    downloadName: "REGEN-RX-Flyer-Facebook-page-1.png",
  },
  {
    id: "business-card",
    title: "Danielle Alcala business card",
    blurb: "REGEN RX card PDF for print.",
    href: `${KIT}/RE-GEN-RX-Danielle-Alcala-Business-Card.pdf`,
    kind: "pdf",
    downloadName: "RE-GEN-RX-Danielle-Alcala-Business-Card.pdf",
  },
  {
    id: "how-it-works",
    title: "How it works — 30 seconds",
    blurb: "Short video for Stories, Reels, and the front desk loop. Illinois adults. Consult is not a guaranteed Rx.",
    href: `${KIT}/REGEN-RX-How-It-Works-30s.mp4`,
    kind: "video",
    downloadName: "REGEN-RX-How-It-Works-30s.mp4",
  },
];

export const AFFILIATE_KIT_PLAYBOOK: AffiliateMarketingAsset[] = [
  {
    id: "staff-bible-html",
    title: "REGEN RX playbook (HTML)",
    blurb: "How we run the program. Use the talking points. Do not name pharmacies or post SOP language.",
    href: `${KIT}/REGEN-RX-Staff-Bible.html`,
    kind: "html",
    downloadName: "REGEN-RX-Staff-Bible.html",
  },
  {
    id: "staff-bible-md",
    title: "REGEN RX manual (Markdown)",
    blurb: "Same playbook as a text file you can search.",
    href: `${KIT}/REGEN-RX-Staff-Bible.md`,
    kind: "markdown",
    downloadName: "REGEN-RX-Staff-Bible.md",
  },
];

/** Vial renders for posts. Visual only — not a menu, not a guaranteed Rx. */
export const AFFILIATE_KIT_VIALS: AffiliateMarketingAsset[] = [
  {
    id: "vial-cellular",
    title: "Cellular energy visual",
    blurb: "NAD+ / cellular energy art. Visual only.",
    href: "/images/regen/marketing/cell-peptide.png",
    kind: "image",
    visualOnly: true,
  },
  {
    id: "hero-dani-ryan",
    title: "Danielle + Ryan",
    blurb: "Studio photo. Visual only — not a product menu.",
    href: "/images/regen/marketing/dani-ryan-syringes-hero.png",
    kind: "image",
    visualOnly: true,
  },
];

export const AFFILIATE_POSTING_RULES = [
  "Illinois adults 21+ only. Say that out loud if someone is out of state.",
  "A request is a consult — never a guaranteed prescription, dose, or result.",
  "Compounded medication is not FDA-approved. Never say it is the same as a brand name.",
  "Do not name pharmacies. Say “our licensed compounding pharmacy.”",
  "No diagnosis, no “this is your dose,” no pound-loss promises.",
  "Disclose the relationship: #ad or #partner on every paid or commissioned post.",
  "Vial photos are art. They are not a menu you can promise to ship.",
  "Do not name recovery or growth-hormone peptides on posts or landing pages. Stripe and advertising rules do not allow those listings on REGEN public pages.",
] as const;
