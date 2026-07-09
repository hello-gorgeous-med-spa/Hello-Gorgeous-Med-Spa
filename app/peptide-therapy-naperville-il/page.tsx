import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { PEPTIDE_THERAPY_NAPERVILLE_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata, SITE } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: PEPTIDE_THERAPY_NAPERVILLE_MENU.metaTitle,
  description: PEPTIDE_THERAPY_NAPERVILLE_MENU.metaDescription,
  path: PEPTIDE_THERAPY_NAPERVILLE_MENU.path,
  keywords: [
    "peptide therapy naperville il",
    "peptide therapy near naperville",
    "bpc 157 naperville",
    "sermorelin naperville il",
    "peptide clinic near naperville",
    "regenerative medicine naperville il",
    "anti aging peptides naperville",
  ],
});

export default function PeptideTherapyNapervillePage() {
  return (
    <OswegoMenuLanding
      slug="peptide-therapy-naperville-il"
      config={PEPTIDE_THERAPY_NAPERVILLE_MENU}
      breadcrumbName="Peptide Therapy Naperville"
      locationLabel="Near Naperville, IL"
      includeMedicalTherapy
      breadcrumbTrail={[
        { name: "Home", url: SITE.url },
        { name: "Naperville, IL", url: `${SITE.url}/naperville-il` },
        {
          name: "Peptide Therapy",
          url: `${SITE.url}${PEPTIDE_THERAPY_NAPERVILLE_MENU.path}`,
        },
      ]}
    />
  );
}
