import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { SEMAGLUTIDE_OSWEGO_MENU } from "@/lib/oswego-wellness-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: SEMAGLUTIDE_OSWEGO_MENU.metaTitle,
  description: SEMAGLUTIDE_OSWEGO_MENU.metaDescription,
  path: SEMAGLUTIDE_OSWEGO_MENU.path,
});

export default function SemaglutideOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="semaglutide-oswego"
      config={SEMAGLUTIDE_OSWEGO_MENU}
      breadcrumbName="Semaglutide Oswego"
    />
  );
}
