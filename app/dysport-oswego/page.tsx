import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { DYSPORT_OSWEGO_MENU } from "@/lib/oswego-injectable-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: DYSPORT_OSWEGO_MENU.metaTitle,
  description: DYSPORT_OSWEGO_MENU.metaDescription,
  path: DYSPORT_OSWEGO_MENU.path,
});

export default function DysportOswegoPage() {
  return <OswegoMenuLanding slug="dysport-oswego" config={DYSPORT_OSWEGO_MENU} breadcrumbName="Dysport Oswego" />;
}
