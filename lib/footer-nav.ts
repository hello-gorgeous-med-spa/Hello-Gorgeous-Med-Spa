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

/** Primary footer navigation — conversion-focused groups. */
export const FOOTER_PRIMARY_COLUMNS: FooterNavColumn[] = [
  {
    id: "popular-services",
    title: "Popular Services",
    links: [
      { label: "Botox", href: "/botox-oswego" },
      { label: "Lip Filler", href: "/lip-filler-oswego" },
      { label: "Morpheus8", href: "/morpheus8-burst-oswego" },
      { label: "Solaria CO₂", href: "/solaria-co2-oswego" },
      { label: "Quantum RF", href: "/quantum-rf-oswego" },
      { label: "Medical Weight Loss", href: "/glp-1-weight-loss-oswego" },
      { label: "Hormone Therapy", href: "/biote-hormone-therapy-oswego" },
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
      { label: "Montgomery", href: "/montgomery-il" },
      { label: "Fox Valley", href: "/locations" },
    ],
  },
  {
    id: "patient-resources",
    title: "Patient Resources",
    links: [
      { label: "Specials", href: "/specials" },
      { label: "Memberships", href: "/monthly-memberships" },
      { label: "Financing", href: "/financing" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Reviews", href: "/reviews" },
      { label: "Blog", href: "/blog" },
      { label: "Skin 101", href: "/skin-101" },
      { label: "FAQs", href: "/faq" },
      { label: "Help Me Choose", href: "/help-me-choose" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About Hello Gorgeous", href: "/about" },
      { label: "Meet Dani", href: "/about#dani" },
      { label: "Meet Ryan", href: "/about#ryan" },
      { label: "Contact", href: "/contact" },
      { label: "Google Reviews", href: SITE.googleReviewUrl, external: true },
      { label: "Careers", href: "/contact" },
    ],
  },
  {
    id: "book",
    title: "Book",
    links: [
      { label: "Book Online", href: "/book", external: true },
      { label: "Download App", href: "/get-app" },
      { label: "Call", href: "tel:630-636-6193" },
      { label: "Directions", href: "/locations" },
    ],
  },
];

/** Additional internal links preserved for SEO — shown in a collapsible block. */
export const FOOTER_SEO_LINKS: FooterNavLink[] = [
  { label: "Gentlemen's Club", href: "/gentlemens-club" },
  { label: "Peptide Therapy", href: "/peptide-therapy-oswego" },
  { label: "Peptide education hub", href: "/peptides" },
  { label: "Injection Menu", href: "/injection-menu" },
  { label: "Solaria Packages", href: "/solaria-packages" },
  { label: "Daxxify", href: "/daxxify-oswego-il" },
  { label: "Botox vs Dysport vs Jeuveau", href: "/botox-vs-dysport-vs-jeuveau" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "Your Journey", href: "/your-journey" },
  { label: "Explore Care", href: "/explore-care" },
  { label: "Fix What Bothers Me", href: "/fix-what-bothers-me" },
  { label: "Telehealth", href: "/telehealth" },
  { label: "Pre & post care guides", href: "/pre-post-care" },
  { label: "Patient documents", href: "/patient-documents" },
  { label: "Products we offer (Rx)", href: "/products-we-offer" },
  { label: "The Book", href: "/the-book" },
  { label: "Community", href: "/community" },
  { label: "Clinical Standards", href: "/clinical-partners" },
  { label: "Male + Female Team", href: "/blog/male-female-practitioners-med-spa-advantage-oswego-il" },
  { label: "Founder's Letter", href: "/blog/founder-letter-morpheus8-solaria-oswego-il" },
  { label: "Our Story", href: "/blog/the-story-behind-hello-gorgeous-oswego-il" },
  { label: "What Makes Us Different", href: "/blog/what-makes-hello-gorgeous-different-oswego-il" },
  { label: "We Aren't Just a Botox Clinic", href: "/blog/we-arent-just-a-botox-clinic-hello-gorgeous-oswego-il" },
  { label: "Botox vs Dysport FAQ", href: "/blog/botox-vs-dysport-vs-jeuveau-faq-oswego" },
  { label: "Spring laser hair special", href: "/spring-special-laser-hair" },
  { label: "April newsletter", href: "/newsletter/april" },
  { label: "Open client app", href: "/app" },
  { label: "Find My Treatment quiz", href: "/quiz/treatment" },
  { label: "VIP Membership", href: "/membership" },
  { label: "Understand Your Body", href: "/understand-your-body" },
  { label: "The Care Engine™", href: "/care-engine" },
  { label: "Our Promise (Vendors)", href: "/our-promise" },
];
