import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { TIRZEPATIDE_OSWEGO_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: TIRZEPATIDE_OSWEGO_MENU.metaTitle,
  description: TIRZEPATIDE_OSWEGO_MENU.metaDescription,
  path: TIRZEPATIDE_OSWEGO_MENU.path,
});

export default function TirzepatideOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="tirzepatide-oswego"
      config={TIRZEPATIDE_OSWEGO_MENU}
      breadcrumbName="Tirzepatide Oswego"
    />
  );
}
