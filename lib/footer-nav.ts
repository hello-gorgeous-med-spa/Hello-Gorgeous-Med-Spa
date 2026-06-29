import { SITE } from "@/lib/seo";

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

/** Primary footer navigation — conversion-focused groups (Phase 1 trim). */
export const FOOTER_PRIMARY_COLUMNS: FooterNavColumn[] = [
  {
    id: "popular-services",
    title: "Popular Services",
    links: [
      { label: "Botox", href: "/botox-oswego" },
      { label: "Lip Filler", href: "/lip-filler-oswego" },
      { label: "Morpheus8", href: "/morpheus8-burst-oswego" },
      { label: "Medical Weight Loss", href: "/glp-1-weight-loss-oswego" },
      { label: "Hello Gorgeous RX", href: "/rx" },
      { label: "Hormone Therapy", href: "/rx/hormones" },
      { label: "IV Therapy", href: "/iv-therapy" },
      { label: "All services", href: "/services" },
    ],
  },
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
    title: "Patient Resources",
    links: [
      { label: "Book a free consult", href: "/book" },
      { label: "Specials", href: "/specials" },
      { label: "RX refills & care", href: "/rx/care" },
      { label: "Online refill guide", href: "/rx/guide" },
      { label: "My RX portal", href: "/portal/rx" },
      { label: "Get the app", href: "/get-app" },
      { label: "FAQs", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About Hello Gorgeous", href: "/about" },
      { label: "Meet Dani & Ryan", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Google Reviews", href: SITE.googleReviewUrl, external: true },
    ],
  },
];

/** Secondary links — collapsed in footer; keep high-value hubs only. */
export const FOOTER_SEO_LINKS: FooterNavLink[] = [
  { label: "Ladies' Club", href: "/ladies-club" },
  { label: "Gentlemen's Club", href: "/gentlemens-club" },
  { label: "Peptide education", href: "/peptides" },
  { label: "Telehealth", href: "/telehealth" },
  { label: "Pre & post care", href: "/pre-post-care" },
  { label: "Products we offer (Rx)", href: "/products-we-offer" },
  { label: "Why choose us", href: "/why-choose-us" },
  { label: "Help me choose", href: "/help-me-choose" },
  { label: "Skin 101", href: "/skin-101" },
  { label: "Financing", href: "/financing" },
  { label: "Blog", href: "/blog" },
  { label: "Open client app", href: "/app" },
];
