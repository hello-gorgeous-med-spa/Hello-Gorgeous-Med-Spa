/** Shared types for Defiant-style numbered service menu pages. */

export type ServiceMenuPriceRow = {
  label: string;
  price: string;
  note?: string;
  href?: string;
};

export type ServiceMenuSection = {
  id: string;
  number: string;
  title: string;
  description: string;
  highlights: string[];
  pricing: ServiceMenuPriceRow[];
  learnMoreHref: string;
  badge?: string;
};

export type ServiceMenuFaq = {
  question: string;
  answer: string;
};

export type ServiceMenuHero = {
  eyebrow: string;
  titleBefore?: string;
  titleAccent: string;
  titleAfter?: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type ServiceMenuConfig = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  hero: ServiceMenuHero;
  sections: ServiceMenuSection[];
  faqs: ServiceMenuFaq[];
};
