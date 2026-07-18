import type { Metadata } from "next";

import { InjectablesEducationGallery } from "@/components/injectables/InjectablesEducationGallery";
import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { LIP_FILLER_OSWEGO_MENU } from "@/lib/oswego-injectable-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: LIP_FILLER_OSWEGO_MENU.metaTitle,
  description: LIP_FILLER_OSWEGO_MENU.metaDescription,
  path: LIP_FILLER_OSWEGO_MENU.path,
});

export default function LipFillerOswegoPage() {
  return (
    <>
      <OswegoMenuLanding
        slug="lip-filler-oswego"
        config={LIP_FILLER_OSWEGO_MENU}
        breadcrumbName="Lip Filler Oswego"
      />
      <InjectablesEducationGallery
        audience="filler"
        eyebrow="Filler education"
        title="First-timers & aftercare"
        intro="What to expect, how to bruise less, dissolving, collagen, and what to tell your injector."
      />
    </>
  );
}
