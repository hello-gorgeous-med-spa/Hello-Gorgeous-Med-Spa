/**
 * Top-level Quiz nav — Moonshot-style screeners & finders.
 */

export const QUIZ_HUB_PATH = "/quiz";

export type QuizNavLink = {
  label: string;
  href: string;
  sub?: string;
  badge?: string;
  overview?: boolean;
  dividerBefore?: boolean;
  comingSoon?: boolean;
};

export const QUIZ_NAV = {
  label: "Quiz",
  href: QUIZ_HUB_PATH,
  links: [
    {
      label: "All Quizzes",
      href: QUIZ_HUB_PATH,
      sub: "Screeners & treatment finders — educational only",
      overview: true,
    },
    {
      label: "GLP-1 Readiness Screener",
      href: "/quiz/glp-1-readiness",
      sub: "2 min · see if medical weight loss may fit",
      badge: "NEW",
      dividerBefore: true,
    },
    {
      label: "Peptide Quiz",
      href: "/skin-101/find-your-peptide",
      sub: "Match goals to BPC-157, Sermorelin & more",
    },
    {
      label: "Treatment Quiz",
      href: "/quiz/treatment",
      sub: "Aesthetics, skin, wellness & more",
    },
    {
      label: "Help Me Choose",
      href: "/help-me-choose",
      sub: "Goal-based med spa treatment finder",
    },
    {
      label: "Perimenopause Readiness Screener",
      href: "/quiz/perimenopause-readiness",
      sub: "2 min · cycles, symptoms & BioTE candidacy",
      badge: "NEW",
      dividerBefore: true,
    },
    {
      label: "TRT Readiness Screener",
      href: "/quiz/trt-readiness",
      sub: "2 min · men's testosterone & lab readiness",
      badge: "NEW",
    },
    {
      label: "Hair Restoration Screener",
      href: "/quiz/hair-readiness",
      sub: "2 min · thinning pattern, AnteAGE MDX & Rx readiness",
      badge: "NEW",
    },
  ] satisfies QuizNavLink[],
};

export const QUIZ_ACTIVE_PREFIXES = [
  QUIZ_HUB_PATH,
  "/help-me-choose",
  "/skin-101/find-your-peptide",
] as const;

export function isQuizNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (QUIZ_ACTIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  return QUIZ_NAV.links.some((link) => {
    const base = link.href.split("#")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}
