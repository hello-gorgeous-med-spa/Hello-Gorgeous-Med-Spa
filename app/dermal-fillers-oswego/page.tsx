import type { Metadata } from "next";

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
    <OswegoMenuLanding
      slug="dermal-fillers-oswego"
      config={DERMAL_FILLERS_OSWEGO_MENU}
      breadcrumbName="Dermal Fillers Oswego"
    />
  );
}
