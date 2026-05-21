/** Regenerative Medicine — nav clusters & SEO hub paths. */

export const REGENERATIVE_MEDICINE_PATH = "/regenerative-medicine-oswego-il";

export type RegenerativeNavLink = {
  label: string;
  href: string;
  sub: string;
  badge?: string;
};

export type RegenerativeNavSection = {
  heading: string;
  links: RegenerativeNavLink[];
};

export const REGENERATIVE_NAV: {
  label: string;
  href: string;
  sections: RegenerativeNavSection[];
} = {
  label: "Regenerative Medicine",
  href: REGENERATIVE_MEDICINE_PATH,
  sections: [
    {
      heading: "PRP & PRF (Your Own Biology)",
      links: [
        {
          label: "PRP Therapy",
          href: "/services/prp",
          sub: "Platelet-rich plasma for skin, scalp & targeted renewal",
        },
        {
          label: "PRF / PRP",
          href: "/services/prf-prp",
          sub: "Longer-release fibrin scaffold · under-eye & texture",
        },
        {
          label: "EZ PRF Gel",
          href: "/services/ez-prf-gel",
          sub: "Injectable gel format for natural rejuvenation",
        },
        {
          label: "PRP Facial",
          href: "/services/prp-facial",
          sub: "Tone, texture & glow using your growth factors",
        },
      ],
    },
    {
      heading: "AnteAGE® Professional",
      links: [
        {
          label: "Microneedling + Exosomes",
          href: "/services/anteage-microneedling-exosomes",
          sub: "Our most advanced regenerative microneedling tier",
          badge: "TOP",
        },
        {
          label: "Microneedling + Growth Factors",
          href: "/services/anteage-microneedling-growth-factors",
          sub: "Stem cell signaling for collagen coaching",
        },
        {
          label: "Microneedling + HA",
          href: "/services/anteage-microneedling-ha",
          sub: "Hydration-forward AnteAGE entry protocol",
        },
        {
          label: "P.E.A.R.L. Fusion",
          href: "/blog/aesthetic-injectables-anteage-pearl-oswego-il#menu",
          sub: "PDRN + exosomes/biosomes · pairs with RF microneedling",
          badge: "NEW",
        },
      ],
    },
    {
      heading: "Cellular Wellness & NAD+",
      links: [
        {
          label: "NAD+ Injections",
          href: "/services/nad-plus-injections-oswego-il",
          sub: "$40 per visit · quick wellness injection · Oswego",
          badge: "NEW",
        },
        {
          label: "NAD+ IV Therapy",
          href: "/nad-iv-oswego",
          sub: "Slow-drip cellular wellness · Oswego, IL",
        },
        {
          label: "Vitamin Injections",
          href: "/services/vitamin-injections",
          sub: "B12, glutathione, D & stack options",
        },
        {
          label: "IV Therapy",
          href: "/services/iv-therapy",
          sub: "Myers, hydration & immunity blends",
        },
      ],
    },
    {
      heading: "Explore More",
      links: [
        {
          label: "Regenerative Medicine Hub",
          href: REGENERATIVE_MEDICINE_PATH,
          sub: "Compare PRF, AnteAGE & NAD+ in one place",
        },
        {
          label: "RF Microneedling (InMode)",
          href: "/services/morpheus8",
          sub: "Pairs with AnteAGE & P.E.A.R.L.",
        },
        {
          label: "Microneedling Oswego",
          href: "/microneedling-oswego-il",
          sub: "Local SEO landing · collagen stimulation",
        },
        {
          label: "Injectables + AnteAGE Guide",
          href: "/blog/aesthetic-injectables-anteage-pearl-oswego-il",
          sub: "Educational article · Oswego, IL",
        },
      ],
    },
  ],
};

/** Flat list for mobile nav accordion. */
export const REGENERATIVE_NAV_FLAT_LINKS: RegenerativeNavLink[] =
  REGENERATIVE_NAV.sections.flatMap((s) => s.links);
