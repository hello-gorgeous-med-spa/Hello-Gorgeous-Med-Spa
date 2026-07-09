import { BOOK_PAGE_PATH } from "@/lib/flows";

/**
 * Site-wide primary conversion action — audit Phase 1.
 * Use this label + `/book` everywhere a visitor should schedule (Square online booking).
 */
export const PRIMARY_BOOKING_CTA = {
  label: "Book a free consult",
  shortLabel: "Book free consult",
  headerLabel: "Book a free consult",
  href: BOOK_PAGE_PATH,
} as const;

/** Secondary actions — demote on hero/homepage; OK in account areas. */
export const SECONDARY_PATIENT_ACTIONS = {
  app: { label: "Get the app", href: "/get-app" },
  rxPortal: { label: "My RX portal", href: "/portal/rx" },
  financing: { label: "Financing", href: "/financing" },
} as const;
