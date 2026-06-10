import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { PEPTIDE_THERAPY_OSWEGO_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: PEPTIDE_THERAPY_OSWEGO_MENU.metaTitle,
  description: PEPTIDE_THERAPY_OSWEGO_MENU.metaDescription,
  path: PEPTIDE_THERAPY_OSWEGO_MENU.path,
});

export default function PeptideTherapyOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="peptide-therapy-oswego"
      config={PEPTIDE_THERAPY_OSWEGO_MENU}
      breadcrumbName="Peptide Therapy Oswego"
    />
  );
}
