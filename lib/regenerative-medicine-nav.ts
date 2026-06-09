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

/** Slim nav — PRP/PRF + AnteAGE via microneedling menu. Wellness/IV/NAD live under Services → Wellness Menu. */
export const REGENERATIVE_NAV: {
  label: string;
  href: string;
  sections: RegenerativeNavSection[];
} = {
  label: "Regenerative Medicine",
  href: REGENERATIVE_MEDICINE_PATH,
  sections: [
    {
      heading: "Regenerative Medicine",
      links: [
        {
          label: "Regenerative Medicine Hub",
          href: REGENERATIVE_MEDICINE_PATH,
          sub: "Compare PRF, AnteAGE & your options in one place",
        },
        {
          label: "Microneedling Menu",
          href: "/services/microneedling",
          sub: "AnteAGE HA · growth factors · exosomes · Morpheus8",
          badge: "MENU",
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
      heading: "PRP & PRF (Your Own Biology)",
      links: [
        {
          label: "PRP Therapy Menu",
          href: "/services/prp",
          sub: "Skin · scalp · joint — platelet-rich plasma protocols",
          badge: "MENU",
        },
        {
          label: "PRF / PRP Menu",
          href: "/services/prf-prp",
          sub: "Under-eye $500 · hair $600 · EZ PRF Gel",
          badge: "MENU",
        },
        {
          label: "EZ PRF Gel",
          href: "/services/ez-prf-gel",
          sub: "Injectable gel format for natural rejuvenation",
        },
        {
          label: "PRP Facial Menu",
          href: "/services/prp-facial",
          sub: "Vampire Facial · Express · microneedling + PRP pricing",
          badge: "MENU",
        },
      ],
    },
  ],
};

/** Flat list for mobile nav / active-state checks. */
export const REGENERATIVE_NAV_FLAT_LINKS: RegenerativeNavLink[] =
  REGENERATIVE_NAV.sections.flatMap((s) => s.links);
