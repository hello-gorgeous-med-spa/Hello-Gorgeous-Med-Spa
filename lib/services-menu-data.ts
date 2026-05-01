import { isServiceCatalogRoute } from "@/lib/proceduresNav";

/**
 * Strategic Services mega-menu — journey-based categories with InMode Trifecta hero.
 * Paths must match real routes in this repo.
 */

export type MenuItemBadge = "exclusive" | "popular" | "new" | "vip" | "package";

export type ServiceMenuLink = {
  id: string;
  name: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: MenuItemBadge;
  featured?: boolean;
};

export type ServiceMenuSection = {
  id: string;
  name: string;
  subtitle: string;
  /** Only the hero tier uses this label */
  tier: "hero" | "goal";
  badge?: "exclusive";
  items: ServiceMenuLink[];
};

export const SERVICES_MENU_HERO: ServiceMenuSection = {
  id: "inmode-trifecta",
  tier: "hero",
  name: "InMode Trifecta",
  subtitle: "Only med spa in Oswego, Naperville & Aurora with all 3 advanced InMode devices.",
  badge: "exclusive",
  items: [
    {
      id: "vip-trifecta",
      name: "VIP Trifecta Package",
      description: "All 3 treatments — exclusive bundle pricing",
      href: "/trifecta-vip",
      icon: "👑",
      badge: "vip",
      featured: true,
    },
    {
      id: "morpheus8-burst",
      name: "Morpheus8 Burst",
      description: "RF microneedling — face & body",
      href: "/services/morpheus8",
      icon: "⚡",
      featured: true,
    },
    {
      id: "quantum-rf",
      name: "Quantum RF",
      description: "Body contouring & tightening",
      href: "/services/quantum-rf",
      icon: "🎯",
      featured: true,
    },
    {
      id: "solaria-co2",
      name: "Solaria CO₂",
      description: "Fractional resurfacing",
      href: "/services/solaria-co2",
      icon: "✨",
      featured: true,
    },
  ],
};

export const SERVICES_MENU_GOALS: ServiceMenuSection[] = [
  {
    id: "anti-aging-tightening",
    tier: "goal",
    name: "Anti-Aging & Skin Tightening",
    subtitle: "Turn back the clock with advanced treatments",
    items: [
      { id: "m8-aa", name: "Morpheus8 Burst", href: "/services/morpheus8", icon: "⚡" },
      { id: "rf-microneedling", name: "RF Microneedling", href: "/services/microneedling-rf", icon: "🎯", badge: "new" },
      { id: "botox", name: "Botox, Dysport & Jeuveau", href: "/services/botox", icon: "💉" },
      { id: "fillers", name: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💋" },
      { id: "lip", name: "Lip Filler", href: "/services/lip-filler", icon: "👄" },
      { id: "prp-facial-aa", name: "PRP / PRF Facial", href: "/services/prp-facial", icon: "✨" },
      { id: "hydra-aa", name: "HydraFacial", href: "/services/hydra-facial", icon: "💧" },
    ],
  },
  {
    id: "body-wellness",
    tier: "goal",
    name: "Body Contouring & Wellness",
    subtitle: "Transform your body with medical-grade treatments",
    items: [
      { id: "qf-body", name: "Quantum RF", href: "/services/quantum-rf", icon: "🎯" },
      {
        id: "glp1",
        name: "Weight Loss (GLP-1)",
        href: "/glp1-weight-loss",
        icon: "⚡",
        badge: "popular",
      },
      {
        id: "weight-loss-therapy",
        name: "Medical Weight Loss Therapy",
        href: "/services/weight-loss-therapy",
        icon: "⚖️",
        badge: "new",
      },
      { id: "hormone", name: "Hormone Therapy (BHRT / TRT)", href: "/services/biote-hormone-therapy", icon: "⚖️" },
      { id: "peptides", name: "Peptide Therapy", href: "/peptides", icon: "🧬" },
      { id: "iv", name: "IV Therapy", href: "/services/iv-therapy", icon: "💧" },
      { id: "lhr", name: "Laser Hair Removal", href: "/services/laser-hair-removal", icon: "✨" },
    ],
  },
  {
    id: "skin-resurfacing",
    tier: "goal",
    name: "Skin Resurfacing & Texture",
    subtitle: "Reveal smoother, clearer skin",
    items: [
      { id: "solaria-sr", name: "Solaria CO₂ Laser", href: "/services/solaria-co2", icon: "✨" },
      { id: "stretch", name: "Stretch Mark Treatment", href: "/stretch-mark-treatment-oswego-il", icon: "✨" },
      { id: "ipl", name: "IPL Photofacial", href: "/services/ipl-photofacial", icon: "💡" },
      { id: "hydra-sr", name: "HydraFacial", href: "/services/hydra-facial", icon: "💧" },
      { id: "clinical", name: "Clinical Skin & Devices", href: "/procedures", icon: "🏥" },
    ],
  },
  {
    id: "injectables-enhancements",
    tier: "goal",
    name: "Injectables & Enhancements",
    subtitle: "Natural-looking results by expert injectors",
    items: [
      { id: "inj-overview", name: "Injectables Overview", href: "/injectables", icon: "✨" },
      { id: "neuro", name: "Botox, Dysport & Jeuveau", href: "/services/botox", icon: "💉" },
      { id: "dermal", name: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💋" },
      { id: "lip-studio", name: "Lip Filler & Lip Studio", href: "/lip-studio", icon: "👄" },
      { id: "kybella", name: "Kybella", href: "/services/kybella", icon: "✨" },
      { id: "alle", name: "Allē Rewards", href: "/alle-botox-rewards", icon: "💎" },
    ],
  },
  {
    id: "regenerative",
    tier: "goal",
    name: "Regenerative Medicine",
    subtitle: "Harness your body's natural healing power",
    items: [
      { id: "prp-prf", name: "PRP / PRF Treatments", href: "/services/prf-prp", icon: "🧬" },
      { id: "prp-facial-r", name: "PRP Facial", href: "/services/prp-facial", icon: "✨" },
      { id: "ez-prf", name: "EZ PRF Gel", href: "/services/ez-prf-gel", icon: "💎" },
      { id: "vit", name: "Vitamin Injections", href: "/services/vitamin-injections", icon: "💉" },
    ],
  },
  {
    id: "specialty",
    tier: "goal",
    name: "Specialty Services",
    subtitle: "Complete aesthetic care",
    items: [
      { id: "lash", name: "Lash Spa", href: "/services/lash-spa", icon: "✨" },
      {
        id: "lash-members",
        name: "Laser Hair Removal Memberships",
        href: "/laser-hair-memberships",
        icon: "🔥",
        badge: "new",
      },
      { id: "skincare", name: "Medical-Grade Skincare", href: "/shop", icon: "🧴" },
    ],
  },
];

/** Nav highlight: pages reached from Services mega-menu (not only `/services/*`). */
export function isServicesDropdownContext(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (pathname === "/services") return true;
  if (
    [
      "/services/morpheus8",
      "/services/quantum-rf",
      "/services/solaria-co2",
      "/services/microneedling-rf",
      "/services/weight-loss-therapy",
      "/services/botox",
    ].some((p) => pathname.startsWith(p))
  ) {
    return true;
  }
  if (isServiceCatalogRoute(pathname)) return true;
  const prefixes = [
    "/glp1-weight-loss",
    "/injectables",
    "/trifecta-vip",
    "/stretch-mark-treatment-oswego-il",
    "/peptides",
    "/lip-studio",
    "/shop",
    "/laser-hair-memberships",
    "/alle-botox-rewards",
  ];
  return prefixes.some((p) => pathname.startsWith(p));
}
