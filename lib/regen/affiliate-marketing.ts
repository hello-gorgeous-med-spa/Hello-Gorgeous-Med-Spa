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
    id: "vial-lineup-glow",
    title: "Vial lineup",
    blurb: "Three-vial hero. Visual only.",
    href: `${KIT}/images/vial-lineup-glow.png`,
    kind: "image",
    visualOnly: true,
  },
  {
    id: "vial-lineup-studio",
    title: "Vial lineup (studio)",
    blurb: "Same three vials on a clean ground. Visual only.",
    href: `${KIT}/images/vial-lineup-studio.png`,
    kind: "image",
    visualOnly: true,
  },
  {
    id: "vial-cjc",
    title: "CJC-1295 / Ipamorelin vial",
    blurb: "Visual only. Ryan decides if this is appropriate.",
    href: `${KIT}/images/vial-cjc-ipamorelin.png`,
    kind: "image",
    visualOnly: true,
  },
  {
    id: "vial-tesa",
    title: "Tesamorelin / Ipamorelin vial",
    blurb: "Visual only — not a live public bundle.",
    href: `${KIT}/images/vial-tesamorelin-ipamorelin.png`,
    kind: "image",
    visualOnly: true,
  },
  {
    id: "vial-bpc",
    title: "BPC-157 / TB-500 vial",
    blurb: "Visual only.",
    href: `${KIT}/images/vial-bpc157-tb500.png`,
    kind: "image",
    visualOnly: true,
  },
  {
    id: "vial-quad",
    title: "Repair quad vial",
    blurb: "Visual only. Do not invent a product nickname in posts.",
    href: `${KIT}/images/vial-repair-quad.png`,
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
] as const;
