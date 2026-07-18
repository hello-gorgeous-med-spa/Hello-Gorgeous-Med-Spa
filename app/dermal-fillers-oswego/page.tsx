import type { Metadata } from "next";

import { InjectablesEducationGallery } from "@/components/injectables/InjectablesEducationGallery";
import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { DERMAL_FILLERS_OSWEGO_MENU } from "@/lib/oswego-injectable-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: DERMAL_FILLERS_OSWEGO_MENU.metaTitle,
  description: DERMAL_FILLERS_OSWEGO_MENU.metaDescription,
  path: DERMAL_FILLERS_OSWEGO_MENU.path,
});

export default function DermalFillersOswegoPage() {
  return (
    <>
      <OswegoMenuLanding
        slug="dermal-fillers-oswego"
        config={DERMAL_FILLERS_OSWEGO_MENU}
        breadcrumbName="Dermal Fillers Oswego"
      />
      <InjectablesEducationGallery
        audience="filler"
        eyebrow="Filler education"
        title="Fillers — what to know"
        intro="First visit, bruising tips, dissolving, collagen, and the checklist for your injector."
      />
    </>
  );
}
