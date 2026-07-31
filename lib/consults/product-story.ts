import { SQUARE_STAFF_APPOINTMENTS_URL } from "@/lib/flows";

/**
 * Consult hub copy + operational shortcuts for company management.
 */

export const CONSULT_PRODUCT = {
  eyebrow: "Hello Gorgeous · Sales & consult desk",
  headline: "One desk for the inquiry.",
  headlineAccent: "Consult → proposal → book.",
  subhead:
    "Start here when someone asks about weight loss, injectables, or Morpheus8. Screen, educate, send a plan, book the visit — without hunting six tabs.",
  statusChip: "Desk live",
  ctaLabel: "Start a consult",
  ctaHref: "/admin/proposals/consults/new",
} as const;

export type ConsultOpsAction = {
  id: string;
  label: string;
  detail: string;
  href: string;
  external?: boolean;
};

/** Practical links for the company desk */
export const CONSULT_OPS_ACTIONS: ConsultOpsAction[] = [
  {
    id: "consult",
    label: "Start a consult",
    detail: "Screen + educate in the room",
    href: "/admin/proposals/consults/new",
  },
  {
    id: "proposal",
    label: "Create a proposal",
    detail: "Build Good / Better / Best plans",
    href: "/admin/proposals/new",
  },
  {
    id: "send",
    label: "Send to client",
    detail: "Open proposals → preview → SMS / email",
    href: "/admin/proposals",
  },
  {
    id: "book",
    label: "Book in Square (staff)",
    detail: "Seller calendar — book for the client, not the public site",
    href: SQUARE_STAFF_APPOINTMENTS_URL,
    external: true,
  },
  {
    id: "care",
    label: "Pre & post care",
    detail: "Official treatment guides",
    href: "/pre-post-care",
  },
  {
    id: "contra",
    label: "Contraindications / WL screen",
    detail: "GLP-1 safety gate (intake)",
    href: "/glp1-intake",
  },
  {
    id: "command",
    label: "Command Center",
    detail: "Team hub · checklist · ops board",
    href: "/admin/command-center",
  },
  {
    id: "staff",
    label: "Staff hub",
    detail: "Protocols & quick tools",
    href: "/staff",
  },
];

export const CONSULT_PIPELINE = [
  { step: "1", label: "Consult", detail: "Screen & educate", tag: "Room", href: "/admin/proposals/consults/new" },
  { step: "2", label: "Propose", detail: "Build the plan", tag: "Commerce", href: "/admin/proposals/new" },
  { step: "3", label: "Send", detail: "SMS / email / PDF", tag: "Client", href: "/admin/proposals" },
  {
    step: "4",
    label: "Book",
    detail: "Square seller calendar",
    tag: "Calendar",
    href: SQUARE_STAFF_APPOINTMENTS_URL,
    external: true as const,
  },
  { step: "5", label: "Care", detail: "Pre / post guides", tag: "Safety", href: "/pre-post-care" },
] as const;
