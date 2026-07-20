import { SITE } from "@/lib/seo";
import { SITE_TWO_DOORS } from "@/lib/site-two-doors";

export type FooterNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterNavColumn = {
  id: string;
  title: string;
  links: FooterNavLink[];
};

/** Primary footer navigation — two-door columns + shared booking layer (Phase 3). */
export const FOOTER_PRIMARY_COLUMNS: FooterNavColumn[] = [
  ...SITE_TWO_DOORS.map((door) => ({
    id: door.id,
    title: door.footerColumnTitle,
    links: door.footerLinks,
  })),
  {
    id: "service-areas",
    title: "Service Areas",
    links: [
      { label: "Oswego", href: "/oswego-il" },
      { label: "Aurora", href: "/aurora-il" },
      { label: "Naperville", href: "/naperville-il" },
      { label: "Plainfield", href: "/plainfield-il" },
      { label: "Yorkville", href: "/yorkville-il" },
      { label: "All locations", href: "/locations" },
    ],
  },
  {
    id: "patient-resources",
    title: "Book & Support",
    links: [
      { label: "Book a free consult", href: "/book" },
      { label: "Specials", href: "/specials" },
      { label: "Get the app", href: "/get-app" },
      { label: "FAQs", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "Pre & post care", href: "/pre-post-care" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About Hello Gorgeous", href: "/about" },
      { label: "Meet the Team", href: "/meet-the-team" },
      { label: "Meet Dani & Ryan", href: "/about" },
      { label: "Why choose us", href: "/why-choose-us" },
      { label: "Google Reviews", href: SITE.googleReviewUrl, external: true },
    ],
  },
];

/** Secondary links — collapsed in footer; keep high-value hubs only. */
export const FOOTER_SEO_LINKS: FooterNavLink[] = [
  { label: "Medical optimization overview", href: "/medical" },
  { label: "IV Therapy", href: "/services/iv-therapy" },
  { label: "Peptide education", href: "/peptides" },
  { label: "Telehealth", href: "/telehealth" },
  { label: "Products we offer (Rx)", href: "/products-we-offer" },
  { label: "Help me choose", href: "/help-me-choose" },
  { label: "Skin 101", href: "/skin-101" },
  { label: "Financing", href: "/financing" },
  { label: "Blog", href: "/blog" },
  { label: "Open client app", href: "/app" },
];
